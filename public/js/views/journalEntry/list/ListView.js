define([
        'views/listViewBase',
        'text!templates/journalEntry/list/ListHeader.html',
        'views/journalEntry/list/ListItemView',
        'models/journalEntry',
        'collections/journalEntry/filterCollection',
        'dataService',
        'custom',
        'constants'
    ],

    function (listViewBase, listTemplate, listItemView, currentModel, contentCollection, dataService, custom, CONSTANTS) {
        var ListView = listViewBase.extend({
            listTemplate            : listTemplate,
            listItemView            : listItemView,
            contentCollection       : contentCollection,
            totalCollectionLengthUrl: '/journalEntry/totalCollectionLength',
            contentType             : CONSTANTS.JOURNALENTRY,

            initialize: function (options) {
                $(document).off("click");

                this.startTime = options.startTime;
                this.collection = options.collection;
                _.bind(this.collection.showMore, this.collection);
                this.defaultItemsNumber = this.collection.namberToShow || 100;
                this.newCollection = options.newCollection;
                this.page = options.collection.page;

                this.render();
                this.contentCollection = contentCollection;
            },

            events: {

            },

            render: function () {
                var $currentEl;
                var itemView;

                $('.ui-dialog ').remove();

                $currentEl = this.$el;

                $currentEl.html('');
                $currentEl.append(_.template(listTemplate));
                itemView = new listItemView({
                    collection : this.collection,
                    itemsNumber: this.collection.namberToShow
                });
                itemView.bind('incomingStages', this.pushStages, this);


                $currentEl.append(itemView.render());//added two parameters page and items number

                this.renderCheckboxes();

                $currentEl.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");

            }

        });

        return ListView;
    });
