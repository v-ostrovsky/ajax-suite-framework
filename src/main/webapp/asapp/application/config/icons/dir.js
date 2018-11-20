define([ 'text!./collapseall.svg', 'text!./copy.svg', 'text!./create.svg', 'text!./edit.svg', 'text!./expandall.svg', 'text!./move.svg', 'text!./question.svg', 'text!./refresh.svg', 'text!./remove.svg' ], function(collapseall, copy, create, edit, expandall, move, question, refresh, remove) {
	return {
		collapseDown : collapseall,
		copy : copy,
		create : create,
		edit : edit,
		expandDown : expandall,
		moveBranch : move,
		question : question,
		refresh : refresh,
		remove : remove,
		removeBranch : remove
	};
});