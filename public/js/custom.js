define([
    'libs/date.format',
    'common',
    'constants',
    'dataService',
    'moment'
], function (dateformat, common, CONTENT_TYPES, dataService, moment) {

    var runApplication = function (success) {
        if (!Backbone.history.fragment) {
            Backbone.history.start({silent: true});
        }
        if (success) {
            var url = (App.requestedURL === null) ? Backbone.history.fragment : App.requestedURL;
            if ((url === "") || (url === "login")) url = 'easyErp';

            Backbone.history.fragment = "";
            Backbone.history.navigate(url, {trigger: true});
            getFiltersValues();

        } else {
            if (App.requestedURL === null)
                App.requestedURL = Backbone.history.fragment;
            Backbone.history.fragment = "";
            Backbone.history.navigate("login", {trigger: true});
        }
    };

    var changeContentViewType = function (event, contentType, collection) {

        event.preventDefault();
        if (contentType) {
            this.contentType = contentType;
        }
        var windowLocHash = window.location.hash.split('/')[3];
        var id;
        if (typeof windowLocHash != "undefined" && windowLocHash.length == 24) {
            id = windowLocHash;
        }
        var viewtype = $(event.target).attr('data-view-type'),
            url = "#easyErp/" + this.contentType + "/" + viewtype;

        if (id) {
            if (viewtype != "list" && (viewtype != "thumbnails")) {
                url += "/" + id;
            }
            if (collection) collection.setElement(id);
        } else {

            if (viewtype == "form" && collection) {
                var model = collection.getElement();
                url += "/" + model.attributes._id;
            }
        }

        App.ownContentType = true;

        Backbone.history.navigate(url, {trigger: true});
    };

    var getCurrentVT = function (option) {
        var viewType;
        if (option && (option.contentType != App.contentType)) {
            App.ownContentType = false;
        }
        if (App.currentViewType == null) {
            if (option) {
                switch (option.contentType) {
                    case CONTENT_TYPES.DASHBOARD:
                    case CONTENT_TYPES.TASKS:
                    case CONTENT_TYPES.PROFILES:
                    case CONTENT_TYPES.DEPARTMENTS:
                    case CONTENT_TYPES.USERS:
                    case CONTENT_TYPES.JOBPOSITIONS:
                    case CONTENT_TYPES.DEGREES:
                    case CONTENT_TYPES.SOURCEOFAPPLICANTS:
                    case CONTENT_TYPES.LEADS:
                    case CONTENT_TYPES.BIRTHDAYS:
                    case CONTENT_TYPES.LEADSWORKFLOW:
                    case CONTENT_TYPES.MYPROFILE:
                    case CONTENT_TYPES.QUOTATION:
                    case CONTENT_TYPES.ORDER:
                    case CONTENT_TYPES.INVOICE:
                    case CONTENT_TYPES.SUPPLIERPAYMENTS:
                    case CONTENT_TYPES.CUSTOMERPAYMENTS:
                    case CONTENT_TYPES.SALESQUOTATION:
                    case CONTENT_TYPES.SALESORDER:
                    case CONTENT_TYPES.SALESINVOICE:
                    case CONTENT_TYPES.WTRACK:
                    case CONTENT_TYPES.SALARY:
                    case CONTENT_TYPES.MONTHHOURS:
                    case CONTENT_TYPES.BONUSTYPE:
                    case CONTENT_TYPES.HOLIDAY:
                    case CONTENT_TYPES.VACATION:
                        App.currentViewType = 'list';
                        break;
                    case CONTENT_TYPES.APPLICATIONS:
                    case CONTENT_TYPES.OPPORTUNITIES:
                        App.currentViewType = "kanban";
                        break;
                    default:
                        App.currentViewType = "thumbnails";
                        break;
                }
            } else {
                App.currentViewType = "thumbnails";
            }
            return App.currentViewType;
        } else {
            if (option && !App.ownContentType) {
                switch (option.contentType) {
                    case CONTENT_TYPES.DASHBOARD:
                    case CONTENT_TYPES.TASKS:
                    case CONTENT_TYPES.PROFILES:
                    case CONTENT_TYPES.DEPARTMENTS:
                    case CONTENT_TYPES.USERS:
                    case CONTENT_TYPES.JOBPOSITIONS:
                    case CONTENT_TYPES.DEGREES:
                    case CONTENT_TYPES.SOURCEOFAPPLICANTS:
                    case CONTENT_TYPES.LEADS:
                    case CONTENT_TYPES.BIRTHDAYS:
                    case CONTENT_TYPES.LEADSWORKFLOW:
                    case CONTENT_TYPES.MYPROFILE:
                    case CONTENT_TYPES.QUOTATION:
                    case CONTENT_TYPES.ORDER:
                    case CONTENT_TYPES.INVOICE:
                    case CONTENT_TYPES.SUPPLIERPAYMENTS:
                    case CONTENT_TYPES.CUSTOMERPAYMENTS:
                    case CONTENT_TYPES.SALESQUOTATION:
                    case CONTENT_TYPES.SALESORDER:
                    case CONTENT_TYPES.SALESINVOICE:
                    case CONTENT_TYPES.WTRACK:
                    case CONTENT_TYPES.SALARY:
                    case CONTENT_TYPES.MONTHHOURS:
                    case CONTENT_TYPES.BONUSTYPE:
                    case CONTENT_TYPES.HOLIDAY:
                    case CONTENT_TYPES.VACATION:
                        App.currentViewType = 'list';
                        break;
                    case CONTENT_TYPES.APPLICATIONS:
                    case CONTENT_TYPES.OPPORTUNITIES:
                        App.currentViewType = "kanban";
                        break;
                    default:
                        App.currentViewType = "thumbnails";
                        break;
                }
            }
        }

        var viewVariants = ["kanban", "list", "form", "thumbnails"];
        if ($.inArray(App.currentViewType, viewVariants) === -1) {
            App.currentViewType = "thumbnails";
            viewType = "thumbnails";
        } else {
            viewType = App.currentViewType;
        }
        return viewType;
    };

    var setCurrentVT = function (viewType) {
        var viewVariants = ["kanban", "list", "form", "thumbnails"];

        if (viewVariants.indexOf(viewType) != -1) {
            App.currentViewType = viewType;
        } else {
            viewType = "thumbnails";
            App.currentViewType = viewType;
        }

        return viewType;
    };

    var getCurrentCL = function () {
        if (App.currentContentLength == null) {
            App.currentContentLength = 0;
            return App.currentContentLength;
        }

        var testLength = new RegExp(/^[0-9]{1}[0-9]*$/), contentLength;
        if (testLength.test(App.currentContentLength) == false) {
            App.currentContentLength = 0;
            contentLength = 0;
        } else {
            contentLength = App.currentContentLength;
        }
        return contentLength;
    };

    var setCurrentCL = function (length) {
        var testLength = new RegExp(/^[0-9]{1}[0-9]*$/);

        if (testLength.test(length) == false)
            length = 0;
        App.currentContentLength = length;

        return length;
    };


    function applyDefaultSettings(chartControl) {
        chartControl.setImagePath("/crm_backbone_repo/images/");
        chartControl.setEditable(false);
        chartControl.showTreePanel(false);
        chartControl.showContextMenu(false);
        chartControl.showDescTask(true, 'd,s-f');
        chartControl.showDescProject(true, 'n,d');
    };

    function cashToApp(key, data) {
        App.cashedData = App.cashedData || {};
        App.cashedData[key] = data;
    }

    function retriveFromCash(key) {
        App.cashedData = App.cashedData || {};
        return App.cashedData[key];
    }

    var savedFilters = function (contentType, uIFilter) {
        var savedFilter;
        var length;
        var filtersForContent;
        var key;
        var filter;
        var beName;
        var beNamesNaw;
        var filterWithName;

        //if (App && App.savedFilters && App.savedFilters[contentType]) {
        //    filtersForContent = App.savedFilters[contentType];
        //    length = filtersForContent.length;
        //    filter = filtersForContent[length - 1];
        //    filterWithName =  filter['filter'];
        //    var key = Object.keys(filterWithName)[0];
        //
        //    savedFilter = filter[key];
        //} else {
        savedFilter = uIFilter;
        // }

        return savedFilter;
    };

    var getFilterById = function (id, contentType) {
        var filter;
        var length;
        var keys;
        var savedFilters;

        dataService.getData('/currentUser', null, function (response) {
            if (response && !response.error) {
                App.currentUser = response.user;
                App.savedFilters = response.savedFilters;

                length = App.savedFilters[contentType].length;
                savedFilters = App.savedFilters[contentType];
                for (var i = length - 1; i >= 0; i--) {
                    if (savedFilters[i]['_id'] === id) {
                        keys = Object.keys(savedFilters[i]['filter']);
                        App.filter = savedFilters[i]['filter'][keys[0]];
                        return App.filter;
                    }
                }
            } else {
                console.log('can\'t fetch currentUser');
            }
        });
    };

    var getFiltersForContentType = function (contentType) {
        var length = App.currentUser.savedFilters.length;
        var filtersForContent = [];
        var filterObj = {};
        var savedFiltersArray = App.currentUser.savedFilters;

        for (var i = length - 1; i >= 0; i--) {
            if (savedFiltersArray[i]['contentView'] === contentType) {
                filterObj = {};
                filterObj._id = savedFiltersArray[i]['_id'];
                filterObj.value = savedFiltersArray[i]['filter'][0];
                filtersForContent.push(filterObj);
            }
        }

        App.savedFilters[contentType] = filtersForContent;
        return filtersForContent;
    };

    var getFiltersValues = function () {
        if (!App || !App.filtersValues) {
            dataService.getData('/filter/getFiltersValues', null, function (response) {
                if (response && !response.error) {
                    App.filtersValues = response;
                } else {
                    console.log('can\'t fetch filtersValues');
                }
            });
        }
    };

    var getWeeks = function(month, year){
        var result = [];
        var startWeek;
        var endWeek;
        var diff;
        var isoWeeks = moment(year).isoWeeksInYear();
        var startDate = moment([year, parseInt(month) - 1]);
        var endDate = moment([year, parseInt(month), -1 + 1]);

        startWeek = moment(startDate).isoWeeks();
        endWeek = moment(endDate).isoWeeks();

        diff = endWeek - startWeek;

        if (diff < 0){
            diff = isoWeeks - startWeek;

            for (var i = diff; i >=0; i--){
                result.push(isoWeeks - i);
            }
        } else {
            for (var i = diff; i >=0; i--){
                result.push(endWeek - i);
            }
        }



        return result;
    };

    return {
        runApplication: runApplication,
        changeContentViewType: changeContentViewType,
        //getCurrentII: getCurrentII,
        //setCurrentII: setCurrentII,
        getCurrentVT: getCurrentVT,
        setCurrentVT: setCurrentVT,
        getCurrentCL: getCurrentCL,
        setCurrentCL: setCurrentCL,
        cashToApp: cashToApp,
        retriveFromCash: retriveFromCash,
        savedFilters: savedFilters,
        getFiltersForContentType: getFiltersForContentType,
        getFilterById: getFilterById,
        getWeeks: getWeeks
    };
});
