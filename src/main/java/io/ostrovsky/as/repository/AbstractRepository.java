package io.ostrovsky.as.repository;

import java.io.Serializable;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;

import io.ostrovsky.as.model.AbstractEntity;

@NoRepositoryBean
public interface AbstractRepository<E extends AbstractEntity, D, ID extends Serializable> extends JpaRepository<E, ID> {
}