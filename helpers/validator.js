var validator = require('validator');
var xssFilters = require('xss-filters');
var dateCalculator = require('./dateCalculator')

validator.extend('isLogin', function (str) {
    "use strict";
    var regExp = /[\w\.@]{4,100}$/;

    return regExp.test(str);
});

validator.extend('isNotValidChars', function (str) {
    "use strict";
    var regExp = /[~<>\^\*₴]/;

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

function getValidProfileBody(body) {
    "use strict";
    var hasName = body.hasOwnProperty('profileName');

    //not sure about regexp
    // why not && ?
    hasName = hasName ? validator.isLogin(body.profileName) : false;

    return hasName;
}

function parseProfileBody(body) {
    "use strict";

    if (body.profileName) {
        body.profileName = validator.escape(body.profileName);
        body.profileName = xssFilters.inHTMLData(body.profileName);
    }


    if (body.profileDescription) {
        body.profileDescription = validator.escape(body.profileDescription);
        body.profileDescription = xssFilters.inHTMLData(body.profileDescription);
    }

    body._id = Date.parse(new Date());

    body.profileAccess = body.profileAccess.map(function (item) {
        item.module = item.module._id;
        return item;
    });

    return body;
}

function getValidTaskBody(body) {
    "use strict";
    //toDo not finished
    var hasSummary = body.hasOwnProperty('summary');

    hasSummary = hasSummary ? !!body.summary : false;
    hasSummary = hasSummary ? !validator.isNotValidChars(body.summary) : false;

    return hasSummary ;
}

function parseTaskBody(body) {
    "use strict";

    if (body.summary) {
        body.summary = validator.escape(body.summary);
        body.summary = xssFilters.inHTMLData(body.summary);
    }
    if (body.project) {
        body.project = validator.escape(body.project);
        body.project = xssFilters.inHTMLData(body.project);
    }
    if (body.assignedTo) {
        body.assignedTo = validator.escape(body.assignedTo);
        body.assignedTo = xssFilters.inHTMLData(body.assignedTo);
    }
    if (body.type) {
        body.type = validator.escape(body.type);
        body.type = xssFilters.inHTMLData(body.type);
    }
    if (body.tags) {
        body.tags = body.tags.map(function(tag, i, tags) {
            tag = validator.escape(tag);
            tag = xssFilters.inHTMLData(tag);
            return tag;
        });
    }        //unused
    if (body.description) {
        body.description = validator.escape(body.description);
        body.description = xssFilters.inHTMLData(body.description);
    }
    if (body.priority) {
        body.priority = validator.escape(body.priority);
        body.priority = xssFilters.inHTMLData(body.priority);
    }
    if (body.sequence) {
        body.sequence = validator.escape(body.sequence);
        body.sequence = xssFilters.inHTMLData(body.sequence);
    }
    if (body.customer) {
        body.customer = validator.escape(body.customer);
        body.customer = xssFilters.inHTMLData(body.customer);
    }    //unused
    if (body.StartDate) {
        body.StartDate = new Date(body.StartDate);
        if (!body.estimated) {
            body.EndDate = new Date(body.StartDate);
        }
    }
    if (body.workflow) {
        body.workflow = validator.escape(body.workflow);
        body.workflow = xssFilters.inHTMLData(body.workflow);
    }
    if (body.uId) {
        body.createdBy = {};
        body.editedBy = {};
        body.createdBy.user = body.uId;
        body.createdBy.date = new Date();
        body.editedBy.date = new Date();
        body.editedBy.user = body.uId;
    }
    if (body.logged) {
        body.logged = validator.escape(body.logged);
        body.logged = xssFilters.inHTMLData(body.logged);
    }
    if (body.attachments) {
        var attachments = body.attachments;

        if (attachments.id) {
            attachments.id = validator.escape(attachments.id);
            attachments.id = xssFilters.inHTMLData(attachments.id);
        }
        if (attachments.name) {
            attachments.name = validator.escape(attachments.name);
            attachments.name = xssFilters.inHTMLData(attachments.name);
        }
        if (attachments.path) {
            attachments.path = validator.escape(attachments.path);
            attachments.path = xssFilters.inHTMLData(attachments.path);
        }
        if (attachments.size) {
            attachments.size = validator.escape(attachments.size);
            attachments.size = xssFilters.inHTMLData(attachments.size);
        }
        if (attachments.uploadDate) {
            attachments.uploadDate = validator.escape(attachments.uploadDate);
            attachments.uploadDate = xssFilters.inHTMLData(attachments.uploadDate);
        }
        if (attachments.uploaderName) {
            attachments.uploaderName = validator.escape(attachments.uploaderName);
            attachments.uploaderName = xssFilters.inHTMLData(attachments.uploaderName);
        }
    } //unused
    if (body.notes) {
        body.notes = validator.escape(body.notes);
        body.notes = xssFilters.inHTMLData(body.notes);
    }       //unused
    if (body.estimated) {
        body.remaining = body.estimated - body.logged;
        if (body.estimated !== 0) {
            body.progress = Math.round((body.logged / body.estimated) * 100);
        } else {
            body.progress = 0;
        }
        body.estimated = body.estimated;

        var StartDate = (body.StartDate) ? new Date(body.StartDate) : new Date();
        body.EndDate = dateCalculator.calculateTaskEndDate(StartDate, body.estimated);
        body.duration = dateCalculator.returnDuration(StartDate, body.EndDate);
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
    validUserBody: getValidUserBody,
    parseUserBody: parseUserBody,
    validProfileBody: getValidProfileBody,
    parseProfileBody: parseProfileBody,
    validTaskBody: getValidTaskBody,
    parseTaskBody: parseTaskBody,
    validEmployeeBody: validEmployeeBody
};
