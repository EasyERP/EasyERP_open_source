/**
 * Created by liliya on 22.07.15.
 */
define(['./filterCollection'], function (ParentCollection) {
    var EditableCollection = ParentCollection.extend({

        initialize: function () {
            this.on('change', this.change, this);
        },

        save: function (changes) {
            var self = this;
            var updatedOptions;
            var syncObject;

            syncObject = {
                trigger: this.trigger,
                url: this.url,
                toJSON: function () {
                    return changes;
                }
            };

            updatedOptions = {
                success: function (model, resp, xhr) {
                    self.trigger('updated');
                }
            };

                Backbone.sync("patch", syncObject, updatedOptions);

        }
    });

    return EditableCollection;
});