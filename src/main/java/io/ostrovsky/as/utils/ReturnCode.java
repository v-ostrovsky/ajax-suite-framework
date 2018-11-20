package io.ostrovsky.as.utils;

public enum ReturnCode {
	MOVE_INTO_ITSELF("03.01");

	private String code;

	ReturnCode(String code) {
		this.code = code;
	}

	public String code() {
		return code;
	}
}