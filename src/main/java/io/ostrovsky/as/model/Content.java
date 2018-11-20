package io.ostrovsky.as.model;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "contents")
public class Content extends AbstractEntity implements Serializable {
	private static final long serialVersionUID = 1L;

	@Column(name = "content")
	private String content;

	public String getContent() {
		return this.content;
	}

	public void setContent(String content) {
		this.content = content;
	}
}