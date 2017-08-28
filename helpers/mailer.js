module.exports = function () {
    var _ = require('../public/js/libs/underscore-min.map.1.6.0.js');
    var nodemailer = require('nodemailer');
    var smtpTransportObject = require('../config/mailer').noReplay;
    var registerNewUserSaaS = require('../config/mailer').registerNewUserSaaS;
    var registerNewUser = require('../config/mailer').registerNewUser;
    var pathMod = require('path');
    var moment = require('../public/js/libs/moment/moment');

    var baseOptions = {salesPerson: registerNewUserSaaS};

    var fs = require('fs');

    function deliver(mailOptions, cb) {
        var transport = nodemailer.createTransport(smtpTransportObject);

        transport.sendMail(mailOptions, function (err, response) {
            if (err) {
                console.log(err);
                if (cb && (typeof cb === 'function')) {
                    cb(err);
                }
            } else {
                if (cb && (typeof cb === 'function')) {
                    cb(null, response);
                }
            }
        });
    }

    this.forgotPassword = function (options, cb) {
        var pass = options.password;
        var dbId = options.dateBase;
        var email = options.email;
        var templateOptions;
        var mailOptions;

        templateOptions = _.extend(baseOptions, {
            password: pass,
            email   : email,
            url     : process.env.HOST + '#login?password=' + pass + '&dbId=' + dbId + '&email=' + email
        });

        mailOptions = {
            from                : 'easyerp <no-replay@easyerp.com>',
            to                  : email,
            subject             : 'Change password',
            generateTextFromHTML: true,
            html                : _.template(fs.readFileSync('public/templates/mailer/forgotPassword.html', encoding = 'utf8'), templateOptions)
        };

        deliver(mailOptions, cb);
    };

    this.changePassword = function (options) {
        var templateOptions = _.extend(baseOptions, {
            name    : options.firstname + ' ' + options.lastname,
            email   : options.email,
            password: options.password,
            url     : 'http://localhost:8823'
        });
        var mailOptions = {
            from                : 'Test',
            to                  : options.email,
            subject             : 'Change password',
            generateTextFromHTML: true,
            html                : _.template(fs.readFileSync('public/templates/mailer/changePassword.html', encoding = 'utf8'), templateOptions)
        };

        deliver(mailOptions);
    };

    this.sendInvoice = function (mailOptions, cb) {
        mailOptions = _.extend(baseOptions, mailOptions);
        mailOptions.generateTextFromHTML = true;
        mailOptions.from = mailOptions.from || 'easyerp <no-replay@easyerp.com>';
        mailOptions.html = _.template(fs.readFileSync(pathMod.join(__dirname, '../public/templates/mailer/sendInvoice.html'), encoding = 'utf8'), mailOptions);

        deliver(mailOptions, cb);
    };

    this.sendGoodsNote = function (mailOptions, cb) {

        mailOptions.generateTextFromHTML = true;
        mailOptions.from = mailOptions.from || 'easyerp <no-replay@easyerp.com>';
        mailOptions.html = _.template(fs.readFileSync(pathMod.join(__dirname, '../public/templates/mailer/sendGoodsNote.html'), encoding = 'utf8'), {});

        deliver(mailOptions, cb);
    };

    this.sendAssignedToLead = function (mailOptions, cb) {

        var templateOptions = _.extend(baseOptions, {
            isOpportunity         : mailOptions.isOpportunity,
            employee              : mailOptions.employee.first + ' ' + mailOptions.employee.last,
            opportunityName       : mailOptions.opportunityName,
            opportunityDescription: mailOptions.opportunityDescription
        });

        mailOptions.generateTextFromHTML = true;
        mailOptions.from = mailOptions.from || 'ThinkMobiles <no-replay@easyerp.com>';
        mailOptions.subject = 'Lead is assigned'; // + name Leads

        mailOptions.html = _.template(fs.readFileSync('public/templates/mailer/sendAssignedToLead.html', encoding = 'utf8'), templateOptions);

        deliver(mailOptions, cb);
    };

    this.sendHistory = function (mailOptions, cb) {
        var templateOptions = _.extend(baseOptions, {
            employee   : mailOptions.employee,
            to         : mailOptions.email,
            history    : mailOptions.history,
            you        : mailOptions.you,
            contentName: mailOptions.contentName,
            date       : mailOptions.history.date ? moment(new Date(mailOptions.history.date)).format('dddd, MMMM Do YYYY, h:mm:ss a') : moment(new Date()).format('dddd, MMMM Do YYYY, h:mm:ss a'),
            note       : mailOptions.note,
            edit       : mailOptions.edit,
            files      : mailOptions.files
        });

        mailOptions.generateTextFromHTML = true;
        mailOptions.from = mailOptions.from || 'ThinkMobiles <no-replay@easyerp.com>';
        mailOptions.subject = 'Changed ' + mailOptions.contentName;

        mailOptions.html = _.template(fs.readFileSync('public/templates/mailer/historyTemplate.html', encoding = 'utf8'), templateOptions);

        deliver(mailOptions, cb);
    };

    this.sendEmailFromTask = function (mailOptions, cb) {
        var templateOptions = _.extend(baseOptions, {
            employee   : mailOptions.employee,
            to         : mailOptions.email,
            date       : moment(new Date(mailOptions.date)).format('dddd, MMMM Do YYYY, h:mm:ss a'),
            description: mailOptions.description
        });

        mailOptions.generateTextFromHTML = true;
        mailOptions.from = mailOptions.from || 'ThinkMobiles <no-replay@easyerp.com>';
        mailOptions.subject = 'New Task';

        mailOptions.html = _.template(fs.readFileSync('public/templates/mailer/taskTemplate.html', encoding = 'utf8'), templateOptions);

        deliver(mailOptions, cb);
    };

    this.sendAddedFollower = function (mailOptions, cb) {
        var collectionName = mailOptions.collectionName;
        var contentId = mailOptions.contentId;
        var toValidCollectionName = collectionName.substr(0, 1).toUpperCase() + collectionName.substr(1).toLowerCase();
        var url = 'http://localhost:8089/#easyErp/' + toValidCollectionName + '/tform/' + contentId;

        var templateOptions = _.extend(baseOptions, {
            employee      : mailOptions.employee,
            contentName   : mailOptions.contentName,
            contentId     : contentId,
            collectionName: collectionName,
            url           : url
        });

        mailOptions.generateTextFromHTML = true;
        mailOptions.from = mailOptions.from || 'ThinkMobiles <no-replay@easyerp.com>';
        mailOptions.subject = 'You was set as a follower'; // + name Leads

        mailOptions.html = _.template(fs.readFileSync('public/templates/mailer/addedFollower.html', encoding = 'utf8'), templateOptions);

        deliver(mailOptions, cb);
    };

    this.registeredNewUserWithToken = function (options, cb) {
        var templateOptions = _.extend(baseOptions, {
            name    : options.firstName + ' ' + options.lastName,
            login   : options.login,
            password: options.password,
            email   : options.email,
            country : options.countryInput,
            city    : options.city,
            host    : options.host,
            link    : options.link
        });

        var mailOptions = {
            from                : 'easyerp <no-replay@easyerp.com>',
            to                  : 'sales@easyerp.com',
            subject             : 'new user',
            generateTextFromHTML: true,
            html                : _.template(fs.readFileSync('public/templates/mailer/registeredNewUser.html', encoding = 'utf8'), templateOptions)
        };

        var mailOptionsUser = {
            from                : 'easyerp <support@easyerp.com>',
            to                  : templateOptions.email,
            subject             : 'New registration',
            generateTextFromHTML: true,
            html                : _.template(fs.readFileSync('public/templates/mailer/newUser.html', encoding = 'utf8'), templateOptions)
        };

        deliver(mailOptionsUser, cb);
        // deliver(mailOptions);
    };

    this.registeredNewUser = function (options, cb) {
        var templateOptions = _.extend(baseOptions, {
            name    : options.firstName + ' ' + options.lastName,
            login   : options.login,
            password: options.password,
            email   : options.email,
            country : options.countryInput,
            city    : options.city,
            host    : options.host
        });
        var mailOptions = {
            from                : 'easyerp <no-replay@easyerp.com>',
            to                  : 'sales@easyerp.com',
            subject             : 'new user',
            generateTextFromHTML: true,
            html                : _.template(fs.readFileSync('public/templates/mailer/registeredNewUser.html', encoding = 'utf8'), templateOptions)
        };

        var mailOptionsUser = {
            from                : 'easyerp <support@easyerp.com>',
            to                  : templateOptions.email,
            subject             : 'Welcome to EasyERP!',
            generateTextFromHTML: true,
            html                : _.template(fs.readFileSync('public/templates/mailer/newUser.html', encoding = 'utf8'), templateOptions)
        };

        deliver(mailOptionsUser, cb);
        // deliver(mailOptions);
    };

    this.sendMailFromHelp = function (mailOptions, cb) {
        var templateOptions = _.extend(baseOptions, {
            name   : mailOptions.name,
            email  : mailOptions.email,
            message: mailOptions.message
        });

        mailOptions.generateTextFromHTML = true;
        mailOptions.subject = 'EasyErp Hepl Message';

        mailOptions.html = _.template(fs.readFileSync('public/templates/mailer/sendFromHelp.html', encoding = 'utf8'), templateOptions);

        deliver(mailOptions, cb);
    };

};

