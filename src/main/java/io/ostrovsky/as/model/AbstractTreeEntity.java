package io.ostrovsky.as.model;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;

@MappedSuperclass
public class AbstractTreeEntity extends AbstractEntity implements Comparable<AbstractTreeEntity> {

	@Column(name = "code")
	private String code;

	public String getCode() {
		return this.code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public int compareTo(String code) {
		String[] arrayA = "0.".concat(this.code).split("\\.");
		String[] arrayB = "0.".concat(code).split("\\.");
		for (int i = 0; i < Integer.max(arrayA.length, arrayB.length); i++) {
			Integer a = (i < arrayA.length) ? Integer.valueOf(arrayA[i]) : 0;
			Integer b = (i < arrayB.length) ? Integer.valueOf(arrayB[i]) : 0;
			Integer comparison = a - b;
			if (comparison != 0) {
				return Integer.signum(comparison);
			}
		}
		return 0;
	}

	public int compareTo(AbstractTreeEntity entry) {
		return this.compareTo(entry.getCode());
	}
}