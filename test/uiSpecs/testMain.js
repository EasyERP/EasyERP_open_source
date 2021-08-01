var allTestFiles = [];
var TEST_REGEXP = /(spec|test)\.js$/i;
var App = App || {
        savedFilters: {},
        weTrack     : true,
        startPreload: function () {
            App.preloaderShowFlag = true;
            $('#loading').show();
        },

        stopPreload: function () {
            App.preloaderShowFlag = false;
            $('#loading').hide();
        },
        render     : function (options) {
            "use strict";
            Backbone.Collection.prototype.getElement = function (id) {
                return (id) ? this.get(id) : ((this.currentElement) ? this.currentElement : this.at(0));
            };

            Backbone.Collection.prototype.setElement = function (id, model) {
                if (arguments.length === 0) {
                    this.currentElement = this.at(0);
                } else if (arguments.length === 2) {
                    if (model) {
                        this.currentElement = model;
                    } else if (id) {
                        this.currentElement = this.get(id);
                    }
                } else {
                    if ((typeof (id) == 'string') && id.length == 24) {
                        this.currentElement = this.get(id);
                    } else if (typeof (id) == 'object') {
                        this.currentElement = id;
                    }
                }

            };
            Backbone.View.prototype.errorNotification = function (xhr) {
                if (xhr) {
                    if (xhr.status === 401 || xhr.status === 403) {
                        if (xhr.status === 401) {
                            Backbone.history.navigate("login", {trigger: true});
                        } else {
                            App.render({
                                type   : 'error',
                                message: "You do not have permission to perform this action."
                            });
                        }
                    } else {
                        if (xhr.responseJSON) {
                            alert(xhr.responseJSON.error);
                        } else {
                            Backbone.history.navigate("home", {trigger: true});
                        }
                    }
                }
            };
            Backbone.View.prototype.pageElementRender = function (totalCount, itemsNumber, currentPage) {
                var itemsNumber = this.defaultItemsNumber;

                if (itemsNumber === 'all') {
                    itemsNumber = totalCount;
                }

                //     $("#itemsNumber").text(itemsNumber); // element deleted

                var start = $("#grid-start");
                var end = $("#grid-end");

                if (totalCount == 0 || totalCount == undefined) {
                    start.text(0);
                    end.text(0);
                    $("#grid-count").text(0);
                    $("#previousPage").prop("disabled", true);
                    $("#nextPage").prop("disabled", true);
                    $("#firstShowPage").prop("disabled", true);
                    $("#lastShowPage").prop("disabled", true);
                    $("#pageList").empty();
                    $("#currentShowPage").val(0);
                    $("#lastPage").text(0);
                } else {
                    currentPage = currentPage || 1;

                    start.text(currentPage * itemsNumber - itemsNumber + 1);
                    if (totalCount <= itemsNumber || totalCount <= currentPage * itemsNumber) {
                        end.text(totalCount);
                    } else {
                        end.text(currentPage * itemsNumber);
                    }
                    $("#grid-count").text(totalCount);
                    $("#pageList").empty();
                    var pageNumber = Math.ceil(totalCount / itemsNumber);
                    //number page show (Vasya)
                    var itemsOnPage = 7;
                    if (pageNumber <= itemsOnPage) {
                        for (var i = 1; i <= pageNumber; i++) {
                            $("#pageList").append('<li class="showPage">' + i + '</li>');
                        }
                    }
                    else if (pageNumber >= itemsOnPage && currentPage <= itemsOnPage) {
                        for (var i = 1; i <= itemsOnPage; i++) {
                            $("#pageList").append('<li class="showPage">' + i + '</li>');
                        }
                    }

                    else if (pageNumber >= itemsOnPage && currentPage > 3 && currentPage <= pageNumber - 3) {
                        for (var i = currentPage - 3; i <= currentPage + 3; i++) {
                            $("#pageList").append('<li class="showPage">' + i + '</li>');
                        }
                    }

                    else if (currentPage >= pageNumber - 3) {
                        for (var i = pageNumber - 6; i <= pageNumber; i++) {
                            $("#pageList").append('<li class="showPage">' + i + '</li>');
                        }
                    }
                    //end number page show
                    $("#lastPage").text(pageNumber);
                    $("#currentShowPage").val(currentPage);
                    $("#previousPage").prop("disabled", parseInt(start.text()) <= parseInt(currentPage));
                    $("#firstShowPage").prop("disabled", parseInt(start.text()) <= parseInt(currentPage));
                    if (pageNumber <= 1) {
                        $("#nextPage").prop("disabled", true);
                        $("#lastShowPage").prop("disabled", true);
                    } else {
                        $("#nextPage").prop("disabled", parseInt(end.text()) === parseInt(totalCount));
                        $("#lastShowPage").prop("disabled", parseInt(end.text()) === parseInt(totalCount));
                    }
                }
            };

            Backbone.View.prototype.pageElementRenderProject = function (totalCount, itemsNumber, currentPage, context) {
                var itemsNumber = this.defaultItemsNumber;
                var el = context.$el;

                if (itemsNumber === 'all') {
                    itemsNumber = totalCount;
                }

                //     $("#itemsNumber").text(itemsNumber); // element deleted

                var start = el.find("#grid-start");
                var end = el.find("#grid-end");

                if (totalCount == 0 || totalCount == undefined) {
                    start.text(0);
                    end.text(0);
                    el.find("#grid-count").text(0);
                    el.find("#previousPage").prop("disabled", true);
                    el.find("#nextPage").prop("disabled", true);
                    el.find("#firstShowPage").prop("disabled", true);
                    el.find("#lastShowPage").prop("disabled", true);
                    el.find("#pageList").empty();
                    el.find("#currentShowPage").val(0);
                    el.find("#lastPage").text(0);
                } else {
                    currentPage = currentPage || 1;

                    start.text(currentPage * itemsNumber - itemsNumber + 1);
                    if (totalCount <= itemsNumber || totalCount <= currentPage * itemsNumber) {
                        end.text(totalCount);
                    } else {
                        end.text(currentPage * itemsNumber);
                    }
                    el.find("#grid-count").text(totalCount);
                    el.find("#pageList").empty();
                    var pageNumber = Math.ceil(totalCount / itemsNumber);
                    //number page show (Vasya)
                    var itemsOnPage = 7;
                    if (pageNumber <= itemsOnPage) {
                        for (var i = 1; i <= pageNumber; i++) {
                            el.find("#pageList").append('<li class="showPage">' + i + '</li>');
                        }
                    }
                    else if (pageNumber >= itemsOnPage && currentPage <= itemsOnPage) {
                        for (var i = 1; i <= itemsOnPage; i++) {
                            el.find("#pageList").append('<li class="showPage">' + i + '</li>');
                        }
                    }

                    else if (pageNumber >= itemsOnPage && currentPage > 3 && currentPage <= pageNumber - 3) {
                        for (var i = currentPage - 3; i <= currentPage + 3; i++) {
                            el.find("#pageList").append('<li class="showPage">' + i + '</li>');
                        }
                    }

                    else if (currentPage >= pageNumber - 3) {
                        for (var i = pageNumber - 6; i <= pageNumber; i++) {
                            el.find("#pageList").append('<li class="showPage">' + i + '</li>');
                        }
                    }
                    //end number page show
                    el.find("#lastPage").text(pageNumber);
                    el.find("#currentShowPage").val(currentPage);
                    el.find("#previousPage").prop("disabled", parseInt(start.text()) <= parseInt(currentPage));
                    el.find("#firstShowPage").prop("disabled", parseInt(start.text()) <= parseInt(currentPage));
                    if (pageNumber <= 1) {
                        el.find("#nextPage").prop("disabled", true);
                        el.find("#lastShowPage").prop("disabled", true);
                    } else {
                        el.find("#nextPage").prop("disabled", parseInt(end.text()) === parseInt(totalCount));
                        el.find("#lastShowPage").prop("disabled", parseInt(end.text()) === parseInt(totalCount));
                    }
                }
            };

            Backbone.View.prototype.changeLocationHash = function (page, count, filter) {
                var location = window.location.hash;

                var mainLocation = '#tinyERP/' + this.contentType + '/' + this.viewType;
                var pId = (location.split('/pId=')[1]) ? location.split('/pId=')[1].split('/')[0] : '';
                if (!page && this.viewType == 'list') {
                    page = (location.split('/p=')[1]) ? location.split('/p=')[1].split('/')[0] : 1;
                }

                if (!count) {
                    var thumbnails = location.split('thumbnails')[0];
                    count = (location.split('/c=')[1]) ? location.split('/c=')[1].split('/')[0] : 100;
                    if (thumbnails && count < 100) {
                        count = 100;
                    }
                }
                var url = mainLocation;
                if (pId) {
                    url += '/pId=' + pId;
                }
                if (page) {
                    url += '/p=' + page;
                }
                if (count) {
                    url += '/c=' + count;
                }
                if (!filter) {
                    var locatioFilter = location.split('/filter=')[1];
                    filter = (locatioFilter) ? JSON.parse(decodeURIComponent(locatioFilter)) : null;
                }
                if (filter) {
                    var notEmptyFilter = false;
                    for (var i in filter) {
                        if (filter[i] && filter[i].length !== 0) {
                            notEmptyFilter = true;
                        }
                    }
                    if (notEmptyFilter) {
                        url += '/filter=' + encodeURIComponent(JSON.stringify(filter));
                    } else {
                        url += '';
                    }
                }

                Backbone.history.navigate(url);

            };

            Backbone.View.prototype.prevPProject = function (dataObject, disableChangeHash, context) {
                var el = context.$el;

                this.startTime = new Date();
                var itemsNumber = context.defaultItemsNumber;
                var currentShowPage = el.find("#currentShowPage");
                var page = parseInt(currentShowPage.val()) - 1;
                this.startTime = new Date();

                currentShowPage.val(page);
                if (page === 1) {
                    el.find("#previousPage").prop("disabled", true);
                    el.find("#firstShowPage").prop("disabled", true);
                }

                var pageNumber = el.find("#lastPage").text();
                var itemsOnPage = 7;
                el.find("#pageList").empty();
                //number page show (Vasya)
                if (pageNumber <= itemsOnPage) {
                    for (var i = 1; i <= pageNumber; i++) {
                        el.find("#pageList").append('<li class="showPage">' + i + '</li>');
                    }
                }
                else if (pageNumber >= itemsOnPage && page <= itemsOnPage) {
                    for (var i = 1; i <= itemsOnPage; i++) {
                        el.find("#pageList").append('<li class="showPage">' + i + '</li>');
                    }
                }
                else if (pageNumber >= itemsOnPage && page > 3 && page <= pageNumber - 3) {
                    for (var i = page - 3; i <= page + 3; i++) {
                        el.find("#pageList").append('<li class="showPage">' + i + '</li>');
                    }
                }
                else if (page >= page - 3) {
                    for (var i = pageNumber - 6; i <= pageNumber; i++) {
                        el.find("#pageList").append('<li class="showPage">' + i + '</li>');
                    }
                }
                //end number page show (Vasya)
                el.find("#grid-start").text((page - 1) * itemsNumber + 1);
                if (this.listLength <= page * itemsNumber) {
                    el.find("#grid-end").text(this.listLength);
                } else {
                    el.find("#grid-end").text(page * itemsNumber);
                }
                el.find("#nextPage").prop("disabled", false);
                el.find("#lastShowPage").prop("disabled", false);
                var serchObject = {
                    count : itemsNumber,
                    page  : page,
                    letter: this.selectedLetter
                };
                if (dataObject) {
                    _.extend(serchObject, dataObject);
                }

                if (!disableChangeHash) {
                    this.changeLocationHash(page, itemsNumber);
                }

                context.collection.bind('reset', context.renderContent, context);
                context.collection.bind('showmore', context.showMoreContent, context);

                context.collection.showMore(serchObject);
            };

            Backbone.View.prototype.prevP = function (dataObject, disableChangeHash) {
                this.startTime = new Date();
                var itemsNumber = this.defaultItemsNumber;
                var currentShowPage = $("#currentShowPage");
                var page = parseInt(currentShowPage.val()) - 1;
                this.startTime = new Date();

                currentShowPage.val(page);
                if (page === 1) {
                    $("#previousPage").prop("disabled", true);
                    $("#firstShowPage").prop("disabled", true);
                }

                var pageNumber = $("#lastPage").text();
                var itemsOnPage = 7;
                $("#pageList").empty();
                //number page show (Vasya)
                if (pageNumber <= itemsOnPage) {
                    for (var i = 1; i <= pageNumber; i++) {
                        $("#pageList").append('<li class="showPage">' + i + '</li>');
                    }
                }
                else if (pageNumber >= itemsOnPage && page <= itemsOnPage) {
                    for (var i = 1; i <= itemsOnPage; i++) {
                        $("#pageList").append('<li class="showPage">' + i + '</li>');
                    }
                }
                else if (pageNumber >= itemsOnPage && page > 3 && page <= pageNumber - 3) {
                    for (var i = page - 3; i <= page + 3; i++) {
                        $("#pageList").append('<li class="showPage">' + i + '</li>');
                    }
                }
                else if (page >= page - 3) {
                    for (var i = pageNumber - 6; i <= pageNumber; i++) {
                        $("#pageList").append('<li class="showPage">' + i + '</li>');
                    }
                }
                //end number page show (Vasya)
                $("#grid-start").text((page - 1) * itemsNumber + 1);
                if (this.listLength <= page * itemsNumber) {
                    $("#grid-end").text(this.listLength);
                } else {
                    $("#grid-end").text(page * itemsNumber);
                }
                $("#nextPage").prop("disabled", false);
                $("#lastShowPage").prop("disabled", false);
                var serchObject = {
                    count : itemsNumber,
                    page  : page,
                    letter: this.selectedLetter
                };
                if (dataObject) {
                    _.extend(serchObject, dataObject);
                }

                if (!disableChangeHash) {
                    this.changeLocationHash(page, itemsNumber);
                }

                this.collection.showMore(serchObject);
            };

            Backbone.View.prototype.nextP = function (dataObject, disableChangeHash) {
                this.startTime = new Date();
                var itemsNumber = this.defaultItemsNumber;
                var page = parseInt($("#currentShowPage").val()) + 1;

                this.startTime = new Date();
                var pageNumber = $("#lastPage").text();
                var itemsOnPage = 7;
                //number page show (Vasya)
                $("#pageList").empty();
                if (pageNumber <= itemsOnPage) {
                    for (var i = 1; i <= pageNumber; i++) {
                        $("#pageList").append('<li class="showPage">' + i + '</li>');
                    }
                }
                else if (pageNumber >= itemsOnPage && page > 3 && page < pageNumber - 3) {
                    for (var i = page - 3; i <= page + 3; i++) {
                        $("#pageList").append('<li class="showPage">' + i + '</li>');
                    }
                }
                else if (pageNumber >= itemsOnPage && page <= itemsOnPage) {
                    for (var i = 1; i <= itemsOnPage; i++) {
                        $("#pageList").append('<li class="showPage">' + i + '</li>');
                    }
                }

                else if (page >= pageNumber - 3) {
                    for (var i = pageNumber - 6; i <= pageNumber; i++) {
                        $("#pageList").append('<li class="showPage">' + i + '</li>');
                    }
                }
                //end number page show (Vasya)
                $("#currentShowPage").val(page);
                $("#grid-start").text((page - 1) * itemsNumber + 1);

                if (this.listLength <= page * itemsNumber) {
                    $("#grid-end").text(this.listLength);
                    $("#nextPage").prop("disabled", true);
                    $("#lastShowPage").prop("disabled", true);
                } else {
                    $("#grid-end").text(page * itemsNumber);
                }

                $("#previousPage").prop("disabled", false);
                $("#firstShowPage").prop("disabled", false);

                var serchObject = {
                    count : itemsNumber,
                    page  : page,
                    letter: this.selectedLetter
                };

                if (dataObject) {
                    _.extend(serchObject, dataObject);
                }

                if (!disableChangeHash) {
                    this.changeLocationHash(page, itemsNumber);
                }

                this.collection.showMore(serchObject);
            };

            Backbone.View.prototype.nextPProject = function (dataObject, disableChangeHash, context) {
                var el = context.$el;

                this.startTime = new Date();
                var itemsNumber = context.defaultItemsNumber;
                var page = parseInt(el.find("#currentShowPage").val()) + 1;

                context.startTime = new Date();
                var pageNumber = el.find("#lastPage").text();
                var itemsOnPage = 7;
                //number page show (Vasya)
                el.find("#pageList").empty();
                if (pageNumber <= itemsOnPage) {
                    for (var i = 1; i <= pageNumber; i++) {
                        el.find("#pageList").append('<li class="showPage">' + i + '</li>');
                    }
                }
                else if (pageNumber >= itemsOnPage && page > 3 && page < pageNumber - 3) {
                    for (var i = page - 3; i <= page + 3; i++) {
                        el.find("#pageList").append('<li class="showPage">' + i + '</li>');
                    }
                }
                else if (pageNumber >= itemsOnPage && page <= itemsOnPage) {
                    for (var i = 1; i <= itemsOnPage; i++) {
                        el.find("#pageList").append('<li class="showPage">' + i + '</li>');
                    }
                }

                else if (page >= pageNumber - 3) {
                    for (var i = pageNumber - 6; i <= pageNumber; i++) {
                        el.find("#pageList").append('<li class="showPage">' + i + '</li>');
                    }
                }
                //end number page show (Vasya)
                el.find("#currentShowPage").val(page);
                el.find("#grid-start").text((page - 1) * itemsNumber + 1);

                if (context.listLength <= page * itemsNumber) {
                    el.find("#grid-end").text(context.listLength);
                    el.find("#nextPage").prop("disabled", true);
                    el.find("#lastShowPage").prop("disabled", true);
                } else {
                    el.find("#grid-end").text(page * itemsNumber);
                }

                el.find("#previousPage").prop("disabled", false);
                el.find("#firstShowPage").prop("disabled", false);

                var serchObject = {
                    count : itemsNumber,
                    page  : page,
                    letter: this.selectedLetter
                };

                if (dataObject) {
                    _.extend(serchObject, dataObject);
                }

                if (!disableChangeHash) {
                    this.changeLocationHash(page, itemsNumber);
                }

                context.collection.unbind();
                context.collection.bind('reset', context.renderContent, context);
                context.collection.bind('showmore', context.showMoreContent, context);

                context.collection.showMore(serchObject);
            };

            Backbone.View.prototype.firstP = function (dataObject, disableChangeHash) {
                this.startTime = new Date();
                var itemsNumber = this.defaultItemsNumber;
                var currentShowPage = $("#currentShowPage");
                var page = 1;

                this.startTime = new Date();

                currentShowPage.val(page);
                var lastPage = $("#lastPage").text();
                if (page === 1) {
                    $("#firstShowPage").prop("disabled", true);
                }
                //number page show
                $("#pageList").empty();
                if (lastPage >= 7) {
                    for (var i = 1; i <= 7; i++) {
                        $("#pageList").append('<li class="showPage">' + i + '</li>');
                    }
                } else {
                    for (var i = 1; i <= lastPage; i++) {
                        $("#pageList").append('<li class="showPage">' + i + '</li>');
                    }
                }
                $("#grid-start").text((page - 1) * itemsNumber + 1);
                if (this.listLength <= page * itemsNumber) {
                    $("#grid-end").text(this.listLength);
                } else {
                    $("#grid-end").text(page * itemsNumber);
                }
                $("#previousPage").prop("disabled", true);
                $("#nextPage").prop("disabled", false);
                $("#lastShowPage").prop("disabled", false);
                var serchObject = {
                    count : itemsNumber,
                    page  : page,
                    letter: this.selectedLetter
                };
                if (dataObject) {
                    _.extend(serchObject, dataObject);
                }

                if (!disableChangeHash) {
                    this.changeLocationHash(page, itemsNumber);
                }

                this.collection.showMore(serchObject);
            };

            Backbone.View.prototype.firstPProject = function (dataObject, disableChangeHash, context) {
                var el = context.$el;

                this.startTime = new Date();
                var itemsNumber = context.defaultItemsNumber;
                var currentShowPage = el.find("#currentShowPage");
                var page = 1;

                this.startTime = new Date();

                currentShowPage.val(page);
                var lastPage = el.find("#lastPage").text();
                if (page === 1) {
                    el.find("#firstShowPage").prop("disabled", true);
                }
                //number page show
                $("#pageList").empty();
                if (lastPage >= 7) {
                    for (var i = 1; i <= 7; i++) {
                        el.find("#pageList").append('<li class="showPage">' + i + '</li>');
                    }
                } else {
                    for (var i = 1; i <= lastPage; i++) {
                        el.find("#pageList").append('<li class="showPage">' + i + '</li>');
                    }
                }
                el.find("#grid-start").text((page - 1) * itemsNumber + 1);
                if (this.listLength <= page * itemsNumber) {
                    el.find("#grid-end").text(this.listLength);
                } else {
                    el.find("#grid-end").text(page * itemsNumber);
                }
                el.find("#previousPage").prop("disabled", true);
                el.find("#nextPage").prop("disabled", false);
                el.find("#lastShowPage").prop("disabled", false);
                var serchObject = {
                    count : itemsNumber,
                    page  : page,
                    letter: this.selectedLetter
                };
                if (dataObject) {
                    _.extend(serchObject, dataObject);
                }

                if (!disableChangeHash) {
                    this.changeLocationHash(page, itemsNumber);
                }

                context.collection.bind('reset', context.renderContent, context);
                context.collection.bind('showmore', context.showMoreContent, context);

                context.collection.showMore(serchObject);
            };

            Backbone.View.prototype.lastP = function (dataObject, disableChangeHash) {
                this.startTime = new Date();
                var itemsNumber = this.defaultItemsNumber;
                var page = $("#lastPage").text();
                $("#firstShowPage").prop("disabled", true);
                this.startTime = new Date();
                $("#pageList").empty();
                //number page show
                if (page >= 7) {
                    for (var i = page - 6; i <= page; i++) {
                        $("#pageList").append('<li class="showPage">' + i + '</li>');
                    }
                }
                else {
                    for (var i = 1; i <= page; i++) {
                        $("#pageList").append('<li class="showPage">' + i + '</li>');
                    }
                }
                //end number page show (Vasya)
                $("#currentShowPage").val(page);
                $("#grid-start").text((page - 1) * itemsNumber + 1);
                if (this.listLength <= page * itemsNumber) {
                    $("#grid-end").text(this.listLength);
                    $("#nextPage").prop("disabled", true);
                } else {
                    $("#grid-end").text(page * itemsNumber);
                }
                $("#nextPage").prop("disabled", true);
                $("#lastShowPage").prop("disabled", true);
                $("#previousPage").prop("disabled", false);
                $("#firstShowPage").prop("disabled", false);
                var serchObject = {
                    count : itemsNumber,
                    page  : page,
                    letter: this.selectedLetter
                };
                if (dataObject) {
                    _.extend(serchObject, dataObject);
                }

                if (!disableChangeHash) {
                    this.changeLocationHash(page, itemsNumber);
                }

                this.collection.showMore(serchObject);
            };

            Backbone.View.prototype.lastPProject = function (dataObject, disableChangeHash, context) {
                var el = context.$el;

                this.startTime = new Date();
                var itemsNumber = context.defaultItemsNumber;
                var page = el.find("#lastPage").text();
                el.find("#firstShowPage").prop("disabled", true);
                this.startTime = new Date();
                el.find("#pageList").empty();
                //number page show
                if (page >= 7) {
                    for (var i = page - 6; i <= page; i++) {
                        el.find("#pageList").append('<li class="showPage">' + i + '</li>');
                    }
                }
                else {
                    for (var i = 1; i <= page; i++) {
                        el.find("#pageList").append('<li class="showPage">' + i + '</li>');
                    }
                }
                //end number page show (Vasya)
                el.find("#currentShowPage").val(page);
                el.find("#grid-start").text((page - 1) * itemsNumber + 1);
                if (this.listLength <= page * itemsNumber) {
                    el.find("#grid-end").text(this.listLength);
                    el.find("#nextPage").prop("disabled", true);
                } else {
                    el.find("#grid-end").text(page * itemsNumber);
                }
                el.find("#nextPage").prop("disabled", true);
                el.find("#lastShowPage").prop("disabled", true);
                el.find("#previousPage").prop("disabled", false);
                el.find("#firstShowPage").prop("disabled", false);
                var serchObject = {
                    count : itemsNumber,
                    page  : page,
                    letter: this.selectedLetter
                };
                if (dataObject) {
                    _.extend(serchObject, dataObject);
                }

                if (!disableChangeHash) {
                    this.changeLocationHash(page, itemsNumber);
                }

                context.collection.bind('reset', context.renderContent, context);
                context.collection.bind('showmore', context.showMoreContent, context);

                context.collection.showMore(serchObject);
            };

            Backbone.View.prototype.showPProject = function (event, dataObject, disableChangeHash, context) {
                var el = context.$el;

                this.startTime = new Date();
                if (context.listLength == 0) {
                    el.find("#currentShowPage").val(0);
                } else {
                    var itemsNumber = context.defaultItemsNumber;
                    var page = parseInt(event.target.textContent);
                    if (!page) {
                        page = el.find(event.target).val();
                    }
                    var adr = /^\d+$/;
                    var lastPage = parseInt(el.find('#lastPage').text());

                    if (!adr.test(page) || (parseInt(page) <= 0) || (parseInt(page) > parseInt(lastPage))) {
                        page = 1;
                    }
                    //number page show (Vasya)
                    var itemsOnPage = 7;
                    el.find("#pageList").empty();
                    if (parseInt(lastPage) <= itemsOnPage) {
                        for (var i = 1; i <= parseInt(lastPage); i++) {
                            el.find("#pageList").append('<li class="showPage">' + i + '</li>');
                        }
                    }
                    else if (page >= 5 && page <= itemsOnPage) {
                        for (var i = parseInt(page) - 3; i <= parseInt(page) + 3; i++) {
                            el.find("#pageList").append('<li class="showPage">' + i + '</li>');
                        }
                    }
                    else if (lastPage >= itemsOnPage && page <= itemsOnPage) {
                        for (var i = 1; i <= itemsOnPage; i++) {
                            el.find("#pageList").append('<li class="showPage">' + i + '</li>');
                        }
                    }
                    else if (lastPage >= itemsOnPage && page > 3 && page <= parseInt(lastPage) - 3) {
                        for (var i = parseInt(page) - 3; i <= parseInt(page) + 3; i++) {
                            el.find("#pageList").append('<li class="showPage">' + i + '</li>');
                        }
                    }

                    else if (page >= parseInt(lastPage) - 3) {
                        for (var i = lastPage - 6; i <= parseInt(lastPage); i++) {
                            el.find("#pageList").append('<li class="showPage">' + i + '</li>');
                        }
                    }
                    //number page show
                    el.find("#currentShowPage").val(page);
                    el.find("#grid-start").text((page - 1) * itemsNumber + 1);
                    if (this.listLength <= page * itemsNumber) {
                        el.find("#grid-end").text(this.listLength);
                    } else {
                        el.find("#grid-end").text(page * itemsNumber);
                    }
                    if (page <= 1) {
                        el.find("#previousPage").prop("disabled", true);
                        el.find("#nextPage").prop("disabled", false);
                        el.find("#firstShowPage").prop("disabled", true);
                        el.find("#lastShowPage").prop("disabled", false);
                    }
                    if (page >= lastPage) {
                        el.find("#nextPage").prop("disabled", true);
                        el.find("#previousPage").prop("disabled", false);
                        el.find("#lastShowPage").prop("disabled", true);
                        el.find("#firstShowPage").prop("disabled", false);
                    }
                    if ((1 < page) && (page < lastPage)) {
                        el.find("#nextPage").prop("disabled", false);
                        el.find("#previousPage").prop("disabled", false);
                        el.find("#lastShowPage").prop("disabled", false);
                        el.find("#firstShowPage").prop("disabled", false);
                    }
                    if ((page == lastPage) && (lastPage == 1)) {
                        el.find("#previousPage").prop("disabled", true);
                        el.find("#nextPage").prop("disabled", true);
                        el.find("#firstShowPage").prop("disabled", true);
                        el.find("#lastShowPage").prop("disabled", true);
                    }
                    var serchObject = {
                        count : itemsNumber,
                        page  : page,
                        letter: this.selectedLetter
                    };
                    if (dataObject) {
                        _.extend(serchObject, dataObject);
                    }

                    if (!disableChangeHash) {
                        this.collection.unbind();
                        this.changeLocationHash(page, itemsNumber);
                    }

                    context.collection.bind('reset', context.renderContent, context);
                    context.collection.bind('showmore', context.showMoreContent, context);

                    context.collection.showMore(serchObject);

                }
            };

            Backbone.View.prototype.showP = function (event, dataObject, disableChangeHash) {
                this.startTime = new Date();
                if (this.listLength == 0) {
                    $("#currentShowPage").val(0);
                } else {
                    var itemsNumber = this.defaultItemsNumber;
                    var page = parseInt(event.target.textContent);
                    if (!page) {
                        page = $(event.target).val();
                    }
                    var adr = /^\d+$/;
                    var lastPage = parseInt($('#lastPage').text());

                    if (!adr.test(page) || (parseInt(page) <= 0) || (parseInt(page) > parseInt(lastPage))) {
                        page = 1;
                    }
                    //number page show (Vasya)
                    var itemsOnPage = 7;
                    $("#pageList").empty();
                    if (parseInt(lastPage) <= itemsOnPage) {
                        for (var i = 1; i <= parseInt(lastPage); i++) {
                            $("#pageList").append('<li class="showPage">' + i + '</li>');
                        }
                    }
                    else if (page >= 5 && page <= itemsOnPage) {
                        for (var i = parseInt(page) - 3; i <= parseInt(page) + 3; i++) {
                            $("#pageList").append('<li class="showPage">' + i + '</li>');
                        }
                    }
                    else if (lastPage >= itemsOnPage && page <= itemsOnPage) {
                        for (var i = 1; i <= itemsOnPage; i++) {
                            $("#pageList").append('<li class="showPage">' + i + '</li>');
                        }
                    }
                    else if (lastPage >= itemsOnPage && page > 3 && page <= parseInt(lastPage) - 3) {
                        for (var i = parseInt(page) - 3; i <= parseInt(page) + 3; i++) {
                            $("#pageList").append('<li class="showPage">' + i + '</li>');
                        }
                    }

                    else if (page >= parseInt(lastPage) - 3) {
                        for (var i = lastPage - 6; i <= parseInt(lastPage); i++) {
                            $("#pageList").append('<li class="showPage">' + i + '</li>');
                        }
                    }
                    //number page show
                    $("#currentShowPage").val(page);
                    $("#grid-start").text((page - 1) * itemsNumber + 1);
                    if (this.listLength <= page * itemsNumber) {
                        $("#grid-end").text(this.listLength);
                    } else {
                        $("#grid-end").text(page * itemsNumber);
                    }
                    if (page <= 1) {
                        $("#previousPage").prop("disabled", true);
                        $("#nextPage").prop("disabled", false);
                        $("#firstShowPage").prop("disabled", true);
                        $("#lastShowPage").prop("disabled", false);
                    }
                    if (page >= lastPage) {
                        $("#nextPage").prop("disabled", true);
                        $("#previousPage").prop("disabled", false);
                        $("#lastShowPage").prop("disabled", true);
                        $("#firstShowPage").prop("disabled", false);
                    }
                    if ((1 < page) && (page < lastPage)) {
                        $("#nextPage").prop("disabled", false);
                        $("#previousPage").prop("disabled", false);
                        $("#lastShowPage").prop("disabled", false);
                        $("#firstShowPage").prop("disabled", false);
                    }
                    if ((page == lastPage) && (lastPage == 1)) {
                        $("#previousPage").prop("disabled", true);
                        $("#nextPage").prop("disabled", true);
                        $("#firstShowPage").prop("disabled", true);
                        $("#lastShowPage").prop("disabled", true);
                    }
                    var serchObject = {
                        count : itemsNumber,
                        page  : page,
                        letter: this.selectedLetter
                    };
                    if (dataObject) {
                        _.extend(serchObject, dataObject);
                    }

                    if (!disableChangeHash) {
                        //this.collection.unbind();
                        this.changeLocationHash(page, itemsNumber);
                    }

                    this.collection.showMore(serchObject);

                }
            };

            Backbone.View.prototype.deleteRender = function (deleteCounter, deletePage, dataObject) {
                this.startTime = new Date();
                var itemsNumber = this.defaultItemsNumber;
                var pageNumber;

                $("#top-bar-deleteBtn").hide();

                if (itemsNumber === 'all') {
                    throw('not implemented');
                }

                if (deleteCounter === this.collectionLength) {
                    pageNumber = Math.ceil(this.listLength / itemsNumber);
                    if (deletePage > 1) {
                        deletePage = deletePage - 1;
                    }
                    if ((deletePage == 1) && (pageNumber > 1)) {
                        deletePage = 1;
                    }
                    if (((deletePage == 1) && (pageNumber == 0)) || (deletePage == 0)) {
                        deletePage = 0;
                    }

                    if (deletePage == 0) {
                        $("#grid-start").text(0);
                        $("#grid-end").text(0);
                        $("#grid-count").text(0);
                        $("#previousPage").prop("disabled", true);
                        $("#nextPage").prop("disabled", true);
                        $("#currentShowPage").val(0);
                        $("#lastPage").text(0);
                        $("#pageList").empty();
                        $("#listTable").empty();
                        $("#startLetter .current").removeClass("current").addClass("empty");
                    } else {
                        $("#grid-start").text((deletePage - 1) * itemsNumber + 1);
                        //page counter Vasya
                        var gridEnd = deletePage * itemsNumber;
                        if (this.listLength <= gridEnd) {
                            $("#grid-end").text(this.listLength);
                        } else {
                            $("#grid-end").text(gridEnd);
                        }
                        //end
                        $("#grid-count").text(this.listLength);
                        $("#currentShowPage").val(deletePage);
                        $("#pageList").empty();

                        for (var i = 1; i <= pageNumber; i++) {
                            $("#pageList").append('<li class="showPage">' + i + '</li>');
                        }
                        $("#lastPage").text(pageNumber);

                        if (deletePage <= 1) {
                            $("#previousPage").prop("disabled", true);
                            $("#nextPage").prop("disabled", false);
                            $("#firstShowPage").prop("disabled", true);
                            $("#lastShowPage").prop("disabled", false);
                        }
                        if (deletePage >= pageNumber) {
                            $("#nextPage").prop("disabled", true);
                            $("#previousPage").prop("disabled", false);
                            $("#firstShowPage").prop("disabled", false);
                            $("#lastShowPage").prop("disabled", true);
                        }
                        if ((1 < deletePage) && (deletePage < pageNumber)) {
                            $("#nextPage").prop("disabled", false);
                            $("#previousPage").prop("disabled", false);
                            $("#firstShowPage").prop("disabled", false);
                            $("#lastShowPage").prop("disabled", false);
                        }
                        if ((deletePage == pageNumber) && (pageNumber == 1)) {
                            $("#previousPage").prop("disabled", true);
                            $("#nextPage").prop("disabled", true);
                            $("#firstShowPage").prop("disabled", true);
                            $("#lastShowPage").prop("disabled", true);
                        }
                        var serchObject = {
                            count: itemsNumber,
                            page : deletePage
                        };
                        if (dataObject) {
                            _.extend(serchObject, dataObject);
                        }
                        this.collection.showMore(serchObject);
                        this.changeLocationHash(deletePage, itemsNumber);
                    }
                    $('#checkAll').prop('checked', false);
                } else {
                    var newFetchModels = new this.contentCollection({
                        viewType        : 'list',
                        sort            : this.sort,
                        page            : deletePage,
                        count           : this.defaultItemsNumber,
                        filter          : this.filter,
                        parrentContentId: this.parrentContentId,
                        contentType     : this.contentType,
                        newCollection   : this.newCollection
                    });
                    var that = this;
                    newFetchModels.bind('reset', function () {
                        that.collection.add(newFetchModels.models, {merge: true});
                        that.showMoreContent(that.collection);//added two parameters page and items number
                    });

                    $("#grid-start").text((deletePage - 1) * itemsNumber + 1);
                    if (itemsNumber === this.collectionLength && (deletePage * this.collectionLength <= this.listLength)) {
                        $("#grid-end").text(deletePage * itemsNumber);
                    } else {
                        $("#grid-end").text((deletePage - 1) * itemsNumber + this.collectionLength - deleteCounter);
                    }
                    $("#grid-count").text(this.listLength);
                    $("#currentShowPage").val(deletePage);

                    $("#pageList").empty();
                    pageNumber = Math.ceil(this.listLength / itemsNumber);
                    var currentPage = $("#currentShowPage").val();

                    //number page show (Vasya)
                    var itemsOnPage = 7;
                    if (pageNumber <= itemsOnPage) {
                        for (var i = 1; i <= pageNumber; i++) {
                            $("#pageList").append('<li class="showPage">' + i + '</li>');
                        }
                    }
                    else if (pageNumber >= itemsOnPage && currentPage <= itemsOnPage) {
                        for (var i = 1; i <= itemsOnPage; i++) {
                            $("#pageList").append('<li class="showPage">' + i + '</li>');
                        }
                    }

                    else if (pageNumber >= itemsOnPage && currentPage > 3 && currentPage <= pageNumber - 3) {
                        for (var i = currentPage - 3; i <= currentPage + 3; i++) {
                            $("#pageList").append('<li class="showPage">' + i + '</li>');
                        }
                    }

                    else if (currentPage >= pageNumber - 3) {
                        for (var i = pageNumber - 6; i <= pageNumber; i++) {
                            $("#pageList").append('<li class="showPage">' + i + '</li>');
                        }
                    }

                    $("#lastPage").text(pageNumber);

                    if (deletePage <= 1) {
                        $("#previousPage").prop("disabled", true);
                        $("#nextPage").prop("disabled", false);
                        $("#firstShowPage").prop("disabled", true);
                        $("#lastShowPage").prop("disabled", false);
                    }
                    if (deletePage >= pageNumber) {
                        $("#nextPage").prop("disabled", true);
                        $("#previousPage").prop("disabled", false);
                        $("#firstShowPage").prop("disabled", false);
                        $("#lastShowPage").prop("disabled", true);
                    }
                    if ((1 < deletePage) && (deletePage < pageNumber)) {
                        $("#nextPage").prop("disabled", false);
                        $("#previousPage").prop("disabled", false);
                        $("#firstShowPage").prop("disabled", false);
                        $("#lastShowPage").prop("disabled", false);
                    }
                    if ((deletePage == pageNumber) && (pageNumber == 1)) {
                        $("#previousPage").prop("disabled", true);
                        $("#nextPage").prop("disabled", true);
                        $("#firstShowPage").prop("disabled", true);
                        $("#lastShowPage").prop("disabled", true);
                    }

                    //$('#timeRecivingDataFromServer').remove();
                    //this.$el.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");
                }
            };

            Date.prototype.getWeek = function () {
                // Create a copy of this date object
                var target = new Date(this.valueOf());

                // ISO week date weeks start on monday
                // so correct the day number
                var dayNr = (this.getDay() + 6) % 7;

                // ISO 8601 states that week 1 is the week
                // with the first thursday of that year.
                // Set the target date to the thursday in the target week
                target.setDate(target.getDate() - dayNr + 3);

                // Store the millisecond value of the target date
                var firstThursday = target.valueOf();

                // Set the target to the first thursday of the year
                // First set the target to january first
                target.setMonth(0, 1);
                // Not a thursday? Correct the date to the next thursday
                if (target.getDay() != 4) {
                    target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
                }

                // The weeknumber is the number of weeks between the
                // first thursday of the year and the thursday in the target week
                return 1 + Math.ceil((firstThursday - target) / 604800000); // 604800000 = 7 * 24 * 3600 * 1000
            };
            return options;
        }
    };

