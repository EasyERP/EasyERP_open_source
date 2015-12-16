/**
 * Created by soundstorm on 12.08.15.
 */
define([
    'models/FilterModel'
], function (FilterModel) {
    var FilterCollection = Backbone.Collection.extend({
        model: FilterModel,

        comparator: function (modelA, modelB) {
            var nameA = modelA.get(this.sortName);
            var nameB = modelB.get(this.sortName);

            if (nameA && nameB) {
                if (this.int) {
                    nameA = parseInt(nameA);
                    nameB = parseInt(nameB);
                }

                if (nameA > nameB) {
                    return this.sortOrder;
                } else if (nameA < nameB) {
                    return this.sortOrder * (-1);
                } else {
                    return 0;
                }
            }
        },

        sortBy: function (options) {
            this.sortName = options.key ? options.key : 'name';
            this.sortOrder = options.order ? options.order : 1;
            ;
            this.int = options.int ? true : false;

            this.sort();
        },

        initialize: function (models, options) {
            this.sortName = options ? options.key : 'name';
            this.sortOrder = options ? options.order : 1;
        }
    });
    return FilterCollection;
});