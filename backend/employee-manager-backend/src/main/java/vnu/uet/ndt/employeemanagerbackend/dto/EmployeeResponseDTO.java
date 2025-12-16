package vnu.uet.ndt.employeemanagerbackend.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class EmployeeResponseDTO {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String department;
    private String keycloakUserId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}


