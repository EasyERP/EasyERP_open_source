define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/selectView/selectTemplate.html',
    'text!templates/selectView/selectContent.html',
    'collections/Filter/filterCollection',
    'dataService'
], function (Backbone, $, _, selectTemplate, selectContent, FilterCollection, dataService) {
    var selectView = Backbone.View.extend({
        template       : _.template(selectTemplate),
        contentTemplate: _.template(selectContent),
        className      : 'newSelectList',
        events         : {
            'click li.miniStylePagination'                     : 'notHide',
            'click li.miniStylePagination .next:not(.disabled)': 'nextSelect',
            'click li.miniStylePagination .prev:not(.disabled)': 'prevSelect',
            'click #createNewEl'                               : 'createNewElement'
        },

        createNewElement: function (e) {
            var target = $(e.target);
            var type = target.attr('data-level');

            Backbone.history.fragment = '';
            Backbone.history.navigate('#easyErp/' + type, {trigger: true});
        },

        chooseOption: function (e) {
            var id;
            var data;
            var $target = $(e.target);
            var attrId = $target.parents('td').find('.current-selected').attr('id');

            $('.newSelectList').hide();

            if ($target.parents('dd').find('.current-selected').length) {
                $target.parents('dd').find('.current-selected').text($target.text()).attr('data-id', $target.attr('id'));
            } else {
                id = $target.parents('td').closest('tr').attr('data-id');

                if (attrId === 'workflow') {
                    data = {_id: id, workflowId: $target.attr('id')};
                } else if (attrId === 'type') {
                    data = {_id: id, type: $target.text()};
                }

                $target.parents('td').find('.current-selected').text($target.text()).attr('data-id', $target.attr('id'));

                dataService.postData('/jobs/update', data, function (err) {
                    if (err) {
                        return console.log(err);
                    }

                });
            }

            this.showSaveButton();
        },

        initialize: function (options) {
            var self = this;
            var data;
            var $target;
            var select;

            //this.select = null;

            function resetCollection() {
                self.showNewSelect(self.e);
            }

            this.number = options.number || 10;
            this.responseObj = options.responseObj || [];
            this.e = options.e;

            $target = $(this.e.target).closest('.current-selected');

          if (!$target || !$target.length){
            $target =  $(this.e.target);
          }

            this.attr = $target.attr('id') || $target.attr('data-content');
            data = this.responseObj['#' + this.attr];

            if (!data || !data.length && ($target.attr('data-content') || $target.parent().attr('data-content'))) {
                this.attr = $target.attr('data-content') || $target.parent().attr('data-content');
                data = this.responseObj['#' + this.attr];
            }

            if (data && data[0] && data[0].name !== 'Select') {

                select = _.find(data, function (item) {
                    return item.name === 'CREATE NEW';
                });

                if (select) {
                    data = _.filter(data, function (item) {
                        return item.name !== 'CREATE NEW';
                    });
                }
            }

            this.collection = new FilterCollection(data);
            this.filteredCollection = new FilterCollection(data);

            if (select) {
                this.filteredCollection.add(select, {at: 0});
            }

            this.filteredCollection.unbind();
            this.filteredCollection.bind('reset', resetCollection);

            this.inputEvent = _.debounce(
                function (e) {
                    var target = e.target;
                    var value = target.value;
                    var newFilteredCollection;

                    if (!value) {
                        this.$el.find('.miniStylePagination').show();
                        return this.filteredCollection.reset(this.collection.toJSON());
                    }

                    this.currentPage = 1;

                    newFilteredCollection = this.filterCollection(value);
                    this.$el.find('.miniStylePagination').toggle(!!newFilteredCollection.length);
                    this.filteredCollection.reset(newFilteredCollection);
                }, 500);

            _.bindAll(this, 'inputEvent');
            _.bindAll(this, 'showNewSelect');
        },

        notHide: function () {
            return false;
        },

        nextSelect: function (e) {
            e.stopPropagation();
            this.showNewSelect(e, false, true);
        },

        prevSelect: function (e) {
            e.stopPropagation();
            this.showNewSelect(e, true, false);
        },

        filterCollection: function (value) {
            var resultCollection;
            var regex;

            regex = new RegExp(value, 'i');

            resultCollection = this.collection.filter(function (model) {
                var info = model.get('info');
                var variants = model.get('variants');
                var name = model.get('name').match(regex);

                if (variants && variants instanceof Array && info && info.SKU) {
                    return name || _.find(variants, function (el) {
                            return el.value.match(regex);
                        }) || info.SKU.match(regex);
                } else if (variants && info && info.SKU) {
                    return name || variants.match(regex) || info.SKU.match(regex);
                }

                if (variants && variants instanceof Array) {
                    return name || _.find(variants, function (el) {
                            return el.value.match(regex);
                        });
                } else if (variants) {
                    return variants.match(regex);
                }

                if (info && info.SKU) {
                    return name || info.SKU.match(regex);
                }

                return name;
            });

            return resultCollection;
        },

        showNewSelect: function (e, prev, next) {
            var targetParent = this.$el;
            var elementVisible = this.number;
            var $window = $(window);
            var data = this.filteredCollection ? this.filteredCollection.toJSON() : this.collection.toJSON();
            var contentHolder = this.$el.find('#content');
            var newSel;
            var type;
            var start;
            var end;
            var allPages;
            var $curUl;
            var curUlHeight;
            var curUlPosition;
            var curUlOffset;

            if (this.responseObj && this.responseObj['#parentDepartment'] && this.responseObj['#parentDepartment'].length && this.responseObj['#parentDepartment'][0].name === 'Select') {
                this.select = this.responseObj['#parentDepartment'].shift();
            }

            this.currentPage = this.currentPage || 1;

            if (this.attr === 'monthSelect') { // todo sorting
                data = this.responseObj['#monthSelect'];
            }

            if (targetParent.prop('tagName') !== 'TR') {
                newSel = targetParent.find('.newSelectList');
            } else {
                newSel = targetParent.find('.emptySelector');
            }

            if (prev || next) {
                newSel = $(e.target).closest('.newSelectList');
                if (!data) {
                    data = this.responseObj['#' + newSel.parent().find('.current-selected').attr('id')];
                }
            }

            if (prev) {
                this.currentPage--;
            }
            if (next) {
                this.currentPage++;
            }

            start = (this.currentPage - 1) * elementVisible;
            end = Math.min(this.currentPage * elementVisible, data.length);
            allPages = Math.ceil(data.length / elementVisible);

            if (this.select) {
                data.unshift(this.select);
                this.responseObj['#parentDepartment'].unshift(this.select);
            }

            if (this.attr === 'jobs') {
                data.push({_id: 'createJob', name: 'Generate sprint'});

                start = (this.currentPage - 1) * elementVisible;
                end = Math.min(this.currentPage * elementVisible, data.length);
                allPages = Math.ceil(data.length / elementVisible);

                contentHolder.html(_.template(selectContent, {
                    collection    : data.slice(start, end),
                    currentPage   : this.currentPage,
                    allPages      : allPages,
                    start         : start,
                    end           : end,
                    dataLength    : data.length,
                    elementVisible: elementVisible
                }));

            } else {
                if (!data.length) {

                    switch (this.attr) {
                        case ('jobPositionDd') :
                            type = 'JobPositions';
                            break;
                        case ('departmentsDd' || 'department') :
                            type = 'Departments';
                            break;
                        case ('projectDd') :
                            type = 'Projects';
                            break;
                        case ('paymentMethod') :
                            type = 'Accounts';
                            break;
                        case ('chartAccount') :
                            type = 'ChartOfAccount';
                            break;
                        case ('employee') :
                            type = 'Employees';

                        // skip default
                    }

                    if (type) {
                        data.push({
                            _id  : 'createNewEl',
                            name : 'Create New',
                            level: type
                        });
                        end = 1;
                    }

                }

                contentHolder.html(_.template(selectContent, {
                    collection    : data.slice(start, end),
                    currentPage   : this.currentPage,
                    allPages      : allPages,
                    start         : start,
                    end           : end,
                    dataLength    : data.length,
                    elementVisible: elementVisible
                }));
            }
            /* $curUl = this.$el;
             curUlOffset = $curUl.offset();
             curUlPosition = $curUl.position();
             curUlHeight = $curUl.outerHeight();

             if (curUlOffset.top + curUlHeight > $window.scrollTop() + $window.height()) {
             $curUl.css({
             top: curUlPosition.top - curUlHeight - this.$el.outerHeight()
             });
             }*/ //todo bug with list position out of document

            if (!this.searchInput.val().length && data.length < elementVisible) {
                this.searchInput.remove();
            }
        },

        render: function () {
            var self = this;

            this.$el.html(this.template);

            this.searchInput = this.$el.find('#selectInput');

            this.searchInput.keyup(function (e) {
                e.stopPropagation();
                self.inputEvent(e);
            });

            this.showNewSelect(this.e);

            return this;
        }
    });

    return selectView;
});
