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
            contentType: CONSTANTS.INVOICE,
            template: _.template(ContentTopBarTemplate),

            events: {
                "click a.changeContentView": 'changeContentViewType',
                "click #top-bar-deleteBtn": "deleteEvent",
                "click #top-bar-editBtn": "editEvent",
                "click #top-bar-createBtn": "createEvent"
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

            render: function () {
                $('title').text(this.contentType);

                var viewType = Custom.getCurrentVT();
                var self = this;

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

                this.$el.html(this.template({ viewType: viewType, contentType: this.contentType }));

                Common.displayControlBtnsByActionType('Content', viewType);
                return this;
            },

            checkDbValue: function (dbName) {
                if (dbName === 'weTrack') {
                    this.hideSaveCancelBtns();
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
                var answer = confirm("Realy DELETE items ?!");
                if (answer == true) this.trigger('deleteEvent');
            }
        });

        return TopBarView;
    });
