define(['as'], function(as) {
	"use strict";

	var Class = as.generics.selectorDropdown.Class;

	/*
	 * ------------- EDITOR IMAGE STYLED CLASS --------------
	 */
	function ImageStyled(context, path, template, parameters) {
		Class.call(this, context, path, template, parameters);
	}
	ImageStyled.prototype = Object.create(Class.prototype);
	ImageStyled.prototype.constructor = ImageStyled;

	ImageStyled.prototype._onChangeValue_ = function() {
		this.isUploading ? null : this.setValue(this.cmdStyle.value);
	}

	ImageStyled.prototype.executeCommand = function() {
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

	ImageStyled.prototype.init = function(editor) {
		this.cmdUpload = editor.commands.get('imageUpload');
		this.cmdStyle = editor.commands.get('imageStyle');

		this.configOptions = ['alignLeft', 'block', 'alignRight'].map(function(item, index) {
			var element = $('<div>').addClass('button button-image').css({
				'margin': '0px 1px'
			}).attr({
				name: item
			});

			return {
				name: item,
				builder: function(context) {
					var properties = {
						template: 'create:' + element[0].outerHTML,
						tooltip: as.locale.editor['image'].options[item],
						content: as.icons.editor['image'][item]
					};

					return as.generics.button.builder(context, '', properties);
				}
			};
		});
		this.selector.setContent(this.configOptions);

		this.isUploading = false;

		this.cmdUpload.on('execute', function(eventInfo) {
			this.isUploading = false;
			this.cmdStyle.execute({
				value: this.getValue()
			});
		}.bind(this));

		this.cmdStyle.on('change:value', function(eventInfo) {
			this._onChangeValue_();
		}.bind(this));
		this._onChangeValue_();

		return this;
	}

	return ImageStyled;
});