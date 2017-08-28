define([
    'Backbone',
    'jQuery',
    'Underscore',
    'common',
    'custom',
    'text!templates/Images/imagesTemplate.html',
    'dataService',
    'common',
    'async'
], function (Backbone, $, _, Common, Custom, ImagesTemplate, dataService, common, async) {
    'use strict';
    var ImagesView = Backbone.View.extend({
        el         : '#sliderBlock',
        actionType : null, // Content, Edit, Create
        template   : _.template(ImagesTemplate),
        contentType: null,

        events: {
            'click #prevSlide'     : 'slidePrev',
            'click #nextSlide'     : 'slideNext',
            'click .slideThumbnail': 'slideClicked',
            'click .mainImage'     : 'checkMainImage',
            'click .deleteImage'   : 'deleteImage',
            'click .attachImage'   : 'attachImage',
            'change .inputAttach'  : 'imageSave'
        },

        initialize: function (options) {
            this.formModel = options.model;
            this.contentType = options.contentType;
            this.parent = options.parent;
            this.groupImages = options.images;
            this.filesCount = 0;
            this.filesUpload = 0;
            this.progress = -100;
            this.slideIndex = 0;
            this.currentIndex = 0;

            this.render();
        },

        attachImage: function (e) {
            var $thisEl = this.$el;

            $thisEl.find('#inputAttach').click();
        },

        imageSave: function (options, _context) {
            var context = _context || this;
            var inputFile = context.$('#inputAttach');
            var status = $('.status');
            var $progressLine = $('#progressLine');
            var $uploadProductView = $('._uploadProductView');
            var $numOfFiles = $('#numOfFiles');
            var functionsArray = [];
            var statusVal = this.progress + '%';
            var files;
            var filesExt;

            //$progressLine.animate('transform: translateX(' + statusVal + ')');
            $progressLine.css('transform', 'translateX(' + statusVal + ')');
            inputFile.prop('accept', 'image/*');
            inputFile.on('change', function (e) {
                e.preventDefault();

                filesExt = ['jpg', 'gif', 'png', 'jpe', 'jfif', 'jpeg', 'bmp', 'JPEG', 'JPG', 'GIF', 'PNG', 'BMP']; //fix type file

                files = inputFile[0].files;
                context.filesCount = inputFile[0].files && inputFile[0].files.length;
                $numOfFiles.text(context.filesCount);
                $uploadProductView.addClass('showProgress');

                _.each(files, function (file) {
                    functionsArray.push(
                        function (wCb) {
                            var fileReader;
                            var parts;

                            parts = $(inputFile).val().split('.');

                            if (filesExt.join().search(parts[parts.length - 1]) !== -1) {
                                fileReader = new FileReader();

                                fileReader.onload = function () {
                                    var src = fileReader.result;
                                    var fileName = file.name;

                                    if (src) {
                                        context.addImage({imageSrc: src, fileName: fileName});
                                    }

                                };

                                inputFile.val('');

                                if (file) {
                                    fileReader.readAsDataURL(file);
                                }

                                wCb();
                            } else {
                                App.render({
                                    type   : 'error',
                                    message: 'Invalid file type!'
                                });

                                wCb();
                            }
                        }
                    );
                });

                async.waterfall(functionsArray, function () {
                    return;
                });
            });

            context.$('#avatar').hide();
        },
        /*
         imageSave1: function (options, _context) {
         var model = (options && options.model) ? options.model : null;
         var context = _context || this;
         var canvas = context.$('#avatar')[0];
         var inputFile = context.$('#inputAttach');
         var fileReader;
         var filesExt;
         var parts;
         var file;

         inputFile.prop('accept', 'image/!*');
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
         */
        addImage : function (options) {
            var self = this;
            var $thisEl = this.$el;
            var image = options.imageSrc;
            var fileName = options.fileName;
            var id = this.formModel.groupId;
            var url = '/image/uploadFiles';
            var $numOfUploaded = $('#numOfUploaded');
            var $fileName = $('#fileName');
            var $progressLine = $('#progressLine');

            this.delimeter = 100 / self.filesCount;

            dataService.postData(url, {item: id, image: image}, function (err, res) {
                if (!res || !res.data) {
                    return;
                }

                $fileName.text(fileName);

                self.progress += self.delimeter;
                $progressLine.css('transform', 'translateX(' + (self.progress) + '%)');
                //$progressLine.animate({'transform': 'translateX(' + (self.progress) + '%)'});

                self.filesUpload += 1;
                $numOfUploaded.text(self.filesUpload);
                self.groupImages.push(res.data);

                if (self.filesCount <= self.filesUpload) {
                    self.filesCount = 0;
                    self.progress = -100;
                    self.filesUpload = 0;

                    $thisEl.html('');

                    self.render();
                }

            });
        },

        doSlide: function () {
            var $slider = this.$el.find('.productSlider');
            var $backgroundSlide = $slider.find('.bgSlide');
            var $activeSlide = $slider.find('.activeSlide');

            if (this.slideIndex !== this.currentIndex) {
                $backgroundSlide.css({'background-image': 'url(' + this.groupImages[this.slideIndex].imageSrc + ')'})
                    .fadeIn(100)
                    .addClass('activeSlide')
                    .removeClass('bgSlide')
                    .attr('data-id', this.groupImages[this.slideIndex]._id);

                $activeSlide.fadeOut(100)
                    .addClass('bgSlide')
                    .removeClass('activeSlide');

                this.currentIndex = this.slideIndex;

                this.$el.find('._productSliderThumbnails').find('.active').removeClass('active');
                $(this.$el.find('.slideThumbnail')[this.slideIndex]).addClass('active');

            }
        },

        slideClicked: function (e) {
            var $elem = $(e.target).closest('.slideThumbnail');
            this.slideIndex = parseInt($elem.attr('data-slide-index'));

            this.doSlide();
        },

        slidePrev: function () {
            var index = this.slideIndex - 1;
            this.slideIndex = index <= 0 ? this.groupImages.length - 1 : index;

            this.doSlide();
        },

        slideNext: function () {
            var index = this.slideIndex + 1;
            var length = this.groupImages.length;
            this.slideIndex = index === length ? 0 : index;

            this.doSlide();
        },

        checkMainImage: function (e) {
            var $target = $(e.target);
            var $thumbnail = $target.closest('.slideThumbnail');
            var self = this;
            var isSlideBtn;
            var id;
            var url;
            var imageObj;
            var $currentListImage;
            var currentId;
            var $currentVariantImage;
            e.stopPropagation();

            if ($thumbnail.hasClass('primary')) {
                return;
            }

            isSlideBtn = $target.parent().hasClass('currentSlideActions');
            id = isSlideBtn ? $target.closest('.productSliderWrap').find('.activeSlide').attr('data-id') : $target.closest('.slideThumbnail').attr('data-id');
            url = '/image/avatar/' + this.formModel._id + '/' + id;
            imageObj = _.find(self.groupImages, function (el) {
                return el._id === id;
            });
            $currentListImage = $('tr[data-id="' + self.formModel._id + '"] .image > img');
            currentId = '#' + self.formModel._id;
            $currentVariantImage = $(currentId + '> td > img');

            this.$el.find('.slideThumbnail').removeClass('primary');

            if (isSlideBtn) {
                $(this.$el.find('.slideThumbnail')[this.currentIndex]).addClass('primary');
            } else {
                $thumbnail.addClass('primary');
            }

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
            var isSlideBtn = $target.parent().hasClass('currentSlideActions');
            var id = isSlideBtn ? $target.closest('.productSliderWrap').find('.activeSlide').attr('data-id') : $target.closest('.slideThumbnail').attr('data-id');
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
            // var $bxslider;
            var modelJSON = this.formModel;
            var images;

            images = _.sortBy(this.groupImages, function (item) {
                return !item.main;
            });

            images = images.reverse();

            $thisEl.html(this.template({
                images: images
            }));

            $thisEl.find('.importContainer').on('drop', function (e) {
                if (e.originalEvent.dataTransfer && e.originalEvent.dataTransfer.files.length) {
                    e.preventDefault();
                    e.stopPropagation();

                    $thisEl.find('#inputAttach').empty();
                    $thisEl.find('#inputAttach')[0].files = e.originalEvent.dataTransfer.files;
                }
            });

            $thisEl.find('.importContainer').on('dragover', function (e) {
                e.preventDefault();
                e.stopPropagation();
            });

            $thisEl.find('.importContainer').on('dragenter', function (e) {
                e.preventDefault();
                e.stopPropagation();
            });

            // $bxslider = $thisEl.find('.bxslider');
            $inputAttach = $thisEl.find('#inputAttach');

            this.formModel.id = this.formModel._id;

            // $bxslider.bxSlider({
            //     pagerCustom: '#bx-pager',
            //     controls   : false
            // });

            this.imageSave({model: this.formModel}, this);

            $inputAttach.hide();

            return this;
        }
    });

    return ImagesView;
});
