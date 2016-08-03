define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Import/FieldsTemplate.html',
    'constants/importMapping',
    'constants',
    'dataService',
    'common'
], function (Backbone, $, _, ContentTemplate, importMapping, CONSTANTS, dataService, common) {
    'use strict';

    var mappingContentView = Backbone.View.extend({
        el: '#contentBlock',
        contentTemplate       : _.template(ContentTemplate),

        initialize: function () {
            var url = '';
            var self = this;

            this.data = {
                'FirstName':'_Firstname',
                'LastName':'Last_Name',
                'Tags':'t$ag&s',
                'Phone':'ph one',
                'Address':'addresS',
                'IsEmployee':'isemployee'
            };

            /*dataService.getData(url,{},function(data) {

                self.render();
            });*/
            this.render();
        },

        goToPreview: function () {
            var $thisEl = this.$el;
            var $contentBlock = $thisEl.find('#contentBlock');

            $contentBlock.html();
        },

        render: function () {
            var $thisEl = this.$el;

            $thisEl.html(this.contentTemplate({
                content: this.data,
                fields: importMapping
            }));
        }
    });

    return mappingContentView;
});