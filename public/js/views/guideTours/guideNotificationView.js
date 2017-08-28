define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/guideTours/notificationTemplate.html',
    'constants/guideTours'
], function (Backbone, $, _, notifyTemplate, GUIDES) {
    'use strict';

    var View = Backbone.View.extend({
        notifyTemplate: _.template(notifyTemplate),
        el            : 'body',

        events: {
            'click .guideStep'  : 'nextStep',
            'click #closeGuide1': 'hideGuideNotify',
            'click #endGuide'   : 'endGuide'
        },

        initialize: function (options) {
            var data = options.data;
            var e = options.e;

            this.nextStep(e, data);
        },

        endGuide: function () {
            var guide;
            var currentGuide;
            var currentGuideGroup;
            var stepsArray;
            var lengthSteps;
            var step;

            if (App.guide) {
                guide = App.guide;
                currentGuideGroup = guide.activeGuide;
                currentGuide = guide.index;
                stepsArray = GUIDES[[currentGuideGroup]][currentGuide].steps;
                lengthSteps = stepsArray.length;
                step = stepsArray[lengthSteps - 1];

                if (step.button) {
                    $(step.button).click();
                }
                if (step.selector) {
                    $(step.button).click();
                }
            }

            this.hideGuideNotify();
        },

        nextStep: function (e, opts) {
            var self = this;
            var $target = e ? $(e.target).closest('.guideAction') : '';
            var index = opts ? opts.index : $target.attr('data-counter');
            var stepValue = opts ? opts.stepValue : parseInt($target.attr('data-step'), 10);
            var activeGuide = opts ? opts.activeGuide : $target.attr('data-guideGroup');
            var guide = GUIDES[activeGuide][index];
            var stepsLength = parseInt(guide.steps.length, 10) - 1;
            var stepData = guide.steps[stepValue];
            var url = stepData.url || (opts ? opts.url : '');
            var isDefault = stepData.isDefault || 0;
            var onTop = stepData.onTop || '';
            var isEnd = stepData.isEnd;
            var hidePrevButton = stepData.hidePrevButton;
            var containerHeight = 280;
            var containerWidth = 410;
            var position;
            var guideEl;

            e && e.stopPropagation();

            this.hideGuideNotify();

            App.guide = {
                index       : index,
                activeGuide : activeGuide,
                stepValue   : stepValue,
                url         : url,
                e           : e,
                button      : stepData.button,
                needRedirect: opts ? opts.needRedirect : false
            };

            $(stepData.selector).on('click', function () {
                if (App.guide && !App.guide.triggered) {
                    triggerNextStep();
                }
            });

            if (stepData.button && ($target && $target.hasClass('next'))) {
                if (App.guide) {
                    App.guide.triggered = true;
                }
                triggerNextStep();
            }
            if (stepData.cancelButton && ($target && $target.hasClass('prev'))) {
                $(stepData.cancelButton).click();
                if (App.guide) {
                    App.guide.stepValue--;
                    return self.nextStep(null, App.guide);
                }
            }

            guideEl = $(stepData.selector);
            guideEl && guideEl.addClass('highlight');

            position = getBlockPosition({
                elem           : guideEl,
                containerWidth : containerWidth,
                containerHeight: containerHeight,
                isDefault      : isDefault,
                onTop          : onTop,
                error          : stepData.error
            });

            if ($target && $target.hasClass('prev') && !url) {
                if (App.guide) {
                    App.guide.stepValue--;
                    App.guide.needRedirect = true;

                    return self.nextStep(null, App.guide);
                }
            }

            if ((url && e && $target.hasClass('guideStep')) || (url && App.guide.needRedirect)) {
                App.guide.needRedirect = false;
                Backbone.history.fragment = '';

                return Backbone.history.navigate(url, {trigger: true});
            }

            if (position && position.arrowPosition === 'none' && stepData.error /*&& ($target && !$target.hasClass('prev'))*/) {
                stepData = stepData.error;
                stepData.isError = true;
            }

            this.render({
                step          : stepValue,
                activeGuide   : activeGuide,
                data          : stepData,
                index         : index,
                limit         : isEnd || stepValue === stepsLength,
                position      : position,
                hidePrevButton: hidePrevButton
            });

            function triggerNextStep() {
                $(stepData.button).click();
                if (App.guide) {
                    if (App.guide.stepValue === stepsLength) {
                        return self.hideGuideNotify();
                    }

                    App.guide.stepValue++;
                    self.nextStep(null, App.guide);
                }
            }

            function getBlockPosition(opts) {
                var elem = opts.elem;
                var containerHeight = opts.containerHeight;
                var containerWidth = opts.containerWidth;
                var boundingClientRect = elem.length && elem[0].getBoundingClientRect();
                var padding = opts.padding || 10;
                var isBottom = boundingClientRect.top < containerHeight + padding;
                var isTop = document.body.clientHeight - boundingClientRect.top < containerHeight + padding;
                var isLeft = document.body.clientWidth - boundingClientRect.left < containerWidth + padding;
                var isDefault = opts.isDefault; // flag to display on right
                var onTop = opts.onTop;
                var arrowPosition;
                var positionLeft;
                var positionTop;
                var arrowLeft = 0;
                var arrowTop;
                var left;
                var buff;
                var top;

                if (!boundingClientRect) {
                    if (opts.error) {
                        arrowPosition = 'none';
                        left = (document.body.clientWidth - containerWidth) / 2;
                        top = (document.body.clientHeight - containerHeight) / 2;

                        return {
                            top          : top,
                            left         : left,
                            arrowPosition: arrowPosition,
                            arrowTop     : '',
                            arrowLeft    : ''
                        };
                    } else {
                        return;
                    }
                }
                if (onTop) {
                    isTop = true;
                }
                if (isBottom && !isDefault) {
                    top = boundingClientRect.top + boundingClientRect.height + padding;
                    left = boundingClientRect.left - containerWidth / 2 + boundingClientRect.width / 2;
                    arrowTop = -padding;
                    arrowLeft = (containerWidth - padding) / 2;
                    arrowPosition = 'bottom';
                } else if (isLeft && !isDefault) {
                    top = boundingClientRect.top - containerHeight / 2 + boundingClientRect.height / 2;
                    left = boundingClientRect.left - containerWidth - padding;
                    arrowTop = containerHeight / 2 - padding;
                    arrowLeft = containerWidth;
                    arrowPosition = 'left';
                } else if (isTop && !isDefault) {
                    top = boundingClientRect.top - containerHeight - padding;
                    left = boundingClientRect.left + containerWidth / 2;
                    arrowTop = containerHeight - padding / 2;
                    arrowLeft = (containerWidth - padding) / 2;
                    arrowPosition = 'top';
                } else {
                    //default show notify on right
                    top = boundingClientRect.top - containerHeight / 2 + boundingClientRect.height / 2;
                    left = boundingClientRect.left + boundingClientRect.right + padding;
                    arrowTop = containerHeight / 2 - padding;
                    arrowPosition = 'right';
                }

                positionLeft = left + containerWidth;
                positionTop = top + containerHeight;

                if (positionLeft >= document.body.clientWidth) {
                    buff = positionLeft - document.body.clientWidth;
                    left -= buff;
                    arrowLeft += buff;
                }

                if (positionTop >= document.body.clientHeight) {
                    buff = positionTop - document.body.clientHeight;
                    top -= buff;
                    arrowTop += buff;
                }

                if (top < 0) {
                    arrowTop += top;
                    top = 0;
                }

                if (left < 0) {
                    arrowLeft += left;
                    left = 0;
                }

                return {
                    top          : top,
                    left         : left,
                    arrowPosition: arrowPosition,
                    arrowTop     : arrowTop || '',
                    arrowLeft    : arrowLeft || ''
                };
            }
        },

        hideGuideNotify: function () {
            var selector;
            var index;
            var step;
            var currentGuideGroup;

            if (App.guide) {
                step = App.guide.stepValue;
                index = App.guide.index;
                currentGuideGroup = App.guide.activeGuide;

                selector = GUIDES[currentGuideGroup][index].steps[step].selector || GUIDES[currentGuideGroup][index].steps[step].button;

                selector && $(selector).removeClass('highlight');
            }

            this.$el.find('.guide-notify').remove();
            $('#wrapper').removeClass('layer');

            delete App.guide;
        },

        render: function (options) {
            var $element = $(this.notifyTemplate(options));
            var $arrow = $element.find('.arrow');
            var position = options.position;
            var arrowPosition;

            if (!position) {
                return;
            }
            $('#wrapper').addClass('layer');

            arrowPosition = position.arrowPosition;
            switch (arrowPosition) {
                case 'bottom':
                    $arrow.css('transform', 'rotate(90deg)');
                    break;
                case 'left':
                    $arrow.css('transform', 'rotate(180deg)');
                    break;
                case 'top':
                    $arrow.css('transform', 'rotate(270deg)');
                    break;
                case 'none':
                    $arrow.remove();
                    break;
            }

            $element.css('top', position.top);
            $element.css('left', position.left);
            position.arrowTop && $arrow.css('top', position.arrowTop);
            position.arrowLeft && $arrow.css('left', position.arrowLeft);

            this.$el.append($element);

            return this;
        }
    });

    return View;
});