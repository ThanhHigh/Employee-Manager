package vnu.uet.ndt.employeemanagerbackend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import vnu.uet.ndt.employeemanagerbackend.entity.Employee;
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
    public List<Employee> getAll() { return service.getAll(); }

    @PostMapping
    public Employee create(@RequestBody Employee emp) { return service.save(emp); }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { service.delete(id); }
}
