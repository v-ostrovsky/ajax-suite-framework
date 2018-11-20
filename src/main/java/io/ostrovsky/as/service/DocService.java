package io.ostrovsky.as.service;

import org.springframework.stereotype.Service;

import io.ostrovsky.as.model.Doc;
import io.ostrovsky.as.repository.DocRepository;

@Service
public class DocService extends AbstractTreeService<Doc, Doc, DocRepository> {
}
