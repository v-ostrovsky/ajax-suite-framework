package io.ostrovsky.as.controller;

import java.io.IOException;
import java.math.BigInteger;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.FilenameUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import io.ostrovsky.as.service.DbAdmin;

@RestController
public class AppController {

	private final Logger logger = LogManager.getLogger(getClass());

	public class CKEditorResponseDto {

		private String path;
		private String fileName;

		public CKEditorResponseDto(String path, String fileName) {
			this.path = path;
			this.fileName = fileName;
		}

		public int getUploaded() {
			return 1;
		}

		public String getFileName() {
			return this.fileName;
		}

		public String getUrl() {
			return this.path + this.fileName;
		}
	}

	@Autowired
	private Environment env;

	@Autowired
	protected DbAdmin dbService;

	@RequestMapping(value = "api/authorities/", method = RequestMethod.GET)
	public String getAuthorities(Authentication authentication) {
		if (authentication != null) {
			return authentication.getAuthorities().iterator().next().getAuthority();
		} else {
			return null;
		}
	}

	@RequestMapping(value = "api/upload/", method = RequestMethod.POST)
	public CKEditorResponseDto upload(@RequestParam("upload") MultipartFile file, HttpServletRequest request) throws IOException {
		CKEditorResponseDto imgPath = null;

		byte[] bytes = file.getBytes();

		try {
			MessageDigest md5 = MessageDigest.getInstance("MD5");
			byte[] digest = md5.digest(bytes);
			String imgName = new BigInteger(1, digest).toString(16) + "." + FilenameUtils.getExtension(file.getOriginalFilename());

			try {
				Path path = Paths.get(env.getRequiredProperty("repository.img") + imgName);
				Files.write(path, bytes);
				logger.info("Successfuly uploaded file {} ({} bytes)", imgName, file.getSize());

				String requestURL = request.getRequestURL().toString();
				String imgUrl = requestURL.substring(0, requestURL.length() - "upload/".length()) + "content/img/";
				imgPath = new CKEditorResponseDto(imgUrl, imgName);
			} catch (IOException e) {
				e.printStackTrace();
			}
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
		}

		return imgPath;
	}

	@RequestMapping(value = "api/dumpdb/", method = RequestMethod.GET)
	public void dumpdb(HttpServletResponse response) throws IOException {
		dbService.dumpdb(response);
		logger.info("Dumped database");
	}
}
