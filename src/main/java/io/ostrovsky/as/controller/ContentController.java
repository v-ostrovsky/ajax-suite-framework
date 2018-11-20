package io.ostrovsky.as.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import io.ostrovsky.as.model.Content;
import io.ostrovsky.as.repository.ContentRepository;
import io.ostrovsky.as.service.ContentService;

@RestController
@RequestMapping("/api/content/")
public class ContentController extends AbstractController<Content, Content, ContentRepository, ContentService> {

	@Autowired
	private Environment env;

	@RequestMapping(value = "img/{imageId:.+}", method = RequestMethod.GET)
	public void getImage(@PathVariable("imageId") String imageId, HttpServletResponse response) throws IOException {
		String mediaType;
		switch (FilenameUtils.getExtension(imageId)) {
		case "png":
			mediaType = MediaType.IMAGE_PNG_VALUE;
			break;
		default:
			mediaType = MediaType.IMAGE_JPEG_VALUE;
			break;
		}
		response.setContentType(mediaType);

		InputStream in = new FileInputStream(new File(env.getRequiredProperty("repository.img") + imageId));
		IOUtils.copy(in, response.getOutputStream());
	}
}