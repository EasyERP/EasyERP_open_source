/**
 * Created by liliy on 28.12.2015.
 */
define([
        "text!templates/selectView/selectTemplate.html"
    ],
    function (selectTemplate) {
        var selectView = Backbone.View.extend({
            template: _.template(selectTemplate),

            events: {
                "click .newSelectList li:not(.miniStylePagination, #selectInput)" : "chooseOption",
                "click .newSelectList li.miniStylePagination"                     : "notHide",
                "click .newSelectList li.miniStylePagination .next:not(.disabled)": "nextSelect",
                "click .newSelectList li.miniStylePagination .prev:not(.disabled)": "prevSelect",
               // "click :not(#selectInput)"                                  : "hideNewSelect",
                "click  #selectInput"                                             : "quickSearch"
            },

            initialize: function (options) {
                this.number = options.number || 10;
                this.responseObj = options.responseObj || [];
                this.e = options.e;
                this.el = this.e.target;
                this.$el = $(this.el);

                this.render();

            },

            quickSearch: function (e) {

            },

            hideNewSelect: function () {
                this.$el.find(".newSelectList").hide();
            },

            notHide: function () {
                return false;
            },

            nextSelect: function (e) {
                this.showNewSelect(e, false, true);
            },

            prevSelect: function (e) {
                this.showNewSelect(e, true, false);
            },

            showNewSelect: function (e, prev, next) {
                var targetEl = $(e.target);
                var attr = targetEl.attr("id");
                var data = this.responseObj["#" + attr];
                var targetParent = $(e.target).parent();
                var elementVisible = this.number;
                var newSel;
                var parent = this.$el;
                var s;
                var start;
                var end;
                var allPages;
                var $curUl;
                var curUlHeight;
                var curUlPosition;
                var curUlOffset;
                var $window = $(window);
                this.currentPage = this.currentPage || 1;

                if (targetParent.prop('tagName') !== 'TR') {
                    newSel = targetParent.find(".newSelectList");
                } else {
                    newSel = targetParent.find(".emptySelector");
                }

                if (prev || next) {
                    newSel = $(e.target).closest(".newSelectList");
                    if (!data) {
                        data = this.responseObj["#" + newSel.parent().find(".current-selected").attr("id")];
                    }
                }

                parent = newSel.length > 0 ? newSel.parent() : $(e.target).parent();

                if (parent.prop('tagName') === 'TR') {
                    parent = $(e.target);
                }

                if (newSel.length && newSel.is(":visible") && !prev && !next) {
                    newSel.remove();
                    return;
                }

                $(".newSelectList").hide(); //fixed by Liliya for generateWTracks

                if ((prev || next) && newSel.length) {
                    this.currentPage = newSel.data("page");
                    newSel.remove();
                } else if (newSel.length) {
                    newSel.show();
                    return;
                }

                if (prev) {
                    this.currentPage--;
                }
                if (next) {
                    this.currentPage++;
                }

                s = "<ul class='newSelectList' data-page='1'><li id='createJob'>Generate</li>";
                start = (this.currentPage - 1) * elementVisible;
                end = Math.min(this.currentPage * elementVisible, data.length);
                allPages = Math.ceil(data.length / elementVisible);

                if (data && data.length) {
                    this.$el.append(_.template(selectTemplate, {
                        collection    : data.slice(start, end),
                        currentPage   : this.currentPage,
                        allPages      : allPages,
                        start         : start,
                        end           : end,
                        dataLength    : data.length,
                        elementVisible: elementVisible
                    }));

                    $curUl = parent.find('.newSelectList');
                    curUlOffset = $curUl.offset();
                    curUlPosition = $curUl.position();
                    curUlHeight = $curUl.outerHeight();

                    if (curUlOffset.top + curUlHeight > $window.scrollTop() + $window.height()) {
                        $curUl.css({
                            top: curUlPosition.top - curUlHeight - this.$el.outerHeight()
                        });
                    }

                } else if (attr === 'jobs') {
                    this.$el.append(s);
                }
            },

            render: function () {

                this.showNewSelect(this.e, false, false);

                return this;
            }

        });

        return selectView;
    });