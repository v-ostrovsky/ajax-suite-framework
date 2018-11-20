package io.ostrovsky.as.service;

import org.springframework.stereotype.Service;

import io.ostrovsky.as.model.User;
import io.ostrovsky.as.repository.UserRepository;

@Service
public class UserService extends AbstractService<User, User, UserRepository> {
}
