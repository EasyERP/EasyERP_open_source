define([
        'text!templates/SettingsEmployee/list/ListTemplate.html'
    ],

    function (listTemplate) {
        var SettingsEmployeeListView = listViewBase.extend({
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
