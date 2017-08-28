define([
    'Backbone',
    'jQuery',
    'Underscore',
    // '../listViewBase',
    'views/dialogViewBase',
    'views/guideTours/guideNotificationView',
    'dataService',
    'text!templates/guideTours/listTemplate.html',
    'text!templates/guideTours/notificationTemplate.html',
    'constants/guideTours'
], function (Backbone, $, _, Parent, NotifyView, dataService, template, notifyTemplate, GUIDES) {
    'use strict';

    var ContentView = Parent.extend({
        template  : _.template(template),
        el        : '.guideTour',
        tId       : null,
        tStep     : null,
        initialize: function () {

            this.render();
        },

        events: {
            'click .guideList': 'createView'
        },

        createView: function (e) {
            if (App.notifyView) {
                App.notifyView.undelegateEvents();
                App.notifyView.stopListening();
            }

            this.remove();

            App.notifyView = new NotifyView({e: e, data: null});
        },

        render: function () {
            var formString = this.template({data: GUIDES});

            this.$el = $(formString).dialog({
                dialogClass: 'create-dialog',
                title      : 'Create Employee',
                width      : '1015px',

                buttons: [
                    {
                        text : 'Close',
                        class: 'btn',
                        icon : 'ui-icon-heart',
                        click: function () {
                            $(this).dialog('close');
                        }

                    }
                ]
            });

            this.delegateEvents(this.events);

            return this;
        }
    });

    return ContentView;
});

