package io.ostrovsky.as.service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.GenericTypeResolver;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import io.ostrovsky.as.model.AbstractTreeEntity;
import io.ostrovsky.as.repository.AbstractTreeRepository;
import io.ostrovsky.as.utils.ReturnCode;
import io.ostrovsky.as.utils.Tree;

public abstract class AbstractTreeService<E extends AbstractTreeEntity, D, R extends AbstractTreeRepository<E, D, Integer>> {

	protected final Logger logger = LogManager.getLogger(getClass());

	protected final String entityName = GenericTypeResolver.resolveTypeArguments(getClass(), AbstractTreeService.class)[0].getSimpleName();

	@Autowired
	protected R repository;

	protected void move(Tree<E> branch, int level, String headCode) {
		E node = branch.getNode();
		node.setCode(headCode + Tree.tailCode(node.getCode(), level));
		repository.save(node);

		branch.getCollection().stream().forEach(item -> move(item, level, headCode));
	}

	protected void split(List<Tree<E>> collection, Integer num) {
		IntStream.range(0, collection.size())
				.forEachOrdered(i -> {
					Tree<E> branch = collection.get(i);
					String code = branch.getNode().getCode();
					if (Tree.number(code) >= num) {
						String headCode = Tree.headCode(code, Tree.level(code) - 1) + Integer.toString(i + 2) + ".";
						this.move(branch, Tree.level(code), headCode);
					}
				});
	}

	protected void splice(List<Tree<E>> collection) {
		IntStream.range(0, collection.size())
				.forEachOrdered(i -> {
					Tree<E> branch = collection.get(i);
					String code = branch.getNode().getCode();
					if (Tree.number(code) != (i + 1)) {
						String headCode = Tree.headCode(code, Tree.level(code) - 1) + Integer.toString(i + 1) + ".";
						this.move(branch, Tree.level(code), headCode);
					}
				});
	}

	protected void remove(Tree<E> branch) {
		repository.delete(branch.getNode());
		branch.getCollection().stream().forEach(item -> remove(item));
	}

	public Tree<E> build(String rootCode) {
		Map<Boolean, List<E>> groups = repository.findAll().stream()
				.filter(item -> Tree.isContained(item.getCode(), rootCode))
				.collect(Collectors.partitioningBy(item -> (Tree.level(item.getCode()) == Tree.level(rootCode))));

		return new Tree<E>(groups.get(true).get(0), groups.get(false));
	}

	public Tree<E> buildTree() {
		Tree<E> tree = this.build("");

		logger.info("Built {} tree with node {}", entityName, tree.getNode());
		return tree;
	}

	public ResponseEntity<Tree<E>> create(E entity) {
		Tree<E> parentBranch = this.build(entity.getCode());
		entity.setCode(entity.getCode() + (parentBranch.getCollection().size() + 1) + ".");
		E model = repository.findOne(repository.save(entity).getId());

		parentBranch = this.build(Tree.parentCode(model.getCode()));

		logger.info("Created {} branch with node: {}", entityName, model);
		return new ResponseEntity<Tree<E>>(parentBranch, HttpStatus.OK);
	}

	public ResponseEntity<Tree<E>> edit(E entity) {
		E model = repository.findOne(repository.save(entity).getId());

		Tree<E> branch = this.build(model.getCode());

		logger.info("Updated {} branch with node: {}", entityName, model);
		return new ResponseEntity<Tree<E>>(branch, HttpStatus.OK);
	}

	public ResponseEntity<Tree<E>> moveBranch(Integer whatId, String position, Integer whereId) {
		E whatNode = repository.findOne(whatId);
		String whatCode = whatNode.getCode();
		E whereNode = repository.findOne(whereId);
		String whereCode = whereNode.getCode();

		if (Tree.isContained(whereCode, whatCode)) {
			HttpHeaders responseHeaders = new HttpHeaders();
			responseHeaders.set("ReturnCode", ReturnCode.MOVE_INTO_ITSELF.code());
			return new ResponseEntity<Tree<E>>(responseHeaders, HttpStatus.ACCEPTED);
		}

		String whereParentCode = (position.equals("before")) ? Tree.parentCode(whereCode) : whereCode;
		List<Tree<E>> whereParentCollection = this.build(whereParentCode).getCollection();
		Integer num = (position.equals("before")) ? Tree.number(whereCode) : (whereParentCollection.size() + 1);
		this.split(whereParentCollection, num);

		whatNode = repository.findOne(whatId);
		whatCode = whatNode.getCode();
		Tree<E> whatBranch = this.build(whatCode);
		this.move(whatBranch, Tree.level(whatCode), whereParentCode + Integer.toString(num) + ".");

		String whatParentCode = Tree.parentCode(whatCode);
		List<Tree<E>> whatParentCollection = this.build(whatParentCode).getCollection();
		this.splice(whatParentCollection);

		String parentCode = "";
		String[] aWhatParentCode = Tree.toArray(whatParentCode);
		String[] aWhereParentCode = Tree.toArray(Tree.parentCode(repository.findOne(whatId).getCode()));

		for (int i = 0; i < Integer.min(aWhatParentCode.length, aWhereParentCode.length); i++) {
			if (aWhatParentCode[i].equals(aWhereParentCode[i])) {
				parentCode += aWhatParentCode[i] + ".";
			} else
				break;
		}

		Tree<E> parentBranch = this.build(parentCode);

		logger.info("Moved {} branch with node: {}", entityName, whatNode);
		return new ResponseEntity<Tree<E>>(parentBranch, HttpStatus.OK);
	}

	public ResponseEntity<Tree<E>> removeBranch(E entity) {
		this.remove(this.build(entity.getCode()));

		Tree<E> parent = this.build(Tree.parentCode(entity.getCode()));
		this.splice(parent.getCollection());

		Tree<E> parentBranch = this.build(Tree.parentCode(entity.getCode()));

		logger.info("Deleted {} branch with node: {}", entityName, entity);
		return new ResponseEntity<Tree<E>>(parentBranch, HttpStatus.OK);
	}
}