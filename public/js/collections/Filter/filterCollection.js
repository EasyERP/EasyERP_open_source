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

            var parseIntA = parseInt(nameA, 10);
            var parseIntB = parseInt(nameB, 10);

            if (statusA > statusB) {
                return this.sortOrder * (-1);
            }

            if (statusA < statusB) {
                return this.sortOrder;
            }

            if ((nameA === 0 || nameA) && (nameB === 0 || nameB)) {

                nameA = isNaN(parseIntA) ? nameA.toLowerCase() : parseIntA;
                nameB = isNaN(parseIntB) ? nameB.toLowerCase() : parseIntB;

                if (nameA === nameB) {
                    return 0;
                }

                return nameA > nameB ? this.sortOrder : this.sortOrder * (-1);
            }
        },

        initialize: function (models, options) {
            if (models && models.length) {
                models.forEach(function (el) { // quick fix for filters
                    var i;
                    if (!el.name) {
                        i = models.indexOf(el);

                        return i > -1 ? models.splice(i, 1) : [];
                    }
                });
            }

            this.sortName = options ? options.key : 'name';
            this.sortOrder = options ? options.order : 1;
        }
    });
    return FilterCollection;
});