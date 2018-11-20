package io.ostrovsky.as.model;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;

import org.apache.commons.lang.builder.ToStringBuilder;

@MappedSuperclass
public abstract class AbstractEntity {

	public static final int MAX_LENGTH_STANDART = 100;

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Integer id;

	public AbstractEntity() {
	}

	public Integer getId() {
		return this.id;
	}

	@Override
	public String toString() {
		return ToStringBuilder.reflectionToString(this);
	}
}
