package io.ostrovsky.as.controller;

import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.GenericTypeResolver;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import io.ostrovsky.as.model.AbstractEntity;
import io.ostrovsky.as.repository.AbstractRepository;
import io.ostrovsky.as.service.AbstractService;

public abstract class AbstractController<E extends AbstractEntity, D, R extends AbstractRepository<E, D, Integer>, S extends AbstractService<E, D, R>> {

	protected final Logger logger = LogManager.getLogger(getClass());

	protected final String entityName = GenericTypeResolver.resolveTypeArguments(getClass(), AbstractController.class)[0].getSimpleName();

	@Autowired
	protected S service;

	@RequestMapping(method = RequestMethod.GET)
	public List<E> findAll() {

		return service.findAll();
	}

	@RequestMapping(value = "{id}", method = RequestMethod.GET)
	public List<E> findById(@PathVariable("id") Integer id) {

		return service.findById(id);
	}

	@RequestMapping(method = { RequestMethod.POST })
	public ResponseEntity<List<E>> create(
			@RequestBody E entity) {

		if (entity.getId() != null) {
			logger.error("The {} entry can't be created. Id is not null.", entityName);
			return new ResponseEntity<List<E>>(HttpStatus.BAD_REQUEST);
		}

		return service.save(entity);
	}

	@RequestMapping(method = { RequestMethod.PUT })
	public ResponseEntity<List<E>> edit(
			@RequestBody E entity) {

		if (entity.getId() == null) {
			logger.error("The {} entry can't be updated. Id is required.", entityName);
			return new ResponseEntity<List<E>>(HttpStatus.BAD_REQUEST);
		}

		return service.save(entity);
	}

	@RequestMapping(method = { RequestMethod.DELETE })
	public ResponseEntity<Void> delete(
			@RequestBody E entity) {

		return service.delete(entity);
	}
}
