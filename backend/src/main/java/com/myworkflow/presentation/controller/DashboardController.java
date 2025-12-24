package com.myworkflow.presentation.controller;

import com.myworkflow.application.dto.response.ApiResponse;
import com.myworkflow.application.dto.response.DashboardResponse;
import com.myworkflow.application.dto.response.StatsResponse;
import com.myworkflow.application.service.AuthService;
import com.myworkflow.application.service.DashboardService;
import com.myworkflow.domain.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;
    private final AuthService authService;

    @GetMapping
    public ResponseEntity<ApiResponse<DashboardResponse>> getDashboard(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        DashboardResponse dashboard = dashboardService.getDashboardData(user);

        return ResponseEntity.ok(ApiResponse.success(dashboard));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<StatsResponse>> getStats(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        StatsResponse stats = dashboardService.getStats(user);

        return ResponseEntity.ok(ApiResponse.success(stats));
    }
}