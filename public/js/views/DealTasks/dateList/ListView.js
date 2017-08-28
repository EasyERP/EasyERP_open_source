define([
    'jQuery',
    'Underscore',
    'text!templates/Pagination/PaginationTemplate.html',
    'text!templates/DealTasks/dateList/ListHeader.html',
    'text!templates/DealTasks/dateList/dateItemTemplate.html',
    'text!templates/DealTasks/dateList/activityTemplate.html',
    'views/pagination',
    'views/DealTasks/CreateView',
    'views/DealTasks/EditView',
    'models/DealTasksModel',
    'views/Filter/filterView',
    'moment',
    'dataService'
], function ($, _, paginationTemplate, listTemplate, dateItemTemplate, activityTemplate, pagination, CreateView, EditView, CurrentModel, FilterView, moment, dataService) {
    var TasksListView = pagination.extend({
        el          : '#content-holder',
        viewType    : 'datelist',
        CreateView  : CreateView,
        listTemplate: listTemplate,
        FilterView  : FilterView,
        contentType : 'DealTasks',

        events: {
            'click .dateListBody'          : 'goToEditDialog',
            'click .newSelectList li'      : 'chooseOption',
            'click .showmoreDiv .showmore' : 'showMore',
            'click .showmoreDiv .hideList' : 'hideList',
            'click .dateListCheckboxWrap'  : 'checked'
        },

        initialize: function (options) {
            $(document).off('click');
            this.startTime = options.startTime;
            this.collection = options.collection;

            this.filter = options.filter;
            options.contentType = this.contentType;
            this.makeRender(options);
            this.render();
        },

        goToEditDialog: function (e) {
            var id;
            var model;

            e.preventDefault();

            id = $(e.target).closest('.dateListItem').attr('data-id');
            model = new CurrentModel({validate: false});

            model.urlRoot = '/dealTasks/';
            model.fetch({
                data   : {id: id, viewType: 'form'},
                success: function (newModel) {
                    new EditView({model: newModel});
                },

                error: function () {
                    App.render({
                        type   : 'error',
                        message: 'Please refresh browser'
                    });
                }
            });
        },

        checked: function (e) {
            var $target = $(e.target).closest('.dateListCheckboxWrap');
            e.stopPropagation();
            var $taskItem = $target.closest('.dateListItem');
            var $checkboxWrap = $target.find('.checkboxWrap');
            var input = $target.find('input');
            var id = $taskItem.attr('data-id');
            var workflow = input.val();
            var sequence = input.attr('data-sequence');
            var model = new CurrentModel({_id: id});

            if (input.prop('checked')) {
                return false;
            }

            $taskItem.addClass('completed');
            $checkboxWrap.addClass('checked');

            model.save({
                sequenceStart: sequence,
                workflow     : '5783b351df8b918c31af24ab',
                sequence     : -1,  
                workflowStart: workflow
            }, {
                patch  : true, validate: false,
                success: function () {
                    input.prop('checked', true);
                }
            });

        },

        showMore: function (e) {
            var $target = $(e.target).closest('.showmoreDiv');
            $target.addClass('open');
        },

        hideList: function (e) {
            var $target = $(e.target).closest('.showmoreDiv');
            $target.removeClass('open');
        },

        showMoreContent: function () {
            this.render();
        },

        render: function () {
            var collection = this.collection.toJSON()[0];
            var key;
            var self = this;

            $('.ui-dialog ').remove();

            this.$el.html(_.template(listTemplate));

            dataService.getData('dealTasks/getActivity', {filter: this.filter}, function (response) {

                response = response.data.map(function (el) {
                    el.date = el.date ? moment(el.date).format("HH:mm") : null;
                    return el;
                });

                self.$el.find('#activityHolder').html(_.template(activityTemplate, {response: response}));
            });

            for (key in collection) {
                this.$el.find('#dateList').append(_.template(dateItemTemplate, {
                    moment: moment,
                    data  : collection[key],
                    type  : key
                }));
            }
        }

    });

    return TasksListView;
});
