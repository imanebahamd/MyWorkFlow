package com.myworkflow.application.service;

import com.myworkflow.application.dto.request.LoginRequest;
import com.myworkflow.application.dto.request.RegisterRequest;
import com.myworkflow.application.dto.response.AuthResponse;
import com.myworkflow.domain.model.User;
import com.myworkflow.domain.repository.UserRepository;
import com.myworkflow.infrastructure.exception.AuthenticationException;
import com.myworkflow.infrastructure.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final ModelMapper modelMapper;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Check if user already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AuthenticationException("Email already registered");
        }

        // Create new user
        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .build();

        user = userRepository.save(user);

        // Generate token
        String token = jwtService.generateToken(user);

        // Build response
        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .user(modelMapper.map(user, AuthResponse.UserResponse.class))
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        // Authenticate user
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        // Get user
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Generate token
        String token = jwtService.generateToken(user);

        // Build response
        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .user(modelMapper.map(user, AuthResponse.UserResponse.class))
                .build();
    }

    public User getCurrentUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}