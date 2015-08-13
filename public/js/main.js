var App = App ||
{
    File: {
        MAXSIZE: 10485760,  //size in kilobytes  = 3 MB
        MaxFileSizeDisplay: "10 MB"
    },
    requestedURL: null,
    Calendar: {
        currentCalendarId: ""
    },
    savedFilters: {}
};

require.config({
    paths: {
        async: './libs/async/lib/async',
        jQuery: './libs/jquery-2.1.0.min.map',
        ajaxForm: './libs/jquery.form',
        imageCrop: './libs/jquery.Jcrop.min',
        jqueryui: './libs/jquery-ui.min',
        Underscore: './libs/underscore-min.map.1.6.0',
        Backbone: './libs/backbone-min.map.1.1.2',
        less: './libs/less.min',
        templates: '../templates',
        text: './libs/text',
        common: 'common',
        helpers: 'helpers',
        constants: 'constants',
        dateFormat: './libs/date.format',
        d3: './libs/d3.v3.min',
        jqueryBarcode: './libs/jquery-barcode.min',
        moment: './libs/moment/moment'
    },
    shim: {
        'jqueryui': ['jQuery'],
        'ajaxForm': ['jQuery'],
        'imageCrop': ['jQuery'],
        'Backbone': ['Underscore', 'jQuery'],
        'app': ['Backbone', 'less', 'jqueryui', 'ajaxForm', 'imageCrop'],
        'd3': {
            exports: 'd3'
        },
        'dateFormat': {
            exports: 'dateFormat'
        }
    }
});

require(['app'], function (app) {
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
                    Backbone.history.navigate("login", { trigger: true });
                } else {
                    alert("You do not have permission to perform this action");
                }
            } else {
                if (xhr.responseJSON) {
                    alert(xhr.responseJSON.error);
                } else {
                    Backbone.history.navigate("home", { trigger: true });
                }
            }
        }
    };
    Backbone.View.prototype.pageElementRender = function (totalCount, itemsNumber, currentPage) {
        var itemsNumber = this.defaultItemsNumber;
        $("#itemsNumber").text(itemsNumber);
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

    Backbone.View.prototype.changeLocationHash = function (page, count, filter) {
        var location = window.location.hash;
        var mainLocation = '#easyErp/' + this.contentType + '/' + this.viewType;
        var pId = (location.split('/pId=')[1]) ? location.split('/pId=')[1].split('/')[0] : '';
        if (!page && this.viewType == 'list') {
            page = (location.split('/p=')[1]) ? location.split('/p=')[1].split('/')[0] : 1;
        }

        if (!count) {
            var thumbnails = location.split('thumbnails')[0];
            count = (location.split('/c=')[1]) ? location.split('/c=')[1].split('/')[0] : 50;
            if (thumbnails && count < 50)
                count = 50;
        }
        var url = mainLocation;
        if (pId)
            url += '/pId=' + pId;
        if (page)
            url += '/p=' + page;
        if (count)
            url += '/c=' + count;
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
            } else url += '/filter=empty';
        }

        Backbone.history.navigate(url);
    };

    Backbone.View.prototype.prevP = function (dataObject) {
        this.startTime = new Date();
        var itemsNumber = $("#itemsNumber").text();
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
            count: itemsNumber,
            page: page,
            letter: this.selectedLetter
        };
        if (dataObject) _.extend(serchObject, dataObject);
        this.collection.showMore(serchObject);
        this.changeLocationHash(page, itemsNumber);
    };

    Backbone.View.prototype.nextP = function (dataObject) {
        this.startTime = new Date();
        var itemsNumber = $("#itemsNumber").text();
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
            count: itemsNumber,
            page: page,
            letter: this.selectedLetter
        };

        if (dataObject) _.extend(serchObject, dataObject);
        this.collection.showMore(serchObject);
        this.changeLocationHash(page, itemsNumber);
    };

    Backbone.View.prototype.firstP = function (dataObject) {
        this.startTime = new Date();
        var itemsNumber = $("#itemsNumber").text();
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
            count: itemsNumber,
            page: page,
            letter: this.selectedLetter
        };
        if (dataObject) _.extend(serchObject, dataObject);
        this.collection.showMore(serchObject);
        this.changeLocationHash(page, itemsNumber);
    };

    Backbone.View.prototype.lastP = function (dataObject) {
        this.startTime = new Date();
        var itemsNumber = $("#itemsNumber").text();
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
            count: itemsNumber,
            page: page,
            letter: this.selectedLetter
        };
        if (dataObject) _.extend(serchObject, dataObject);
        this.collection.showMore(serchObject);
        this.changeLocationHash(page, itemsNumber);
    };

    Backbone.View.prototype.showP = function (event, dataObject) {
        this.startTime = new Date();
        if (this.listLength == 0) {
            $("#currentShowPage").val(0);
        } else {
            var itemsNumber = $("#itemsNumber").text();
            var page = parseInt(event.target.textContent);
            if (!page) {
                page = $(event.target).val();
            }
            var adr = /^\d+$/;
            var lastPage = parseInt($('#lastPage').text());
            var itemsNumber = $("#itemsNumber").text();
            if (!adr.test(page) || (parseInt(page) <= 0) || (parseInt(page) > parseInt(lastPage))) {
                page = 1;
            }
            //number page show (Vasya)
            var itemsOnPage = 7;
            $("#pageList").empty();
            if (parseInt(lastPage) <= itemsOnPage) {
                for (var i = 1; i <= parseInt(lastPage) ; i++) {
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
                for (var i = lastPage - 6; i <= parseInt(lastPage) ; i++) {
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
                count: itemsNumber,
                page: page,
                letter: this.selectedLetter
            };
            if (dataObject) _.extend(serchObject, dataObject);
            this.collection.showMore(serchObject);
            this.changeLocationHash(page, itemsNumber);
        }
    };

    Backbone.View.prototype.deleteRender = function (deleteCounter, deletePage, dataObject) {
        this.startTime = new Date();
        $("#top-bar-deleteBtn").hide();
        var itemsNumber = parseInt($("#itemsNumber").text());
        var pageNumber;
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
                    page: deletePage
                };
                if (dataObject) _.extend(serchObject, dataObject);
                this.collection.showMore(serchObject);
                this.changeLocationHash(deletePage, itemsNumber);
            }
            $('#check_all').prop('checked', false);
        } else {
            var newFetchModels = new this.contentCollection({
                viewType: 'list',
                sort: this.sort,
                page: deletePage,
                count: this.defaultItemsNumber,
                filter: this.filter,
                parrentContentId: this.parrentContentId,
                contentType: this.contentType,
                newCollection: this.newCollection
            });
            var that = this;
            newFetchModels.bind('reset', function () {
                that.collection.add(newFetchModels.models, { merge: true });
                that.showMoreContent(that.collection);//added two parameters page and items number
            });
            
            $("#grid-start").text((deletePage - 1) * itemsNumber + 1);
            if (itemsNumber === this.collectionLength && (deletePage * this.collectionLength <= this.listLength))
                $("#grid-end").text(deletePage * itemsNumber);
            else
                $("#grid-end").text((deletePage - 1) * itemsNumber + this.collectionLength - deleteCounter);
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

    app.initialize();
    app.applyDefaults();
});
