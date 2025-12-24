package com.myworkflow.application.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatsResponse {

    // Project Statistics
    private long totalProjects;
    private long activeProjects;
    private long completedProjects;

    // Task Statistics
    private long totalTasks;
    private long completedTasks;
    private long inProgressTasks;
    private long todoTasks;
    private long overdueTasks;

    // Progress Statistics
    private double averageProjectProgress;
    private long projectsWithDeadlines;
    private long tasksWithDeadlines;

    // Recent Activity
    private List<RecentActivity> recentActivities;

    // Project Progress Distribution
    private Map<String, Long> projectProgressDistribution;

    // Task Status Distribution
    private Map<String, Long> taskStatusDistribution;

    // Weekly/Monthly Trends
    private Map<String, Long> weeklyTaskCompletion;
    private Map<String, Long> monthlyProjectCreation;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecentActivity {
        private Long id;
        private String type; // "PROJECT_CREATED", "TASK_CREATED", "TASK_COMPLETED", "PROJECT_UPDATED"
        private String title;
        private String description;
        private String timestamp;
        private Long projectId;
        private Long taskId;
        private String projectTitle;
    }
}