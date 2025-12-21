package com.myworkflow.application.service;

import com.myworkflow.domain.model.Project;
import com.myworkflow.domain.model.TaskStatus;
import com.myworkflow.domain.repository.ProjectRepository;
import com.myworkflow.domain.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProgressService {

    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;

    @Transactional
    public void updateProjectProgress(Long projectId) {
        Project project = projectRepository.findById(projectId).orElse(null);
        if (project == null) return;

        long totalTasks = taskRepository.countByProject(project);
        long completedTasks = taskRepository.countByProjectAndStatus(project, TaskStatus.DONE);

        // Calculate progress percentage
        double progressPercentage = totalTasks > 0
                ? (double) completedTasks / totalTasks * 100
                : 0.0;

        // Round to 2 decimal places
        progressPercentage = Math.round(progressPercentage * 100.0) / 100.0;

        // We'll store this in a cache or separate progress table if needed
        // For now, we just update the project entity if it has progress fields
        // (You might want to add progressPercentage field to Project entity)
    }

    @Transactional(readOnly = true)
    public double calculateProjectProgress(Long projectId) {
        Project project = projectRepository.findById(projectId).orElse(null);
        if (project == null) return 0.0;

        long totalTasks = taskRepository.countByProject(project);
        long completedTasks = taskRepository.countByProjectAndStatus(project, TaskStatus.DONE);

        if (totalTasks == 0) return 0.0;

        double progress = (double) completedTasks / totalTasks * 100;
        return Math.round(progress * 100.0) / 100.0;
    }

    @Transactional(readOnly = true)
    public long getTotalTasks(Long projectId) {
        Project project = projectRepository.findById(projectId).orElse(null);
        if (project == null) return 0;
        return taskRepository.countByProject(project);
    }

    @Transactional(readOnly = true)
    public long getCompletedTasks(Long projectId) {
        Project project = projectRepository.findById(projectId).orElse(null);
        if (project == null) return 0;
        return taskRepository.countByProjectAndStatus(project, TaskStatus.DONE);
    }
}