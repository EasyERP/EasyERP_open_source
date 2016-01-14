module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var userSchema = mongoose.Schema({
        /**
         * @module User
         *
         * @class User
         *
         * @property {String} imageSrc - `base64` representation of avatar
         *
         * @property {String} login - Login
         * @property {String} email - Personal email
         * @property {String} pass - Password
         *
         * @property {Object} credentials
         * @property {String} credentials.refresh_token
         * @property {String} credentials.access_token
         *
         * @property {Number} profile - Profile
         * @property {Date} lastAccess - Last access
         *
         * @property {Object} kanbanSettings - Setting for `kanban` viewType
         * @property {Object} kanbanSettings.opportunities
         * @property {Number} kanbanSettings.opportunities.countPerPage
         * @property {Array} kanbanSettings.opportunities.foldWorkflows
         * @property {Object} kanbanSettings.applications
         * @property {Number} kanbanSettings.applications.countPerPage
         * @property {Array} kanbanSettings.applications.foldWorkflows
         * @property {Object} kanbanSettings.tasks
         * @property {Number} kanbanSettings.tasks.countPerPage
         * @property {Array} kanbanSettings.tasks.foldWorkflows
         *
         * @property {Array} savedFilters - Saved filters for current user
         * @property {String} relatedEmployee - Related employee for current user
         */
        imageSrc       : {
            type   : String,
            default: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC'
        },
        login          : {type: String, default: ''},
        email          : {type: String, default: ''},
        pass           : {type: String, default: ''},
        credentials    : {
            refresh_token: {type: String, default: ''},
            access_token : {type: String, default: ''}
        },
        profile        : {type: Number, ref: "Profile"},
        lastAccess     : {type: Date},
        kanbanSettings : {
            opportunities: {
                countPerPage : {type: Number, default: 10},
                foldWorkflows: [{type: String, default: ''}]
            },
            applications : {
                countPerPage : {type: Number, default: 10},
                foldWorkflows: [{type: String, default: ''}]
            },
            tasks        : {
                countPerPage : {type: Number, default: 10},
                foldWorkflows: [{type: String, default: ''}]
            }
        },
        savedFilters   : [
            {
                _id      : {type: ObjectId, ref: 'savedFilters', default: null},
                byDefault: {type: String, default: ''},
                viewType : {type: String, default: ''}
            }
        ],
        ID             : Number,
        relatedEmployee: {type: ObjectId, ref: 'Employees', default: null}
    }, {collection: 'Users'});

    mongoose.model('Users', userSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas['User'] = userSchema;
})();