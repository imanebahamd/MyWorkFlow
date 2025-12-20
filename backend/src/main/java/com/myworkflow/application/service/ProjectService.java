package com.myworkflow.application.service;

import com.myworkflow.application.dto.request.CreateProjectRequest;
import com.myworkflow.application.dto.request.PageRequestDTO;
import com.myworkflow.application.dto.request.UpdateProjectRequest;
import com.myworkflow.application.dto.response.PaginatedResponse;
import com.myworkflow.application.dto.response.ProjectDetailResponse;
import com.myworkflow.application.dto.response.ProjectResponse;
import com.myworkflow.domain.model.Project;
import com.myworkflow.domain.model.User;
import com.myworkflow.domain.repository.ProjectRepository;
import com.myworkflow.domain.repository.TaskRepository;
import com.myworkflow.infrastructure.exception.ResourceNotFoundException;
import com.myworkflow.infrastructure.exception.UnauthorizedException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.PageRequest;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final ModelMapper modelMapper;
    private final AuthService authService;

    @Transactional
    public ProjectResponse createProject(User user, CreateProjectRequest request) {
        Project project = Project.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .user(user)
                .build();

        project = projectRepository.save(project);
        return mapToProjectResponse(project);
    }

    @Transactional(readOnly = true)
    public PaginatedResponse<ProjectResponse> getUserProjects(
            User user,
            PageRequestDTO pageRequest
    ) {
        Pageable pageable = createPageable(pageRequest);
        Page<Project> projectsPage;

        if (pageRequest.getSearch() != null && !pageRequest.getSearch().trim().isEmpty()) {
            projectsPage = projectRepository.findByUserAndSearch(
                    user,
                    pageRequest.getSearch().trim(),
                    pageable
            );
        } else {
            projectsPage = projectRepository.findByUser(user, pageable);
        }

        List<ProjectResponse> projects = projectsPage.getContent().stream()
                .map(this::mapToProjectResponse)
                .collect(Collectors.toList());

        return PaginatedResponse.of(
                projects,
                projectsPage.getNumber(),
                projectsPage.getSize(),
                projectsPage.getTotalElements(),
                projectsPage.getTotalPages(),
                projectsPage.isLast(),
                projectsPage.isFirst()
        );
    }

    @Transactional(readOnly = true)
    public ProjectDetailResponse getProjectById(Long projectId, User user) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));

        // Check if user owns the project
        if (!project.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("You are not authorized to access this project");
        }

        return mapToProjectDetailResponse(project);
    }

    @Transactional
    public ProjectResponse updateProject(
            Long projectId,
            User user,
            UpdateProjectRequest request
    ) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));

        // Check if user owns the project
        if (!project.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("You are not authorized to update this project");
        }

        // Update fields if provided
        if (request.getTitle() != null) {
            project.setTitle(request.getTitle());
        }

        if (request.getDescription() != null) {
            project.setDescription(request.getDescription());
        }

        project = projectRepository.save(project);
        return mapToProjectResponse(project);
    }

    @Transactional
    public void deleteProject(Long projectId, User user) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));

        // Check if user owns the project
        if (!project.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("You are not authorized to delete this project");
        }

        projectRepository.delete(project);
    }

    private Pageable createPageable(PageRequestDTO pageRequest) {
        Sort.Direction direction = Sort.Direction.fromString(pageRequest.getSortDirection());
        Sort sort = Sort.by(direction, pageRequest.getSortBy());

        return PageRequest. of(
                pageRequest.getPage(),
                pageRequest.getSize(),
                sort
        );
    }

    private ProjectResponse mapToProjectResponse(Project project) {
        ProjectResponse response = modelMapper.map(project, ProjectResponse.class);

        // Calculate task statistics
        long totalTasks = taskRepository.countByProject(project);
        long completedTasks = taskRepository.countByProjectAndStatus(
                project,
                com.myworkflow.domain.model.TaskStatus.DONE
        );

        double progressPercentage = totalTasks > 0
                ? (double) completedTasks / totalTasks * 100
                : 0.0;

        response.setTotalTasks(totalTasks);
        response.setCompletedTasks(completedTasks);
        response.setProgressPercentage(Math.round(progressPercentage * 100.0) / 100.0);

        return response;
    }

    private ProjectDetailResponse mapToProjectDetailResponse(Project project) {
        ProjectDetailResponse response = modelMapper.map(project, ProjectDetailResponse.class);

        // Map owner
        response.setOwner(modelMapper.map(project.getUser(), ProjectDetailResponse.UserResponse.class));

        // Calculate task statistics
        long totalTasks = taskRepository.countByProject(project);
        long completedTasks = taskRepository.countByProjectAndStatus(
                project,
                com.myworkflow.domain.model.TaskStatus.DONE
        );

        double progressPercentage = totalTasks > 0
                ? (double) completedTasks / totalTasks * 100
                : 0.0;

        response.setTotalTasks(totalTasks);
        response.setCompletedTasks(completedTasks);
        response.setProgressPercentage(Math.round(progressPercentage * 100.0) / 100.0);

        return response;
    }
}