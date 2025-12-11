package vnu.uet.ndt.employeemanagerbackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vnu.uet.ndt.employeemanagerbackend.entity.Employee;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
}
