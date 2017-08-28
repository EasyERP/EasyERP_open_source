define([
    'Backbone',
    'jQuery',
    'Underscore',
    'common',
    'custom',
    'views/Notes/AttachView',
    'helpers/ga',
    'constants/googleAnalytics'
], function (Backbone, $, _, Common, Custom, AttachView, ga, GA) {
    'use strict';
    var TopBarView = Backbone.View.extend({
        el        : '#top-bar',
        actionType: null, // Content, Edit, Create

        events: {
            'click a.changeContentView'     : 'onChangeContentViewType',
            'click ul.changeContentIndex a' : 'onChangeItemIndex',
            'click #top-bar-nextBtn'        : 'onNextEvent',
            'click #top-bar-deleteBtn'      : 'onDeleteEvent',
            'click #top-bar-createBtn'      : 'onCreateEvent',
            'click #top-bar-discardBtn'     : 'onDiscardEvent',
            'click #top-bar-editBtn'        : 'onEditEvent',
            'click #top-bar-edit'           : 'onEditListEvent',
            'click #top-bar-saveBtn'        : 'onSaveEvent',
            'click #kanban-settings-Btn'    : 'onEditKanban',
//            'click #top-bar-importBtn'      : 'importEvent',
            'click #top-bar-exportBtn'      : 'export',
            'click #top-bar-exportToCsvBtn' : 'exportToCsv',
            'click #top-bar-exportToXlsxBtn': 'exportToXlsx',
            'change .inputAttach'           : 'importFiles',
            'click #top-bar-moveToEditBtn'  : 'moveToEdit',
            'click #top-bar-saveAllBtn'     : 'onSaveAllEvent',
            'click #top-bar-removeAllBtn'   : 'onRemoveAllEvent'
        },

        initialize: function (options) {
            this.actionType = options.actionType || 'Content';
            this.dashboardName = options.name || '';
            this.dashboardDescription = options.description || '';

            this.render();
        },

        exportToCsv: function (event) {
            event.preventDefault();
            this.trigger('exportToCsv');

            ga && ga.event({
                eventCategory: GA.EVENT_CATEGORIES.USER_ACTION,
                eventLabel   : GA.EVENT_LABEL.EXPORT_TO_CSV
            });
        },

        exportToXlsx: function (event) {
            event.preventDefault();
            this.trigger('exportToXlsx');

            ga && ga.event({
                eventCategory: GA.EVENT_CATEGORIES.USER_ACTION,
                eventLabel   : GA.EVENT_LABEL.EXPORT_TO_XLSX
            });
        },

        importEvent: function (event) {
            event.preventDefault();
            this.$el.find('#forImport').html(this.importTemplate);
            this.$el.find('#inputAttach').click();
            this.trigger('importEvent');
        },

        importFiles: function (e) {
            var importFile = new AttachView({});
            this.import = true;
            importFile.sendToServer(e, null, this);
        },

        onChangeContentViewType: function (e) {
            e.preventDefault();
            e.stopPropagation();
            Custom.changeContentViewType(e, this.contentType, this.collection);
        },

        onChangeItemIndex: function (e) {
            var actionType = 'Content';

            Custom.changeItemIndex(e, actionType, this.contentType, this.collection);
        },

        onNextEvent: function (event) {
            event.preventDefault();
            this.trigger('nextEvent');
        },

        onCreateEvent: function (event) {
            event.preventDefault();
            this.trigger('createEvent');

            ga && ga.event({
                eventCategory: GA.EVENT_CATEGORIES.USER_ACTION,
                eventLabel   : GA.EVENT_LABEL.CREATE_BTN
            });
        },

        onDiscardEvent: function (event) {
            event.preventDefault();
            Backbone.history.navigate('home/content-' + this.contentType, {trigger: true});
        },

        onEditEvent: function (event) {
            event.preventDefault();
            this.trigger('editEvent');
        },

        onEditListEvent: function (event) {
            event.preventDefault();
            this.trigger('editEvent');
        },

        onSaveEvent: function (event) {
            event.preventDefault();

            this.trigger('saveEvent');
            ga && ga.event({
                eventCategory: GA.EVENT_CATEGORIES.USER_ACTION,
                eventLabel   : GA.EVENT_LABEL.SAVE_BTN
            });
        },

        onDeleteEvent: function (event) {
            event.preventDefault();
            this.trigger('deleteEvent');

            ga && ga.event({
                eventCategory: GA.EVENT_CATEGORIES.USER_ACTION,
                eventLabel   : GA.EVENT_LABEL.DELETE_BTN
            });
        },

        onEditKanban: function (event) {
            event.preventDefault();
            this.trigger('editKanban');

            ga && ga.event({
                eventCategory: GA.EVENT_CATEGORIES.USER_ACTION,
                eventLabel   : GA.EVENT_LABEL.SETTINGS_BTN
            });
        },

        moveToEdit: function (event) {
            event.preventDefault();
            this.trigger('moveToEdit');

            ga && ga.event({
                eventCategory: GA.EVENT_CATEGORIES.USER_ACTION,
                eventLabel   : GA.EVENT_LABEL.MOVE_TO_EDIT
            });
        },

        onSaveAllEvent: function (event) {
            event.preventDefault();
            this.trigger('saveAllEvent');

            ga && ga.event({
                eventCategory: GA.EVENT_CATEGORIES.USER_ACTION,
                eventLabel   : GA.EVENT_LABEL.SAVE_ALL_BTN
            });
        },

        onRemoveAllEvent: function (event) {
            event.preventDefault();
            this.trigger('removeAllEvent');

            ga && ga.event({
                eventCategory: GA.EVENT_CATEGORIES.USER_ACTION,
                eventLabel   : GA.EVENT_LABEL.REMOVE_ALL_BTN
            });
        },

        render: function (options) {
            var viewType = Custom.getCurrentVT();
            var title = this.contentHeader || this.contentType;

            $('title').text(title.toUpperCase());

            if (viewType && viewType === 'tform') {
                this.$el.addClass('position');
            } else {
                this.$el.removeClass('position');
            }

            if (!options || !options.hide) {
                this.$el.html(this.template({
                    viewType            : viewType,
                    contentType         : this.contentType,
                    headerType          : this.headerType,
                    contentHeader       : this.contentHeader,
                    dashboardName       : this.dashboardName,
                    dashboardDescription: this.dashboardDescription
                }));
            } else {
                this.$el.html('');
            }
            Common.displayControlBtnsByActionType(this.actionType, viewType);

            return this;
        }
    });

    TopBarView.extend = function (childView) {
        var view = Backbone.View.extend.apply(this, arguments);

        view.prototype.events = _.extend({}, this.prototype.events, childView.events);

        return view;
    };

    return TopBarView;
});
