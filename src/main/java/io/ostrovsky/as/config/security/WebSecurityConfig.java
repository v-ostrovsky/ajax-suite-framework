package io.ostrovsky.as.config.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import io.ostrovsky.as.security.AuthenticationEntryPointImpl;
import io.ostrovsky.as.security.AuthenticationFailureHandlerImpl;
import io.ostrovsky.as.security.AuthenticationSuccessHandlerRest;
import io.ostrovsky.as.security.UserDetailsServiceImpl;

@Configuration
@EnableGlobalMethodSecurity(prePostEnabled = true)
@EnableWebSecurity
@ComponentScan(basePackages = {
		"io.ostrovsky.as.security" })
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

	@Autowired
	private AuthenticationEntryPointImpl authenticationEntryPoint;

	@Autowired
	private UserDetailsServiceImpl userDetailsService;

	@Autowired
	private AuthenticationSuccessHandlerRest authenticationSuccessHandler;

	@Autowired
	private AuthenticationFailureHandlerImpl authenticationFailureHandler;

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder(11);
	}

	@Bean
	public DaoAuthenticationProvider authProvider() {
		final DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
		authProvider.setUserDetailsService(userDetailsService);
		authProvider.setPasswordEncoder(passwordEncoder());

		return authProvider;
	}

	@Override
	public void configure(AuthenticationManagerBuilder auth) throws Exception {
		auth.authenticationProvider(authProvider());
	}

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http.authorizeRequests()
				.antMatchers("/index.html", "/lib/**").permitAll()
				.antMatchers("/asapp/main.js", "/asapp/as.min.js", "/asapp/ajax-suite/**").permitAll()
				.regexMatchers("^/asapp/application/((?!ROLE_).)*$").permitAll()
				// .antMatchers(HttpMethod.GET, "/api/authorities/", "/api/doc/", "/api/content/**").permitAll()
				.antMatchers(HttpMethod.GET, "/api/authorities/").permitAll()
				.anyRequest().hasAuthority("ROLE_ADMIN");

		http.csrf().disable();

		http.exceptionHandling().authenticationEntryPoint(authenticationEntryPoint);

		http.formLogin()
				.loginProcessingUrl("/login")
				.usernameParameter("username")
				.passwordParameter("password")
				.successHandler(authenticationSuccessHandler)
				.failureHandler(authenticationFailureHandler)
				.permitAll();

		http.logout()
				.logoutSuccessUrl("/")
				.permitAll();
	}
}