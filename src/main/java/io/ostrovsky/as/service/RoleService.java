package io.ostrovsky.as.service;

import org.springframework.stereotype.Service;

import io.ostrovsky.as.model.Role;
import io.ostrovsky.as.repository.RoleRepository;

@Service
public class RoleService extends AbstractService<Role, Role, RoleRepository> {
}
