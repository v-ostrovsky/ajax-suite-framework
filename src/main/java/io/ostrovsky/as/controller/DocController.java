package io.ostrovsky.as.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import io.ostrovsky.as.model.Content;
import io.ostrovsky.as.model.Doc;
import io.ostrovsky.as.repository.DocRepository;
import io.ostrovsky.as.service.ContentService;
import io.ostrovsky.as.service.DocService;
import io.ostrovsky.as.utils.Tree;

@RestController
@RequestMapping("/api/doc/")
public class DocController extends AbstractTreeController<Doc, Doc, DocRepository, DocService> {

	@Autowired
	private ContentService contentService;

	private void removeContent(Tree<Doc> branch) {
		Content content = contentService.findById(branch.getNode().getContent()).get(0);
		contentService.delete(content);

		branch.getCollection().stream().forEach(item -> removeContent(item));
	}

	@Transactional
	@Override
	@RequestMapping(method = { RequestMethod.POST })
	public ResponseEntity<Tree<Doc>> create(
			@RequestBody Doc entity) {

		Content content = contentService.save(new Content()).getBody().get(0);
		entity.setContent(content.getId());

		return super.create(entity);
	}

	@Transactional
	@Override
	@RequestMapping(method = { RequestMethod.DELETE })
	public ResponseEntity<Tree<Doc>> removeBranch(
			@RequestBody Doc entity) {

		removeContent(service.build(entity.getCode()));

		return super.removeBranch(entity);
	}
}