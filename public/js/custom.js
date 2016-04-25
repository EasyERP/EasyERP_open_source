define([
    'Backbone',
    'Underscore',
    'jQuery',
    'libs/date.format',
    'common',
    'constants',
    'dataService',
    'moment'
], function (Backbone, _, $, dateformat, common, CONTENT_TYPES, dataService, moment) {
    'use strict';

    var Store = function () {
        this.save = function (name, data) {
            localStorage.setItem(name, JSON.stringify(data));
        };
        this.find = function (name) {
            var store = localStorage.getItem(name);

            return (store && JSON.parse(store)) || null;
        };
        this.remove = function (name) {
           localStorage.removeItem(name);
        };
    };

    var runApplication = function (success) {
        if (!Backbone.History.started) {
            Backbone.history.start({silent: true});
        }
        if (success) {
            var url = (App.requestedURL === null) ? Backbone.history.fragment : App.requestedURL;
            if ((url === "") || (url === "login")) {
                url = 'easyErp';
            }

            Backbone.history.fragment = "";
            Backbone.history.navigate(url, {trigger: true});
            getFiltersValues();
        } else {
            if (App.requestedURL === null) {
                App.requestedURL = Backbone.history.fragment;
            }
            Backbone.history.fragment = "";
            Backbone.history.navigate("login", {trigger: true});
        }
    };

    var changeContentViewType = function (event, contentType, collection) {
        event.preventDefault();
        var windowLocation = window.location.hash;
        var windowLocHash = windowLocation.split('/')[3];
        var browserFilter = windowLocation.split('/filter=')[1];
        var id;
        var viewtype;
        var url;

        if (contentType) {
            this.contentType = contentType;
        }

        if (windowLocHash !== undefined && windowLocHash.length === 24) {
            id = windowLocHash;
        }

        viewtype = $(event.target).attr('data-view-type');
        url = "#easyErp/" + this.contentType + "/" + viewtype + (browserFilter ? '/filter=' + browserFilter : '');

        if (id) {
            if (viewtype !== "list" && (viewtype !== "thumbnails")) {
                url += "/" + id;
            }
            if (collection) {
                collection.setElement(id);
            }
        } else {

            if (viewtype === "form" && collection) {
                var model = collection.getElement();
                url += "/" + model.attributes._id;
            }
        }

        App.ownContentType = true;

        Backbone.history.navigate(url, {trigger: true});
    };

    var getCurrentVT = function (option) {
        var viewType;
        var savedFilter;
        var viewVariants;

        if (option && (option.contentType !== App.contentType)) {
            App.ownContentType = false;
        }
        if (App.currentViewType === null) {
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
                    case CONTENT_TYPES.PAYROLLEXPENSES:
                    case CONTENT_TYPES.MONTHHOURS:
                    case CONTENT_TYPES.BONUSTYPE:
                    case CONTENT_TYPES.HOLIDAY:
                    case CONTENT_TYPES.VACATION:
                    case CONTENT_TYPES.CAPACITY:
                    case CONTENT_TYPES.JOBSDASHBOARD:
                    case CONTENT_TYPES.PAYROLLPAYMENTS:
                    case CONTENT_TYPES.INVOICEAGING:
                    case CONTENT_TYPES.CHARTOFACCOUNT:
                    case CONTENT_TYPES.JOURNAL:
                    case CONTENT_TYPES.JOURNALENTRY:
                    case CONTENT_TYPES.TRIALBALANCE:
                    case CONTENT_TYPES.SALARYREPORT:
                    case CONTENT_TYPES.PROFITANDLOSS:
                    case CONTENT_TYPES.BALANCESHEET:
                    case CONTENT_TYPES.CASHFLOW:
                    case CONTENT_TYPES.CLOSEMONTH:
                    case CONTENT_TYPES.PROFORMA:
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
                    case CONTENT_TYPES.PAYROLLEXPENSES:
                    case CONTENT_TYPES.MONTHHOURS:
                    case CONTENT_TYPES.BONUSTYPE:
                    case CONTENT_TYPES.HOLIDAY:
                    case CONTENT_TYPES.VACATION:
                    case CONTENT_TYPES.CAPACITY:
                    case CONTENT_TYPES.JOBSDASHBOARD:
                    case CONTENT_TYPES.PAYROLLPAYMENTS:
                    case CONTENT_TYPES.INVOICEAGING:
                    case CONTENT_TYPES.CHARTOFACCOUNT:
                    case CONTENT_TYPES.JOURNAL:
                    case CONTENT_TYPES.JOURNALENTRY:
                    case CONTENT_TYPES.TRIALBALANCE:
                    case CONTENT_TYPES.SALARYREPORT:
                    case CONTENT_TYPES.PROFITANDLOSS:
                    case CONTENT_TYPES.BALANCESHEET:
                    case CONTENT_TYPES.CASHFLOW:
                    case CONTENT_TYPES.CLOSEMONTH:
                    case CONTENT_TYPES.PROFORMA:
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

        viewVariants = ["kanban", "list", "form", "thumbnails"];

        if ($.inArray(App.currentViewType, viewVariants) === -1) {
            App.currentViewType = "thumbnails";
            viewType = "thumbnails";
        } else {
            viewType = App.currentViewType;
        }

        //for default filter && defaultViewType
        if (option && option.contentType && App.savedFilters[option.contentType]) {
            savedFilter = App.savedFilters[option.contentType];

            for (var j = savedFilter.length - 1; j >= 0; j--) {
                if (savedFilter[j]) {
                    if (savedFilter[j].byDefault === option.contentType) {

                        if (savedFilter[j].viewType) {
                            viewType = savedFilter[j].viewType;
                        }
                    }
                }
            }
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

        if (testLength.test(length) == false) {
            length = 0;
        }
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

    function cacheToApp(key, data, notSaveInLocalStorage) {
        App.cashedData = App.cashedData || {};
        App.cashedData[key] = data;

        if (!notSaveInLocalStorage) {
            App.storage.save(key, data);
        }
    }

    function retriveFromCash(key) {
        App.cashedData = App.cashedData || {};

        return App.cashedData[key] || App.storage.find(key);
    }

    function removeFromCash(key) {
        App.cashedData = App.cashedData || {};

        delete App.cashedData[key];

        return App.storage.remove(key);
    }

    //ToDo refactor It
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

    var getFiltersValues = function (options) {
        var locationHash = window.location.hash;
        var filter = locationHash.split('/filter=')[1];//For startDate & endDate in EmployeeFinder for filters in dashVac

        filter = (filter) ? JSON.parse(decodeURIComponent(filter)) : null;

        if (!App || !App.filtersValues || options) {
            dataService.getData('/filter/getFiltersValues', filter, function (response) {
                if (response && !response.error) {
                    App.filtersValues = response;
                } else {
                    console.log('can\'t fetch filtersValues');
                }
            });
        }
    };

    var getWeeks = function (month, year) {
        var result = [];
        var startWeek;
        var endWeek;
        var diff;
        var isoWeeksInYear;
        var startDate;
        var endDate;
        var daysCount;
        var curWeek;
        var direction = -1;

        function iterator(i, diff) {
            curWeek = endWeek - isoWeeksInYear + i * direction;

            if (i === diff) {
                daysCount = moment(startDate).endOf('isoWeek').date();
            } else if (i === 0) {
                curWeek = endWeek;
                daysCount = (moment(endDate).date() - moment(endDate).startOf('isoWeek').date() + 1);
            } else {
                daysCount = 7;
            }

            result.push({week: curWeek, daysCount: daysCount});
        }

        year = parseInt(year);
        month = parseInt(month);

        isoWeeksInYear = 0;
        startDate = moment([year, month - 1]);
        endDate = moment(startDate).endOf('month');

        startWeek = startDate.isoWeeks();
        endWeek = endDate.isoWeeks();

        diff = endWeek - startWeek;

        if (diff < 0) {
            direction = 1;
            isoWeeksInYear = moment().year(year - 1).isoWeeksInYear();
            diff += startWeek;
            endWeek = startWeek;

            for (var i = 0; i <= diff; i++) {
                iterator(i, diff);
            }
        } else {
            for (var i = diff; i >= 0; i--) {
                iterator(i, diff);
            }
        }

        return result;
    };

    App.storage = new Store();

    return {
        runApplication: runApplication,
        changeContentViewType: changeContentViewType,
        getCurrentVT: getCurrentVT,
        setCurrentVT: setCurrentVT,
        getCurrentCL: getCurrentCL,
        setCurrentCL: setCurrentCL,
        cacheToApp: cacheToApp,
        retriveFromCash: retriveFromCash,
        removeFromCash: removeFromCash,
        savedFilters: savedFilters,
        getFiltersForContentType: getFiltersForContentType,
        getFilterById: getFilterById,
        getWeeks: getWeeks,
        getFiltersValues: getFiltersValues
    };
});
