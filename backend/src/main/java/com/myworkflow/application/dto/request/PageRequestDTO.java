package com.myworkflow.application.dto.request;

import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PageRequestDTO {

    @Builder.Default
    @Min(value = 0, message = "Page number must be greater than or equal to 0")
    private int page = 0;

    @Builder.Default
    @Min(value = 1, message = "Page size must be greater than or equal to 1")
    private int size = 10;

    private String sortBy = "createdAt";

    private String sortDirection = "desc";

    private String search;
}