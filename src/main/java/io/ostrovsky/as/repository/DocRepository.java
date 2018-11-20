package io.ostrovsky.as.repository;

import java.util.List;

import io.ostrovsky.as.model.Doc;

public interface DocRepository extends AbstractTreeRepository<Doc, Doc, Integer> {

	List<Doc> findByCode(String code);

	List<Doc> findByCodeStartingWith(String docCode);
}