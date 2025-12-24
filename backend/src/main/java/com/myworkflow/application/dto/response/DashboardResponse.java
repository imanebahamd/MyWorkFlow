package com.myworkflow.application.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {

    private StatsResponse stats;
    private List<ProjectResponse> recentProjects;
    private List<TaskResponse> upcomingTasks;
    private List<TaskResponse> overdueTasks;
}