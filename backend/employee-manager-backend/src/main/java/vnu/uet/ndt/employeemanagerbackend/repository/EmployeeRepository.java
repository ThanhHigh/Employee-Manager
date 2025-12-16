package vnu.uet.ndt.employeemanagerbackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vnu.uet.ndt.employeemanagerbackend.entity.Employee;

import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Optional<Employee> findByKeycloakUserId(String keycloakUserId);
    boolean existsByEmail(String email);
}
