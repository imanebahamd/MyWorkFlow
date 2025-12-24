package com.myworkflow.application.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardDataDTO {
    private Long projectId;
    private String projectTitle;
    private String projectDescription;
    private LocalDateTime projectCreatedAt;
    private LocalDateTime projectUpdatedAt;
    private Long totalTasks;
    private Long completedTasks;
    private Long tasksWithDeadlines;

    private Long taskId;
    private String taskTitle;
    private String taskDescription;
    private java.time.LocalDate taskDueDate;
    private String taskStatus;
    private LocalDateTime taskCreatedAt;
    private LocalDateTime taskUpdatedAt;
    private Boolean taskOverdue;
}