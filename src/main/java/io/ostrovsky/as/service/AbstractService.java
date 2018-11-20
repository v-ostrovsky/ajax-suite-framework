package io.ostrovsky.as.service;

import java.util.ArrayList;
import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.GenericTypeResolver;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import io.ostrovsky.as.model.AbstractEntity;
import io.ostrovsky.as.repository.AbstractRepository;

@Service
public abstract class AbstractService<E extends AbstractEntity, D, R extends AbstractRepository<E, D, Integer>> {

	protected final Logger logger = LogManager.getLogger(getClass());

	protected final String entityName = GenericTypeResolver.resolveTypeArguments(getClass(), AbstractService.class)[0].getSimpleName();

	@Autowired
	protected R repository;

	public List<E> findAll() {
		List<E> models = repository.findAll();

		logger.info("Found {} {} entries.", models.size(), entityName);
		return models;
	}

	public List<E> findById(Integer id) {
		if (id == 0) {
			return null;
		}

		List<E> models = new ArrayList<>();
		models.add(repository.findOne(id));

		logger.info("Found {} {} entry", (models.size() == 0) ? "no" : "1", entityName);
		return models;
	}

	public ResponseEntity<List<E>> save(E entity) {
		E model = repository.findOne(repository.save(entity).getId());

		List<E> models = new ArrayList<>();
		models.add(model);

		logger.info("Saved {} entry", entityName);
		return new ResponseEntity<List<E>>(models, HttpStatus.OK);
	}

	public ResponseEntity<Void> delete(E entity) {
		repository.delete(entity);

		logger.info("Deleted {} entry", entityName);
		return new ResponseEntity<Void>(HttpStatus.OK);
	}

}
