var mongoose = require('mongoose');
require('../../models/index.js');
var ObjectId = mongoose.Schema.Types.ObjectId;

var connectOptions = {
    user: 'easyerp',
    pass: '1q2w3e!@#',
    w   : 1,
    j   : true
};

var dbsObject = {};
var CurrencySchema = mongoose.Schemas.Currency;
var orgSettingsSchema = mongoose.Schemas.orgSettingsSchema;
var dbName = 'CRM';
var dbObject = mongoose.createConnection('localhost', dbName, 27017);
dbsObject[dbName] = dbObject;
var models = require('../../helpers/models')(dbsObject);

var currencySchemaOLd = new mongoose.Schema({
    name    : {type: String, default: ''},
    symbol  : {type: String, default: ''},
    decPlace: {type: Number, default: 2},
    sequence: {type: Number}
}, {collection: 'currency'});

mongoose.model('currencyOld', currencySchemaOLd);

var CurrencyOld = models.get(dbName, 'currencyOld', currencySchemaOLd);
var Currency = models.get(dbName, 'currency', CurrencySchema);

var OrgSettings = models.get(dbName, 'orgSettings', orgSettingsSchema);

OrgSettings.findOne({}, function (err, result) {
    if (err) {
        return console.log(err);
    }

    if (result) {
        OrgSettings.findByIdAndUpdate({_id: result._id}, {$set: {currency: 'USD'}}, function (err, result) {
            if (err) {
                return console.log(err);
            }

            console.log(result);
        })
    } else {
        var el = {
            "_id"         : ObjectId("581b46939a01c15a2e3a5302"),
            "startDate"   : "2014-08-13T21:00:00Z",
            "name"        : "EasyERP Inc",
            "user"        : null,
            "language"    : null,
            "defaultEmail": false,
            "contact"     : ObjectId("52203e707d4dba8813000003"),
            "industry"    : ObjectId("574c54e22b7598157b94f10f"),
            "currency"    : "USD",
            "website"     : "www.thinkmobiles.com",
            "phone"       : "+38 096 709 86 15",
            "imageSrc"    : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
            "address"     : {
                "country": "Ukraine",
                "street" : "47 Shandora Petefi sq., 7th floor",
                "city"   : "Uzhhorod",
                "state"  : "Transcarpation",
                "fax"    : "",
                "zip"    : "88000"
            },
            "__v"         : 0,
            "contactName" : "Alex Sokhanych"
        };

        OrgSettings.collection.insert(el, function (err, result) {
            if (err) {
                return console.log(err);
            }

            console.log(result);
        });
    }
});

CurrencyOld.find({}).populate('currency._id').exec(function (err, result) {
    if (err) {
        return console.log(err);
    }

    result.forEach(function (el) {
        var body = {
            _id     : el.name,
            name    : el.name,
            decPlace: el.decPlace,
            symbol  : el.symbol
        };

        Currency.collection.insert(body, function () {
            if (err) {
                return console.log(err);
            }

            CurrencyOld.remove({_id: el._id}, function (err, result) {
                if (err) {
                    return console.log(err);
                }

                console.log('good');
            });
        });

    });
});
