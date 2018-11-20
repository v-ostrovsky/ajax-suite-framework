package io.ostrovsky.as.utils;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Component;

import io.ostrovsky.as.model.AbstractTreeEntity;

@Component
public class Tree<E extends AbstractTreeEntity> {

	protected final Logger logger = LogManager.getLogger(getClass());

	private E node;

	private List<Tree<E>> collection;

	private Tree<E> findChild(Tree<E> branch, String code) {
		if (code.matches(branch.getNode().getCode())) {
			return branch;
		} else {
			List<Tree<E>> filtered = branch.getCollection().stream()
					.filter(item -> code.matches(item.getNode().getCode() + ".*"))
					.collect(Collectors.toList());

			return (filtered.size() > 0) ? findChild(filtered.get(0), code) : null;
		}
	}

	private static String normalizeCode(String code) {
		if (code.length() > 0 && (code.charAt(code.length() - 1) != '.')) {
			code += '.';
		}
		return code;
	}

	public static String[] toArray(String code) {
		String appendix = (code.length() == 0) ? "." : "";
		return (code + appendix).split("\\.");
	}

	public static int level(String code) {
		return toArray(code).length;
	}

	public static boolean isContained(String code, String parentCode) {
		return (code.length() >= parentCode.length()) ? code.substring(0, parentCode.length()).equals(parentCode) : false;
	}

	public static Integer number(String code) {
		return (level(code) > 0) ? Integer.parseInt(toArray(code)[level(code) - 1]) : null;
	}

	public static String headCode(String code, int level) {
		String[] aCode = toArray(code);
		String[] aHeadCode = Arrays.copyOfRange(aCode, 0, level);

		return normalizeCode(String.join(".", aHeadCode));
	}

	public static String tailCode(String code, int level) {
		String[] aCode = toArray(code);
		String[] aTailCode = Arrays.copyOfRange(aCode, level, aCode.length);

		return normalizeCode(String.join(".", aTailCode));
	}

	public static String parentCode(String code) {
		String[] aCode = toArray(code);

		return (aCode.length > 0) ? normalizeCode(String.join(".", Arrays.copyOf(aCode, aCode.length - 1))) : null;
	}

	public Tree(E node, List<E> collection) {
		this.node = node;

		int level = level(this.node.getCode());
		this.collection = collection.stream()
				.sorted((model1, model2) -> model1.compareTo(model2))
				.filter(model -> (level(model.getCode()) == (level + 1)))
				.map(group -> new Tree<E>(group, collection.stream()
						.filter(model -> (!model.equals(group) && isContained(model.getCode(), group.getCode())))
						.collect(Collectors.toList())))
				.collect(Collectors.toList());
	}

	public E getNode() {
		return this.node;
	}

	public List<Tree<E>> getCollection() {
		return this.collection;
	}

	public Tree<E> findBranch(String code) {
		Tree<E> branch = this.findChild(this, code);
		return (branch != null) ? branch : null;
	}
}
