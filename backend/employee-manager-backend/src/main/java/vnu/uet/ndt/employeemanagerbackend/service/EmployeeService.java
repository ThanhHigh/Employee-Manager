package vnu.uet.ndt.employeemanagerbackend.service;

import org.springframework.stereotype.Service;
import vnu.uet.ndt.employeemanagerbackend.entity.Employee;
import vnu.uet.ndt.employeemanagerbackend.repository.EmployeeRepository;

import java.util.List;

@Service
public class EmployeeService {
    private final EmployeeRepository repository;

    public EmployeeService(EmployeeRepository repository) {
        this.repository = repository;
    }

    public List<Employee> getAll() { return repository.findAll(); }
    public Employee save(Employee e) { return repository.save(e); }
    public void delete(Long id) { repository.deleteById(id); }
}
