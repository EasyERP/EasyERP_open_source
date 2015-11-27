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

            },

            initialize: function (options) {

                this.collection = options.collection;

                this.render();
            },

            render: function(){
                var self;
                var currentEl;
                var tempalte = _.template(listTemplate);

                self = this;
                currentEl = this.$el;

                currentEl.html('');
                currentEl.html(_.template(listHeaderTemplate));
                currentEl.append(tempalte({
                    collection: this.collection
                }));

            }
        });

return ProjectsListView;
});
