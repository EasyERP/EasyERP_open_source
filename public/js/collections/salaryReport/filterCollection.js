/**
 * Created by liliy on 20.01.2016.
 */
define([
    'models/EmployeeDashboardItem'
], function (EmpModel) {
    var salatyCollection = Backbone.Collection.extend({

        model       : EmpModel,
        url         : '/salaryReport/list',
        contentType : null,
        page        : null,
        numberToShow: null,
        viewType    : 'list',

        initialize: function (options) {
            options = options || {};
            this.startTime = new Date();
            this.filter = options ? options.filter : {};
            this.startDate = options.startDate;
            this.endDate = options.endDate;
           // this.year = options.year;

            this.fetch({
                data   : options,
                reset  : true,
                success: function (newCollection) {

                },
                error  : function (err, xhr) {
                    console.log(xhr);
                }
            });
        },

        sortByOrder: function (key, order) {
            this.sortOrder = order;
            this.sortKey = key;

            this.comparator = function (modelA, modelB) {
                var self = this;
                var nameA = getSortName(modelA);
                var nameB = getSortName(modelB);

                function getSortName(model) {
                    var sortAttr = self.sortKey ? model.get(self.sortKey) : model.get('name');

                    return sortAttr;
                }

                if (nameA && nameB) {
                    if (nameA > nameB) {
                        return self.sortOrder;
                    } else if (nameA < nameB) {
                        return self.sortOrder * (-1);
                    } else {
                        return 0;
                    }
                }
            };

            this.sort();
        },

        showMore: function (options) {
            var that = this;
            var filterObject = options || {};

            filterObject['filter'] = (options) ? options.filter : {};

            this.fetch({
                data   : filterObject,
                waite  : true,
                success: function (models) {
                    that.page += 1;
                    that.trigger('showmore', models);
                },
                error  : function () {
                    App.render({
                        type: 'error',
                        message: "Some Error."
                    });
                }
            });
        }
    });

    return salatyCollection;
});