// Get a list of all the test files to include
Object.keys(window.__karma__.files).forEach(function (file) {
    if (TEST_REGEXP.test(file)) {
        // Normalize paths to RequireJS module names.
        // If you require sub-dependencies of test files to be loaded as-is (requiring file extension)
        // then do not normalize the paths
        var normalizedTestModule = file.replace(/^\/base\/|\.js$/g, '');
        allTestFiles.push(normalizedTestModule);
    }
});

require.config({
    // Karma serves files under /base, which is the basePath from your config file
    baseUrl: '/base',
    urlArgs: 'bust=' + (new Date()).getTime(),
    paths  : {
        models           : './public/js/models',
        collections      : './public/js/collections',
        views            : './public/js/views',
        mixins           : './public/js/mixins',
        services         : './public/js/services',
        templates        : './public/templates',
        helpers          : './public/js/helpers',
        d3               : './public/js/libs/d3.v3.min',
        spinJs           : './public/js/libs/spin.js/spin',
        jQuery           : './public/js/libs/jquery-2.1.0.min.map',
        jqueryui         : './public/js/libs/jquery-ui.min',
        jqueryBarcode    : './public/js/libs/jquery-barcode.min',
        Underscore       : './public/js/libs/underscore-min.map.1.6.0',
        Backbone         : './public/js/libs/backbone-min.map.1.1.2',
        text             : './public/js/libs/text',
        Validation       : './public/js/Validation',
        custom           : './public/js/custom',
        common           : './public/js/common',
        populate         : './public/js/populate',
        constants        : './public/js/constants',
        dataService      : './public/js/dataService',
        tracker          : './public/js/tracker',
        moment           : './public/js/libs/moment/moment',
        router           : './public/js/router',
        async            : './public/js/libs/async/lib/async',
        libs             : './public/js/libs',
        chai             : './node_modules/chai/chai',
        'chai-jquery'    : './node_modules/chai-jquery/chai-jquery',
        'sinon-chai'     : './node_modules/sinon-chai/lib/sinon-chai',
        fixtures         : './test/uiSpecs/fixtures',
        images           : './public/images',
        modules          : './constants/test/modules',
        testConstants    : './constants/test',
        dashboardVacation: './constants/test/dashboardVacation',
        filter           : './constants/test/filter',
        filterTest       : './test/uiSpecs/modules/filterTest'
    },
    shim   : {
        jQuery       : {
            exports: '$'
        },
        jqueryui     : {
            deps   : ['jQuery'],
            exports: 'jqueryui'
        },
        'chai-jquery': ['jqueryui', 'chai'],
        Backbone     : ['Underscore', 'jqueryui'],
        Underscore   : {
            exports: '_'
        },
        async        : {
            exports: 'async'
        },
        jqueryBarcode: ['jQuery'],
        d3           : {
            exports: 'd3'
        }
    },
    deps   : allTestFiles,

    // we have to kickoff jasmine, as it is asynchronous
    callback: window.__karma__.start
});
