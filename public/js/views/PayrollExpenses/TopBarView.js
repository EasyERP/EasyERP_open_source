define([
    'Underscore',
    'views/topBarViewBase',
    'text!templates/PayrollExpenses/TopBarTemplate.html',
    'custom',
    'common',
    'constants'
], function (_, BaseView, ContentTopBarTemplate, Custom, Common, CONSTANTS) {
    'use strict';

    var TopBarView = BaseView.extend({
        el           : '#top-bar',
        contentType  : CONSTANTS.PAYROLLEXPENSES,
        contentHeader: 'Payroll Expenses',
        template     : _.template(ContentTopBarTemplate),

        events: {
            'click a.changeContentView'   : 'changeContentViewType',
            'click #top-bar-deleteBtn'    : 'deleteEvent',
            'click #top-bar-saveBtn'      : 'saveEvent',
            'click #top-bar-editBtn'      : 'editEvent',
            'click #top-bar-createBtn'    : 'createEvent',
            'click #top-bar-generate'     : 'generateEvent',
            'click #top-bar-recount'      : 'recountEvent',
            'click #top-bar-recountAll'   : 'recountAllEvent',
            'click #top-bar-copy'         : 'copyEvent',
            'click #topBarPaymentGenerate': 'createPayment'
        },

        initialize: function (options) {
            this.actionType = options.actionType;
            if (this.actionType !== 'Content') {
                Custom.setCurrentVT('form');
            }
            if (options.collection) {
                this.collection = options.collection;
                this.collection.bind('reset', _.bind(this.render, this));
            }
            this.render();
        },

        generateEvent: function (event) {
            event.preventDefault();
            this.trigger('generateEvent');
        },

        copyEvent: function (event) {
            event.preventDefault();
            this.trigger('copyEvent');
        },

        recountEvent: function (event) {
            event.preventDefault();

            this.trigger('recountEvent');
        },

        recountAllEvent: function (event) {
            event.preventDefault();

            this.trigger('recountAllEvent');
        },

        createPayment: function (event) {
            event.preventDefault();

            this.trigger('pay');
        }
    });

    return TopBarView;
});
