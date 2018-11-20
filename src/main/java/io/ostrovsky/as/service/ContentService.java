package io.ostrovsky.as.service;

import org.springframework.stereotype.Service;

import io.ostrovsky.as.model.Content;
import io.ostrovsky.as.repository.ContentRepository;

@Service
public class ContentService extends AbstractService<Content, Content, ContentRepository> {
}
