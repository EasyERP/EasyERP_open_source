define([
    'Backbone',
    'jQuery',
    'Underscore',
    'common',
    'custom',
    'views/Notes/AttachView'
], function (Backbone, $, _, Common, Custom, AttachView) {
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
        },

        exportToXlsx: function (event) {
            event.preventDefault();
            this.trigger('exportToXlsx');
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
        },

        onDiscardEvent: function (event) {
            event.preventDefault();
            Backbone.history.navigate('home/content-' + this.contentType, {trigger: true});
        },

        onEditEvent: function (event) {
            event.preventDefault();
            this.trigger('editEvent');
        },

        onSaveEvent: function (event) {
            event.preventDefault();

            this.trigger('saveEvent');
        },

        onDeleteEvent: function (event) {
            event.preventDefault();
            this.trigger('deleteEvent');
        },

        onEditKanban: function (event) {
            event.preventDefault();
            this.trigger('editKanban');
        },

        moveToEdit: function (event) {
            event.preventDefault();
            this.trigger('moveToEdit');
        },

        onSaveAllEvent: function (event) {
            event.preventDefault();
            this.trigger('saveAllEvent');
        },

        onRemoveAllEvent: function (event) {
            event.preventDefault();
            this.trigger('removeAllEvent');
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
