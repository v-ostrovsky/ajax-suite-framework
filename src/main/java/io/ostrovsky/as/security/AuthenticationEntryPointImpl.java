package io.ostrovsky.as.security;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

@Component
public final class AuthenticationEntryPointImpl implements AuthenticationEntryPoint {

	private final Logger logger = LogManager.getLogger(getClass());

	@Override
	public void commence(final HttpServletRequest request, final HttpServletResponse response, final AuthenticationException authException) throws IOException {
		logger.info("Method: {}, servlet path: {}", request.getMethod(), request.getServletPath());

		int pos = request.getServletPath().indexOf("application");
		if (pos >= 0) {
			String pathToEmptyFile = request.getServletPath().substring(0, pos + 12) + "empty.js";
			response.sendRedirect(request.getContextPath() + pathToEmptyFile);
		} else {
			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
		}
	}
}