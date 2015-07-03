define([
        'text!templates/Filter/FilterTemplate.html',
        'custom',
        'common'
    ],
    function (ContentFilterTemplate, Custom, Common) {
        var FilterView;
        FilterView = Backbone.View.extend({
            el: '#searchContainer',
            contentType: "Filter",
            template: _.template(ContentFilterTemplate),

            events: {
                "click .search-content": 'showSearchContent',
                "click .filter": 'showFilterContent',
                "click .drop-down-filter input[type='checkbox']": "writeValue",
                "click .drop-down-filter li": "triggerClick",
                "click .removeValues": "removeValues",
                'change .chooseTerm': 'chooseOptions',
                'click .addCondition': 'addCondition',
                'click .removeFilter': 'removeFilter',
                'click .customFilter': 'showCustomFilter',
                'click .applyFilter': 'applyFilter'
            },


            initialize: function (options) {
                this.render(options);
            },

            render: function (options) {
                this.customCollection =  options.customCollection;

                this.$el.html(this.template({collection: this.collection, customCollection: options.customCollection}));

                return this;
            },

            applyFilter: function () {
                this.trigger('filter');
            },

            showCustomFilter: function () {
                this.$el.find(".filterOptions, .filterActions").toggle();
            },

            removeFilter: function (e) {
                var filter = this.$el.find('.filterOptions');
                var opt = this.$el.find('.chooseOption');
                var term = this.$el.find('.chooseTerm');
                var date = this.$el.find('.chooseDate');

                if (filter.length > 1) {
                    $(e.target).closest('.filterOptions').remove();
                } else {
                    filter.removeClass('chosen');
                    opt.children().remove();
                    term.val($(".chooseTerm option:first").val());
                    date.remove();
                    opt.show();
                    this.$el.find(".filterOptions, .filterActions").hide();
                    this.trigger('defaultFilter');

                }
                e.stopPropagation();
            },

            addCondition: function () {
                $(".filterOptions:first").clone().insertBefore('.filterActions');
                $(".filterOptions:last").children('.chooseOption').children().remove();
                $(".filterOptions:last").children('.chooseOption').show();
                $(".filterOptions:last").children('.chooseDate').remove();
                $(".filterOptions:last").removeClass('chosen');
            },

            chooseOptions: function (e) {
                var el = $(e.target.nextElementSibling);
                var value  = e.target.value;
                var optDate = this.$el.find('.chooseDate');

                $(e.target).closest('.filterOptions').addClass('chosen');

                if (/date/.test(value.toLowerCase())) {
                    el.html('').hide();
                    $('<div class=\'chooseDate\'><input id="start" type="date"/><input id="end" type="date"/><div>').insertBefore(el)
                } else {
                    if ($('.chooseDate')) $('.chooseDate').remove();
                    if (optDate.length) {
                        optDate.remove();
                        el = $(e.target).next();
                    }

                    el.show();
                    el.children().remove();

                    this.customCollection[0][value].forEach(function (opt) {
                        if (opt && opt.name && opt._id) {
                            el.append('<option value="' + opt._id + '">' + opt.fullName + '</option>')
                        } else if (opt && opt.name) {
                            el.append('<option value="' + opt.name + '">' + opt.name + '</option>')
                        } else {
                            el.append('<option value="' + opt + '">' + opt + '</option>')
                        }
                    });
                }
            },

            triggerClick: function (e) {
                if (e.target.localName === 'li') {
                    $(e.target.children[0]).trigger('click');
                }
            },

            showSearchContent: function () {
                var el = this.$el.find('.search-content');
                var searchOpt = this.$el.find('.search-options');
                var selector = 'fa-caret-up';

                searchOpt.toggle();

                if (el.hasClass(selector)) {
                    el.removeClass(selector)
                } else {
                    el.addClass(selector)
                }
            },

            showFilterContent: function () {
                var filter = this.$el.find('.drop-down-filter');

                filter.toggle();
                return false;
            },

            writeValue: function (e) {
                var inputText = e.target.nextElementSibling.textContent;
                var filterValues = this.$el.find('.filterValues');
                var filterIcons = this.$el.find('.filter-icons');
                var input = this.$el.find('.drop-down-filter input');
                var defaultFilter = this.$el.find('#defaultFilter');
                var checked;

                filterIcons.addClass('active');

                $.each(input, function (index, value) {
                    if (value.checked) {
                        return checked = true
                    }
                });
                if (!checked) {
                    this.trigger('defaultFilter');
                    filterValues.empty();
                    filterIcons.removeClass('active');
                }
                if (e.target.checked) {
                    filterValues.append('<span class=' + '"' + inputText + '">' + inputText + '</span>');

                } else {
                    filterValues.find('.' + inputText).remove();
                    label.removeClass('activeFilterItem');
                }

                if (e.target.id !== 'defaultFilter') {

                    defaultFilter.removeAttr('checked');
                    filterValues.find('.Default').remove();
                    this.trigger('filter');
                } else {
                    $.each(input, function (index, value) {
                        if (value.id !== 'defaultFilter') value.checked = false
                    });
                    $.each($('.filterValues span'), function (index, item) {
                        if (item.className !== 'Default') item.remove();
                    });
                    this.trigger('defaultFilter');
                }

                if ($('.drop-down-filter input:checkbox:checked').length === 0) {
                    this.trigger('defaultFilter');
                }

            },

            removeValues: function () {
                this.$el.find('.filterValues').empty();
                this.$el.find('.filter-icons').removeClass('active');

                $.each($('.drop-down-filter input'), function (index, value) {
                    value.checked = false
                });

                this.trigger('defaultFilter');
            }
        });

        return FilterView;
    });
