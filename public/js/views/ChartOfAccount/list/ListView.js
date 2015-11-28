/**
 * Created by lilya on 27/11/15.
 */
define([
        'text!templates/ChartOfAccount/list/ListHeader.html',
        'text!templates/ChartOfAccount/list/ListTemplate.html',
        'collections/ChartOfAccount/filterCollection'
    ],
    function(listHeaderTemplate, listTemplate, contentCollection){
        var ProjectsListView = Backbone.View.extend({
            el                : '#content-holder',
            contentType: "ChartOfAccount",

            events: {
                "click .oe_sortable"          : "goSort"
            },

            initialize: function (options) {

                this.collection = options.collection;

                this.render();
            },

            goSort: function (e) {
                var target$;
                var currentParrentSortClass;
                var sortClass;
                var sortConst;
                var sortBy;
                var sortObject;

                this.collection.unbind('reset');
                this.collection.unbind('showmore');

                target$ = $(e.target).closest('th');
                currentParrentSortClass = target$.attr('class');
                sortClass = currentParrentSortClass.split(' ')[1];
                sortConst = 1;
                sortBy = target$.data('sort');
                sortObject = {};

                if (!sortClass) {
                    target$.addClass('sortDn');
                    sortClass = "sortDn";
                }
                switch (sortClass) {
                    case "sortDn":
                    {
                        target$.parent().find("th").removeClass('sortDn').removeClass('sortUp');
                        target$.removeClass('sortDn').addClass('sortUp');
                        sortConst = 1;
                    }
                        break;
                    case "sortUp":
                    {
                        target$.parent().find("th").removeClass('sortDn').removeClass('sortUp');
                        target$.removeClass('sortUp').addClass('sortDn');
                        sortConst = -1;
                    }
                        break;
                }
                sortObject[sortBy] = sortConst;

                this.fetchSortCollection(sortObject);
            },

            fetchSortCollection: function (sortObject) {
                this.sort = sortObject;
                this.collection = new contentCollection({
                    viewType        : 'list',
                    sort            : sortObject,
                    page            : this.page,
                    count           : this.defaultItemsNumber,
                    filter          : this.filter,
                    parrentContentId: this.parrentContentId,
                    contentType     : this.contentType,
                    newCollection   : this.newCollection
                });
                this.collection.bind('reset', this.renderContent, this);
                this.collection.bind('showmore', this.showMoreContent, this);
            },

            renderContent: function () {
                var currentEl = this.$el;
                var tempalte = _.template(listTemplate);
                var tBody = currentEl.find('#chartOfAccount');

                tBody.empty();

                if (this.collection.length > 0) {
                    this.$el.find('#chartOfAccount').html(tempalte({
                        collection: this.collection.toJSON()
                    }));
                }
            },


            render: function(){
                var currentEl;
                var tempalte = _.template(listTemplate);
                currentEl = this.$el;

                currentEl.html('');
                currentEl.html(_.template(listHeaderTemplate));
                this.$el.find('#chartOfAccount').html(tempalte({
                    collection: this.collection.toJSON()
                }));

            }
        });

return ProjectsListView;
});
