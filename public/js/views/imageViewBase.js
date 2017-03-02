define([
    'Backbone',
    'jQuery',
    'Underscore',
    'common',
    'custom',
    'text!templates/Images/imagesTemplate.html',
    'dataService',
    'common'
], function (Backbone, $, _, Common, Custom, ImagesTemplate, dataService, common) {
    'use strict';
    var ImagesView = Backbone.View.extend({
        el         : '#sliderBlock',
        actionType : null, // Content, Edit, Create
        template   : _.template(ImagesTemplate),
        contentType: null,

        events: {
            'click .mainImage'  : 'checkMainImage',
            'click .deleteImage': 'deleteImage',
            'click .attachImage': 'attachImage'
        },

        initialize: function (options) {
            this.formModel = options.model;
            this.contentType = options.contentType;
            this.parent = options.parent;
            this.groupImages = options.images;

            this.render();
        },

        attachImage: function (e) {
            var $thisEl = this.$el;

            $thisEl.find('#inputAttach').click();
        },

        imageSave: function (options, _context) {
            var model = (options && options.model) ? options.model : null;
            var context = _context || this;
            var canvas = context.$('#avatar')[0];
            var inputFile = context.$('#inputAttach');
            var fileReader;
            var filesExt;
            var parts;
            var file;

            inputFile.prop('accept', 'image/*');
            inputFile.on('change', function (e) {
                e.preventDefault();

                file = inputFile[0].files[0];
                filesExt = ['jpg', 'gif', 'png', 'jpe', 'jfif', 'jpeg', 'bmp', 'JPEG', 'JPG', 'GIF', 'PNG', 'BMP']; //fix type file
                parts = $(inputFile).val().split('.');

                if (filesExt.join().search(parts[parts.length - 1]) !== -1) {
                    fileReader = new FileReader();

                    fileReader.onload = function () {
                        var src = fileReader.result;

                        function imgSelect(sellictions) {
                            var img;
                            var canvasCrop;
                            var ctx;

                            if (parseInt(sellictions.w, 10) > 0) {
                                img = $('.image_input img')[0];

                                canvasCrop = document.createElement('canvas');
                                canvasCrop.height = 400;
                                canvasCrop.width = 400;

                                ctx = canvasCrop.getContext('2d');
                                ctx.drawImage(img, sellictions.x, sellictions.y, sellictions.w, sellictions.h, 0, 0, canvasCrop.width, canvasCrop.height);
                                $('.image_output').attr('src', canvasCrop.toDataURL('image/jpeg'));
                                ctx.clearRect(0, 0, canvas.width, canvas.height);
                            }
                        }

                        $('.image_input').html(['<img src="', src, '"/>'].join(''));
                        $('.image_input img').Jcrop({
                            bgColor    : 'white',
                            bgOpacity  : 0.6,
                            setSelect  : [0, 0, 100, 100],
                            aspectRatio: 1,
                            onSelect   : imgSelect,
                            onChange   : imgSelect,
                            boxWidth   : 650,
                            boxHeight  : 650,
                            minSize    : [10, 10]
                        });

                        $('.cropImages').dialog({
                            dialogClass: 'crop-images-dialog',
                            autoOpen   : true,
                            resizable  : true,
                            title      : 'Crop Images',
                            width      : '900px',
                            buttons    : {
                                save: {
                                    text : 'Crop',
                                    class: 'btn',

                                    click: function () {
                                        var imageSrcCrop = $('.image_output').attr('src');

                                        if (model) {
                                            model.imageSrc = imageSrcCrop;
                                        } else {
                                            model = {
                                                imageSrc: imageSrcCrop
                                            };
                                        }

                                        context.addImage({imageSrc: imageSrcCrop});

                                        $(this).dialog('close');
                                    }

                                },

                                cancel: {
                                    text : 'Cancel',
                                    class: 'btn',
                                    click: function () {
                                        $(this).dialog('close');
                                    }
                                }
                            }

                        });

                    };
                    inputFile.val('');

                    fileReader.readAsDataURL(file);

                } else {
                    App.render({
                        type   : 'error',
                        message: 'Invalid file type!'
                    });
                }
            });

            context.$('#avatar').hide();
        },

        addImage: function (options) {
            var self = this;
            var $thisEl = this.$el;
            var image = options.imageSrc;
            var id = this.formModel.groupId;
            var url = '/image/uploadFiles';

            dataService.postData(url, {item: id, image: image}, function (err, res) {
                if (!res || !res.data) {
                    return;
                }

                self.groupImages.push(res.data);

                $thisEl.html('');
                self.render();
            });
        },

        checkMainImage: function (e) {
            var $target = $(e.target);
            var id = $target.closest('li').attr('id');
            var url = '/image/avatar/' + this.formModel._id + '/' + id;
            var self = this;
            var imageObj = _.find(self.groupImages, function (el) {
                return el._id === id;
            });
            var $currentListImage = $('tr[data-id="' + self.formModel._id + '"] .image > img');
            var currentId = '#' + self.formModel._id;
            var $currentVariantImage = $(currentId + '> td > img');

            dataService.getData(url, {}, function (result) {
                result = result.data;

                if (!result || !result.changed) {
                    return App.render({
                        type   : 'error',
                        message: result && result.message || 'avatar is not changed'
                    });
                }

                App.render({
                    type   : 'notify',
                    message: result && result.message || 'avatar is changed'
                });

                common.canvasDrawing({model: imageObj, fromGallery: true}, self.parent);
                $currentListImage.attr('src', imageObj.imageSrc);
                $currentVariantImage.attr('src', imageObj.imageSrc);
            });
        },

        deleteImage: function (e) {
            var $target = $(e.target);
            var id = $target.closest('li').attr('id');
            var url = 'image/' + id;
            var self = this;
            var isConfirm = confirm('you sure that you want delete this image?');
            var imageObj = _.find(self.groupImages, function (el) {
                return el._id === id;
            });
            var indexOfArray = self.groupImages.indexOf(imageObj);
            var $currentListImage = $('tr[data-id="' + self.formModel._id + '"] .image > img');
            var currentId = '#' + self.formModel._id;
            var $currentVariantImage = $(currentId + '> td > img');

            if (!isConfirm) {
                return;
            }

            dataService.deleteData(url, {}, function (err, result) {
                if (result && result.error) {
                    return App.render({
                        type   : 'error',
                        message: result && result.message || 'not deleted'
                    });
                }

                App.render({
                    type   : 'notify',
                    message: result && result.success || 'deleted'
                });

                if (indexOfArray > -1) {
                    self.groupImages.splice(indexOfArray, 1);
                }

                self.render();

                if (result.main) {
                    Backbone.history.fragment = '';
                    Backbone.history.navigate(window.location.hash, {trigger: true});
                }
            });
        },

        render: function () {
            var $thisEl = this.$el;
            var $inputAttach;
            var $bxslider;
            var modelJSON = this.formModel;
            var images;

            images = _.sortBy(this.groupImages, function (item) {
                return !item.main;
            });

            $thisEl.html(this.template({
                images: images
            }));

            $bxslider = $thisEl.find('.bxslider');
            $inputAttach = $thisEl.find('#inputAttach');

            this.formModel.id = this.formModel._id;

            $bxslider.bxSlider({
                pagerCustom: '#bx-pager',
                controls   : false
            });

            this.imageSave({model: this.formModel}, this);

            $inputAttach.hide();

            return this;
        }
    });

    return ImagesView;
});
