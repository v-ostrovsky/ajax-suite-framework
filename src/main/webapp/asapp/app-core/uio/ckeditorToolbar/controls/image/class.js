define(['as'], function(as) {
	"use strict";

	var Class = as.generics.button.Class;

	/*
	 * ------------- EDITOR IMAGE CLASS --------------
	 */
	function Image(context, path, template, parameters) {
		Class.call(this, context, path, template, parameters);
	}
	Image.prototype = Object.create(Class.prototype);
	Image.prototype.constructor = Image;

	Image.prototype.executeCommand = function() {
		if (!this.cmdStyle.value) {
			$('<input type="file" accept=".jpg, .jpeg, .png, .pdf" />').on({
				change: function(event) {
					var imgSize = event.target.files[0].size, imgMaxSize = as.IMAGE_MAX_SIZE;

					if (imgSize < imgMaxSize) {
						this.isUploading = true;
						this.cmdUpload.execute({
							file: Array.from(event.target.files)
						});
					} else {
						var imgSizeText = as.locale.formatter('number(0)', imgSize), imgMaxSizeText = as.locale.formatter('number(0)', imgMaxSize);
						this.application.showDialog(as.utils.assignProperties(as.uio.frmDialogBuilder, {
							message: as.locale.composeText(as.locale.editor.image['imgSizeMessage'], imgSizeText, imgMaxSizeText, '')
						}), as.locale.form.titleMessage);
					}
				}.bind(this)
			}).click();
		} else if (this.cmdStyle.value != this.getValue()) {
			this.cmdStyle.execute({
				value: this.getValue()
			});
		}
	}

	Image.prototype.init = function(editor) {
		this.cmdUpload = editor.commands.get('imageUpload');
		this.cmdStyle = editor.commands.get('imageStyle');

		this.isUploading = false;

		this.cmdUpload.on('execute', function(eventInfo) {
			this.isUploading = false;
			this.cmdStyle.execute({
				value: 'block'
			});
		}.bind(this));

		return this;
	}

	return Image;
});