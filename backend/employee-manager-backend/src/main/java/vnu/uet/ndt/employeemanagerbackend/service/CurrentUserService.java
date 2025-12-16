package vnu.uet.ndt.employeemanagerbackend.service;

import org.springframework.stereotype.Component;
import vnu.uet.ndt.employeemanagerbackend.util.SecurityUtils;

import java.util.List;

@Component
public class CurrentUserService {

    public String getCurrentUserId() {
        return SecurityUtils.getCurrentUserId();
    }

    public List<String> getCurrentUserRoles() {
        return SecurityUtils.getCurrentUserRoles();
    }

    public boolean hasRole(String role) {
        return SecurityUtils.hasRole(role);
    }

    public boolean isAdmin() {
        return SecurityUtils.isAdmin();
    }

    public boolean isStaff() {
        return SecurityUtils.isStaff();
    }

    public boolean isUser() {
        return SecurityUtils.isUser();
    }
}


