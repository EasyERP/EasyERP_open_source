/**
 * Created by soundstorm on 12.08.15.
 */
define([
        'text!templates/Filter/filterGroup.html',
        'collections/Filter/filterCollection',
        'constants'
    ],
    function (valuesTemplate, filterCollection, CONSTANTS) {
        var filterValuesView = Backbone.View.extend({
            initialize: function (options) {
                this.contentType = options.parentContentType;
                this.status = options.status;
                this.groupStatus = options.groupStatus;
                this.currentPage = 1;
                this.groupName = options.groupName;
                this.groupViewName = options.groupViewName;
                this.collection = options.currentCollection;
                this.collectionLength = this.collection.length;
                this.elementToShow = options.elementToShow || (CONSTANTS.FILTERVALUESCOUNT > this.collectionLength) ? this.collectionLength : CONSTANTS.FILTERVALUESCOUNT;

                this.paginationBool = (this.collectionLength > this.elementToShow) ? true : false;

                this.allPages = Math.ceil(this.collectionLength / this.elementToShow);
                this.start;
                this.end;

                this.$el = $(options.element);
            },

            paginationChange: function (e, context) {
                var curEl = $(e.target);

                if (curEl.hasClass('prev')) {
                    context.currentPage--;
                } else {
                    context.currentPage++;
                }

                context.renderContent();
            },

            renderContent: function () {
                var displayCollection;
                var ulElement = this.$el.find("[id='" + this.groupViewName + "Ul']");
                var ulContent = ulElement.closest('.ulContent');
                var paginationLi = ulContent.find('.miniStylePagination');
                var element;

                this.start = (this.currentPage - 1) * this.elementToShow;
                this.end = Math.min(this.currentPage * this.elementToShow, this.collectionLength);

                var prevPage;
                var nextPage;
                var status = '';

                displayCollection = this.collection.toJSON();
                displayCollection = displayCollection.slice(this.start, this.end);

                ulElement.html('');

                for (var i = 0; i <= (this.elementToShow - 1); i++) {
                    element = displayCollection[i];
                    if (element) {
                        if (element.status) {
                            status = ' class="checkedValue"';
                        } else {
                            status = '';
                        }

                        if (element._id) {
                            ulElement.append('<li data-value="' + element._id + '"' + status + '>' + element.name + '</li>');
                        } else {
                            ulElement.append('<li data-value="' + element + '"' + status + '>' + element + '</li>');
                        }
                    }
                }

                paginationLi.find('.counter').html((this.start + 1) + '-' + this.end + ' of ' + this.collectionLength);

                prevPage = paginationLi.find('.prev');
                nextPage = paginationLi.find('.next');


                if (this.currentPage === 1 && !prevPage.hasClass('disabled')) {
                    prevPage.addClass('disabled');
                } else if (this.currentPage === this.allPages && !nextPage.hasClass('disabled')) {
                    nextPage.addClass('disabled');
                } else {
                    prevPage.removeClass('disabled');
                    nextPage.removeClass('disabled');
                }
            },

            render: function () {
                var self = this;

                this.$el.append(_.template(valuesTemplate, {
                    groupStatus: this.groupStatus,
                    groupViewName: this.groupViewName,
                    status: this.status,
                    groupName: this.groupName,
                    paginationBool: this.paginationBool
                }));

                this.renderContent();

                $("[id='" + this.groupViewName + "Container'] .miniStylePagination a").click(function (e) {
                    self.paginationChange(e, self);
                });
            }
        });

        return filterValuesView;
    }
);