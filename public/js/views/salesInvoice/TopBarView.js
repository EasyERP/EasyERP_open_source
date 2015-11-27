define([
        'text!templates/Invoice/TopBarTemplate.html',
        'custom',
        'common',
        'constants',
        'dataService'
],
    function (ContentTopBarTemplate, Custom, Common, CONSTANTS, dataService) {
        var TopBarView = Backbone.View.extend({
            el: '#top-bar',
            contentType: CONSTANTS.SALESINVOICE,
            template: _.template(ContentTopBarTemplate),

            events: {
                "click a.changeContentView": 'changeContentViewType',
                "click #top-bar-deleteBtn": "deleteEvent",
                "click #top-bar-editBtn": "editEvent",
                "click #top-bar-createBtn": "createEvent",
                "click #top-bar-saveBtn": "saveEvent"
            },

            changeContentViewType: function (e) {
                Custom.changeContentViewType(e, this.contentType, this.collection);
            },

            initialize: function (options) {
                if (options.collection)
                    this.collection = options.collection;
                this.render();
            },

            createEvent: function (event) {
                event.preventDefault();
                this.trigger('createEvent');
            },

            saveEvent: function (event) {
                event.preventDefault();
                this.trigger('saveEvent');
            },

            render: function () {
                $('title').text("Invoice");

                var viewType = Custom.getCurrentVT();
                var self = this;

                this.$el.html(this.template({ viewType: viewType, contentType: this.contentType }));

                Common.displayControlBtnsByActionType('Content', viewType);

                if (!App || !App.currentDb) {
                    dataService.getData('/currentDb', null, function (response) {
                        if (response && !response.error) {
                            App.currentDb = response;
                            self.checkDbValue(App.currentDb);
                        } else {
                            console.log('can\'t fetch current db');
                        }
                    });
                } else {
                    this.checkDbValue(App.currentDb);
                }

                return this;
            },

            checkDbValue: function (dbName) {
                if ((dbName === CONSTANTS.WTRACK_DB_NAME) || (dbName === "production") || (dbName === "development")) {
                    this.hideSaveCancelBtns();
                    App.weTrack = true;
                } else {
                    App.weTrack = false;
                }
            },

            hideSaveCancelBtns: function () {
                var createBtnEl = $('#top-bar-createBtn');
                var saveBtnEl = $('#top-bar-saveBtn');
                var cancelBtnEl = $('#top-bar-deleteBtn');

                createBtnEl.hide();
                saveBtnEl.hide();
                cancelBtnEl.hide();

                return false;
            },

            editEvent: function (event) {
                event.preventDefault();
                this.trigger('editEvent');
            },

            deleteEvent: function (event) {
                event.preventDefault();
                var answer = confirm("Really DELETE items ?!");
                if (answer == true) this.trigger('deleteEvent');
            }
        });

        return TopBarView;
    });
