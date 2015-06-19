define([
        'text!templates/Filter/FilterTemplate.html',
        'custom',
        'common'
    ],
    function (ContentFilterTemplate, Custom, Common) {
        var FilterView = Backbone.View.extend({
            el: '#searchContainer',
            contentType: "Opportunities",
            template: _.template(ContentFilterTemplate),

            events: {
                "click .search-content": 'showSearchContent',
                "click .filter": 'showFilterContent',
                "click .drop-down-filter input": "writeValue",
                "click .removeValues": "removeValues"
            },


            initialize: function (options) {
                this.render();
            },

            render: function () {

                this.$el.html(this.template({collection: this.collection}));

                return this;
            },

            showSearchContent: function (e) {
                var el = $('.search-content');
                $('.search-options').toggle();

                if (el.hasClass('arrow-down')) {
                    el.removeClass('arrow-down')
                } else {
                    el.addClass('arrow-down')
                }
            },

            showFilterContent: function (e) {
                $('.drop-down-filter').toggle('fast');
                return false;
            },

            writeValue: function (e) {
                var inputText = e.target.nextElementSibling.textContent;
                var checked;

                $('.filter-icons').addClass('active');

                if (!$('.filterValues').find('.iconFilter').length) {
                    $('.filterValues').prepend('<span class="iconFilter"></span>')
                }

                $.each($('.drop-down-filter input'), function (index, value) {
                    if (value.checked) {
                        return checked = true
                    }
                });
                if (!checked) {
                    $('#content-holder').trigger('defaultFilter');
                    $('.filterValues').empty();
                    $('.filter-icons').removeClass('active');
                }
                if (e.target.checked) {
                    $('.filterValues').append('<span class=' + '"' + inputText + '">' + inputText + '</span>')
                } else {
                    $('.filterValues').find('.' + inputText).remove()
                }
                if (e.target.id !== 'defaultFilter' && e.target.checked) {
                    $('#defaultFilter').removeAttr('checked');
                    $('.filterValues').find('.Default').remove();
                    $('#content-holder').trigger('filter')
                } else {
                    $.each($('.drop-down-filter input'), function (index, value) {
                        if (value.id !== 'defaultFilter') value.checked = false
                    });
                    $.each($('.filterValues span'), function (index, item) {
                        if (item.className !== 'Default' && item.className !== 'iconFilter') item.remove();
                    });
                    $('#content-holder').trigger('defaultFilter');
                }

            },

            removeValues: function (e) {
                $('.filterValues').empty();
                $('.filter-icons').removeClass('active');
                $.each($('.drop-down-filter input'), function (index, value) {
                    value.checked = false
                });
                $('#content-holder').trigger('defaultFilter');

            }



        });

        return FilterView;
    });
