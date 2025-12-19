package com.myworkflow.application.service;

import com.myworkflow.application.dto.request.UpdateProfileRequest;
import com.myworkflow.application.dto.response.UserProfileResponse;
import com.myworkflow.domain.model.User;
import com.myworkflow.domain.repository.UserRepository;
import com.myworkflow.infrastructure.exception.AuthenticationException;
import com.myworkflow.infrastructure.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ModelMapper modelMapper;

    private static final String UPLOAD_DIR = "uploads/profile-images/";

    @Transactional
    public UserProfileResponse updateProfile(Long userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Update basic info
        if (request.getFirstName() != null) {
            user.setFirstName(request.getFirstName());
        }

        if (request.getLastName() != null) {
            user.setLastName(request.getLastName());
        }

        // Update password if provided
        if (request.getPassword() != null && request.getCurrentPassword() != null) {
            // Verify current password
            if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                throw new AuthenticationException("Current password is incorrect");
            }

            // Update to new password
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        user = userRepository.save(user);
        return modelMapper.map(user, UserProfileResponse.class);
    }

    @Transactional
    public UserProfileResponse updateProfileImage(Long userId, MultipartFile file) throws IOException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Delete old image if exists
        if (user.getProfileImageUrl() != null) {
            Path oldImagePath = Paths.get(user.getProfileImageUrl());
            if (Files.exists(oldImagePath)) {
                Files.delete(oldImagePath);
            }
        }

        // Create upload directory if not exists
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Generate unique filename
        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(filename);

        // Save file
        Files.copy(file.getInputStream(), filePath);

        // Update user profile image URL
        user.setProfileImageUrl(filePath.toString());
        user = userRepository.save(user);

        return modelMapper.map(user, UserProfileResponse.class);
    }

    public UserProfileResponse getProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return modelMapper.map(user, UserProfileResponse.class);
    }
}