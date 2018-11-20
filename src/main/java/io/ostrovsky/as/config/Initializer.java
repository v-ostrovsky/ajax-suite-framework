package io.ostrovsky.as.config;

import javax.servlet.MultipartConfigElement;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletRegistration;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.web.WebApplicationInitializer;
import org.springframework.web.context.ContextLoaderListener;
import org.springframework.web.context.support.AnnotationConfigWebApplicationContext;
import org.springframework.web.servlet.DispatcherServlet;

import io.ostrovsky.as.config.jpa.JdbcDataConfig;
import io.ostrovsky.as.config.jpa.PersistenceConfig;
import io.ostrovsky.as.config.security.WebSecurityConfig;
import io.ostrovsky.as.config.web.WebConfig;

public class Initializer implements WebApplicationInitializer {

	private String TMP_FOLDER = "/tmp";
	private int MAX_UPLOAD_SIZE = 5 * 1024 * 1024;

	private final Logger logger = LogManager.getLogger(getClass());

	public void onStartup(ServletContext container) throws ServletException {

		logger.debug("The application starts initializing...");

		// Create the 'root' Spring application context
		AnnotationConfigWebApplicationContext rootContext = new AnnotationConfigWebApplicationContext();
		rootContext.register(JdbcDataConfig.class);
		rootContext.register(PersistenceConfig.class);
		rootContext.register(WebSecurityConfig.class);

		// Manage the lifecycle of the root application context
		container.addListener(new ContextLoaderListener(rootContext));

		// Create the dispatcher servlet's context
		AnnotationConfigWebApplicationContext dispatcherContext = new AnnotationConfigWebApplicationContext();
		dispatcherContext.register(WebConfig.class);

		// Register and map the dispatcher servlet
		DispatcherServlet servlet = new DispatcherServlet(dispatcherContext);
		ServletRegistration.Dynamic dispatcher = container.addServlet("dispatcher", servlet);
		dispatcher.setLoadOnStartup(1);
		dispatcher.addMapping("/");

		// In order to use Servlet 3.0 multipart parsing
		MultipartConfigElement multipartConfigElement = new MultipartConfigElement(TMP_FOLDER, MAX_UPLOAD_SIZE, MAX_UPLOAD_SIZE * 2, MAX_UPLOAD_SIZE / 2);
		dispatcher.setMultipartConfig(multipartConfigElement);
	}
}
