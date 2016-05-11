define([
        'jQuery',
        'Underscore',
        'Backbone',
        'text!templates/settingsEmployee/list/ListTemplate.html'
    ],

    function ($, _, Backbone, listTemplate) {
        var SettingsEmployeeListView = Backbone.View.extend({
            template            : listTemplate,

            initialize: function (options) {
                var self = this;




                this.render();
            },

            render: function () {
                var self = this;
                var $currentEl = this.$el;

                $currentEl.html('');
                $currentEl.append(self.template());

            }

        });

        return SettingsEmployeeListView;
    });
