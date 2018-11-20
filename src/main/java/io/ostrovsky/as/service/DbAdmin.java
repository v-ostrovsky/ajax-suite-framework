package io.ostrovsky.as.service;

import java.io.IOException;
import java.io.InputStream;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class DbAdmin {

	@Value("${jdbc.url}")
	String dbUrl;

	@Value("${jdbc.username}")
	String dbUserName;

	@Value("${jdbc.password}")
	String dbPassword;

	public void dumpdb(HttpServletResponse response) throws IOException {
		Runtime runtime = Runtime.getRuntime();
		String dbName = dbUrl.substring(dbUrl.lastIndexOf("/") + 1);
		dbName = dbName.substring(0, dbName.lastIndexOf("?"));
		Process process = runtime.exec("mysqldump -u" + dbUserName + " -p" + dbPassword + " " + dbName);
		InputStream inputStream = process.getInputStream();
		IOUtils.copy(inputStream, response.getOutputStream());
		response.flushBuffer();
		inputStream.close();
	}

}
