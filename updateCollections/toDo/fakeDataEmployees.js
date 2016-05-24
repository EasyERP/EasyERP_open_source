var mongoose = require('mongoose');
require('../../models/index.js');
var async = require('async');

var EmployeesSchema = mongoose.Schemas.Employees;

var connectOptions = {
    user: 'easyerp',
    pass: '1q2w3e!@#',
    w   : 1,
    j   : true
};

var dbObject = mongoose.createConnection('localhost', 'demodb'/*, 27017, connectOptions*/);

//var dbObject = mongoose.createConnection('localhost', 'production');


var fakeSurnames = "Kharuk,Dubovik,Fyodor,Doodle,Biben,Alex,Mariam,Starving,Sexton,Golubovsky,Onischenko,Bilak,Сhaba,Mykoryak,Burdyuzha,Maslova,Lyulyk,Banyk,Didyk,String,Mamchyv,Tymoshenko,Kryuchkovska,Ilnytskyy,Babidorych,Savchenko,Didyk,Vachylya,Kryuchkovska,Rudnytska,Tymoshenko,Ganych,Bede,Tustanovskyy,Markov,Logachov,Sirota,Svyda,Lukinyshyn,Varchuk,Bobuk,Pivkach,Slutsky,Breza,Hyzhun,Stefano,Holubec,Mendzhul,Slavskay,Pletnev,Lizak,Saldan,Perechyn,Palyvoda,Hreschuk,Mine,Grakov,Buck,Yatsyuk,Nachod,Andrew,Roman,Vadim,Henry,Syuzev,Lyubka,Diane,Shulga,Dmitry,Vasilenko,Sica,Lukashov,Burday,Savenko,Skoroplyas,Apiary,Gil,Komorowski,Hevelyev,Haynus,Igor,Sykora,Sviridenko,Varchuk,Shershun,Hanyn,Mikulaninets,Chernenko,Ganych,Eugene,Zolotar,Svyda,Sviridyuk,Shershun,Tarcheva,Hlibchuk,Basil,Petsuh,Zayanchkovskyy,Doodle,Bede,Yakovchuk,John,Dobriansky,Andrei,Thick,Maxim,Ostrouh,Zvaryka,Volodimir,Starchenko,Bychenko,Anton,Sea,Shkurenko,Kashpur,Ivanchenko,Semenenko,Sidorenko,Banga,pikemen,Popovich,Garden,Mahoney,Zaderetskiy,Myronyuk,Opalynskyy,Shevchenko,Buzzard,Simonyan,Kurt,Lituchyy,Lower,Bereziuk,Protas,Kovalenko,Varchuk,Fedorov,John,Cali,Bede,Novohatskyy,Hubal,Zajac,Nikolenko,Malyarenko,Gresko,Vovchenko,Kolontay,Star,Breza,Bourg,Laslov,Mishchenko,Rospopa,Rogach,Rough,Korpanets,Horuzhy,Geyb,Kraynyay,Silaev,Pliska,Vizenko,Voloshchuk,Kalabishka,Drachevskyy,Jakub,Borzykh,Kampov,Kampov,Stasiuk,Stepanych,Buzz,Kolochynskyy,Islands,Sviderok,Zeykan,Himal,Chutora,Wasilewski,Majewski,Flenko,Trifonov,Rosul,Elagin,Shpishak,Samoshkin,Syuzev,Lykhach,Osadchyk,Medyukov,Tereshchenko,Popovich,Stimulating,Voronenko,Maruschak,Zavatskyy,Yakovets,Denchyk,Fadeev,Slush,Pekach,Paul,Serbyn,Kordonets,Guly,Oksymets,Chekalyuk,Andryushkina,Vodolazkyy,Nalizhyta,Davydyuk,Koberskyy,Hlybov,Shlepetskyy,Bush,Vashash,Drugova,Valchuk,Drobot,Usatyuk,Konkevych,Ivanov,Konkevych,Serbulenko,Dyachenko,Ulyanov,Fiyalka,Kulchytsky,Dedyk,Panimatchenko,Games,Semenenko,Bobrovskyy,Vodzyanova,Vedernikov,Nikitin,Ivanov,Radchenko,Dyachuk,Zharuk,Polishchuk,Podanev,Gorbov,Aminov,Grebenyuk,Tkachuk,Shpak,Chebanenko,Chutora,Goncharenko,Fayevych,Anokhin,Meshcheryakov,Manilo,Chulipa,Shved,Paul,Sadvariy,Fedelesh,Fedorko,Sviderok,Lega,Kobylyansky,Kretsu,Gavrylenko,Gavrilenko,Vajda,Maxim,Rutsynska,Bihan,Omelyanskyy,Melnichuk,Omelianenko,Brodetska,Voitenko,Ferenc,Novohatskyy,Podynskyy,Rudnytska,Bede,Slavskay,Pasichnyak,Toroni,Ermakov,Kovalev,Burak,Velichko,Leshchenko,Zinkovych,Cyril,Tsayber,Novohatskyy,Laslov,Mudrik,Konovalov,Kaschiy,Bardashov,Potapchuk,Jack,Hook,Yuri,Chagall,Lavrik,Uvarov,Kalandyak,Konovalov,Borzhymskiy,Redhead,Gaponov,Tokar,Kuzora,Samoilov";
var fakeNames = "Sergey,Edward,Olga,Nicholas,John,Yuri,Vyacheslav,Will,Tirion,Oleg,Alexey,Anastasia,Christian,John,Vladimir,Ekaterina,Michael,Andrew,Vitaliy,Inna,Daniel,Maxim,Anastasia,Dmitry,Stanislav,Yuriy,Vitaliy,Yuri,Anastasia,Natalia,Maxim,Vladislav,Sergey,Miroslav,Aleksandr,Joseph,Igor,Andrew,Oleksandr,Alexander,Egor,Anton,John,Yuri,Alexander,Andrew,Oleg,Vasuliy,Alina,Ivan,Istvan,Roman,Maria,Victor,Vladislav,Dmitry,Abram,Gabor,Vladimir,Daria,Banyk,Filodem,Belov,Moschcowich,Sergiy,Alexander,Balogh,Evgeniy,Olash,Ekaterina,Christina,Denis,Lubomir,Eugene,Paul,Mark,Sergei,Anton,Sergey,Andrew,Bags,Dmitry,Aleksandr,Alexander,Andrey,Andrew,Alexander,Vitaliy,Vlad,Yovbak,Oleg,Anastasia,Igor,Andrey,Vladimir,Nicholas,Sehlyanyk,Boris,Dmitry,Nicholas,Sergei,Roman,Krichfolushi,Eugene,Yaremenko,Vladislav,Getman,Vladislav,John,Olegovich,Artem,Alexander,Schebakov,Anton,Anton,Maxim,Vitaly,Dmitry,Alexander,Ivan,Alexander,Rostislav,Michael,Oleg,Miroslav,Alexander,Ostap,Sergey,Ruslan,Natalya,Michael,Maxim,Irina,Volodymyr,Bogdan,Ivan,Alexander,Alexander,Shpakovsky,Michael,John,Taras,Oleg,Andrew,Alexander,Dmitry,Jaroslav,Adriy,Constantin,Andrew,Yuri,Julian,Miroslav,Mykola,Peter,Anna,Rostislav,Taras,Andrew,Ivan,Michael,Philip,George,Roman,Joseph,Basil,Anatoly,Ivan,Oleg,Arsen,Julia,John,John,Yuri,Dmitry,Dmitry,Miroslav,Michael,Vladislav,Taras,Maxim,Vladimir,Sergey,Maxim,Roman,Sergey,Joseph,Artem,Taras,Olesandr,Roman,Valery,Cyril,Stanislav,Alexander,Dmitry,Elena,Alexander,Michael,Eugene,Stanislav,Ivan,Dmitry,Pomirko,Nicholas,John,Andrew,Bogdan,Oleksandr,Anna,Anton,Tatiana,Peter,Yuri,Simon,Edward,Andrew,Victor,Anna,Julia,Denis,Vadim,Taras,Dmitry,Taras,Artem,Victor,Ilya,Anna,Roman,Natalia,Sergey,Anatskyy,Dmitry,Andrew,Elena,Alain,Yuri,Roman,Anna,Roman,Alexander,Christina,Michael,Taras,Vadim,Oleg,Alexander,Valery,Oleksiy,Taras,Alexander,Basil,Artem,Artur,Volodymyr,Angelina,Ruslan,Kretsu,Alexander,Yuri,Vitaly,Miroslav,Ivan,Michael,Paul,Christina,Anton,Peter,Oros,Alla,Michael,Sergey,Vladyslav,Taras,Philip,Daniel,Dmitry,Taras,Andrew,Natalia,John,Alina,Marian,Valery,Vladislav,Viktor,Vitali,Vasily,Alexey,Boris,Nikonyenko,Victoria,Taras,Miroslav,Vitaly,Kirill,Orest,Rostislav,Anatoly,Chopey,Vladislav,Guchka,Andrew,Dmitry,Alexander,Natalia,Oleksiy,George,Andrew,Dmitry,Jaroslav,Andrew,Igor";
var fakeNamesString = fakeNames.split(',');
var fakeSurnamesString = fakeSurnames.split(',');

