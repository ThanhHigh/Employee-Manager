package vnu.uet.ndt.employeemanagerbackend.service;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vnu.uet.ndt.employeemanagerbackend.dto.CreateEmployeeDTO;
import vnu.uet.ndt.employeemanagerbackend.dto.EmployeeResponseDTO;
import vnu.uet.ndt.employeemanagerbackend.dto.UpdateEmployeeDTO;
import vnu.uet.ndt.employeemanagerbackend.entity.Employee;
import vnu.uet.ndt.employeemanagerbackend.repository.EmployeeRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmployeeService {
    private final EmployeeRepository repository;
    private final CurrentUserService currentUserService;

    public EmployeeService(EmployeeRepository repository, CurrentUserService currentUserService) {
        this.repository = repository;
        this.currentUserService = currentUserService;
    }

    public List<EmployeeResponseDTO> getAll() {
        String currentUserId = currentUserService.getCurrentUserId();
        List<Employee> employees;

        if (currentUserService.isAdmin() || currentUserService.isStaff()) {
            // ADMIN and STAFF can see all employees
            employees = repository.findAll();
        } else if (currentUserService.isUser()) {
            // USER can only see their own profile
            employees = repository.findByKeycloakUserId(currentUserId)
                    .map(List::of)
                    .orElse(List.of());
        } else {
            employees = List.of();
        }

        return employees.stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public EmployeeResponseDTO getById(Long id) {
        Employee employee = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Employee not found with id: " + id));
        
        // Check access: USER can only access their own profile
        if (currentUserService.isUser()) {
            String currentUserId = currentUserService.getCurrentUserId();
            if (!currentUserId.equals(employee.getKeycloakUserId())) {
                throw new AccessDeniedException("Access denied: You can only view your own profile");
            }
        }

        return toResponseDTO(employee);
    }

    public EmployeeResponseDTO getOwnProfile() {
        String currentUserId = currentUserService.getCurrentUserId();
        Employee employee = repository.findByKeycloakUserId(currentUserId)
                .orElseThrow(() -> new EntityNotFoundException("Employee profile not found for current user"));
        return toResponseDTO(employee);
    }

    /**
     * Tạo nhân viên mới - chỉ admin và staff mới được phép
     * Tự động set createdAt và createdBy
     */
    @Transactional
    public EmployeeResponseDTO create(CreateEmployeeDTO dto) {
        // Kiểm tra quyền: chỉ admin mới được tạo nhân viên
        if (!currentUserService.isAdmin() && !currentUserService.isStaff()) {
            throw new AccessDeniedException("Only admin users or staff users can create employees");
        }

        // Kiểm tra email đã tồn tại chưa
        if (repository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Email already exists: " + dto.getEmail());
        }

        // Tạo entity và set các giá trị tự động
        Employee employee = toEntity(dto);
        employee.setCreatedBy(currentUserService.getCurrentUserId()); // Tự động set createdBy
        // createdAt sẽ được tự động set bởi @CreationTimestamp

        Employee saved = repository.save(employee);
        return toResponseDTO(saved);
    }

    @Transactional
    public EmployeeResponseDTO update(Long id, UpdateEmployeeDTO dto) {
        Employee employee = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Employee not found with id: " + id));
        
        if (dto.getName() != null) {
            employee.setName(dto.getName());
        }
        if (dto.getEmail() != null) {
            employee.setEmail(dto.getEmail());
        }
        if (dto.getPhone() != null) {
            employee.setPhone(dto.getPhone());
        }
        if (dto.getDepartment() != null) {
            employee.setDepartment(dto.getDepartment());
        }
        
        Employee updated = repository.save(employee);
        return toResponseDTO(updated);
    }

    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new EntityNotFoundException("Employee not found with id: " + id);
        }
        repository.deleteById(id);
    }

    private Employee toEntity(CreateEmployeeDTO dto) {
        Employee employee = new Employee();
        employee.setName(dto.getName());
        employee.setEmail(dto.getEmail());
        employee.setPhone(dto.getPhone());
        employee.setDepartment(dto.getDepartment());
        employee.setKeycloakUserId(dto.getKeycloakUserId());
        return employee;
    }

    private EmployeeResponseDTO toResponseDTO(Employee employee) {
        EmployeeResponseDTO dto = new EmployeeResponseDTO();
        dto.setId(employee.getId());
        dto.setName(employee.getName());
        dto.setEmail(employee.getEmail());
        dto.setPhone(employee.getPhone());
        dto.setDepartment(employee.getDepartment());
        dto.setKeycloakUserId(employee.getKeycloakUserId());
        dto.setCreatedBy(employee.getCreatedBy());
        dto.setCreatedAt(employee.getCreatedAt());
        dto.setUpdatedAt(employee.getUpdatedAt());
        return dto;
    }
}
