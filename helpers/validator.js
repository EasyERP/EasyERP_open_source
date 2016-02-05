var validator = require('validator');
var xssFilters = require('xss-filters');

validator.extend('isLogin', function (str) {
    "use strict";
    var regExp = /[\w\.@]{4,100}$/;

    return regExp.test(str);
});

validator.extend('isPass', function (str) {
    "use strict";
    var regExp = /^[\w\.@]{3,100}$/;

    return regExp.test(str);
});

validator.extend('isProfile', function (str) {
    "use strict";
    var regExp = /^\d+$/;

    return regExp.test(str);
});

validator.extend('isEmployeeName', function (str) {
    "use strict";
    var regExp = /^[a-zA-Z]+[a-zA-Z-_\s]+$/;

    return regExp.test(str);
});

validator.extend('isEmployeeDate', function (str) {
    "use strict";
    var regExp = /[a-zA-Z0-9]+[a-zA-Z0-9-,#@&*-_\s()\.\/\s]+$/;

    return regExp.test(str);
});

function getValidUserBody(body) {
    "use strict";
    var hasLogin = body.hasOwnProperty('login');
    var hasEmail = body.hasOwnProperty('email');
    var hasPass = body.hasOwnProperty('pass');
    var hasProfile = body.hasOwnProperty('profile');

    hasEmail = hasEmail ? validator.isEmail(body.email) : false;
    hasLogin = hasLogin ? validator.isLogin(body.login) : false;
    hasPass = hasPass ? validator.isPass(body.pass) : false;
    hasProfile = hasProfile ? validator.isProfile(body.profile) : false;

    return hasEmail && hasLogin && hasPass && hasProfile;
}

function parseUserBody(body) {
    "use strict";
    var email = body.email;

    if (body.login) {
        body.login = validator.escape(body.login);
        body.login = xssFilters.inHTMLData(body.login);
    }
    if (email) {
        email = validator.escape(email);
        email = validator.normalizeEmail(email);

        body.email = xssFilters.inHTMLData(email);
    }
    if (body.pass) {
        body.pass = validator.escape(body.pass);
        body.pass = xssFilters.inHTMLData(body.pass);
    }

    return body;
}

function validEmployeeBody(body) {
    "use strict";
    var hasName = body.hasOwnProperty('name');
    var dateBirth = body.hasOwnProperty('dateBirth');

    var hasNameFirst = hasName ? validator.isEmployeeName(body.name.first) : false;
    var hasNameLast = hasName ? validator.isEmployeeName(body.name.first) : false;

    dateBirth = dateBirth ? validator.isDate(body.dateBirth) : false;

    return hasNameFirst && hasNameLast && dateBirth;
}

module.exports = {
    validUserBody    : getValidUserBody,
    parseUserBody    : parseUserBody,
    validEmployeeBody: validEmployeeBody
};
