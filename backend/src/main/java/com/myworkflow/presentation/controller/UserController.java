package com.myworkflow.presentation.controller;

import com.myworkflow.application.dto.request.UpdateProfileRequest;
import com.myworkflow.application.dto.response.ApiResponse;
import com.myworkflow.application.dto.response.UserProfileResponse;
import com.myworkflow.application.service.AuthService;
import com.myworkflow.application.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final AuthService authService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getCurrentUser(
            @AuthenticationPrincipal UserDetails userDetails) {

        var user = authService.getCurrentUser(userDetails.getUsername());
        UserProfileResponse response = userService.getProfile(user.getId());

        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UpdateProfileRequest request) {

        var user = authService.getCurrentUser(userDetails.getUsername());
        UserProfileResponse response = userService.updateProfile(user.getId(), request);

        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", response));
    }

    @PatchMapping(value = "/me/profile-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateProfileImage(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam("file") MultipartFile file) throws IOException {

        var user = authService.getCurrentUser(userDetails.getUsername());
        UserProfileResponse response = userService.updateProfileImage(user.getId(), file);

        return ResponseEntity.ok(ApiResponse.success("Profile image updated successfully", response));
    }
    
}