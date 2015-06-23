define([
        'text!templates/Filter/FilterTemplate.html',
        'custom',
        'common'
    ],
    function (ContentFilterTemplate, Custom, Common) {
        var FilterView;
        FilterView = Backbone.View.extend({
            el: '#searchContainer',
            contentType: "Opportunities",
            template: _.template(ContentFilterTemplate),

            events: {
                "click .search-content": 'showSearchContent',
                "click .filter": 'showFilterContent',
                "click .filter-check-list input": "writeValue",
                "click .removeValues": "removeValues"
            },


            initialize: function () {
                this.render();
            },

            render: function () {

                this.$el.html(this.template({collection: this.collection}));

                return this;
            },

            showSearchContent: function () {
                var el = $('.search-content');
                var selector = 'arrow-down';

                $('.search-options').toggle();

                if (el.hasClass(selector)) {
                    el.removeClass(selector)
                } else {
                    el.addClass(selector)
                }
            },

            showFilterContent: function () {
                $('.filter-check-list').toggle('fast');
                return false;
            },

            writeValue: function (e) {
                var inputText = e.target.nextElementSibling.textContent;
                var filterValues = $('.filterValues');
                var filterIcons = $('.filter-icons');
                var input = $('.filter-check-list input');
                var checked;

                filterIcons.addClass('active');

                if (!filterValues.find('.iconFilter').length) {
                    filterValues.prepend('<span class="iconFilter fa fa-filter"></span>')
                }

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
                    filterValues.append('<span class=' + '"' + inputText + '">' + inputText + '</span>')
                } else {
                    filterValues.find('.' + inputText).remove()
                }

                if (e.target.id !== 'defaultFilter') {
                    $('#defaultFilter').removeAttr('checked');
                    filterValues.find('.Default').remove();
                    this.trigger('filter')
                } else {
                    $.each(input, function (index, value) {
                        if (value.id !== 'defaultFilter') value.checked = false
                    });
                    $.each($('.filterValues span'), function (index, item) {
                        if (item.className !== 'Default' && item.className !== 'iconFilter') item.remove();
                    });
                    this.trigger('defaultFilter');
                }

                if ($('.filter-check-list input:checkbox:checked').length === 0) {
                    this.trigger('defaultFilter');
                }

            },

            removeValues: function () {
                $('.filterValues').empty();
                $('.filter-icons').removeClass('active');
                $.each($('.filter-check-list input'), function (index, value) {
                    value.checked = false
                });
                this.trigger('defaultFilter');

            }



        });

        return FilterView;
    });
