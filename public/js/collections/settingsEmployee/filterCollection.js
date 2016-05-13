define([
    'Backbone'
],
    function (Backbone) {
        return Backbone.Collection.extend({
            initialize: function() {
                var self = this;

                setTimeout(function() {
                    self.trigger('reset', []);
                }, 0);
            }
        });
    });
