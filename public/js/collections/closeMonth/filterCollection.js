/**
 * Created by liliy on 25.03.2016.
 */
'use strict';
define([
    'Backbone',
    'models/journalEntry'
], function (Backbone, journalEntryModel) {
    var gLReportCollection = Backbone.Collection.extend({

        model       : journalEntryModel,
        url         : 'journal/journalEntry/getCloseMonth',
        contentType : null,
        page        : null,
        numberToShow: null,
        viewType    : 'list',

        initialize: function (options) {
            options = options || {};
            this.startTime = new Date();

            this.fetch({
                data   : options,
                reset  : true,
                success: function () {

                },
                error  : function (err, xhr) {
                    console.log(xhr);
                }
            });
        },

        showMore: function (options) {
            var that = this;
            var filterObject = options || {};

            this.fetch({
                data   : filterObject,
                waite  : true,
                success: function (models) {
                    that.page += 1;
                    that.trigger('showmore', models);
                },
                error  : function () {
                    App.render({
                        type   : 'error',
                        message: "Some Error."
                    });
                }
            });
        }
    });

    return gLReportCollection;
});

