package io.ostrovsky.as.repository;

import java.io.Serializable;
import java.util.List;

import org.springframework.data.repository.NoRepositoryBean;

import io.ostrovsky.as.model.AbstractTreeEntity;

@NoRepositoryBean
public interface AbstractTreeRepository<E extends AbstractTreeEntity, D, ID extends Serializable> extends AbstractRepository<E, D, ID> {

	List<D> findByCodeStartingWith(String code);
}