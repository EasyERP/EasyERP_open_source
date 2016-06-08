define([
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'text!templates/Projects/list/ListHeader.html',
    'text!templates/stages.html',
    'views/Projects/CreateView',
    'views/Projects/list/ListItemView',
    'views/Projects/EditView',
    'models/ProjectsModel',
    'collections/Projects/filterCollection',
    'views/Filter/FilterView',
    'common',
    'dataService',
    'custom'
], function ($, _, ListViewBase, listTemplate, stagesTamplate, CreateView, ListItemView, EditView, CurrentModel, ContentCollection, FilterView, common, dataService, custom) {
    var ProjectsListView = ListViewBase.extend({
        createView       : CreateView,
        listTemplate     : listTemplate,
        ListItemView     : ListItemView,
        ContentCollection: ContentCollection,
        FilterView       : FilterView,
        formUrl          : '#easyErp/Projects/form/',
        contentType      : 'Projects', //  needs in view.prototype.changeLocationHash

        initialize: function (options) {
            $(document).off('click');

            this.EditView = EditView;
            this.CreateView = CreateView;

            this.startTime = options.startTime;
            this.collection = options.collection;
            this.parrentContentId = options.collection.parrentContentId;
            this.sort = options.sort;
            this.filter = options.filter;
            this.page = options.collection.currentPage;
            this.ContentCollection = ContentCollection;

            this.render();
        },

        events: {
            'click .stageSelect'                     : 'showNewSelect',
            'click .newSelectList li'                : 'chooseOption',
            'click .health-wrapper .health-container': 'showHealthDd',
            'click #health ul li div'                : 'chooseHealthDd'
        },

        chooseHealthDd: function (e) {
            var target$ = $(e.target);
            var target = target$.parents('.health-wrapper');
            var currTargetHealth = target$.attr('class').replace('health', '');
            var id = target.parents('.thumbnail').attr('id');
            var model = this.collection.get(id);
            var health = parseInt(currTargetHealth, 10);

            target.find('.health-container a').attr('class', target$.attr('class')).attr('data-value', currTargetHealth);

            model.save({health: health}, {
                headers: {
                    mid: 39
                },

                patch   : true,
                validate: false,
                success : function () {
                    $('.health-wrapper ul').hide();
                }
            });
        },

        showHealthDd: function (e) {
            $(e.target).parents('.health-wrapper').find('ul').toggle();

            return false;
        },

        hideNewSelect: function (e) {
            $('.newSelectList').remove();
        },

        showNewSelect: function (e) {
            if ($('.newSelectList').is(':visible')) {
                this.hideHealth();
                return false;
            }
            $(e.target).parent().append(_.template(stagesTamplate, {stagesCollection: this.stages}));

            return false;
        },

        hideHealth: function () {
            var $thisEl = this.$el;

            $thisEl.find('.health-wrapper ul').hide();
            $thisEl.find('.newSelectList').hide();
        },

        chooseOption: function (e) {
            var self = this;
            var target$ = $(e.target);
            var targetElement = target$.parents("td");
            var id = targetElement.attr("id");
            var model = this.collection.get(id);

            model.save({'workflow': target$.attr("id")}, {
                headers : {
                    mid: 39
                },
                patch   : true,
                validate: false,
                success : function () {
                    self.showFilteredPage({}, self/*_.pluck(self.stages, '_id')*/);
                }
            });

            this.hideNewSelect();
            return false;
        },

        /*checked: function (e) {
         var $targetEl = $(e.target);

         if ($targetEl.hasClass('notRemovable')) {
         $targetEl.prop('checked', false);

         return false;
         }

         if (this.collection.length > 0) {
         var checkLength = $("input.checkbox:checked").length;

         if ($("input.checkbox:checked").length > 0) {
         $("#top-bar-deleteBtn").show();
         $('#checkAll').prop('checked', false);

         if (checkLength == this.collection.length) {
         $('#checkAll').prop('checked', true);
         }
         }
         else {
         $("#top-bar-deleteBtn").hide();
         $('#checkAll').prop('checked', false);
         }
         }
         },*/

        /*renderCheckboxes: function () {
         this.$el.find('#checkAll').click(function () {

         $(':checkbox:not(.notRemovable)').prop('checked', this.checked);
         if ($("input.checkbox:checked").length > 0) {
         $("#top-bar-deleteBtn").show();
         } else {
         $("#top-bar-deleteBtn").hide();
         }
         });
         },*/

        render: function () {
            var itemView;
            var $currentEl;
            var self;

            $('.ui-dialog ').remove();
            self = this;

            $currentEl = this.$el;

            $currentEl.html('');
            $currentEl.append(_.template(listTemplate));
            itemView = new ListItemView({
                collection : this.collection,
                page       : this.page,
                itemsNumber: this.collection.namberToShow
            });

            $currentEl.append(itemView.render()); // added two parameters page and items number

            this.renderFilter(self);

            // todo add to after main render
            this.renderPagination($currentEl, this);

            $currentEl.append('<div id="timeRecivingDataFromServer">Created in ' + (new Date() - this.startTime) + ' ms</div>');

        }

    });

    return ProjectsListView;
});
