package com.myworkflow.presentation.controller;

import com.myworkflow.application.dto.request.CreateProjectRequest;
import com.myworkflow.application.dto.request.PageRequestDTO;
import com.myworkflow.application.dto.request.UpdateProjectRequest;
import com.myworkflow.application.dto.response.ApiResponse;
import com.myworkflow.application.dto.response.PaginatedResponse;
import com.myworkflow.application.dto.response.ProjectDetailResponse;
import com.myworkflow.application.dto.response.ProjectResponse;
import com.myworkflow.application.service.AuthService;
import com.myworkflow.application.service.ProjectService;
import com.myworkflow.domain.model.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;
    private final AuthService authService;

    @PostMapping
    public ResponseEntity<ApiResponse<ProjectResponse>> createProject(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CreateProjectRequest request
    ) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        ProjectResponse project = projectService.createProject(user, request);

        return ResponseEntity.ok(
                ApiResponse.success("Project created successfully", project)
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PaginatedResponse<ProjectResponse>>> getUserProjects(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid PageRequestDTO pageRequest
    ) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        PaginatedResponse<ProjectResponse> projects = projectService.getUserProjects(user, pageRequest);

        return ResponseEntity.ok(ApiResponse.success(projects));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProjectDetailResponse>> getProject(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id
    ) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        ProjectDetailResponse project = projectService.getProjectById(id, user);

        return ResponseEntity.ok(ApiResponse.success(project));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProjectResponse>> updateProject(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody UpdateProjectRequest request
    ) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        ProjectResponse project = projectService.updateProject(id, user, request);

        return ResponseEntity.ok(
                ApiResponse.success("Project updated successfully", project)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProject(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id
    ) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        projectService.deleteProject(id, user);

        return ResponseEntity.ok(
                ApiResponse.success("Project deleted successfully", null)
        );
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<PaginatedResponse<ProjectResponse>>> searchProjects(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam String query,
            @Valid PageRequestDTO pageRequest
    ) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        pageRequest.setSearch(query);
        PaginatedResponse<ProjectResponse> projects = projectService.getUserProjects(user, pageRequest);

        return ResponseEntity.ok(ApiResponse.success(projects));
    }
}