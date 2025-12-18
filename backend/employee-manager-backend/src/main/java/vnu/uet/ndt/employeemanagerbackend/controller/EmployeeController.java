package vnu.uet.ndt.employeemanagerbackend.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import vnu.uet.ndt.employeemanagerbackend.dto.CreateEmployeeDTO;
import vnu.uet.ndt.employeemanagerbackend.dto.EmployeeResponseDTO;
import vnu.uet.ndt.employeemanagerbackend.dto.UpdateEmployeeDTO;
import vnu.uet.ndt.employeemanagerbackend.service.EmployeeService;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {
    private final EmployeeService service;

    public EmployeeController(EmployeeService service) {
        this.service = service;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('hr_staff', 'hr_manager', 'hr_admin')")
    public ResponseEntity<List<EmployeeResponseDTO>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('hr_staff', 'hr_manager', 'hr_admin')")
    public ResponseEntity<EmployeeResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @GetMapping("/profile")
    @PreAuthorize("hasAnyRole('hr_staff', 'hr_manager', 'hr_admin')")
    public ResponseEntity<EmployeeResponseDTO> getOwnProfile() {
        return ResponseEntity.ok(service.getOwnProfile());
    }

    /**
     * Tạo nhân viên mới - chỉ admin và staff mới được phép
     * 
     * Request body example:
     * {
     *   "name": "Nguyen Van A",
     *   "email": "nguyenvana@example.com",
     *   "phone": "0123456789",
     *   "department": "IT"
     * }
     * 
     * Response 201 Created:
     * {
     *   "id": 1,
     *   "name": "Nguyen Van A",
     *   "email": "nguyenvana@example.com",
     *   "phone": "0123456789",
     *   "department": "IT",
     *   "keycloakUserId": null,
     *   "createdBy": "keycloak-user-id-123",
     *   "createdAt": "2024-01-15T10:30:00",
     *   "updatedAt": "2024-01-15T10:30:00"
     * }
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('hr_manager', 'hr_admin')")
    public ResponseEntity<EmployeeResponseDTO> create(@Valid @RequestBody CreateEmployeeDTO dto) {
        EmployeeResponseDTO created = service.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('hr_manager', 'hr_admin')")
    public ResponseEntity<EmployeeResponseDTO> update(
            @PathVariable Long id,
            @Valid @RequestBody UpdateEmployeeDTO dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('hr_admin')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
