define([
    'Backbone',
    'Underscore',
    'jQuery',
    'common',
    'constants',
    'dataService',
    'moment',
    'helpers/ga',
    'constants/googleAnalytics'
], function (Backbone, _, $, common, CONTENT_TYPES, dataService, moment, ga, GA) {
    'use strict';

    var Store = function () {
        this.save = function (name, data) {
            localStorage.setItem(name, JSON.stringify(data));
        };
        this.find = function (name) {
            var store = localStorage.getItem(name);
            return (store && store !== 'undefined' && JSON.parse(store)) || null;
        };
        this.remove = function (name) {
            localStorage.removeItem(name);
        };
        this.clear = function () {
            localStorage.clear();
        };
    };

    var runApplication = function (success) {
        var location = window.location.hash;
        var regExp = /password|home|ir_hash/;
        var url;

        if (!Backbone.History.started) {
            Backbone.history.start({silent: true});
        }

        if (success) {
            url = (App.requestedURL === null) ? Backbone.history.fragment : App.requestedURL;
            if ((url === '') || url === 'login' || regExp.test(url)) {
                url = 'easyErp';
            }

            if (!App.currentDb) {
                App.currentDb = App.storage.find('currentDb');
            }

            Backbone.history.fragment = '';
            Backbone.history.navigate(url, {trigger: true});
        } else {
            if (App.requestedURL === null) {
                App.requestedURL = Backbone.history.fragment;
            }
            Backbone.history.fragment = '';

            if (regExp.test(location)) {
                url = location;
            } else {
                url = 'login';
            }

            Backbone.history.navigate(url, {trigger: true});
        }
    };

    var changeContentViewType = function (event, contentType, collection) {
        var windowLocation = window.location.hash;
        var windowLocHash = windowLocation.split('/')[3];
        var browserFilter = windowLocation.split('/filter=')[1];
        var id;
        var viewType;
        var url;
        var filter;
        var kanbanFilter = browserFilter ? JSON.parse(decodeURIComponent(browserFilter)) : null;
        var model;

        event.preventDefault();

        if (contentType) {
            this.contentType = contentType;
        }

        if (windowLocHash !== undefined && windowLocHash.length === 24) {
            id = windowLocHash;
        }

        viewType = $(event.target).attr('data-view-type');
        url = '#easyErp/' + this.contentType + '/' + viewType + (browserFilter ? '/filter=' + browserFilter : '');

        if (id) {
            if (viewType !== 'list' && (viewType !== 'thumbnails')) {
                url += '/' + id;
            }
            if (collection) {
                collection.setElement(id);
            }
        } else {

            if (viewType === 'form' && collection) {
                model = collection.getElement();
                url += '/' + model.attributes._id;
            }
        }

        if (id && (viewType === 'list') && (this.contentType === 'Tasks')) {
            filter = {
                project: {
                    key  : 'project._id',
                    value: [id]
                }
            };

            url += '/filter=' + encodeURIComponent(JSON.stringify(filter));
        } else if (kanbanFilter && (viewType === 'kanban') && (this.contentType === 'Tasks')) {
            if (kanbanFilter.project) {
                url = '#easyErp/' + this.contentType + '/' + viewType + '/' + kanbanFilter.project.value[0];
            } else {
                url = '#easyErp/' + this.contentType + '/' + viewType;
            }
        }

        App.ownContentType = true;

        Backbone.history.navigate(url, {trigger: true});

        ga && ga.event({
            eventCategory: GA.EVENT_CATEGORIES.USER_ACTION,
            eventLabel   : GA.EVENT_LABEL.SETTED_VIEW_TYPE + ' "' + viewType + '"'
        });
    };

    var getCurrentVT = function (option) {
        var viewType;
        var savedFilter;
        var viewVariants;
        var j;

        if (option && (option.contentType !== App.contentType)) {
            App.ownContentType = false;
        }
        if (App.currentViewType === null) {
            if (option) {
                switch (option.contentType) {
                    case CONTENT_TYPES.PRICELISTS:
                    case CONTENT_TYPES.PRODUCTTYPE:
                    case CONTENT_TYPES.PRODUCTS:
                    case CONTENT_TYPES.PRODUCTS_SETTINGS:
                    case CONTENT_TYPES.IMPORT:
                    case CONTENT_TYPES.DASHBOARD:
                    case CONTENT_TYPES.TASKS:
                    case CONTENT_TYPES.PROFILES:
                    case CONTENT_TYPES.DEPARTMENTS:
                    case CONTENT_TYPES.INVOICE:
                    case CONTENT_TYPES.USERS:
                    case CONTENT_TYPES.JOBPOSITIONS:
                    case CONTENT_TYPES.DEGREES:
                    case CONTENT_TYPES.WRITEOFF:
                    case CONTENT_TYPES.STOCKCORRECTIONS:
                    case CONTENT_TYPES.SOURCEOFAPPLICANTS:
                    case CONTENT_TYPES.LEADS:
                    case CONTENT_TYPES.GOODSOUTNOTES:
                    case CONTENT_TYPES.BIRTHDAYS:
                    case CONTENT_TYPES.INVENTORYREPORT:
                    case CONTENT_TYPES.LEADSWORKFLOW:
                    case CONTENT_TYPES.MYPROFILE:
                    case CONTENT_TYPES.QUOTATIONS:
                    case CONTENT_TYPES.ORDERS:
                    case CONTENT_TYPES.INVOICES:
                    case CONTENT_TYPES.SUPPLIERPAYMENTS:
                    case CONTENT_TYPES.CUSTOMERPAYMENTS:
                    case CONTENT_TYPES.SALESQUOTATIONS:
                    case CONTENT_TYPES.SALESORDERS:
                    case CONTENT_TYPES.SALESINVOICES:
                    case CONTENT_TYPES.WTRACK:
                    case CONTENT_TYPES.PAYROLLEXPENSES:
                    case CONTENT_TYPES.MONTHHOURS:
                    case CONTENT_TYPES.BONUSTYPE:
                    case CONTENT_TYPES.STOCKTRANSACTIONS:
                    case CONTENT_TYPES.HOLIDAY:
                    case CONTENT_TYPES.VACATION:
                    case CONTENT_TYPES.CAPACITY:
                    case CONTENT_TYPES.JOBSDASHBOARD:
                    case CONTENT_TYPES.PAYROLLPAYMENTS:
                    case CONTENT_TYPES.INVOICEAGING:
                    case CONTENT_TYPES.CHARTOFACCOUNT:
                    case CONTENT_TYPES.JOURNAL:
                    case CONTENT_TYPES.STOCKINVENTORY:
                    case CONTENT_TYPES.TRIALBALANCE:
                    case CONTENT_TYPES.SALARYREPORT:
                    case CONTENT_TYPES.PROFITANDLOSS:
                    case CONTENT_TYPES.BALANCESHEET:
                    case CONTENT_TYPES.CASHFLOW:
                    case CONTENT_TYPES.ORDER:
                    case CONTENT_TYPES.CLOSEMONTH:
                    case CONTENT_TYPES.SALESPROFORMA:
                    case CONTENT_TYPES.EXPENSESINVOICE:
                    case CONTENT_TYPES.EXPENSESPAYMENTS:
                    case CONTENT_TYPES.DIVIDENDINVOICE:
                    case CONTENT_TYPES.DIVIDENDPAYMENTS:
                    case CONTENT_TYPES.PURCHASEPAYMENTS:
                    case CONTENT_TYPES.PROFORMA:
                    case CONTENT_TYPES.CASHBOOK:
                    case CONTENT_TYPES.CASHTRANSFER:
                    case CONTENT_TYPES.REPORTSDASHBOARD:
                    case CONTENT_TYPES.CONTRACTJOBS:
                    case CONTENT_TYPES.PROJECTSDASHBOARD:
                    case CONTENT_TYPES.MANUALENTRY:
                    case CONTENT_TYPES.PURCHASEORDERS:
                    case CONTENT_TYPES.PURCHASEINVOICES:
                    case CONTENT_TYPES.TAXREPORT:
                    case CONTENT_TYPES.WAREHOUSEMOVEMENTS:
                    case CONTENT_TYPES.STOCKRETURNS:
                    case CONTENT_TYPES.MANUFACTURINGORDERS:
                    case CONTENT_TYPES.BILLOFMATERIALS:
                    case CONTENT_TYPES.WORKCENTERS:
                    case CONTENT_TYPES.ROUTINGS:
                        App.currentViewType = 'list';
                        break;
                    case CONTENT_TYPES.APPLICATIONS:
                    case CONTENT_TYPES.OPPORTUNITIES:
                        App.currentViewType = 'kanban';
                        break;
                    case CONTENT_TYPES.DEALTASKS:
                        App.currentViewType = 'datelist';
                        break;
                    default:
                        App.currentViewType = 'thumbnails';
                        break;
                }
            } else {
                App.currentViewType = 'thumbnails';
            }
            return App.currentViewType;
        } else {
            if (option && !App.ownContentType) {
                switch (option.contentType) {
                    case CONTENT_TYPES.PRICELISTS:
                    case CONTENT_TYPES.PRODUCTTYPE:
                    case CONTENT_TYPES.PRODUCTS:
                    case CONTENT_TYPES.PRODUCTS_SETTINGS:
                    case CONTENT_TYPES.IMPORT:
                    case CONTENT_TYPES.DASHBOARD:
                    case CONTENT_TYPES.TASKS:
                    case CONTENT_TYPES.PROFILES:
                    case CONTENT_TYPES.INVENTORYREPORT:
                    case CONTENT_TYPES.DEPARTMENTS:
                    case CONTENT_TYPES.USERS:
                    case CONTENT_TYPES.JOBPOSITIONS:
                    case CONTENT_TYPES.STOCKINVENTORY:
                    case CONTENT_TYPES.DEGREES:
                    case CONTENT_TYPES.SOURCEOFAPPLICANTS:
                    case CONTENT_TYPES.LEADS:
                    case CONTENT_TYPES.STOCKTRANSACTIONS:
                    case CONTENT_TYPES.WRITEOFF:
                    case CONTENT_TYPES.BIRTHDAYS:
                    case CONTENT_TYPES.LEADSWORKFLOW:
                    case CONTENT_TYPES.MYPROFILE:
                    case CONTENT_TYPES.QUOTATIONS:
                    case CONTENT_TYPES.ORDER:
                    case CONTENT_TYPES.INVOICES:
                    case CONTENT_TYPES.INVOICE:
                    case CONTENT_TYPES.SUPPLIERPAYMENTS:
                    case CONTENT_TYPES.CUSTOMERPAYMENTS:
                    case CONTENT_TYPES.GOODSOUTNOTES:
                    case CONTENT_TYPES.SALESQUOTATIONS:
                    case CONTENT_TYPES.SALESORDERS:
                    case CONTENT_TYPES.SALESINVOICES:
                    case CONTENT_TYPES.ORDERS:
                    case CONTENT_TYPES.WTRACK:
                    case CONTENT_TYPES.PAYROLLEXPENSES:
                    case CONTENT_TYPES.MONTHHOURS:
                    case CONTENT_TYPES.BONUSTYPE:
                    case CONTENT_TYPES.STOCKCORRECTIONS:
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
                    case CONTENT_TYPES.SALESPROFORMA:
                    case CONTENT_TYPES.EXPENSESINVOICE:
                    case CONTENT_TYPES.EXPENSESPAYMENTS:
                    case CONTENT_TYPES.DIVIDENDINVOICE:
                    case CONTENT_TYPES.DIVIDENDPAYMENTS:
                    case CONTENT_TYPES.PURCHASEPAYMENTS:
                    case CONTENT_TYPES.PROFORMA:
                    case CONTENT_TYPES.CASHBOOK:
                    case CONTENT_TYPES.CASHTRANSFER:
                    case CONTENT_TYPES.REPORTSDASHBOARD:
                    case CONTENT_TYPES.CONTRACTJOBS:
                    case CONTENT_TYPES.PROJECTSDASHBOARD:
                    case CONTENT_TYPES.MANUALENTRY:
                    case CONTENT_TYPES.PURCHASEORDERS:
                    case CONTENT_TYPES.PURCHASEINVOICES:
                    case CONTENT_TYPES.TAXREPORT:
                    case CONTENT_TYPES.WAREHOUSEMOVEMENTS:
                    case CONTENT_TYPES.STOCKRETURNS:
                    case CONTENT_TYPES.BILLOFMATERIALS:
                    case CONTENT_TYPES.WORKCENTERS:
                    case CONTENT_TYPES.ROUTING:
                    case CONTENT_TYPES.MANUFACTURINGORDERS:
                        App.currentViewType = 'list';
                        break;
                    case CONTENT_TYPES.DEALTASKS:
                        App.currentViewType = 'datelist';
                        break;
                    case CONTENT_TYPES.APPLICATIONS:
                    case CONTENT_TYPES.OPPORTUNITIES:
                        App.currentViewType = 'kanban';
                        break;
                    default:
                        App.currentViewType = 'thumbnails';
                        break;
                }
            }
        }

        viewVariants = ['kanban', 'list', 'form', 'thumbnails', 'tform', 'datelist'];

        if ($.inArray(App.currentViewType, viewVariants) === -1) {
            App.currentViewType = 'thumbnails';
            viewType = 'thumbnails';
        } else {
            viewType = App.currentViewType;
        }

        return viewType;
    };

    var setCurrentVT = function (viewType) {
        var viewVariants = ['kanban', 'list', 'form', 'thumbnails', 'tform'];

        if (viewVariants.indexOf(viewType) !== -1) {
            App.currentViewType = viewType;
        } else {
            viewType = 'thumbnails';
            App.currentViewType = viewType;
        }
        return viewType;
    };

    var getCurrentCL = function () {
        var testLength;
        var contentLength;

        if (App.currentContentLength === null) {
            App.currentContentLength = 0;
            return App.currentContentLength;
        }

        testLength = new RegExp(/^[0-9]{1}[0-9]*$/);

        if (!testLength.test(App.currentContentLength)) {
            App.currentContentLength = 0;
            contentLength = 0;
        } else {
            contentLength = App.currentContentLength;
        }
        return contentLength;
    };

    var setCurrentCL = function (length) {
        var testLength = new RegExp(/^[0-9]{1}[0-9]*$/);

        if (!testLength.test(length)) {
            length = 0;
        }
        App.currentContentLength = length;

        return length;
    };

    function applyDefaultSettings(chartControl) {
        chartControl.setImagePath('/crm_backbone_repo/images/');
        chartControl.setEditable(false);
        chartControl.showTreePanel(false);
        chartControl.showContextMenu(false);
        chartControl.showDescTask(true, 'd,s-f');
        chartControl.showDescProject(true, 'n,d');
    }

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

    // ToDo refactor It
    var savedFilters = function (contentType, uIFilter) {
        var savedFilter;

        savedFilter = uIFilter;

        return savedFilter;
    };

    var getFilterById = function (id, contentType) {
        var filter;
        var length;
        var keys;
        var savedFilters;

        dataService.getData(CONTENT_TYPES.URLS.CURRENT_USER, null, function (response) {
            if (response && !response.error) {
                App.currentUser = response.user;
                App.filtersObject.savedFilters = response.savedFilters;

                length = App.filtersObject.savedFilters[contentType].length;
                savedFilters = App.filtersObject.savedFilters[contentType];
                for (var i = length - 1; i >= 0; i--) {
                    if (savedFilters[i]._id === id) {
                        keys = Object.keys(savedFilters[i].filter);
                        App.filtersObject.filter = savedFilters[i].filter[keys[0]];
                        return App.filtersObject.filter;
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
            if (savedFiltersArray[i].contentView === contentType) {
                filterObj = {};
                filterObj._id = savedFiltersArray[i]._id;
                filterObj.value = savedFiltersArray[i].filter[0];
                filtersForContent.push(filterObj);
            }
        }

        App.filtersObject.savedFilters[contentType] = filtersForContent;
        return filtersForContent;
    };

    var getFiltersValues = function (options, cb) {
        var contentType = options.contentType;
        var locationHash = window.location.hash;
        var filter = locationHash.split('/filter=')[1]; // For startDate & endDate in EmployeeFinder for filters in dashVac

        filter = (filter) ? JSON.parse(decodeURIComponent(filter)) : null;

        dataService.getData('/filter/' + contentType, {filter: filter}, function (response) {
            if (response && !response.error) {
                if (!App.filtersObject) {
                    App.filtersObject = {};
                }

                if (!App.filtersObject.filtersValues) {
                    App.filtersObject.filtersValues = {};
                }

                App.filtersObject.filtersValues[contentType] = response;

                if (cb && typeof cb === 'function') {
                    cb();
                }
            } else {
                console.log('can\'t fetch filtersValues');
            }
        });
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
        var i;

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

        year = parseInt(year, 10);
        month = parseInt(month, 10);

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

            for (i = 0; i <= diff; i++) {
                iterator(i, diff);
            }
        } else {
            for (i = diff; i >= 0; i--) {
                iterator(i, diff);
            }
        }

        return result;
    };

    var getDefSavedFilterForCT = function (contentType) {
        var object = App.filtersObject;
        var savedFiltersObject = object && object.savedFilters ? object.savedFilters[contentType] : [];
        var savedFiltersValues = savedFiltersObject && savedFiltersObject.length ? savedFiltersObject[0].filter : [];
        var defSavedFilter = _.findWhere(savedFiltersValues, {byDefault: true});
        var defSavedFilterValues = defSavedFilter ? defSavedFilter.filters : null;

        if (defSavedFilterValues) {
            App.storage.save(contentType + '.savedFilter', defSavedFilter.name);
        }

        return defSavedFilterValues ? _.extend({}, defSavedFilterValues) : null;
    };

    var getSavedFilterForCT = function (contentType) {
        var savedFilterName = App.storage.find(contentType + '.savedFilter');
        var object = App.filtersObject;
        var savedFiltersObject = object && object.savedFilters ? object.savedFilters[contentType] : [];
        var savedFilters = savedFiltersObject && savedFiltersObject.length ? savedFiltersObject[0].filter : [];
        var savedFilter = _.findWhere(savedFilters, {name: savedFilterName});
        var savedFilterValues = savedFilter ? savedFilter.filters : null;

        return savedFilterValues ? _.extend({}, savedFilterValues) : null;
    };

    App.storage = new Store();
    App.eventsChannel = _.extend({}, Backbone.Events);

    return {
        runApplication          : runApplication,
        changeContentViewType   : changeContentViewType,
        getCurrentVT            : getCurrentVT,
        setCurrentVT            : setCurrentVT,
        getCurrentCL            : getCurrentCL,
        setCurrentCL            : setCurrentCL,
        cacheToApp              : cacheToApp,
        retriveFromCash         : retriveFromCash,
        removeFromCash          : removeFromCash,
        savedFilters            : savedFilters,
        getFiltersForContentType: getFiltersForContentType,
        getFilterById           : getFilterById,
        getWeeks                : getWeeks,
        getFiltersValues        : getFiltersValues,
        getDefSavedFilterForCT  : getDefSavedFilterForCT,
        getSavedFilterForCT     : getSavedFilterForCT,
    };
});