var Employee = dbObject.model('Employees', EmployeesSchema);

var query = Employee.find().lean();

query.exec(function (error, _res) {
    if (error) {
        return console.dir(error);
    }
    var i = 0;

    async.eachLimit(_res, 100, function (emp, callback) {
        var objectToSave = {};
        var randomNumber1 = Math.floor(Math.random() * (99999999 - 10000000  + 1) ) + 10000000;
        var randomNumber2 = Math.floor(Math.random() * (99999999 - 10000000  + 1) ) + 10000000;
        var mobileNumber = emp.workPhones ?  emp.workPhones.mobile.substring(0, 6) + randomNumber1 : '';
        var phoneNumber = emp.workPhones ?  emp.workPhones.phone.substring(0, 6) + randomNumber2 : '';


        if (emp) {
            objectToSave = {
                name         : {
                    first: fakeNamesString[i],
                    last : fakeSurnamesString[i]
                },
                personalEmail: fakeNamesString[i] + '.' + fakeSurnamesString[i] + '@gmail.com',
                workEmail    : fakeNamesString[i] + '.' + fakeSurnamesString[i] + '@thinkmobiles.com',
                workPhones   : {
                    mobile: mobileNumber,
                    phone : phoneNumber
                },
                skype        : fakeSurnamesString[i].toLowerCase()
            };
        }


        Employee.update({_id: emp._id}, objectToSave, callback);
        i++;
    }, function (err) {
        if (err) {
            return console.dir(err);
        }

        console.dir('Good');
    });
});



