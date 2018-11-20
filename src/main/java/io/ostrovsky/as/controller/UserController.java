package io.ostrovsky.as.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import io.ostrovsky.as.model.User;
import io.ostrovsky.as.repository.UserRepository;
import io.ostrovsky.as.service.UserService;

@RestController
@RequestMapping("/api/user/")
public class UserController extends AbstractController<User, User, UserRepository, UserService> {

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private UserRepository repository;

	@Override
	@RequestMapping(method = { RequestMethod.POST })
	public ResponseEntity<List<User>> create(
			@RequestBody User user) {

		String password = user.getPassword();
		password = (password == null)
				? null
				: passwordEncoder.encode(user.getPassword());
		user.setPassword(password);

		return super.create(user);
	}

	@Override
	@RequestMapping(method = { RequestMethod.PUT })
	public ResponseEntity<List<User>> edit(
			@RequestBody User user) {

		String password = user.getPassword();
		password = (password == null)
				? repository.findOne(user.getId()).getPassword()
				: passwordEncoder.encode(user.getPassword());
		user.setPassword(password);

		return super.edit(user);
	}
}