/**
 * 
 */
package io.ostrovsky.as.security;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import io.ostrovsky.as.model.User;
import io.ostrovsky.as.repository.UserRepository;

@Component
public class UserDetailsServiceImpl implements UserDetailsService {

	private final Logger logger = LogManager.getLogger(getClass());

	@Autowired
	private UserRepository repository;

	@Override
	public UserDetails loadUserByUsername(String username)
			throws UsernameNotFoundException {

		User user = repository.findByUsername(username);
		if (user == null) {
			throw new UsernameNotFoundException("UserName " + username + " not found");
		}

		UserDetails userDetails = new UserDetailsImpl(user);

		logger.info("Found UserDetails with username: {}", userDetails.getUsername());

		return userDetails;
	}

}
