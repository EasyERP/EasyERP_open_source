module.exports = function (email) {
    var firstName;
    var lastName;
    var splitter;
    var _nameArray;
    var nameStr;

    if (!('capitalizer' in String.prototype)) {
        require('./stringExtender');
    }

    function splitterRetriver(name) {
        if (name.indexOf('.') !== -1) {
            return '.';
        }
        if (name.indexOf('_') !== -1) {
            return '_';
        }
        if (name.indexOf('-') !== -1) {
            return '-';
        }

        return '';
    }


    if (email) {
        nameStr = email.substring(0, email.indexOf('@'));
        splitter = splitterRetriver(nameStr);
        _nameArray = nameStr.split(splitter);
        firstName = _nameArray[0];
        lastName = _nameArray[1];

        firstName = firstName || ' ';
        lastName = lastName || ' ';

        firstName = firstName.capitalizer('Caps');
        lastName = lastName.capitalizer('Caps');

        return {
            first: firstName,
            last : lastName
        };
    }

    return {
        first: '',
        last : ''
    };
};
