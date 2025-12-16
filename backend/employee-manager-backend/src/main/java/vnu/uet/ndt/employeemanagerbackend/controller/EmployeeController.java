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
    @PreAuthorize("hasAnyRole('role-admin', 'role-staff', 'role-user')")
    public ResponseEntity<List<EmployeeResponseDTO>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('role-admin', 'role-staff', 'role-user')")
    public ResponseEntity<EmployeeResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @GetMapping("/profile")
    @PreAuthorize("hasAnyRole('role-admin', 'role-staff', 'role-user')")
    public ResponseEntity<EmployeeResponseDTO> getOwnProfile() {
        return ResponseEntity.ok(service.getOwnProfile());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('role-admin', 'role-staff')")
    public ResponseEntity<EmployeeResponseDTO> create(@Valid @RequestBody CreateEmployeeDTO dto) {
        EmployeeResponseDTO created = service.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('role-admin', 'role-staff')")
    public ResponseEntity<EmployeeResponseDTO> update(
            @PathVariable Long id,
            @Valid @RequestBody UpdateEmployeeDTO dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('role-admin')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
