/**
 * Created by soundstorm on 12.08.15.
 */
define([
        'Backbone',
        'Underscore',
        'text!templates/Filter/filterGroup.html',
        'collections/Filter/filterCollection',
        'constants',
        'jQuery'
    ],
    function (Backbone, _, valuesTemplate, FilterCollection, CONSTANTS, $) {
        'use strict';
        var filterValuesView = Backbone.View.extend({
            initialize: function (options) {
                var sortOptions = options.sortOptions || {};

                _.bindAll(this, "renderContent");
                this.contentType = options.parentContentType;
                this.status = options.status;
                this.groupStatus = options.groupStatus;
                this.currentPage = 1;
                this.groupName = options.groupName;
                this.groupViewName = options.groupViewName;
                this.collection = options.currentCollection;
                this.elementToShow = options.elementToShow || (CONSTANTS.FILTERVALUESCOUNT > this.collectionLength) ? this.collectionLength : CONSTANTS.FILTERVALUESCOUNT;
                this.$el = $(options.element);

                this.filteredCollection = new FilterCollection(this.collection.toJSON(), sortOptions);

                this.collection.on('change', function () {
                    this.filteredCollection.set(this.collection.toJSON());
                }, this);

                this.filteredCollection.on('reset', this.renderContent);

                this.collectionLength = this.filteredCollection.length;
                this.paginationBool = this.collectionLength > this.elementToShow;

                this.allPages = Math.ceil(this.collectionLength / this.elementToShow);

                this.inputEvent = _.debounce(
                    function (e) {
                        var target = e.target;
                        var value = target.value;
                        var newFilteredCollection;

                        if (!value) {
                            this.$el.find('.miniStylePagination').show();
                            return this.filteredCollection.reset(this.collection.toJSON());
                        }

                        this.currentPage = 1;

                        newFilteredCollection = this.filterCollection(value);
                        this.$el.find('.miniStylePagination').toggle(!!newFilteredCollection.length);
                        this.filteredCollection.reset(newFilteredCollection);
                    }, 500);

                _.bindAll(this, "inputEvent");
            },

            filterCollection: function (value) {
                var resultCollection;
                var regex;

                regex = new RegExp(value, 'i');

                resultCollection = this.collection.filter(function (model) {

                    var searchItem = model.get('name') ? model.get('name').toString() : ''; // added in case of not string values

                    return searchItem.match(regex);
                });

                return resultCollection;
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
                var i;

                this.collectionLength = this.filteredCollection.length;
                this.paginationBool = this.collectionLength > this.elementToShow;

                this.allPages = Math.ceil(this.collectionLength / this.elementToShow);

                this.start = (this.currentPage - 1) * this.elementToShow;
                this.end = Math.min(this.currentPage * this.elementToShow, this.collectionLength);

                var prevPage;
                var nextPage;
                var status = '';
                var classFired = '';

                displayCollection = this.filteredCollection.toJSON();
                displayCollection = displayCollection.slice(this.start, this.end);

                ulElement.html('');

                for (i = 0; i <= (this.elementToShow - 1); i++) {
                    element = displayCollection[i];
                    if (element) {
                        element.name = $.trim(element.name) || 'None';
                        if (element.status) {
                            status = ' class="checkedValue"';
                        } else {
                            status = '';
                        }

                        if (element._id || element._id === 0) {

                            if (element.isEmployee === false) {

                                if (!element.status) {
                                    classFired = "fired";
                                } else {
                                    classFired = "fired checkedValue";
                                }
                                ulElement.append('<li class="' + classFired + '" data-value="' + element._id + '"' + status + '>' + element.name + '</li>');
                            } else {
                                ulElement.append('<li data-value="' + element._id + '"' + status + '>' + element.name + '</li>');
                            }
                        }
                    }
                }

                paginationLi.find('.counter').html((this.start + 1) + '-' + this.end + ' of ' + this.collectionLength);

                prevPage = paginationLi.find('.prev');
                nextPage = paginationLi.find('.next');

                if (this.currentPage === 1 && this.currentPage === this.allPages) {
                    prevPage.addClass('disabled');
                    nextPage.addClass('disabled');
                } else if (this.currentPage === 1 && this.currentPage !== this.allPages) {
                    prevPage.addClass('disabled');
                    nextPage.removeClass('disabled');
                } else if (this.currentPage !== 1 && this.currentPage === this.allPages) {
                    prevPage.removeClass('disabled');
                    nextPage.addClass('disabled');
                } else if (this.currentPage !== 1 && this.currentPage !== this.allPages) {
                    prevPage.removeClass('disabled');
                    nextPage.removeClass('disabled');
                }
            },

            render: function () {
                var self = this;
                var searchInput;

                var $currentEl = this.$el;

                $currentEl.append(_.template(valuesTemplate, {
                    groupStatus   : this.groupStatus,
                    groupViewName : this.groupViewName,
                    status        : this.status,
                    groupName     : this.groupName,
                    paginationBool: this.paginationBool
                }));

                this.renderContent();

                $currentEl.find("[id='" + this.groupViewName + "Container'] .miniStylePagination a").click(function (e) {
                    self.paginationChange(e, self);
                });

                searchInput = $currentEl.find(".ulContent input");

                searchInput.keyup(function (e) {
                    self.inputEvent(e);
                });

                searchInput.change(function (e) {
                    self.inputEvent(e);
                });

            }
        });

        return filterValuesView;
    }
);