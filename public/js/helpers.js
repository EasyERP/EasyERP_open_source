define([
    'Underscore'
], function (_) {
    function makeFilterString(filter, type) {
        var filterString = '';

        if (filter && type) {
            filterString = '/?type=' + type + '&filter=' + encodeURIComponent(JSON.stringify(filter));

            return filterString;
        }

        if (filter && !type) {
            filterString = '/?filter=' + encodeURIComponent(JSON.stringify(filter));

            return filterString;
        }

        if (!filter && type) {
            filterString = '/?type=' + type;

            return filterString;
        }

        return filterString;
    }

    function mappingReportFields(typeData, field, moment) {
        var result = field;
        var date;

        if (field && field !== '&nbsp') {
            switch (typeData) {
                case 'Finance' : {
                    result = '$ ' + currencySplitter((field).toFixed(2));
                    break;
                }
                case 'Double' : {
                    result = field.toFixed(2);
                    break;
                }
                case 'Percent' : {
                    result = field.toFixed(2) + '%';
                    break;
                }
                case 'Date' : {
                    date = moment(new Date(field)).format('DD MMM, YYYY');

                    if (date === 'Invalid date') {
                        break;
                    }

                    result = moment(new Date(field)).format('DD MMM, YYYY');
                    break;
                }
                case 'Channel' : {
                    if (field !== 'shopify' && field !== 'etsy' && field !== 'magento') {
                        break;
                    }
                    result = '<div class="channelImg ' + (field || '') + '"></div>';
                    break;
                }
                case 'Image' : {
                    result = '<img src="' + field + '" alt="Avatar" class="iconEmployee">';
                    break;
                }
                case 'Address': {
                    result = '<div>' + addressMaker(field) + '</div>';
                }
                default: {
                    break;
                }
            }
        }

        return result;
    }

    function minFromDates(arrayOfDates) {
        arrayOfDates = _.map(arrayOfDates, function (date) {
            return new Date(date).valueOf();
        });

        return new Date(Math.min.apply(null, arrayOfDates));
    }

    function currencySplitter(currency) {
        return currency.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
    }

    function currencyClass(currency) {
        var currencyName;
        switch (currency) {
            case '565eab29aeb95fa9c0f9df2d':
                currencyName = 'dollar';
                break;
            case '565eab34aeb95fa9c0f9df2e':
                currencyName = 'euro';
                break;
            case '565eab3faeb95fa9c0f9df2f':
                currencyName = 'uah';
                break;
            // skip default;
        }
        return currencyName;
    }

    function weekSplitter(date) {
        return date.replace(/(\d{4})/, '$1/');
    }

    function spaceReplacer(value) {
        if (value) {
            return value.replace(/\s/g, '');
        } else {
            return value;
        }
    }

    function setTimeToDate(date) {
        'use strict';
        var newDate = new Date();
        var hours = newDate.getHours();
        var minutes = newDate.getMinutes();
        var seconds = newDate.getSeconds();

        date = new Date(date);

        date.setHours(hours);
        date.setMinutes(minutes);
        date.setSeconds(seconds);

        return date;
    }

    function addressMaker(address) {
        var result = '';

        if (!address) {
            return '';
        }

        if (address.street) {
            result += address.street;
        }

        if (address.city) {
            result += ', ';
            result += address.city;
        }

        if (address.state) {
            result += ', ';
            result += address.state;
        }

        if (address.country && address.country !== 'Select') {
            result += ', ';
            result += address.country;
        }

        if (address.zip) {
            result += ', ';
            result += address.zip;
        }

        return result;
    }

    return {
        minFromDates       : minFromDates,
        currencySplitter   : currencySplitter,
        currencyClass      : currencyClass,
        weekSplitter       : weekSplitter,
        spaceReplacer      : spaceReplacer,
        setTimeToDate      : setTimeToDate,
        makeFilterString   : makeFilterString,
        addressMaker       : addressMaker,
        mappingReportFields: mappingReportFields
    };
});
