package com.myworkflow.application.service;

import com.myworkflow.application.dto.dashboard.DashboardDataDTO;
import com.myworkflow.application.dto.response.*;
import com.myworkflow.domain.model.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class DashboardService {

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional(readOnly = true)
    public DashboardResponse getDashboardData(User user) {
        long startTime = System.currentTimeMillis();

        try {
            // 1. Récupérer toutes les données en UNE SEULE requête
            List<Object[]> rawData = getDashboardDataFromDatabase(user.getId());

            // 2. Transformer les données
            List<DashboardDataDTO> dashboardData = transformRawData(rawData);

            // 3. Regrouper par projet
            Map<Long, List<DashboardDataDTO>> projectsMap = dashboardData.stream()
                    .collect(Collectors.groupingBy(DashboardDataDTO::getProjectId));

            // 4. Extraire toutes les tâches
            List<Task> allTasks = extractAllTasks(dashboardData);

            // 5. Calculer les statistiques
            StatsResponse stats = calculateStatsOptimized(projectsMap, allTasks);

            // 6. Préparer les réponses
            List<ProjectResponse> recentProjects = getRecentProjectsOptimized(projectsMap);
            List<TaskResponse> upcomingTasks = getUpcomingTasksOptimized(allTasks);
            List<TaskResponse> overdueTasks = getOverdueTasksOptimized(allTasks);

            long duration = System.currentTimeMillis() - startTime;
            log.info("Dashboard loaded for user {} in {} ms with {} projects and {} tasks",
                    user.getId(), duration, projectsMap.size(), allTasks.size());

            return DashboardResponse.builder()
                    .stats(stats)
                    .recentProjects(recentProjects)
                    .upcomingTasks(upcomingTasks)
                    .overdueTasks(overdueTasks)
                    .build();

        } catch (Exception e) {
            log.error("Error loading dashboard for user {}: {}", user.getId(), e.getMessage(), e);
            throw new RuntimeException("Error loading dashboard data", e);
        }
    }

    @Transactional(readOnly = true)
    public StatsResponse getStats(User user) {
        long startTime = System.currentTimeMillis();

        try {
            // 1. Récupérer toutes les données
            List<Object[]> rawData = getDashboardDataFromDatabase(user.getId());

            // 2. Transformer les données
            List<DashboardDataDTO> dashboardData = transformRawData(rawData);

            // 3. Regrouper par projet
            Map<Long, List<DashboardDataDTO>> projectsMap = dashboardData.stream()
                    .collect(Collectors.groupingBy(DashboardDataDTO::getProjectId));

            // 4. Extraire toutes les tâches
            List<Task> allTasks = extractAllTasks(dashboardData);

            // 5. Calculer les statistiques
            StatsResponse stats = calculateStatsOptimized(projectsMap, allTasks);

            long duration = System.currentTimeMillis() - startTime;
            log.info("Stats loaded for user {} in {} ms", user.getId(), duration);

            return stats;

        } catch (Exception e) {
            log.error("Error loading stats for user {}: {}", user.getId(), e.getMessage(), e);
            // Retourner des statistiques vides en cas d'erreur
            return createEmptyStatsResponse();
        }
    }

    // ============ MÉTHODES PRIVÉES ============

    private List<Object[]> getDashboardDataFromDatabase(Long userId) {
        String sql = """
            WITH project_stats AS (
                SELECT 
                    p.id as project_id,
                    p.title as project_title,
                    p.description as project_description,
                    p.created_at as project_created_at,
                    p.updated_at as project_updated_at,
                    COUNT(t.id) as total_tasks,
                    SUM(CASE WHEN t.status = 'DONE' THEN 1 ELSE 0 END) as completed_tasks,
                    SUM(CASE WHEN t.due_date IS NOT NULL THEN 1 ELSE 0 END) as tasks_with_deadlines,
                    MAX(t.due_date) as max_due_date
                FROM projects p
                LEFT JOIN tasks t ON p.id = t.project_id
                WHERE p.user_id = :userId
                GROUP BY p.id, p.title, p.description, p.created_at, p.updated_at
            ),
            task_details AS (
                SELECT 
                    t.id as task_id,
                    t.title as task_title,
                    t.description as task_description,
                    t.due_date as task_due_date,
                    t.status as task_status,
                    t.created_at as task_created_at,
                    t.updated_at as task_updated_at,
                    t.project_id,
                    CASE 
                        WHEN t.due_date < CURRENT_DATE AND t.status != 'DONE' THEN true
                        ELSE false
                    END as is_overdue
                FROM tasks t
                WHERE t.project_id IN (SELECT p.id FROM projects p WHERE p.user_id = :userId)
            )
            SELECT 
                ps.project_id,
                ps.project_title,
                ps.project_description,
                ps.project_created_at,
                ps.project_updated_at,
                ps.total_tasks,
                ps.completed_tasks,
                ps.tasks_with_deadlines,
                td.task_id,
                td.task_title,
                td.task_description,
                td.task_due_date,
                td.task_status,
                td.task_created_at,
                td.task_updated_at,
                td.is_overdue
            FROM project_stats ps
            LEFT JOIN task_details td ON ps.project_id = td.project_id
            ORDER BY ps.project_created_at DESC, td.task_due_date ASC NULLS LAST
            """;

        try {
            Query query = entityManager.createNativeQuery(sql);
            query.setParameter("userId", userId);

            @SuppressWarnings("unchecked")
            List<Object[]> result = query.getResultList();
            log.debug("Retrieved {} rows for user {}", result.size(), userId);
            return result;
        } catch (Exception e) {
            log.error("Error executing dashboard query for user {}: {}", userId, e.getMessage(), e);
            return new ArrayList<>();
        }
    }

    private List<DashboardDataDTO> transformRawData(List<Object[]> rawData) {
        if (rawData == null || rawData.isEmpty()) {
            return new ArrayList<>();
        }

        return rawData.stream()
                .map(row -> {
                    try {
                        DashboardDataDTO dto = DashboardDataDTO.builder()
                                .projectId(row[0] != null ? ((Number) row[0]).longValue() : null)
                                .projectTitle(row[1] != null ? (String) row[1] : "")
                                .projectDescription(row[2] != null ? (String) row[2] : "")
                                .projectCreatedAt(convertToLocalDateTime(row[3]))
                                .projectUpdatedAt(convertToLocalDateTime(row[4]))
                                .totalTasks(row[5] != null ? ((Number) row[5]).longValue() : 0L)
                                .completedTasks(row[6] != null ? ((Number) row[6]).longValue() : 0L)
                                .tasksWithDeadlines(row[7] != null ? ((Number) row[7]).longValue() : 0L)
                                .build();

                        // Ajouter les données de tâche si présentes
                        if (row[8] != null) {
                            dto.setTaskId(((Number) row[8]).longValue());
                            dto.setTaskTitle(row[9] != null ? (String) row[9] : "");
                            dto.setTaskDescription(row[10] != null ? (String) row[10] : "");
                            dto.setTaskDueDate(row[11] != null ? ((java.sql.Date) row[11]).toLocalDate() : null);
                            dto.setTaskStatus(row[12] != null ? (String) row[12] : "TODO");
                            dto.setTaskCreatedAt(convertToLocalDateTime(row[13]));
                            dto.setTaskUpdatedAt(convertToLocalDateTime(row[14]));
                            dto.setTaskOverdue(row[15] != null && (Boolean) row[15]);
                        }

                        return dto;
                    } catch (Exception e) {
                        log.warn("Error transforming row data: {}", e.getMessage());
                        return null;
                    }
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    private LocalDateTime convertToLocalDateTime(Object timestamp) {
        if (timestamp == null) {
            return null;
        }
        try {
            if (timestamp instanceof java.sql.Timestamp) {
                return ((java.sql.Timestamp) timestamp).toLocalDateTime();
            }
            if (timestamp instanceof java.sql.Date) {
                return ((java.sql.Date) timestamp).toLocalDate().atStartOfDay();
            }
            if (timestamp instanceof java.util.Date) {
                return new java.sql.Timestamp(((java.util.Date) timestamp).getTime()).toLocalDateTime();
            }
        } catch (Exception e) {
            log.warn("Error converting timestamp: {}", e.getMessage());
        }
        return null;
    }

    private List<Task> extractAllTasks(List<DashboardDataDTO> dashboardData) {
        if (dashboardData == null || dashboardData.isEmpty()) {
            return new ArrayList<>();
        }

        return dashboardData.stream()
                .filter(dto -> dto.getTaskId() != null)
                .map(dto -> {
                    try {
                        Task task = new Task();
                        task.setId(dto.getTaskId());
                        task.setTitle(dto.getTaskTitle());
                        task.setDescription(dto.getTaskDescription());
                        task.setDueDate(dto.getTaskDueDate());

                        // Gérer le statut
                        String statusStr = dto.getTaskStatus();
                        if (statusStr != null && !statusStr.isEmpty()) {
                            try {
                                task.setStatus(TaskStatus.valueOf(statusStr));
                            } catch (IllegalArgumentException e) {
                                log.warn("Invalid task status: {}, defaulting to TODO", statusStr);
                                task.setStatus(TaskStatus.TODO);
                            }
                        } else {
                            task.setStatus(TaskStatus.TODO);
                        }

                        task.setCreatedAt(dto.getTaskCreatedAt());
                        task.setUpdatedAt(dto.getTaskUpdatedAt());

                        // Project minimal
                        Project project = new Project();
                        project.setId(dto.getProjectId());
                        project.setTitle(dto.getProjectTitle());
                        project.setDescription(dto.getProjectDescription());
                        project.setCreatedAt(dto.getProjectCreatedAt());
                        project.setUpdatedAt(dto.getProjectUpdatedAt());
                        task.setProject(project);

                        return task;
                    } catch (Exception e) {
                        log.warn("Error creating task from DTO: {}", e.getMessage());
                        return null;
                    }
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    private StatsResponse calculateStatsOptimized(
            Map<Long, List<DashboardDataDTO>> projectsMap,
            List<Task> allTasks) {

        // Project Statistics
        long totalProjects = projectsMap.size();

        long completedProjects = projectsMap.values().stream()
                .map(projectData -> projectData.get(0))
                .filter(project -> {
                    Long total = project.getTotalTasks();
                    Long completed = project.getCompletedTasks();
                    return total != null && total > 0 && total.equals(completed);
                })
                .count();

        long activeProjects = totalProjects - completedProjects;

        // Task Statistics
        long totalTasks = allTasks.size();
        long completedTasks = allTasks.stream()
                .filter(task -> task.getStatus() == TaskStatus.DONE)
                .count();
        long inProgressTasks = allTasks.stream()
                .filter(task -> task.getStatus() == TaskStatus.IN_PROGRESS)
                .count();
        long todoTasks = allTasks.stream()
                .filter(task -> task.getStatus() == TaskStatus.TODO)
                .count();
        long overdueTasks = allTasks.stream()
                .filter(Task::isOverdue)
                .count();

        // Progress Statistics
        double averageProjectProgress = projectsMap.values().stream()
                .map(projectData -> projectData.get(0))
                .mapToDouble(project -> {
                    Long total = project.getTotalTasks();
                    Long completed = project.getCompletedTasks();
                    return (total != null && total > 0 && completed != null) ?
                            (double) completed / total * 100 : 0.0;
                })
                .average()
                .orElse(0.0);

        long projectsWithDeadlines = projectsMap.values().stream()
                .map(projectData -> projectData.get(0))
                .filter(project -> project.getTasksWithDeadlines() != null &&
                        project.getTasksWithDeadlines() > 0)
                .count();

        long tasksWithDeadlines = allTasks.stream()
                .filter(task -> task.getDueDate() != null)
                .count();

        // Distributions
        Map<String, Long> projectProgressDistribution = calculateProjectProgressDistributionOptimized(projectsMap);
        Map<String, Long> taskStatusDistribution = calculateTaskStatusDistribution(allTasks);

        // Recent Activities
        List<StatsResponse.RecentActivity> recentActivities = getRecentActivitiesOptimized(projectsMap, allTasks);

        return StatsResponse.builder()
                .totalProjects(totalProjects)
                .activeProjects(activeProjects)
                .completedProjects(completedProjects)
                .totalTasks(totalTasks)
                .completedTasks(completedTasks)
                .inProgressTasks(inProgressTasks)
                .todoTasks(todoTasks)
                .overdueTasks(overdueTasks)
                .averageProjectProgress(Math.round(averageProjectProgress * 100.0) / 100.0)
                .projectsWithDeadlines(projectsWithDeadlines)
                .tasksWithDeadlines(tasksWithDeadlines)
                .recentActivities(recentActivities)
                .projectProgressDistribution(projectProgressDistribution)
                .taskStatusDistribution(taskStatusDistribution)
                .weeklyTaskCompletion(calculateWeeklyTaskCompletion(allTasks))
                .monthlyProjectCreation(calculateMonthlyProjectCreationOptimized(projectsMap))
                .build();
    }

    private List<ProjectResponse> getRecentProjectsOptimized(Map<Long, List<DashboardDataDTO>> projectsMap) {
        if (projectsMap.isEmpty()) {
            return new ArrayList<>();
        }

        return projectsMap.values().stream()
                .map(projectData -> projectData.get(0))
                .filter(project -> project.getProjectCreatedAt() != null)
                .sorted((p1, p2) -> p2.getProjectCreatedAt().compareTo(p1.getProjectCreatedAt()))
                .limit(5)
                .map(project -> {
                    long total = project.getTotalTasks() != null ? project.getTotalTasks() : 0L;
                    long completed = project.getCompletedTasks() != null ? project.getCompletedTasks() : 0L;
                    double progress = total > 0 ? (double) completed / total * 100 : 0.0;

                    return ProjectResponse.builder()
                            .id(project.getProjectId())
                            .title(project.getProjectTitle())
                            .description(project.getProjectDescription())
                            .totalTasks(total)
                            .completedTasks(completed)
                            .progressPercentage(Math.round(progress * 100.0) / 100.0)
                            .createdAt(project.getProjectCreatedAt())
                            .updatedAt(project.getProjectUpdatedAt())
                            .build();
                })
                .collect(Collectors.toList());
    }

    private List<TaskResponse> getUpcomingTasksOptimized(List<Task> tasks) {
        if (tasks.isEmpty()) {
            return new ArrayList<>();
        }

        return tasks.stream()
                .filter(task -> task.getDueDate() != null)
                .filter(task -> !task.getDueDate().isBefore(LocalDate.now()))
                .filter(task -> task.getStatus() != TaskStatus.DONE)
                .sorted((t1, t2) -> {
                    LocalDate due1 = t1.getDueDate();
                    LocalDate due2 = t2.getDueDate();
                    if (due1 == null && due2 == null) return 0;
                    if (due1 == null) return 1;
                    if (due2 == null) return -1;
                    return due1.compareTo(due2);
                })
                .limit(10)
                .map(this::mapToTaskResponse)
                .collect(Collectors.toList());
    }

    private List<TaskResponse> getOverdueTasksOptimized(List<Task> tasks) {
        if (tasks.isEmpty()) {
            return new ArrayList<>();
        }

        return tasks.stream()
                .filter(Task::isOverdue)
                .filter(task -> task.getStatus() != TaskStatus.DONE)
                .sorted((t1, t2) -> {
                    LocalDate due1 = t1.getDueDate();
                    LocalDate due2 = t2.getDueDate();
                    if (due1 == null && due2 == null) return 0;
                    if (due1 == null) return 1;
                    if (due2 == null) return -1;
                    return due1.compareTo(due2);
                })
                .limit(10)
                .map(this::mapToTaskResponse)
                .collect(Collectors.toList());
    }

    private TaskResponse mapToTaskResponse(Task task) {
        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .dueDate(task.getDueDate())
                .status(task.getStatus())
                .overdue(task.isOverdue())
                .projectId(task.getProject() != null ? task.getProject().getId() : null)
                .projectTitle(task.getProject() != null ? task.getProject().getTitle() : null)
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();
    }

    private Map<String, Long> calculateProjectProgressDistributionOptimized(
            Map<Long, List<DashboardDataDTO>> projectsMap) {

        Map<String, Long> distribution = new LinkedHashMap<>();
        distribution.put("0-20%", 0L);
        distribution.put("21-40%", 0L);
        distribution.put("41-60%", 0L);
        distribution.put("61-80%", 0L);
        distribution.put("81-99%", 0L);
        distribution.put("100%", 0L);

        if (projectsMap.isEmpty()) {
            return distribution;
        }

        projectsMap.values().stream()
                .map(projectData -> projectData.get(0))
                .forEach(project -> {
                    long total = project.getTotalTasks() != null ? project.getTotalTasks() : 0L;
                    long completed = project.getCompletedTasks() != null ? project.getCompletedTasks() : 0L;
                    double progress = total > 0 ? (double) completed / total * 100 : 0.0;

                    if (progress == 0) {
                        distribution.put("0-20%", distribution.get("0-20%") + 1);
                    } else if (progress <= 20) {
                        distribution.put("0-20%", distribution.get("0-20%") + 1);
                    } else if (progress <= 40) {
                        distribution.put("21-40%", distribution.get("21-40%") + 1);
                    } else if (progress <= 60) {
                        distribution.put("41-60%", distribution.get("41-60%") + 1);
                    } else if (progress <= 80) {
                        distribution.put("61-80%", distribution.get("61-80%") + 1);
                    } else if (progress < 100) {
                        distribution.put("81-99%", distribution.get("81-99%") + 1);
                    } else {
                        distribution.put("100%", distribution.get("100%") + 1);
                    }
                });

        return distribution;
    }

    private Map<String, Long> calculateTaskStatusDistribution(List<Task> tasks) {
        Map<String, Long> distribution = new LinkedHashMap<>();
        distribution.put("TODO", 0L);
        distribution.put("IN_PROGRESS", 0L);
        distribution.put("DONE", 0L);
        distribution.put("OVERDUE", 0L);

        if (tasks.isEmpty()) {
            return distribution;
        }

        for (Task task : tasks) {
            String status = task.getStatus().toString();
            distribution.put(status, distribution.getOrDefault(status, 0L) + 1);

            if (task.isOverdue()) {
                distribution.put("OVERDUE", distribution.getOrDefault("OVERDUE", 0L) + 1);
            }
        }

        return distribution;
    }

    private Map<String, Long> calculateWeeklyTaskCompletion(List<Task> tasks) {
        Map<String, Long> weeklyCompletion = new LinkedHashMap<>();
        LocalDate today = LocalDate.now();

        // Initialize last 7 days
        for (int i = 6; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            String day = date.format(DateTimeFormatter.ofPattern("EEE"));
            weeklyCompletion.put(day, 0L);
        }

        if (tasks.isEmpty()) {
            return weeklyCompletion;
        }

        // Count completed tasks by day
        tasks.stream()
                .filter(task -> task.getStatus() == TaskStatus.DONE)
                .filter(task -> task.getUpdatedAt() != null)
                .filter(task -> task.getUpdatedAt().toLocalDate().isAfter(today.minusDays(7)))
                .forEach(task -> {
                    String day = task.getUpdatedAt().toLocalDate()
                            .format(DateTimeFormatter.ofPattern("EEE"));
                    weeklyCompletion.put(day, weeklyCompletion.getOrDefault(day, 0L) + 1);
                });

        return weeklyCompletion;
    }

    private Map<String, Long> calculateMonthlyProjectCreationOptimized(
            Map<Long, List<DashboardDataDTO>> projectsMap) {

        Map<String, Long> monthlyCreation = new LinkedHashMap<>();
        LocalDate today = LocalDate.now();

        // Initialize last 6 months
        for (int i = 5; i >= 0; i--) {
            LocalDate date = today.minusMonths(i);
            String month = date.format(DateTimeFormatter.ofPattern("MMM"));
            monthlyCreation.put(month, 0L);
        }

        if (projectsMap.isEmpty()) {
            return monthlyCreation;
        }

        // Count projects by month
        projectsMap.values().stream()
                .map(projectData -> projectData.get(0))
                .filter(project -> project.getProjectCreatedAt() != null)
                .filter(project -> project.getProjectCreatedAt().toLocalDate()
                        .isAfter(today.minusMonths(6)))
                .forEach(project -> {
                    String month = project.getProjectCreatedAt().toLocalDate()
                            .format(DateTimeFormatter.ofPattern("MMM"));
                    monthlyCreation.put(month, monthlyCreation.getOrDefault(month, 0L) + 1);
                });

        return monthlyCreation;
    }

    private List<StatsResponse.RecentActivity> getRecentActivitiesOptimized(
            Map<Long, List<DashboardDataDTO>> projectsMap,
            List<Task> allTasks) {

        List<StatsResponse.RecentActivity> activities = new ArrayList<>();
        LocalDateTime cutoff = LocalDateTime.now().minusDays(7);

        // Projects récents
        projectsMap.values().stream()
                .map(projectData -> projectData.get(0))
                .filter(project -> project.getProjectCreatedAt() != null &&
                        project.getProjectCreatedAt().isAfter(cutoff))
                .sorted((p1, p2) -> p2.getProjectCreatedAt().compareTo(p1.getProjectCreatedAt()))
                .limit(3)
                .forEach(project -> {
                    activities.add(StatsResponse.RecentActivity.builder()
                            .id(project.getProjectId())
                            .type("PROJECT_CREATED")
                            .title(project.getProjectTitle())
                            .description("New project created")
                            .timestamp(project.getProjectCreatedAt().toString())
                            .projectId(project.getProjectId())
                            .projectTitle(project.getProjectTitle())
                            .build());
                });

        // Tasks récentes
        allTasks.stream()
                .filter(task -> task.getCreatedAt() != null &&
                        task.getCreatedAt().isAfter(cutoff))
                .sorted((t1, t2) -> t2.getCreatedAt().compareTo(t1.getCreatedAt()))
                .limit(3)
                .forEach(task -> {
                    activities.add(StatsResponse.RecentActivity.builder()
                            .id(task.getId())
                            .type("TASK_CREATED")
                            .title(task.getTitle())
                            .description("New task added to " +
                                    (task.getProject() != null ? task.getProject().getTitle() : "project"))
                            .timestamp(task.getCreatedAt().toString())
                            .projectId(task.getProject() != null ? task.getProject().getId() : null)
                            .taskId(task.getId())
                            .projectTitle(task.getProject() != null ? task.getProject().getTitle() : null)
                            .build());
                });

        // Sort by timestamp
        return activities.stream()
                .sorted((a1, a2) -> {
                    try {
                        LocalDateTime time1 = LocalDateTime.parse(a1.getTimestamp());
                        LocalDateTime time2 = LocalDateTime.parse(a2.getTimestamp());
                        return time2.compareTo(time1);
                    } catch (Exception e) {
                        return 0;
                    }
                })
                .limit(6)
                .collect(Collectors.toList());
    }

    private StatsResponse createEmptyStatsResponse() {
        return StatsResponse.builder()
                .totalProjects(0L)
                .activeProjects(0L)
                .completedProjects(0L)
                .totalTasks(0L)
                .completedTasks(0L)
                .inProgressTasks(0L)
                .todoTasks(0L)
                .overdueTasks(0L)
                .averageProjectProgress(0.0)
                .projectsWithDeadlines(0L)
                .tasksWithDeadlines(0L)
                .recentActivities(new ArrayList<>())
                .projectProgressDistribution(new LinkedHashMap<>())
                .taskStatusDistribution(new LinkedHashMap<>())
                .weeklyTaskCompletion(new LinkedHashMap<>())
                .monthlyProjectCreation(new LinkedHashMap<>())
                .build();
    }
}