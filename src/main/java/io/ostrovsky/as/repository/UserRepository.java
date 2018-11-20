package io.ostrovsky.as.repository;

import io.ostrovsky.as.model.User;

public interface UserRepository extends AbstractRepository<User, User, Integer> {

	User findByUsername(String login);
}