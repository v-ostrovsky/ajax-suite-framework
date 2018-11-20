package io.ostrovsky.as.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.ostrovsky.as.model.Role;
import io.ostrovsky.as.repository.RoleRepository;
import io.ostrovsky.as.service.RoleService;

@RestController
@RequestMapping("/api/role/")
public class RoleController extends AbstractController<Role, Role, RoleRepository, RoleService> {
}