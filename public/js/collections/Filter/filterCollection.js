/**
 * Created by soundstorm on 12.08.15.
 */
define([
    'Backbone',
    'models/FilterModel'
], function (Backbone, FilterModel) {
    'use strict';

    var FilterCollection = Backbone.Collection.extend({
        model: FilterModel,

        comparator: function (modelA, modelB) {
            var nameA = modelA.get(this.sortName);
            var nameB = modelB.get(this.sortName);

            var statusA = modelA.get('status');
            var statusB = modelB.get('status');

            if (statusA > statusB) {
                return this.sortOrder * (-1);
            }

            if (statusA < statusB) {
                return this.sortOrder;
            }

            if ((nameA === 0 || nameA) && (nameB === 0 || nameB)) {
                if (this.int) {
                    nameA = parseInt(nameA, 10);
                    nameB = parseInt(nameB, 10);
                } else {
                    nameA = nameA.toLowerCase();
                    nameB = nameB.toLowerCase();
                }

                if (nameA === nameB) {
                    return 0;
                }

                return nameA > nameB ? this.sortOrder : this.sortOrder * (-1);
            }
        },

        sortBy: function (options) {
            this.sortName = options.key || 'name';
            this.sortOrder = options.order || 1;
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