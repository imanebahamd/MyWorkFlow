package com.myworkflow.presentation.controller;

import com.myworkflow.application.dto.request.CreateTaskRequest;
import com.myworkflow.application.dto.request.TaskFilterRequest;
import com.myworkflow.application.dto.request.UpdateTaskRequest;
import com.myworkflow.application.dto.response.ApiResponse;
import com.myworkflow.application.dto.response.PaginatedResponse;
import com.myworkflow.application.dto.response.TaskDetailResponse;
import com.myworkflow.application.dto.response.TaskResponse;
import com.myworkflow.application.service.AuthService;
import com.myworkflow.application.service.TaskService;
import com.myworkflow.domain.model.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;
    private final AuthService authService;

    // Project-specific tasks endpoints
    @PostMapping("/projects/{projectId}/tasks")
    public ResponseEntity<ApiResponse<TaskResponse>> createTask(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long projectId,
            @Valid @RequestBody CreateTaskRequest request
    ) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        TaskResponse task = taskService.createTask(projectId, user, request);

        return ResponseEntity.ok(
                ApiResponse.success("Task created successfully", task)
        );
    }

    @GetMapping("/projects/{projectId}/tasks")
    public ResponseEntity<ApiResponse<PaginatedResponse<TaskResponse>>> getProjectTasks(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long projectId,
            @Valid TaskFilterRequest filterRequest
    ) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        PaginatedResponse<TaskResponse> tasks = taskService.getTasksByProject(projectId, user, filterRequest);

        return ResponseEntity.ok(ApiResponse.success(tasks));
    }

    // General tasks endpoints
    @GetMapping("/tasks")
    public ResponseEntity<ApiResponse<PaginatedResponse<TaskResponse>>> getUserTasks(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid TaskFilterRequest filterRequest
    ) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        PaginatedResponse<TaskResponse> tasks = taskService.getUserTasks(user, filterRequest);

        return ResponseEntity.ok(ApiResponse.success(tasks));
    }

    @GetMapping("/tasks/{id}")
    public ResponseEntity<ApiResponse<TaskDetailResponse>> getTask(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id
    ) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        TaskDetailResponse task = taskService.getTaskById(id, user);

        return ResponseEntity.ok(ApiResponse.success(task));
    }

    @PutMapping("/tasks/{id}")
    public ResponseEntity<ApiResponse<TaskResponse>> updateTask(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody UpdateTaskRequest request
    ) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        TaskResponse task = taskService.updateTask(id, user, request);

        return ResponseEntity.ok(
                ApiResponse.success("Task updated successfully", task)
        );
    }

    @PatchMapping("/tasks/{id}/complete")
    public ResponseEntity<ApiResponse<TaskResponse>> markTaskAsCompleted(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id
    ) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        TaskResponse task = taskService.markTaskAsCompleted(id, user);

        return ResponseEntity.ok(
                ApiResponse.success("Task marked as completed", task)
        );
    }

    @DeleteMapping("/tasks/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTask(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id
    ) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        taskService.deleteTask(id, user);

        return ResponseEntity.ok(
                ApiResponse.success("Task deleted successfully", null)
        );
    }

    // Search tasks across all user's projects
    @GetMapping("/tasks/search")
    public ResponseEntity<ApiResponse<PaginatedResponse<TaskResponse>>> searchTasks(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam String query,
            @Valid TaskFilterRequest filterRequest
    ) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        filterRequest.setSearch(query);
        PaginatedResponse<TaskResponse> tasks = taskService.getUserTasks(user, filterRequest);

        return ResponseEntity.ok(ApiResponse.success(tasks));
    }
}