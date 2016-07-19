var mongoose = require('mongoose');
require('../../models/index.js');
var async = require('async');

var ProjectSchema = mongoose.Schemas.Project;

var connectOptions = {
    user: 'easyerp',
    pass: '1q2w3e!@#',
    w   : 1,
    j   : true
};

var dbObject = mongoose.createConnection('localhost', 'demodb'/*, 27017, connectOptions*/);

//var dbObject = mongoose.createConnection('localhost', 'production');


var fakeNames = "Polyglot ,tceh ,VSL-studio,WriteContent ,sQuamis ,Studyon.guru ,REES46 ,Verstal ,Zadarma.com ,AdPar,INOSTUDIO ,MailHandler ,Nextteam,AQ Design ,bloxy ,FlipCat.net ,AdvanceTS ,BizKit ,SMS Aero ,Postgres Professional ,RockinRobin ,BrandWiFi ,eGo - CMS ,ReadyScript ,Payn ,BroDude ,Homepaq,Fingo ,protoplan.pro ,Synxronica ,LiveDune ,Muslim Jobs ,Ritm24 ,ContextProfy ,Stdio.Digital ,Hey Lucy [Now] ,Sound Space ,Sobnet ,Shopigo ,А2Б ,Sotto ,Beauty Masters ,LIFE.FILM ,Logo Magazin ,I-Megazine ,HoReKing ,PrimeLiber ,YAGLA ,nono ,Swelp ,EkosMedia ,KEPLER LEADS ,HIT THE TARGET ,IN-IT.INFO ,Ярко! ,GECTOPASCAL ,ADCONSULT ,Eurecable ,OnlineSchool ,Workly ,RoboHunter ,SkyStudio ,adStein ,LogoMachine,Massive Health,GiveForward,BizeeBee,Captricity,CareDox,Comprehend,Habit Labs,Cake Health,Ginger,Eligible,RunKeeper,Practice Fusion,Care.com,Counsyl,Kapor Capital,Felicis Ventures,Healthline Networks,Jawbone,Glooko,Flywire,Medigram,TenderTree,Weave,Asset Management Ventures,Watsi,PowerVision,CrowdMed,Three Arch Partners,Misfit,Unwind Me,True Link,Glow,iodine,SolveBio,Lively,The Human Diagnosis Project,Walker & Company Brands,HomeHero,PicnicHealth,HealthSherpa,MoveWith,Brainchild & Co.,Notable Labs,TinyRx,GAIN Fitness,SharePractice,GNS Healthcare,Bellabeat,Circle Medical,Kyruus,Medisas,fitmob,Recombine,TrueVault,ClassPass,Chewse,Rock Health,Docphin,WellnessFX,First Opinion,Nightingale App,CareCloud,Mango Health,AgileMD,Lantern,Ekso Bionics,Calm,Human API,Pact,Patients Know Best,Studio Cy,Doctor On Demand,CellScope,Flatiron Health,Havoc,Soothe,Birdi,Gyroscope,Meddik,Spire,ShopWell ,PlateJoy,FirstLine,Genomera,Careport Health,Standard Cyborg,100Plus,GoodRx,Wink Health,Fenox Venture Capital,Launchpad Digital Health,Health Gorilla,Nexercise,Doximity,Molekule,Immunity Project,Wello,TheMightyLeo,Aptible,GeoPalz,Ritter Pharmaceuticals,FIGS,Maverix Biomics,HERO,EveryMove,Sickweather,Epocrates,Simplee,MyHealthTeams,CareLinx,Hammerhead,Medicast,Shift Labs,Retrofit,Jiff,Ringadoc,Call9,hCentive,Serica,Opencare,analyticsMD,Lumo Bodytech,Polaris Partners,Senior Reports,Evidation Health,Rise,Oscar Insurance,Accountable,EyeNetra,Sano,Blueprint Medicines,Stanford-StartX Fund,QueueDr,Wellframe,MicroTransponder,ChoreS,KineRaw,Cureatr,Meadow,BitGym,PlushCare,PokitDok,ZappRx,Rallyon,MD Insider,Sherpaa,Wildflower Health,captureproof,Medlert,TigerText,Digital Assent,Luminate Health,Augmedix,Future Perfect Ventures";
var fakeNamesString = fakeNames.split(',');

var Project = dbObject.model('Project', ProjectSchema);

var query = Project.find().lean();

query.exec(function (error, _res) {
    if (error) {
        return console.dir(error);
    }
    var i = 0;

    async.eachLimit(_res, 100, function (project, callback) {
        var objectToSave = {};
        if (project) {
            objectToSave = {
                projectName : fakeNamesString[i]
            };
        }
        Project.update({_id: project._id}, objectToSave, callback);
        i++;
    }, function (err) {
        if (err) {
            return console.dir(err);
        }

        console.dir('Good');
    });
});



