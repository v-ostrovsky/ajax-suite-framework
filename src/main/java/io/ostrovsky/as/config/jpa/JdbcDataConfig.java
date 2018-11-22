package io.ostrovsky.as.config.jpa;

import javax.annotation.Resource;
import javax.sql.DataSource;

import org.apache.commons.dbcp.BasicDataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

@Configuration
public class JdbcDataConfig {

	@Resource
	private Environment environment;

	@Bean
	public DataSource dataSource() {
		BasicDataSource dataSource = new BasicDataSource();
		dataSource.setDriverClassName(environment.getRequiredProperty("jdbc.driver"));
		dataSource.setUrl(environment.getRequiredProperty("jdbc.url"));
		dataSource.setUsername(environment.getRequiredProperty("jdbc.username"));
		dataSource.setPassword(environment.getRequiredProperty("jdbc.password"));

		dataSource.setTestWhileIdle(true);
		dataSource.setTestOnBorrow(true);
		dataSource.setValidationQuery("SELECT 1");
		dataSource.setTimeBetweenEvictionRunsMillis(3600000);
		dataSource.setMinEvictableIdleTimeMillis(3600000);

		return dataSource;
	}

}
