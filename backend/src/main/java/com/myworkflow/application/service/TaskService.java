package com.myworkflow.application.service;

import com.myworkflow.application.dto.request.CreateTaskRequest;
import com.myworkflow.application.dto.request.TaskFilterRequest;
import com.myworkflow.application.dto.request.UpdateTaskRequest;
import com.myworkflow.application.dto.response.PaginatedResponse;
import com.myworkflow.application.dto.response.TaskDetailResponse;
import com.myworkflow.application.dto.response.TaskResponse;
import com.myworkflow.domain.model.Project;
import com.myworkflow.domain.model.Task;
import com.myworkflow.domain.model.TaskStatus;
import com.myworkflow.domain.model.User;
import com.myworkflow.domain.repository.ProjectRepository;
import com.myworkflow.domain.repository.TaskRepository;
import com.myworkflow.infrastructure.exception.ResourceNotFoundException;
import com.myworkflow.infrastructure.exception.UnauthorizedException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final ModelMapper modelMapper;
    private final ProgressService progressService;

    @Transactional
    public TaskResponse createTask(Long projectId, User user, CreateTaskRequest request) {
        // Get project and verify ownership
        Project project = getProjectAndVerifyOwnership(projectId, user);

        // Create task
        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .dueDate(request.getDueDate())
                .status(TaskStatus.TODO)
                .project(project)
                .build();

        task = taskRepository.save(task);

        // Update project progress
        progressService.updateProjectProgress(project.getId());

        return mapToTaskResponse(task);
    }

    @Transactional(readOnly = true)
    public PaginatedResponse<TaskResponse> getTasksByProject(
            Long projectId,
            User user,
            TaskFilterRequest filterRequest
    ) {
        // Get project and verify ownership
        Project project = getProjectAndVerifyOwnership(projectId, user);

        Pageable pageable = createPageable(filterRequest);
        Page<Task> tasksPage;

        if (filterRequest.getStatus() != null || filterRequest.getDueDate() != null) {
            // Use filter method
            tasksPage = taskRepository.findByProjectAndFilters(
                    project,
                    filterRequest.getStatus(),
                    filterRequest.getDueDate(),
                    pageable
            );
        } else if (filterRequest.getSearch() != null && !filterRequest.getSearch().trim().isEmpty()) {
            // Use search method
            tasksPage = taskRepository.findByProjectAndSearch(
                    project,
                    filterRequest.getSearch().trim(),
                    pageable
            );
        } else {
            // Get all tasks
            tasksPage = taskRepository.findByProject(project, pageable);
        }

        // Apply overdue filter if requested
        if (Boolean.TRUE.equals(filterRequest.getOverdue())) {
            List<Task> overdueTasks = tasksPage.getContent().stream()
                    .filter(Task::isOverdue)
                    .collect(Collectors.toList());

            return PaginatedResponse.of(
                    overdueTasks.stream()
                            .map(this::mapToTaskResponse)
                            .collect(Collectors.toList()),
                    tasksPage.getNumber(),
                    tasksPage.getSize(),
                    overdueTasks.size(),
                    (int) Math.ceil((double) overdueTasks.size() / tasksPage.getSize()),
                    tasksPage.isLast(),
                    tasksPage.isFirst()
            );
        }

        List<TaskResponse> tasks = tasksPage.getContent().stream()
                .map(this::mapToTaskResponse)
                .collect(Collectors.toList());

        return PaginatedResponse.of(
                tasks,
                tasksPage.getNumber(),
                tasksPage.getSize(),
                tasksPage.getTotalElements(),
                tasksPage.getTotalPages(),
                tasksPage.isLast(),
                tasksPage.isFirst()
        );
    }

    @Transactional(readOnly = true)
    public TaskDetailResponse getTaskById(Long taskId, User user) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));

        // Verify project ownership
        if (!task.getProject().getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("You are not authorized to access this task");
        }

        return mapToTaskDetailResponse(task);
    }

    @Transactional
    public TaskResponse updateTask(Long taskId, User user, UpdateTaskRequest request) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));

        // Verify project ownership
        if (!task.getProject().getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("You are not authorized to update this task");
        }

        // Update fields if provided
        if (request.getTitle() != null) {
            task.setTitle(request.getTitle());
        }

        if (request.getDescription() != null) {
            task.setDescription(request.getDescription());
        }

        if (request.getDueDate() != null) {
            task.setDueDate(request.getDueDate());
        }

        if (request.getStatus() != null) {
            task.setStatus(request.getStatus());
        }

        task = taskRepository.save(task);

        // Update project progress
        progressService.updateProjectProgress(task.getProject().getId());

        return mapToTaskResponse(task);
    }

    @Transactional
    public TaskResponse markTaskAsCompleted(Long taskId, User user) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));

        // Verify project ownership
        if (!task.getProject().getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("You are not authorized to update this task");
        }

        // Mark as completed
        task.markAsCompleted();
        task = taskRepository.save(task);

        // Update project progress
        progressService.updateProjectProgress(task.getProject().getId());

        return mapToTaskResponse(task);
    }

    @Transactional
    public void deleteTask(Long taskId, User user) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));

        // Verify project ownership
        if (!task.getProject().getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("You are not authorized to delete this task");
        }

        Long projectId = task.getProject().getId();
        taskRepository.delete(task);

        // Update project progress
        progressService.updateProjectProgress(projectId);
    }

    @Transactional(readOnly = true)
    public PaginatedResponse<TaskResponse> getUserTasks(User user, TaskFilterRequest filterRequest) {
        Pageable pageable = createPageable(filterRequest);
        Page<Task> tasksPage = taskRepository.findAll(pageable);

        // Filter tasks by user ownership
        List<Task> userTasks = tasksPage.getContent().stream()
                .filter(task -> task.getProject().getUser().getId().equals(user.getId()))
                .collect(Collectors.toList());

        List<TaskResponse> tasks = userTasks.stream()
                .map(this::mapToTaskResponse)
                .collect(Collectors.toList());

        return PaginatedResponse.of(
                tasks,
                tasksPage.getNumber(),
                tasksPage.getSize(),
                userTasks.size(),
                (int) Math.ceil((double) userTasks.size() / tasksPage.getSize()),
                tasksPage.isLast(),
                tasksPage.isFirst()
        );
    }

    private Project getProjectAndVerifyOwnership(Long projectId, User user) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));

        if (!project.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("You are not authorized to access this project");
        }

        return project;
    }

    private Pageable createPageable(TaskFilterRequest filterRequest) {
        Sort.Direction direction = Sort.Direction.fromString(filterRequest.getSortDirection());
        Sort sort = Sort.by(direction, filterRequest.getSortBy());

        return PageRequest.of(
                filterRequest.getPage(),
                filterRequest.getSize(),
                sort
        );
    }

    private TaskResponse mapToTaskResponse(Task task) {
        TaskResponse response = modelMapper.map(task, TaskResponse.class);
        response.setProjectId(task.getProject().getId());
        response.setProjectTitle(task.getProject().getTitle());
        response.setOverdue(task.isOverdue());
        return response;
    }

    private TaskDetailResponse mapToTaskDetailResponse(Task task) {
        TaskDetailResponse response = modelMapper.map(task, TaskDetailResponse.class);
        response.setOverdue(task.isOverdue());
        response.setProject(modelMapper.map(task.getProject(), TaskDetailResponse.ProjectResponse.class));
        return response;
    }
}