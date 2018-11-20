package io.ostrovsky.as.controller;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.GenericTypeResolver;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import io.ostrovsky.as.model.AbstractTreeEntity;
import io.ostrovsky.as.repository.AbstractTreeRepository;
import io.ostrovsky.as.service.AbstractTreeService;
import io.ostrovsky.as.utils.Tree;

public abstract class AbstractTreeController<E extends AbstractTreeEntity, D, R extends AbstractTreeRepository<E, D, Integer>, S extends AbstractTreeService<E, D, R>> {

	protected final Logger logger = LogManager.getLogger(getClass());

	protected final String entityName = GenericTypeResolver.resolveTypeArguments(getClass(), AbstractTreeController.class)[0].getSimpleName();

	@Autowired
	protected S service;

	@RequestMapping(method = RequestMethod.GET)
	public Tree<E> getTree() {

		return service.buildTree();
	}

	@RequestMapping(method = { RequestMethod.POST })
	public ResponseEntity<Tree<E>> create(
			@RequestBody E entity) {

		if (entity.getId() != null) {
			logger.error("The {} entry can't be created. Id is not null.", entityName);
			return new ResponseEntity<Tree<E>>(HttpStatus.BAD_REQUEST);
		}

		return service.create(entity);
	}

	@RequestMapping(method = { RequestMethod.PUT })
	public ResponseEntity<Tree<E>> edit(
			@RequestBody E entity) {

		if (entity.getId() == null) {
			logger.error("The {} entry can't be updated. Id is required.", entityName);
			return new ResponseEntity<Tree<E>>(HttpStatus.BAD_REQUEST);
		}

		return service.edit(entity);
	}

	@RequestMapping(value = "move/", method = RequestMethod.POST)
	public ResponseEntity<Tree<E>> move(
			@RequestParam("whatId") Integer whatId,
			@RequestParam("position") String position,
			@RequestParam("whereId") Integer whereId) {

		return service.moveBranch(whatId, position, whereId);
	}

	@RequestMapping(method = { RequestMethod.DELETE })
	public ResponseEntity<Tree<E>> removeBranch(
			@RequestBody E entity) {

		return service.removeBranch(entity);
	}
}