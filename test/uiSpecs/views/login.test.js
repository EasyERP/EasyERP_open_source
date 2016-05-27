define([
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai',
    'text!fixtures/index.html',
    'views/login/LoginView',
    'custom'
], function ($, chai, chaiJquery, sinonChai, fixtures, LoginView, Custom) {
    'use strict';
    var fakeFilters = {
        Product         : {
            _id           : null,
            name          : [
                {
                    _id : "5715fdf09a56725721b14df0",
                    name: "TEST"
                },
                {
                    _id : "55c0e4a30343b37542000005",
                    name: "Bank expenses"
                },
                {
                    _id : "5540d528dacb551c24000003",
                    name: "IT services"
                }
            ],
            productType   : [
                {
                    _id : "Service",
                    name: "Service"
                }
            ],
            canBeSold     : [
                {
                    _id : "true",
                    name: "True"
                },
                {
                    _id : "false",
                    name: "False"
                }
            ],
            canBeExpensed : [
                {
                    _id : "true",
                    name: "True"
                },
                {
                    _id : "false",
                    name: "False"
                }
            ],
            canBePurchased: [
                {
                    _id : "true",
                    name: "True"
                },
                {
                    _id : "false",
                    name: "False"
                }
            ]
        },
        Persons         : {
            _id     : null,
            name    : [
                {
                    _id : "56e00114b07e2ad226b6893e",
                    name: "Masami Morikawa"
                },
                {
                    _id : "56d9a09a045bc8e93c16efe4",
                    name: "Michael FitzGerald"
                },
                {
                    _id : "55b92ad621e4b7c40f000640",
                    name: "Oris4/TimWilson "
                },
                {
                    _id : "55b92ad621e4b7c40f00063e",
                    name: "VTI "
                },
                {
                    _id : "55b92ad521e4b7c40f000611",
                    name: "Remon "
                },
                {
                    _id : "55b92ad621e4b7c40f00063a",
                    name: "TrumpMedia "
                },
                {
                    _id : "55b92ad621e4b7c40f000639",
                    name: "Digital Media "
                },
                {
                    _id : "55b92ad621e4b7c40f000638",
                    name: "Unibet "
                },
                {
                    _id : "55b92ad621e4b7c40f000632",
                    name: "evista "
                },
                {
                    _id : "56a9eeabd59a04d6225b0df5",
                    name: "Peter Voloshchuk"
                },
                {
                    _id : "55b92ad621e4b7c40f00062d",
                    name: "Andreas Rabenseifner "
                },
                {
                    _id : "55b92ad521e4b7c40f00060f",
                    name: "Sharmila "
                },
                {
                    _id : "55b92ad521e4b7c40f000620",
                    name: "Thomas Sinquin "
                },
                {
                    _id : "56685d4fa3fc012a68f0d853",
                    name: "Nicolas Burer"
                },
                {
                    _id : "55b92ad621e4b7c40f00062c",
                    name: "spscontrol "
                },
                {
                    _id : "55b92ad621e4b7c40f000628",
                    name: "Quimron "
                },
                {
                    _id : "55b92ad621e4b7c40f000626",
                    name: "ShargoO "
                },
                {
                    _id : "55b92ad521e4b7c40f00061b",
                    name: "Unlimited Conferencing "
                },
                {
                    _id : "55b92ad621e4b7c40f000625",
                    name: "WishExpress "
                },
                {
                    _id : "55b92ad521e4b7c40f000613",
                    name: "Kikast "
                },
                {
                    _id : "55b92ad521e4b7c40f000610",
                    name: "Norbert "
                },
                {
                    _id : "55b92ad521e4b7c40f000615",
                    name: "TechJoiner "
                },
                {
                    _id : "55b92ad621e4b7c40f000642",
                    name: "Volodymyr Lychman "
                },
                {
                    _id : "55b92ad621e4b7c40f00063b",
                    name: "Foxtrapp "
                },
                {
                    _id : "55ba0362d79a3a343900000e",
                    name: "Ingo Nadler"
                },
                {
                    _id : "55b92ad621e4b7c40f000637",
                    name: "Airsoft Holdings "
                },
                {
                    _id : "55b92ad621e4b7c40f00064c",
                    name: "Razvan Chisu "
                },
                {
                    _id : "55b92ad521e4b7c40f000617",
                    name: "Peter Hickey "
                },
                {
                    _id : "55b92ad521e4b7c40f000612",
                    name: "Isaac S. "
                },
                {
                    _id : "55b92ad621e4b7c40f00064b",
                    name: "Thomas "
                },
                {
                    _id : "55b92ad521e4b7c40f000621",
                    name: "Mike Allstar "
                },
                {
                    _id : "55b92ad621e4b7c40f00063c",
                    name: "DigiPresents "
                },
                {
                    _id : "55b92ad621e4b7c40f000657",
                    name: "Nikky "
                },
                {
                    _id : "55b92ad621e4b7c40f00062b",
                    name: "HashPlay "
                },
                {
                    _id : "55b92ad621e4b7c40f000655",
                    name: "We do apps "
                },
                {
                    _id : "55b92ad521e4b7c40f000614",
                    name: "The Watch Enthusiast "
                },
                {
                    _id : "55ba0701d79a3a3439000012",
                    name: "Francisco Calvo Vicente"
                },
                {
                    _id : "55b92ad621e4b7c40f00065e",
                    name: "Collections Tech "
                },
                {
                    _id : "55b92ad621e4b7c40f000641",
                    name: "Global Forwarding LLC "
                },
                {
                    _id : "55b92ad521e4b7c40f00060c",
                    name: "Alexey Blinov"
                },
                {
                    _id : "55d37aee226ed3280b000005",
                    name: "Brendan Morrisey"
                },
                {
                    _id : "55b92ad521e4b7c40f000616",
                    name: "ThinkApps "
                },
                {
                    _id : "56ab5ca674d57e0d56d6bda4",
                    name: "Stian Maurstad"
                },
                {
                    _id : "55b92ad621e4b7c40f00065b",
                    name: "Kogan.com "
                },
                {
                    _id : "562bba2062461bfd59ef58c0",
                    name: "Mark Unknown"
                },
                {
                    _id : "55b92ad521e4b7c40f000618",
                    name: "Tarun M. "
                },
                {
                    _id : "55b92ad621e4b7c40f000636",
                    name: "Constantine "
                },
                {
                    _id : "55b92ad621e4b7c40f000645",
                    name: "Vlad "
                },
                {
                    _id : "55b92ad621e4b7c40f00062f",
                    name: "Mark "
                },
                {
                    _id : "55b92ad521e4b7c40f00061f",
                    name: "PostIndustria "
                },
                {
                    _id : "55b92ad521e4b7c40f000619",
                    name: "Israel "
                },
                {
                    _id : "55b92ad621e4b7c40f000648",
                    name: "Anand Gupta "
                },
                {
                    _id : "55b92ad621e4b7c40f000631",
                    name: "Tinybeans "
                },
                {
                    _id : "55b92ad621e4b7c40f000623",
                    name: "Vladi "
                },
                {
                    _id : "55b92ad621e4b7c40f000656",
                    name: "ShiwaForce "
                },
                {
                    _id : "55b92ad621e4b7c40f000635",
                    name: "Academiacs "
                },
                {
                    _id : "55b92ad621e4b7c40f000649",
                    name: "Contegra Systems "
                },
                {
                    _id : "55b92ad621e4b7c40f000627",
                    name: "UfukTogay "
                },
                {
                    _id : "55b92ad521e4b7c40f000622",
                    name: "Chamin "
                },
                {
                    _id : "55b92ad521e4b7c40f00061c",
                    name: "Genexies "
                },
                {
                    _id : "55b92ad621e4b7c40f000643",
                    name: "Angelica "
                },
                {
                    _id : "55b92ad621e4b7c40f000630",
                    name: "PPT Group "
                },
                {
                    _id : "55b92ad621e4b7c40f000644",
                    name: "iask consulting "
                },
                {
                    _id : "55b92ad621e4b7c40f000624",
                    name: "Giroptic "
                },
                {
                    _id : "55b92ad621e4b7c40f000650",
                    name: "PatrickMolander "
                },
                {
                    _id : "55b92ad521e4b7c40f00060e",
                    name: "Pekaboo/D.Kaufman "
                },
                {
                    _id : "55b92ad621e4b7c40f000653",
                    name: "Peter B. "
                },
                {
                    _id : "55b92ad621e4b7c40f00064a",
                    name: "Carussel "
                },
                {
                    _id : "55b92ad621e4b7c40f00064d",
                    name: "ProTriever "
                },
                {
                    _id : "55b92ad521e4b7c40f00061a",
                    name: "Ivcarto "
                },
                {
                    _id : "55b92ad621e4b7c40f000652",
                    name: "Zugara "
                },
                {
                    _id : "55b92ad621e4b7c40f000658",
                    name: "JellyGames "
                },
                {
                    _id : "55b92ad621e4b7c40f000634",
                    name: "Max "
                },
                {
                    _id : "569f603762d172544baf0d57",
                    name: "Nimrod Nahum"
                },
                {
                    _id : "55b92ad621e4b7c40f000659",
                    name: "PBI-Solutions "
                },
                {
                    _id : "56dff2c6622d25002676ffcd",
                    name: "Menachem Tauman"
                },
                {
                    _id : "55b92ad621e4b7c40f00065d",
                    name: "CloudFuze "
                },
                {
                    _id : "55b92ad621e4b7c40f000651",
                    name: "Dan D. "
                },
                {
                    _id : "55b9fa60d79a3a3439000005",
                    name: "Jason Coutsodimitropoulos"
                },
                {
                    _id : "55b9ff67d79a3a343900000a",
                    name: "Ruslan Kogan"
                },
                {
                    _id : "55ba006ed79a3a343900000b",
                    name: "Jeff Courter"
                },
                {
                    _id : "55ba0479d79a3a3439000010",
                    name: "Drew Lupsor"
                },
                {
                    _id : "55b92ad621e4b7c40f00064e",
                    name: "SetFile "
                },
                {
                    _id : "569f581762d172544baf0c3b",
                    name: "Dirk Ziegener"
                },
                {
                    _id : "55ba04d5d79a3a3439000011",
                    name: "Rowan Hick"
                },
                {
                    _id : "55ba0df2d79a3a3439000015",
                    name: "Erez Leket"
                },
                {
                    _id : "55d37d50226ed3280b000006",
                    name: "Matt Fulford"
                },
                {
                    _id : "55d38523226ed3280b000007",
                    name: "Peter Hickey"
                },
                {
                    _id : "55b92ad621e4b7c40f000654",
                    name: "iqDesk "
                },
                {
                    _id : "5637627bc928c61d052d500e",
                    name: "Tibor Bekefi"
                },
                {
                    _id : "55b92ad621e4b7c40f00065a",
                    name: "Technatives "
                },
                {
                    _id : "56574092bfd103f108eb4ad3",
                    name: "Ales Smokvina"
                },
                {
                    _id : "56e291651f2850d361927dd0",
                    name: "Gil Strauss"
                },
                {
                    _id : "5661809cbb8be7814fb52584",
                    name: "Selim Yilmaz"
                },
                {
                    _id : "56a0d53b62d172544baf0e3c",
                    name: "Ivar Liden"
                },
                {
                    _id : "566d4b55abccac87642cb522",
                    name: "Olivier Sans"
                },
                {
                    _id : "55b92ad621e4b7c40f000647",
                    name: "Joren Rapiny "
                },
                {
                    _id : "569f599062d172544baf0c3f",
                    name: "Gilad Nevo"
                },
                {
                    _id : "56a23c26aa157ca50f21fae0",
                    name: "Richard Hazenberg"
                },
                {
                    _id : "56a8930ceb2b76c70ec74d1d",
                    name: "Sebastian Lyall"
                }
            ],
            country : [
                {
                    _id : "Japan",
                    name: "Japan"
                },
                {
                    _id : "New Zealand",
                    name: "New Zealand"
                },
                {
                    _id : "Israel",
                    name: "Israel"
                },
                {
                    _id : "Hungary",
                    name: "Hungary"
                },
                {
                    _id : "Belgium",
                    name: "Belgium"
                },
                {
                    _id : "United States",
                    name: "United States"
                },
                {
                    _id : "UK",
                    name: "UK"
                },
                {
                    _id : "France",
                    name: "France"
                },
                {
                    _id : "Ukraine",
                    name: "Ukraine"
                },
                {
                    _id : "Ireland",
                    name: "Ireland"
                },
                {
                    _id : "Singapore",
                    name: "Singapore"
                },
                {
                    _id : "Netherlands",
                    name: "Netherlands"
                },
                {
                    _id : "Canada",
                    name: "Canada"
                },
                {
                    _id : "USA",
                    name: "USA"
                },
                {
                    _id : "UAE",
                    name: "UAE"
                },
                {
                    _id : "United Kingdom",
                    name: "United Kingdom"
                },
                {
                    _id : "Romania",
                    name: "Romania"
                },
                {
                    _id : "Germany",
                    name: "Germany"
                },
                {
                    _id : "Spain",
                    name: "Spain"
                },
                {
                    _id : "TU",
                    name: "TU"
                },
                {
                    _id : "Australia",
                    name: "Australia"
                },
                {
                    _id : "USA/Germany",
                    name: "USA/Germany"
                },
                {
                    _id : "US",
                    name: "US"
                },
                {
                    _id : "Sweden",
                    name: "Sweden"
                },
                {
                    _id : "Ohio",
                    name: "Ohio"
                },
                {
                    _id : "Thailand",
                    name: "Thailand"
                }
            ],
            services: [
                {
                    _id : "isSupplier",
                    name: "Supplier"
                },
                {
                    _id : "isCustomer",
                    name: "Customer"
                }
            ]
        },
        Companies       : {
            _id     : null,
            name    : [
                {
                    _id : "56e290f1896e98a661aa831a",
                    name: "Game scale "
                },
                {
                    _id : "56dff9147e20c5df25a36bbf",
                    name: "Lassic "
                },
                {
                    _id : "56fa4cdce7050b54043a6955",
                    name: "SPSControl "
                },
                {
                    _id : "56a0d4b962d172544baf0e3b",
                    name: "Chimney "
                },
                {
                    _id : "569f5fbf62d172544baf0d56",
                    name: "BIScience "
                },
                {
                    _id : "569f57be62d172544baf0c3a",
                    name: "ETECTURE GmbH "
                },
                {
                    _id : "566d4b35abccac87642cb521",
                    name: "Scatch "
                },
                {
                    _id : "562ff202547f50b51d6de2b8",
                    name: "Appsmakerstore "
                },
                {
                    _id : "562bed4062461bfd59ef58d1",
                    name: "TreatMe "
                },
                {
                    _id : "561d1bc0b51032d674856acb",
                    name: "Attrecto "
                },
                {
                    _id : "5604170eb904af832d000005",
                    name: "Stentle "
                },
                {
                    _id : "56030d81fa3f91444e00000c",
                    name: "Peter F "
                },
                {
                    _id : "55f56406b81672730c00002e",
                    name: "App Institute "
                },
                {
                    _id : "569f590262d172544baf0c3e",
                    name: "Time2view "
                },
                {
                    _id : "562bc2db62461bfd59ef58c7",
                    name: "AppMedia "
                },
                {
                    _id : "55b92ad621e4b7c40f000633",
                    name: "Chris Mack "
                },
                {
                    _id : "5661805cbb8be7814fb52529",
                    name: "Otrema "
                },
                {
                    _id : "55b92ad621e4b7c40f00063f",
                    name: "Hussam "
                },
                {
                    _id : "55ba0301d79a3a343900000d",
                    name: "#Play "
                },
                {
                    _id : "56dff22b7e20c5df25a36bb6",
                    name: "Qmasters "
                },
                {
                    _id : "55cf362b4a91e37b0b0000c1",
                    name: "MobStar "
                },
                {
                    _id : "55b92ad621e4b7c40f00062e",
                    name: "Web1 Syndication, Inc "
                },
                {
                    _id : "55b92ad521e4b7c40f00061e",
                    name: "Luke Raskino "
                },
                {
                    _id : "55b92ad621e4b7c40f000646",
                    name: "EtienneL "
                },
                {
                    _id : "56574032bfd103f108eb4ad2",
                    name: "Marand "
                },
                {
                    _id : "55b9fe20d79a3a3439000009",
                    name: "Kogan "
                },
                {
                    _id : "55b92ad521e4b7c40f00061d",
                    name: "Buzinga "
                },
                {
                    _id : "56a9ee95d59a04d6225b0df4",
                    name: "ThinkMobiles "
                },
                {
                    _id : "55b92ad521e4b7c40f00060d",
                    name: "Sportsman Tracker "
                },
                {
                    _id : "56dffe038594da632689f1ca",
                    name: "Takumi Networks "
                },
                {
                    _id : "55b92ad621e4b7c40f00064f",
                    name: "Kenlo Group Ltd "
                },
                {
                    _id : "55b92ad621e4b7c40f00063d",
                    name: "Gomez "
                },
                {
                    _id : "55ba0b46d79a3a3439000013",
                    name: "Unibet "
                },
                {
                    _id : "55b92ad621e4b7c40f000629",
                    name: "Cristaliza "
                },
                {
                    _id : "55cdc93c9b42266a4f000005",
                    name: "AgileFind "
                },
                {
                    _id : "55b92ad621e4b7c40f00062a",
                    name: "PeachInc "
                },
                {
                    _id : "55f55854b81672730c000010",
                    name: "MediaHeads "
                },
                {
                    _id : "55cf4f834a91e37b0b000102",
                    name: "SharperBuilds "
                },
                {
                    _id : "55ba03f8d79a3a343900000f",
                    name: "GlobalWorkshop "
                },
                {
                    _id : "55deb987ae2b22730b000018",
                    name: "Yello "
                },
                {
                    _id : "55cf5c194a91e37b0b00012b",
                    name: "Global Workshop Solutions "
                },
                {
                    _id : "5637a8e2bf9592df04c55115",
                    name: "Colestreet "
                },
                {
                    _id : "55edaf167221afe30b000040",
                    name: "BetterIt "
                }
            ],
            country : [
                {
                    _id : "Italy",
                    name: "Italy"
                },
                {
                    _id : "Japan",
                    name: "Japan"
                },
                {
                    _id : "Ireland",
                    name: "Ireland"
                },
                {
                    _id : "USA",
                    name: "USA"
                },
                {
                    _id : "Germany",
                    name: "Germany"
                },
                {
                    _id : "Australia",
                    name: "Australia"
                },
                {
                    _id : "United Kingdom",
                    name: "United Kingdom"
                },
                {
                    _id : "United States",
                    name: "United States"
                },
                {
                    _id : "UK",
                    name: "UK"
                },
                {
                    _id : "England",
                    name: "England"
                },
                {
                    _id : "New Zealand",
                    name: "New Zealand"
                },
                {
                    _id : "Spain",
                    name: "Spain"
                },
                {
                    _id : "Sweden",
                    name: "Sweden"
                },
                {
                    _id : "Brazil",
                    name: "Brazil"
                },
                {
                    _id : "Norway",
                    name: "Norway"
                },
                {
                    _id : "Canada",
                    name: "Canada"
                },
                {
                    _id : "OAE",
                    name: "OAE"
                },
                {
                    _id : "Israel",
                    name: "Israel"
                },
                {
                    _id : "USAd",
                    name: "USAd"
                }
            ],
            services: [
                {
                    _id : "isSupplier",
                    name: "Supplier"
                },
                {
                    _id : "isCustomer",
                    name: "Customer"
                }
            ]
        },
        supplierPayments: {
            _id       : null,
            supplier  : [
                {
                    _id : "55b92ad221e4b7c40f00004b",
                    name: "Roland Katona"
                },
                {
                    _id : "55b92ad221e4b7c40f000063",
                    name: "Yana Gusti"
                },
                {
                    _id : "55b92ad221e4b7c40f00005f",
                    name: "Peter Voloshchuk"
                },
                {
                    _id : "55b92ad221e4b7c40f00004a",
                    name: "Oleg Ostroverkh"
                }
            ],
            paymentRef: [
                {
                    _id : "Sales/Head 8%",
                    name: "Sales/Head 8%"
                },
                {
                    _id : "Sales/Usual 8%",
                    name: "Sales/Usual 8%"
                },
                {
                    _id : "Sales/QA 14%",
                    name: "Sales/QA 14%"
                },
                {
                    _id : "Sales/QA 16%",
                    name: "Sales/QA 16%"
                },
                {
                    _id : "Sales/Head 10%",
                    name: "Sales/Head 10%"
                }
            ],
            year      : [
                {
                    _id : 2014,
                    name: 2014
                },
                {
                    _id : 2015,
                    name: 2015
                }
            ],
            month     : [
                {
                    _id : 3,
                    name: 3
                },
                {
                    _id : 4,
                    name: 4
                },
                {
                    _id : 5,
                    name: 5
                },
                {
                    _id : 10,
                    name: 10
                },
                {
                    _id : 2,
                    name: 2
                },
                {
                    _id : 12,
                    name: 12
                },
                {
                    _id : 11,
                    name: 11
                },
                {
                    _id : 8,
                    name: 8
                },
                {
                    _id : 1,
                    name: 1
                }
            ],
            workflow  : [
                {
                    _id : "Paid",
                    name: "Paid"
                }
            ]
        },
        customerPayments: {
            _id          : null,
            assigned     : [
                {
                    _id : "56029cc950de7f4138000005",
                    name: "Eugen Lendyel"
                },
                {
                    _id : "55b92ad221e4b7c40f0000a2",
                    name: "Igor Stan"
                },
                {
                    _id : "55b92ad221e4b7c40f0000cb",
                    name: "Alona Yelahina"
                },
                {
                    _id : "55b92ad221e4b7c40f00005f",
                    name: "Peter Voloshchuk"
                }
            ],
            supplier     : [
                {
                    _id : "56a8930ceb2b76c70ec74d1d",
                    name: "Sebastian Lyall"
                },
                {
                    _id : "566d4b35abccac87642cb521",
                    name: "Scatch "
                },
                {
                    _id : "56e291651f2850d361927dd0",
                    name: "Gil Strauss"
                }
            ],
            name         : [
                {
                    _id : "5703a90bec814f7c039b808c",
                    name: "PP_330"
                },
                {
                    _id : "5703a77eed3f15af0782f17f",
                    name: "PP_328"
                },
                {
                    _id : "5703a6fc69c37d5903700b6e",
                    name: "PP_327"
                }
            ],
            paymentMethod: [
                {
                    _id : "565f2e05ab70d49024242e0b",
                    name: "Ukrsibbank 26005536599700"
                },
                {
                    _id : "555cc981532aebbc4a8baf38",
                    name: "Primary"
                },
                {
                    _id : "565f2e05ab70d49024242e10",
                    name: "CASH UAH"
                }
            ]
        },
        Projects        : {
            _id           : null,
            workflow      : [
                {
                    _id : "528ce7d0f3f67bc40b000021",
                    name: "New"
                },
                {
                    _id : "528ce80ef3f67bc40b000024",
                    name: "Cancelled"
                },
                {
                    _id : "528ce7e3f3f67bc40b000022",
                    name: "Pending"
                },
                {
                    _id : "528ce82df3f67bc40b000025",
                    name: "Closed"
                },
                {
                    _id : "528ce7f2f3f67bc40b000023",
                    name: "In Progress"
                }
            ],
            customer      : [
                {
                    _id : "55d38523226ed3280b000007",
                    name: "Peter Hickey"
                },
                {
                    _id : "56a9eeabd59a04d6225b0df5",
                    name: "Peter Voloshchuk"
                },
                {
                    _id : "56e291651f2850d361927dd0",
                    name: "Gil Strauss"
                },
                {
                    _id : "56dffe038594da632689f1ca",
                    name: "Takumi Networks "
                },
                {
                    _id : "56dff9147e20c5df25a36bbf",
                    name: "Lassic "
                },
                {
                    _id : "56a9ee95d59a04d6225b0df4",
                    name: "ThinkMobiles "
                },
                {
                    _id : "56a8930ceb2b76c70ec74d1d",
                    name: "Sebastian Lyall"
                },
                {
                    _id : "56a23c26aa157ca50f21fae0",
                    name: "Richard Hazenberg"
                },
                {
                    _id : "56a0d53b62d172544baf0e3c",
                    name: "Ivar Liden"
                },
                {
                    _id : "569f57be62d172544baf0c3a",
                    name: "ETECTURE GmbH "
                },
                {
                    _id : "55b92ad621e4b7c40f000640",
                    name: "Oris4/TimWilson "
                },
                {
                    _id : "56d9a09a045bc8e93c16efe4",
                    name: "Michael FitzGerald"
                },
                {
                    _id : "55b92ad621e4b7c40f00062e",
                    name: "Web1 Syndication, Inc "
                },
                {
                    _id : "55b92ad521e4b7c40f000618",
                    name: "Tarun M. "
                },
                {
                    _id : "55b92ad621e4b7c40f000625",
                    name: "WishExpress "
                },
                {
                    _id : "55b92ad521e4b7c40f000613",
                    name: "Kikast "
                },
                {
                    _id : "56030d81fa3f91444e00000c",
                    name: "Peter F "
                },
                {
                    _id : "55b92ad621e4b7c40f000655",
                    name: "We do apps "
                },
                {
                    _id : "55b92ad621e4b7c40f00062b",
                    name: "HashPlay "
                },
                {
                    _id : "55b92ad621e4b7c40f000659",
                    name: "PBI-Solutions "
                },
                {
                    _id : "569f603762d172544baf0d57",
                    name: "Nimrod Nahum"
                },
                {
                    _id : "55b92ad621e4b7c40f000634",
                    name: "Max "
                },
                {
                    _id : "55b92ad621e4b7c40f00064e",
                    name: "SetFile "
                },
                {
                    _id : "55b92ad621e4b7c40f00063b",
                    name: "Foxtrapp "
                },
                {
                    _id : "55b92ad621e4b7c40f000639",
                    name: "Digital Media "
                },
                {
                    _id : "55b92ad621e4b7c40f000652",
                    name: "Zugara "
                },
                {
                    _id : "55b92ad621e4b7c40f000632",
                    name: "evista "
                },
                {
                    _id : "569f599062d172544baf0c3f",
                    name: "Gilad Nevo"
                },
                {
                    _id : "55b92ad621e4b7c40f000647",
                    name: "Joren Rapiny "
                },
                {
                    _id : "55b92ad621e4b7c40f000646",
                    name: "EtienneL "
                },
                {
                    _id : "55b92ad521e4b7c40f000617",
                    name: "Peter Hickey "
                },
                {
                    _id : "55b92ad521e4b7c40f000612",
                    name: "Isaac S. "
                },
                {
                    _id : "55b92ad621e4b7c40f00064b",
                    name: "Thomas "
                },
                {
                    _id : "55b92ad621e4b7c40f000648",
                    name: "Anand Gupta "
                },
                {
                    _id : "55b92ad521e4b7c40f000622",
                    name: "Chamin "
                },
                {
                    _id : "55b92ad521e4b7c40f00061d",
                    name: "Buzinga "
                },
                {
                    _id : "55b92ad521e4b7c40f000619",
                    name: "Israel "
                },
                {
                    _id : "55b92ad521e4b7c40f00060e",
                    name: "Pekaboo/D.Kaufman "
                },
                {
                    _id : "55b92ad621e4b7c40f000653",
                    name: "Peter B. "
                },
                {
                    _id : "55b92ad621e4b7c40f000657",
                    name: "Nikky "
                },
                {
                    _id : "55b92ad621e4b7c40f00063c",
                    name: "DigiPresents "
                },
                {
                    _id : "55b92ad521e4b7c40f000621",
                    name: "Mike Allstar "
                },
                {
                    _id : "55edaf167221afe30b000040",
                    name: "BetterIt "
                },
                {
                    _id : "55b92ad521e4b7c40f000620",
                    name: "Thomas Sinquin "
                },
                {
                    _id : "55b92ad621e4b7c40f000645",
                    name: "Vlad "
                },
                {
                    _id : "55b92ad621e4b7c40f000636",
                    name: "Constantine "
                },
                {
                    _id : "56685d4fa3fc012a68f0d853",
                    name: "Nicolas Burer"
                },
                {
                    _id : "55b92ad621e4b7c40f000658",
                    name: "JellyGames "
                },
                {
                    _id : "55b92ad621e4b7c40f00063f",
                    name: "Hussam "
                },
                {
                    _id : "55b92ad621e4b7c40f00064f",
                    name: "Kenlo Group Ltd "
                },
                {
                    _id : "55f56406b81672730c00002e",
                    name: "App Institute "
                },
                {
                    _id : "55b92ad521e4b7c40f00061f",
                    name: "PostIndustria "
                },
                {
                    _id : "55cdc93c9b42266a4f000005",
                    name: "AgileFind "
                },
                {
                    _id : "55b92ad621e4b7c40f000649",
                    name: "Contegra Systems "
                },
                {
                    _id : "55b92ad621e4b7c40f000635",
                    name: "Academiacs "
                },
                {
                    _id : "55cf5c194a91e37b0b00012b",
                    name: "Global Workshop Solutions "
                },
                {
                    _id : "56574032bfd103f108eb4ad2",
                    name: "Marand "
                },
                {
                    _id : "55b92ad621e4b7c40f000651",
                    name: "Dan D. "
                },
                {
                    _id : "55b92ad621e4b7c40f000633",
                    name: "Chris Mack "
                },
                {
                    _id : "55b92ad621e4b7c40f000656",
                    name: "ShiwaForce "
                },
                {
                    _id : "55b92ad621e4b7c40f000638",
                    name: "Unibet "
                },
                {
                    _id : "55b92ad621e4b7c40f00065a",
                    name: "Technatives "
                },
                {
                    _id : "55b92ad521e4b7c40f00061e",
                    name: "Luke Raskino "
                },
                {
                    _id : "55b92ad521e4b7c40f000610",
                    name: "Norbert "
                },
                {
                    _id : "55b92ad621e4b7c40f000630",
                    name: "PPT Group "
                },
                {
                    _id : "55b92ad521e4b7c40f00060d",
                    name: "Sportsman Tracker "
                },
                {
                    _id : "562ff202547f50b51d6de2b8",
                    name: "Appsmakerstore "
                },
                {
                    _id : "55b92ad621e4b7c40f000641",
                    name: "Global Forwarding LLC "
                },
                {
                    _id : "55b92ad521e4b7c40f00060c",
                    name: "Alexey Blinov"
                },
                {
                    _id : "55b92ad621e4b7c40f000623",
                    name: "Vladi "
                },
                {
                    _id : "55b92ad621e4b7c40f000631",
                    name: "Tinybeans "
                },
                {
                    _id : "55b92ad521e4b7c40f000614",
                    name: "The Watch Enthusiast "
                },
                {
                    _id : "55b92ad621e4b7c40f000650",
                    name: "PatrickMolander "
                },
                {
                    _id : "55b92ad621e4b7c40f000624",
                    name: "Giroptic "
                },
                {
                    _id : "55b92ad621e4b7c40f000629",
                    name: "Cristaliza "
                },
                {
                    _id : "55b92ad621e4b7c40f000637",
                    name: "Airsoft Holdings "
                },
                {
                    _id : "55b92ad621e4b7c40f00064c",
                    name: "Razvan Chisu "
                },
                {
                    _id : "55b92ad621e4b7c40f00062f",
                    name: "Mark "
                },
                {
                    _id : "55b92ad521e4b7c40f000611",
                    name: "Remon "
                },
                {
                    _id : "55b92ad621e4b7c40f00063e",
                    name: "VTI "
                },
                {
                    _id : "55b92ad621e4b7c40f00064a",
                    name: "Carussel "
                },
                {
                    _id : "55b92ad521e4b7c40f000615",
                    name: "TechJoiner "
                },
                {
                    _id : "55b92ad621e4b7c40f000628",
                    name: "Quimron "
                },
                {
                    _id : "55b92ad621e4b7c40f00063d",
                    name: "Gomez "
                },
                {
                    _id : "55b92ad621e4b7c40f00063a",
                    name: "TrumpMedia "
                },
                {
                    _id : "55cf4f834a91e37b0b000102",
                    name: "SharperBuilds "
                },
                {
                    _id : "55b92ad621e4b7c40f00062a",
                    name: "PeachInc "
                },
                {
                    _id : "55b92ad621e4b7c40f00064d",
                    name: "ProTriever "
                },
                {
                    _id : "55b92ad621e4b7c40f00062c",
                    name: "spscontrol "
                },
                {
                    _id : "55f55854b81672730c000010",
                    name: "MediaHeads "
                },
                {
                    _id : "56dff2c6622d25002676ffcd",
                    name: "Menachem Tauman"
                },
                {
                    _id : "55b92ad621e4b7c40f00065d",
                    name: "CloudFuze "
                },
                {
                    _id : "55b92ad621e4b7c40f00065e",
                    name: "Collections Tech "
                },
                {
                    _id : "55b92ad621e4b7c40f000643",
                    name: "Angelica "
                },
                {
                    _id : "55b92ad521e4b7c40f00061c",
                    name: "Genexies "
                },
                {
                    _id : "56ab5ca674d57e0d56d6bda4",
                    name: "Stian Maurstad"
                },
                {
                    _id : "55b92ad621e4b7c40f00065b",
                    name: "Kogan.com "
                },
                {
                    _id : "55b92ad521e4b7c40f00061b",
                    name: "Unlimited Conferencing "
                },
                {
                    _id : "5604170eb904af832d000005",
                    name: "Stentle "
                },
                {
                    _id : "55b92ad621e4b7c40f00062d",
                    name: "Andreas Rabenseifner "
                },
                {
                    _id : "55cf362b4a91e37b0b0000c1",
                    name: "MobStar "
                },
                {
                    _id : "55b92ad621e4b7c40f000642",
                    name: "Volodymyr Lychman "
                },
                {
                    _id : "55deb987ae2b22730b000018",
                    name: "Yello "
                },
                {
                    _id : "55ba0df2d79a3a3439000015",
                    name: "Erez Leket"
                },
                {
                    _id : "5661805cbb8be7814fb52529",
                    name: "Otrema "
                },
                {
                    _id : "561d1bc0b51032d674856acb",
                    name: "Attrecto "
                },
                {
                    _id : "562bc2db62461bfd59ef58c7",
                    name: "AppMedia "
                },
                {
                    _id : "562bed4062461bfd59ef58d1",
                    name: "TreatMe "
                },
                {
                    _id : "5637627bc928c61d052d500e",
                    name: "Tibor Bekefi"
                },
                {
                    _id : "5637a8e2bf9592df04c55115",
                    name: "Colestreet "
                },
                {
                    _id : "566d4b35abccac87642cb521",
                    name: "Scatch "
                }
            ],
            projectmanager: [
                {
                    _id : "55b92ad221e4b7c40f000030",
                    name: "Alex Svatuk"
                },
                {
                    _id : "56029cc950de7f4138000005",
                    name: "Eugen Lendyel"
                },
                {
                    _id : "5602a01550de7f4138000008",
                    name: "Yana Dufynets"
                },
                {
                    _id : "561ba8639ebb48212ea838c4",
                    name: "Nataliya Yartysh"
                },
                {
                    _id : "55b92ad221e4b7c40f000063",
                    name: "Yana Gusti"
                },
                {
                    _id : "561b756f9ebb48212ea838c0",
                    name: "Stanislav Romanyuk"
                },
                {
                    _id : "56123232c90e2fb026ce064b",
                    name: "Olga Sikora"
                },
                {
                    _id : "55b92ad221e4b7c40f0000a2",
                    name: "Igor Stan"
                },
                {
                    _id : "55b92ad221e4b7c40f00005f",
                    name: "Peter Voloshchuk"
                },
                {
                    _id : "55b92ad221e4b7c40f0000cb",
                    name: "Alona Yelahina"
                },
                {
                    _id : "55b92ad221e4b7c40f00004a",
                    name: "Oleg Ostroverkh"
                },
                {
                    _id : "55b92ad221e4b7c40f000040",
                    name: "Vasiliy Almashiy"
                },
                {
                    _id : "565f0fa6f6427f253cf6bf19",
                    name: "Alex Lysachenko"
                },
                {
                    _id : "55b92ad221e4b7c40f000031",
                    name: "Alex Gleba"
                },
                {
                    _id : "55b92ad221e4b7c40f00004f",
                    name: "Alex Sokhanych"
                },
                {
                    _id : "55b92ad221e4b7c40f00004b",
                    name: "Roland Katona"
                },
                {
                    _id : "55b92ad221e4b7c40f0000bb",
                    name: "Igor Shepinka"
                },
                {
                    _id : "55b92ad221e4b7c40f00009b",
                    name: "Larysa Popp"
                },
                {
                    _id : "55b92ad221e4b7c40f0000a0",
                    name: "Ivan Bilak"
                }
            ],
            name          : [
                {
                    _id : "57063f34c3a5da3e0347a4b9",
                    name: "PriceBox WEB"
                },
                {
                    _id : "5703a427c3a5da3e0347a481",
                    name: "Command Center"
                },
                {
                    _id : "56e292585def9136621b7800",
                    name: "Casino"
                },
                {
                    _id : "56e2924a1f2850d361927dd1",
                    name: "Poems app"
                },
                {
                    _id : "56e005f0f20b93842671670d",
                    name: "Spoon Comics"
                },
                {
                    _id : "56e003948594da632689f1cd",
                    name: "Phone app"
                },
                {
                    _id : "56e001b7622d25002676ffd3",
                    name: "Nexture site"
                },
                {
                    _id : "56dff1b4a12a4f3c26919c91",
                    name: "EasyERP"
                },
                {
                    _id : "56bdcc69dfd8a81466e2f58a",
                    name: "Buzinga extra costs"
                },
                {
                    _id : "56bc8fd2dfd8a81466e2f46b",
                    name: "WSpider"
                },
                {
                    _id : "56b09dd8d6ef38a708dfc284",
                    name: "Vike Analytics Integration"
                },
                {
                    _id : "56ab958e74d57e0d56d6be3b",
                    name: "Planogram"
                },
                {
                    _id : "56aa2cb4b4dc0d09232bd7aa",
                    name: "AngularJS - Stentle"
                },
                {
                    _id : "56dffa45f20b938426716709",
                    name: "ESTablet web"
                },
                {
                    _id : "56a24d5faa157ca50f21fb13",
                    name: "Water Safety App"
                },
                {
                    _id : "56e93c3b07ea2d845ef75dff",
                    name: "Guru"
                },
                {
                    _id : "56d9a14f7891423e3d5b8f18",
                    name: "Habi"
                },
                {
                    _id : "56a0d60062d172544baf0e3d",
                    name: "BuddyBet"
                },
                {
                    _id : "569f60d162d172544baf0d58",
                    name: "Android advertisement"
                },
                {
                    _id : "569f58df62d172544baf0c3d",
                    name: "Haie"
                },
                {
                    _id : "569ced3fea21e2ac7d729e18",
                    name: "MySmallCommunity"
                },
                {
                    _id : "565740e0bfd103f108eb4ad4",
                    name: "HKConnect"
                },
                {
                    _id : "56422bfc70bbc2b740ce89f3",
                    name: "PREEME"
                },
                {
                    _id : "5702160eed3f15af0782f13a",
                    name: "Andreas Project 2"
                },
                {
                    _id : "5638e863593807ff047d99e5",
                    name: "Bizrate"
                },
                {
                    _id : "56dea0a5c235df7c05aa635c",
                    name: "PhotoShop app"
                },
                {
                    _id : "56ab891074d57e0d56d6be1f",
                    name: "Serial Box"
                },
                {
                    _id : "562ff292b03714731dd8433b",
                    name: "Appsmakerstore"
                },
                {
                    _id : "56fd3453a33b73e503e3eb65",
                    name: "Donation App"
                },
                {
                    _id : "562bba6e4a431b5a5a3111fe",
                    name: "Spark"
                },
                {
                    _id : "5629e238129820ab5994e8c0",
                    name: "Bus Project"
                },
                {
                    _id : "561ebb8cd6c741e8235f42ea",
                    name: "Bodega application"
                },
                {
                    _id : "56a89384eb2b76c70ec74d1e",
                    name: "Locappy"
                },
                {
                    _id : "5613b6f0c90e2fb026ce068c",
                    name: "iTacit"
                },
                {
                    _id : "56e689c75ec71b00429745a9",
                    name: "360CamSDK"
                },
                {
                    _id : "561253dfc90e2fb026ce064d",
                    name: "Shiwaforce Karma QA"
                },
                {
                    _id : "562beda846bca6e4591f4930",
                    name: "TreatMe"
                },
                {
                    _id : "56030dbffa3f91444e00000d",
                    name: "Firderberg"
                },
                {
                    _id : "55f5728cb81672730c00006a",
                    name: "BetterIt ios"
                },
                {
                    _id : "55f55d31b81672730c000020",
                    name: "Farmers App"
                },
                {
                    _id : "55f56442b81672730c000032",
                    name: "Tinder clone"
                },
                {
                    _id : "55f55a89b81672730c000017",
                    name: "Bimii"
                },
                {
                    _id : "55ded24cae2b22730b000040",
                    name: "FarmStatistic"
                },
                {
                    _id : "55deb95bae2b22730b000017",
                    name: "YelloDrive"
                },
                {
                    _id : "55de2a30f09cc2ec0b00004e",
                    name: "GovMap"
                },
                {
                    _id : "55de24bbf09cc2ec0b000036",
                    name: "FosterFarms"
                },
                {
                    _id : "56afdabef5c2bcd4555cb2f8",
                    name: "Design Slots"
                },
                {
                    _id : "563295f6c928c61d052d5003",
                    name: "WordPress Sites"
                },
                {
                    _id : "55cf4fc74a91e37b0b000103",
                    name: "Legal Application"
                },
                {
                    _id : "570b6a5df684d1240d484b6e",
                    name: "Test"
                },
                {
                    _id : "55cf36d54a91e37b0b0000c2",
                    name: "Mobstar"
                },
                {
                    _id : "563767135d23a8eb04e80aec",
                    name: "Coach App"
                },
                {
                    _id : "55cdc96d9b42266a4f000006",
                    name: "Absolute Vodka"
                },
                {
                    _id : "55b92ad621e4b7c40f0006d6",
                    name: "ArTV"
                },
                {
                    _id : "56618227bb8be7814fb526e5",
                    name: "Otrema WP4"
                },
                {
                    _id : "55b92ad621e4b7c40f0006d5",
                    name: "Unlimited Conferencing"
                },
                {
                    _id : "55b92ad621e4b7c40f0006d4",
                    name: "M-Government"
                },
                {
                    _id : "55b92ad621e4b7c40f0006cf",
                    name: "Kogan Apps"
                },
                {
                    _id : "55b92ad621e4b7c40f0006ce",
                    name: "FlipStar Game"
                },
                {
                    _id : "55b92ad621e4b7c40f0006cd",
                    name: "CloudFuze"
                },
                {
                    _id : "55b92ad621e4b7c40f0006cb",
                    name: "Bayzat"
                },
                {
                    _id : "55b92ad621e4b7c40f0006ca",
                    name: "SketchTechPoints"
                },
                {
                    _id : "56dff3458594da632689f1c7",
                    name: "ThinkMobiles Web"
                },
                {
                    _id : "55b92ad621e4b7c40f0006c8",
                    name: "PriTriever"
                },
                {
                    _id : "561d1c3db51032d674856acc",
                    name: "PayFever"
                },
                {
                    _id : "55f55901b81672730c000011",
                    name: "WhachApp"
                },
                {
                    _id : "55b92ad621e4b7c40f00068c",
                    name: "DRH manual"
                },
                {
                    _id : "55b92ad621e4b7c40f000685",
                    name: "Travlr"
                },
                {
                    _id : "569f5bc662d172544baf0c40",
                    name: "Gilad Nevo Bug fixing"
                },
                {
                    _id : "55b92ad621e4b7c40f000684",
                    name: "OnSite Unibet"
                },
                {
                    _id : "55b92ad621e4b7c40f000670",
                    name: "iRemember"
                },
                {
                    _id : "55b92ad621e4b7c40f0006a9",
                    name: "Spokal"
                },
                {
                    _id : "55b92ad621e4b7c40f000682",
                    name: "Connexus"
                },
                {
                    _id : "55b92ad621e4b7c40f000681",
                    name: "AirPort"
                },
                {
                    _id : "56a9ef06d59a04d6225b0df6",
                    name: "UpCity"
                },
                {
                    _id : "55b92ad621e4b7c40f00068e",
                    name: "Phidget ANE"
                },
                {
                    _id : "56304d56547f50b51d6de2bb",
                    name: "Move for Less"
                },
                {
                    _id : "55b92ad621e4b7c40f00066b",
                    name: "Nikky"
                },
                {
                    _id : "56a23c5caa157ca50f21fae1",
                    name: "Demolition Derby"
                },
                {
                    _id : "55b92ad621e4b7c40f00069c",
                    name: "sTrader"
                },
                {
                    _id : "56ab5ceb74d57e0d56d6bda5",
                    name: "CAPT"
                },
                {
                    _id : "55b92ad621e4b7c40f00067e",
                    name: "SoulIntentions"
                },
                {
                    _id : "55b92ad621e4b7c40f00067b",
                    name: "Android Help"
                },
                {
                    _id : "55b92ad621e4b7c40f0006d8",
                    name: "Casino Game"
                },
                {
                    _id : "55b92ad621e4b7c40f00068f",
                    name: "QMR Android"
                },
                {
                    _id : "55b92ad621e4b7c40f0006d7",
                    name: "Mesa Ave"
                },
                {
                    _id : "55b92ad621e4b7c40f0006a0",
                    name: "GetFit"
                },
                {
                    _id : "55b92ad621e4b7c40f0006c9",
                    name: "spscontrol"
                },
                {
                    _id : "55b92ad621e4b7c40f000677",
                    name: "Android Tribesta"
                },
                {
                    _id : "55b92ad621e4b7c40f00066a",
                    name: "The Watch Enthusiast"
                },
                {
                    _id : "55b92ad621e4b7c40f0006c6",
                    name: "Demo Rocket"
                },
                {
                    _id : "55b92ad621e4b7c40f000687",
                    name: "iOS/Tribesta"
                },
                {
                    _id : "55b92ad621e4b7c40f000664",
                    name: "BelgiumHTML"
                },
                {
                    _id : "55b92ad621e4b7c40f0006d2",
                    name: "Snapped"
                },
                {
                    _id : "55b92ad621e4b7c40f000665",
                    name: "JellyGames"
                },
                {
                    _id : "55b92ad621e4b7c40f00068a",
                    name: "application regression testing"
                },
                {
                    _id : "55b92ad621e4b7c40f000691",
                    name: "Faceworks"
                },
                {
                    _id : "55b92ad621e4b7c40f000663",
                    name: "ajaxbrowser.com"
                },
                {
                    _id : "562bc32484deb7cb59d61b70",
                    name: "MyDrive"
                },
                {
                    _id : "55b92ad621e4b7c40f000674",
                    name: "Win7 app tester needed"
                },
                {
                    _id : "55cb770bfea413b50b000008",
                    name: "QualPro"
                },
                {
                    _id : "55b92ad621e4b7c40f000683",
                    name: "Bob"
                },
                {
                    _id : "55b92ad621e4b7c40f000667",
                    name: "PT2"
                },
                {
                    _id : "55b92ad621e4b7c40f00067d",
                    name: "Sharalike"
                },
                {
                    _id : "55b92ad621e4b7c40f0006c4",
                    name: "Ibizawire"
                },
                {
                    _id : "57039f0353db5c9d03fc9ebe",
                    name: "DiGep"
                },
                {
                    _id : "56e2cc9b74ac46664a83e949",
                    name: "Backoffice 2.0 Stentle"
                },
                {
                    _id : "55b92ad621e4b7c40f000673",
                    name: "Q/A digital QA"
                },
                {
                    _id : "55b92ad621e4b7c40f000662",
                    name: "QMr and It websites testing1"
                },
                {
                    _id : "55b92ad621e4b7c40f000688",
                    name: "iOS2"
                },
                {
                    _id : "55b92ad621e4b7c40f000668",
                    name: "Selenium IDE"
                },
                {
                    _id : "55b92ad621e4b7c40f0006c5",
                    name: "Liquivid"
                },
                {
                    _id : "55b92ad621e4b7c40f0006ac",
                    name: "Manual front end testing for e commerce site"
                },
                {
                    _id : "55b92ad621e4b7c40f000689",
                    name: "iOS4"
                },
                {
                    _id : "55b92ad621e4b7c40f00067a",
                    name: "QMr and It websites testing"
                },
                {
                    _id : "56abd16ac6be8658550dc6c3",
                    name: "Baccarat"
                },
                {
                    _id : "55b92ad621e4b7c40f00065f",
                    name: "IOS/Android QA"
                },
                {
                    _id : "55b92ad621e4b7c40f0006c7",
                    name: "BizRate"
                },
                {
                    _id : "55b92ad621e4b7c40f000669",
                    name: "Airsoft site"
                },
                {
                    _id : "55b92ad621e4b7c40f00066d",
                    name: "LiveCasinoAndroid"
                },
                {
                    _id : "55b92ad621e4b7c40f00067f",
                    name: "Player iOS/And"
                },
                {
                    _id : "55b92ad621e4b7c40f000676",
                    name: "QA"
                },
                {
                    _id : "5605736c002c16436b000007",
                    name: "Stentle CSS"
                },
                {
                    _id : "55b92ad621e4b7c40f000696",
                    name: "Software Testing of Web Application"
                },
                {
                    _id : "55b92ad621e4b7c40f00066e",
                    name: "LCUpdate iOS"
                },
                {
                    _id : "55b92ad621e4b7c40f000666",
                    name: "blow.com"
                },
                {
                    _id : "568cea4977b14bf41bf2c32c",
                    name: "LocalCollector"
                },
                {
                    _id : "55b92ad621e4b7c40f00066c",
                    name: "DesignShargo"
                },
                {
                    _id : "55b92ad621e4b7c40f000675",
                    name: "iOS6"
                },
                {
                    _id : "55b92ad621e4b7c40f000672",
                    name: "DRH QA Automation"
                },
                {
                    _id : "55de1e8ef09cc2ec0b000031",
                    name: "BlueLight"
                },
                {
                    _id : "55b92ad621e4b7c40f000661",
                    name: "Android2"
                },
                {
                    _id : "55b92ad621e4b7c40f0006ab",
                    name: "QMR iOS"
                },
                {
                    _id : "55de2cd2f09cc2ec0b000053",
                    name: "Dragon Daze"
                },
                {
                    _id : "55b92ad621e4b7c40f000693",
                    name: "WP Player"
                },
                {
                    _id : "55b92ad621e4b7c40f0006b2",
                    name: "Player"
                },
                {
                    _id : "55b92ad621e4b7c40f000694",
                    name: "QA iOS Purple Ocean"
                },
                {
                    _id : "55b92ad621e4b7c40f0006bf",
                    name: "Minder"
                },
                {
                    _id : "55b92ad621e4b7c40f000697",
                    name: "Pilot"
                },
                {
                    _id : "55b92ad621e4b7c40f00066f",
                    name: "Oculus Player"
                },
                {
                    _id : "55b92ad621e4b7c40f000698",
                    name: "Staffd"
                },
                {
                    _id : "55b92ad621e4b7c40f0006c1",
                    name: "Ganchak Help"
                },
                {
                    _id : "55b92ad621e4b7c40f0006ba",
                    name: "TocToc"
                },
                {
                    _id : "55b92ad621e4b7c40f0006b3",
                    name: "Loyalty"
                },
                {
                    _id : "55b92ad621e4b7c40f000686",
                    name: "Sensei"
                },
                {
                    _id : "55b92ad621e4b7c40f000699",
                    name: "Tablet apps"
                },
                {
                    _id : "568b85b33cce9254776f2b4c",
                    name: "FluxIOT"
                },
                {
                    _id : "55b92ad621e4b7c40f00069e",
                    name: "Android1"
                },
                {
                    _id : "570b8fce9655379f334001c9",
                    name: "TEST1"
                },
                {
                    _id : "55b92ad621e4b7c40f000678",
                    name: "Appium testing"
                },
                {
                    _id : "55b92ad621e4b7c40f0006aa",
                    name: "DiveplanIT"
                },
                {
                    _id : "56c431dda2cb3024468a04ee",
                    name: "Raffle Draw"
                },
                {
                    _id : "55b92ad621e4b7c40f000660",
                    name: "iOS1"
                },
                {
                    _id : "55b92ad621e4b7c40f0006b7",
                    name: "Design"
                },
                {
                    _id : "55b92ad621e4b7c40f0006a2",
                    name: "Android"
                },
                {
                    _id : "55cf5ea04a91e37b0b00012c",
                    name: "Global Workshop"
                },
                {
                    _id : "55b92ad621e4b7c40f0006a4",
                    name: "iOS Periop"
                },
                {
                    _id : "55b92ad621e4b7c40f0006a8",
                    name: "sitefix"
                },
                {
                    _id : "55b92ad621e4b7c40f0006d3",
                    name: "HashPlay"
                },
                {
                    _id : "55b92ad621e4b7c40f000680",
                    name: "CodeThreads"
                },
                {
                    _id : "55b92ad621e4b7c40f000690",
                    name: "Max"
                },
                {
                    _id : "55b92ad621e4b7c40f0006a5",
                    name: "Android"
                },
                {
                    _id : "55b92ad621e4b7c40f0006a6",
                    name: "Moriser"
                },
                {
                    _id : "55b92ad621e4b7c40f0006a7",
                    name: "couch"
                },
                {
                    _id : "55b92ad621e4b7c40f000671",
                    name: "Kari"
                },
                {
                    _id : "55b92ad621e4b7c40f0006ad",
                    name: "KX keyboard"
                },
                {
                    _id : "55b92ad621e4b7c40f0006b6",
                    name: "Shiwaforce Karma"
                },
                {
                    _id : "56fe645769c37d5903700b20",
                    name: "Colgate"
                },
                {
                    _id : "55b92ad621e4b7c40f00067c",
                    name: "iQshop"
                },
                {
                    _id : "55b92ad621e4b7c40f0006ae",
                    name: "Kikast"
                },
                {
                    _id : "55b92ad621e4b7c40f0006d9",
                    name: "Pilot"
                },
                {
                    _id : "55b92ad621e4b7c40f000692",
                    name: "WishExpress"
                },
                {
                    _id : "55b92ad621e4b7c40f0006af",
                    name: "Academic Website testing"
                },
                {
                    _id : "55b92ad621e4b7c40f0006b0",
                    name: "Telecom"
                },
                {
                    _id : "55b92ad621e4b7c40f0006a3",
                    name: "iOS dev"
                },
                {
                    _id : "55b92ad621e4b7c40f0006b1",
                    name: "Android Automation"
                },
                {
                    _id : "55b92ad621e4b7c40f0006b4",
                    name: "Vroup"
                },
                {
                    _id : "55b92ad621e4b7c40f0006b5",
                    name: "KemblaJoggers"
                },
                {
                    _id : "56dff43eb07e2ad226b6893b",
                    name: "Smart360"
                },
                {
                    _id : "566857caa3fc012a68f0d83a",
                    name: "SPS Mobile"
                },
                {
                    _id : "55b92ad621e4b7c40f0006b8",
                    name: "FindLost"
                },
                {
                    _id : "566d4bc3abccac87642cb523",
                    name: "Scatch"
                },
                {
                    _id : "55b92ad621e4b7c40f0006d1",
                    name: "Sales Tool"
                },
                {
                    _id : "55b92ad621e4b7c40f0006bb",
                    name: "MorfitRun"
                },
                {
                    _id : "55b92ad621e4b7c40f00069d",
                    name: "iOS3"
                },
                {
                    _id : "55b92ad621e4b7c40f0006c2",
                    name: "WP Wrapper Unibet"
                },
                {
                    _id : "56685d88a3fc012a68f0d854",
                    name: "Nicolas Burer Design"
                },
                {
                    _id : "563b95acab9698be7c9df727",
                    name: "LoginChineseTrue"
                },
                {
                    _id : "55b92ad621e4b7c40f0006bc",
                    name: "Pseudo"
                },
                {
                    _id : "55b92ad621e4b7c40f0006bd",
                    name: "Purple Ocean"
                },
                {
                    _id : "55b92ad621e4b7c40f000695",
                    name: "Consent APP"
                },
                {
                    _id : "55b92ad621e4b7c40f00069f",
                    name: "iOS5"
                },
                {
                    _id : "55b92ad621e4b7c40f0006be",
                    name: "HBO"
                },
                {
                    _id : "55b92ad621e4b7c40f0006b9",
                    name: "Curb testing"
                },
                {
                    _id : "55b92ad621e4b7c40f0006c0",
                    name: "TrumpT QA"
                },
                {
                    _id : "55b92ad621e4b7c40f0006c3",
                    name: "Jude"
                }
            ]
        },
        salesOrder      : {
            _id         : null,
            projectName : [
                {
                    _id : "56e001b7622d25002676ffd3",
                    name: "Nexture site"
                },
                {
                    _id : "56e003948594da632689f1cd",
                    name: "Phone app"
                },
                {
                    _id : "56dffa45f20b938426716709",
                    name: "ESTablet web"
                },
                {
                    _id : "56e292585def9136621b7800",
                    name: "Casino"
                },
                {
                    _id : "56e005f0f20b93842671670d",
                    name: "Spoon Comics"
                },
                {
                    _id : "55b92ad621e4b7c40f0006b6",
                    name: "Shiwaforce Karma"
                },
                {
                    _id : "56ab958e74d57e0d56d6be3b",
                    name: "Planogram"
                },
                {
                    _id : "569ced3fea21e2ac7d729e18",
                    name: "MySmallCommunity"
                },
                {
                    _id : "569f58df62d172544baf0c3d",
                    name: "Haie"
                },
                {
                    _id : "561253dfc90e2fb026ce064d",
                    name: "Shiwaforce Karma QA"
                },
                {
                    _id : "569f60d162d172544baf0d58",
                    name: "Android advertisement"
                },
                {
                    _id : "56d9a14f7891423e3d5b8f18",
                    name: "Habi"
                },
                {
                    _id : "56a0d60062d172544baf0e3d",
                    name: "BuddyBet"
                },
                {
                    _id : "56422bfc70bbc2b740ce89f3",
                    name: "PREEME"
                },
                {
                    _id : "55b92ad621e4b7c40f0006d6",
                    name: "ArTV"
                },
                {
                    _id : "562ff292b03714731dd8433b",
                    name: "Appsmakerstore"
                },
                {
                    _id : "56a89384eb2b76c70ec74d1e",
                    name: "Locappy"
                },
                {
                    _id : "5613b6f0c90e2fb026ce068c",
                    name: "iTacit"
                },
                {
                    _id : "562bba6e4a431b5a5a3111fe",
                    name: "Spark"
                },
                {
                    _id : "561ebb8cd6c741e8235f42ea",
                    name: "Bodega application"
                },
                {
                    _id : "55f55a89b81672730c000017",
                    name: "Bimii"
                },
                {
                    _id : "55f56442b81672730c000032",
                    name: "Tinder clone"
                },
                {
                    _id : "55cdc96d9b42266a4f000006",
                    name: "Absolute Vodka"
                },
                {
                    _id : "55cf4fc74a91e37b0b000103",
                    name: "Legal Application"
                },
                {
                    _id : "55b92ad621e4b7c40f0006ce",
                    name: "FlipStar Game"
                },
                {
                    _id : "55f5728cb81672730c00006a",
                    name: "BetterIt ios"
                },
                {
                    _id : "5629e238129820ab5994e8c0",
                    name: "Bus Project"
                },
                {
                    _id : "55deb95bae2b22730b000017",
                    name: "YelloDrive"
                },
                {
                    _id : "565740e0bfd103f108eb4ad4",
                    name: "HKConnect"
                },
                {
                    _id : "55ded24cae2b22730b000040",
                    name: "FarmStatistic"
                },
                {
                    _id : "55de2a30f09cc2ec0b00004e",
                    name: "GovMap"
                },
                {
                    _id : "55de24bbf09cc2ec0b000036",
                    name: "FosterFarms"
                },
                {
                    _id : "562beda846bca6e4591f4930",
                    name: "TreatMe"
                },
                {
                    _id : "56030dbffa3f91444e00000d",
                    name: "Firderberg"
                },
                {
                    _id : "55b92ad621e4b7c40f000697",
                    name: "Pilot"
                },
                {
                    _id : "56abd16ac6be8658550dc6c3",
                    name: "Baccarat"
                },
                {
                    _id : "55b92ad621e4b7c40f00065f",
                    name: "IOS/Android QA"
                },
                {
                    _id : "55b92ad621e4b7c40f00067a",
                    name: "QMr and It websites testing"
                },
                {
                    _id : "55b92ad621e4b7c40f0006a0",
                    name: "GetFit"
                },
                {
                    _id : "55b92ad621e4b7c40f0006d7",
                    name: "Mesa Ave"
                },
                {
                    _id : "55b92ad621e4b7c40f0006c3",
                    name: "Jude"
                },
                {
                    _id : "55b92ad621e4b7c40f0006c4",
                    name: "Ibizawire"
                },
                {
                    _id : "55b92ad621e4b7c40f00066d",
                    name: "LiveCasinoAndroid"
                },
                {
                    _id : "562bc32484deb7cb59d61b70",
                    name: "MyDrive"
                },
                {
                    _id : "55b92ad621e4b7c40f000674",
                    name: "Win7 app tester needed"
                },
                {
                    _id : "55cf5ea04a91e37b0b00012c",
                    name: "Global Workshop"
                },
                {
                    _id : "55b92ad621e4b7c40f0006a4",
                    name: "iOS Periop"
                },
                {
                    _id : "55b92ad621e4b7c40f0006cf",
                    name: "Kogan Apps"
                },
                {
                    _id : "55b92ad621e4b7c40f0006d5",
                    name: "Unlimited Conferencing"
                },
                {
                    _id : "55b92ad621e4b7c40f00067b",
                    name: "Android Help"
                },
                {
                    _id : "56685d88a3fc012a68f0d854",
                    name: "Nicolas Burer Design"
                },
                {
                    _id : "563b95acab9698be7c9df727",
                    name: "LoginChineseTrue"
                },
                {
                    _id : "55b92ad621e4b7c40f0006bc",
                    name: "Pseudo"
                },
                {
                    _id : "55b92ad621e4b7c40f000672",
                    name: "DRH QA Automation"
                },
                {
                    _id : "55cf36d54a91e37b0b0000c2",
                    name: "Mobstar"
                },
                {
                    _id : "55b92ad621e4b7c40f000681",
                    name: "AirPort"
                },
                {
                    _id : "55b92ad621e4b7c40f000668",
                    name: "Selenium IDE"
                },
                {
                    _id : "55b92ad621e4b7c40f000688",
                    name: "iOS2"
                },
                {
                    _id : "55b92ad621e4b7c40f0006c8",
                    name: "PriTriever"
                },
                {
                    _id : "55b92ad621e4b7c40f00066e",
                    name: "LCUpdate iOS"
                },
                {
                    _id : "55b92ad621e4b7c40f000698",
                    name: "Staffd"
                },
                {
                    _id : "55b92ad621e4b7c40f00066f",
                    name: "Oculus Player"
                },
                {
                    _id : "55b92ad621e4b7c40f0006cd",
                    name: "CloudFuze"
                },
                {
                    _id : "55b92ad621e4b7c40f000694",
                    name: "QA iOS Purple Ocean"
                },
                {
                    _id : "55b92ad621e4b7c40f0006bf",
                    name: "Minder"
                },
                {
                    _id : "55b92ad621e4b7c40f0006b5",
                    name: "KemblaJoggers"
                },
                {
                    _id : "56c431dda2cb3024468a04ee",
                    name: "Raffle Draw"
                },
                {
                    _id : "55b92ad621e4b7c40f0006b7",
                    name: "Design"
                },
                {
                    _id : "55b92ad621e4b7c40f000660",
                    name: "iOS1"
                },
                {
                    _id : "55b92ad621e4b7c40f000686",
                    name: "Sensei"
                },
                {
                    _id : "55b92ad621e4b7c40f000699",
                    name: "Tablet apps"
                },
                {
                    _id : "55b92ad621e4b7c40f000678",
                    name: "Appium testing"
                },
                {
                    _id : "55b92ad621e4b7c40f0006aa",
                    name: "DiveplanIT"
                },
                {
                    _id : "55b92ad621e4b7c40f00069e",
                    name: "Android1"
                },
                {
                    _id : "55b92ad621e4b7c40f0006c7",
                    name: "BizRate"
                },
                {
                    _id : "55b92ad621e4b7c40f000669",
                    name: "Airsoft site"
                },
                {
                    _id : "55b92ad621e4b7c40f00066a",
                    name: "The Watch Enthusiast"
                },
                {
                    _id : "55b92ad621e4b7c40f0006c9",
                    name: "spscontrol"
                },
                {
                    _id : "55b92ad621e4b7c40f000677",
                    name: "Android Tribesta"
                },
                {
                    _id : "55b92ad621e4b7c40f0006a7",
                    name: "couch"
                },
                {
                    _id : "55b92ad621e4b7c40f00068a",
                    name: "application regression testing"
                },
                {
                    _id : "55b92ad621e4b7c40f0006a2",
                    name: "Android"
                },
                {
                    _id : "55b92ad621e4b7c40f0006bd",
                    name: "Purple Ocean"
                },
                {
                    _id : "55b92ad621e4b7c40f000665",
                    name: "JellyGames"
                },
                {
                    _id : "55b92ad621e4b7c40f0006d2",
                    name: "Snapped"
                },
                {
                    _id : "55b92ad621e4b7c40f0006b0",
                    name: "Telecom"
                },
                {
                    _id : "55b92ad621e4b7c40f00069d",
                    name: "iOS3"
                },
                {
                    _id : "55b92ad621e4b7c40f0006ac",
                    name: "Manual front end testing for e commerce site"
                },
                {
                    _id : "55b92ad621e4b7c40f0006c5",
                    name: "Liquivid"
                },
                {
                    _id : "55b92ad621e4b7c40f0006a9",
                    name: "Spokal"
                },
                {
                    _id : "55b92ad621e4b7c40f000670",
                    name: "iRemember"
                },
                {
                    _id : "569f5bc662d172544baf0c40",
                    name: "Gilad Nevo Bug fixing"
                },
                {
                    _id : "55b92ad621e4b7c40f000684",
                    name: "OnSite Unibet"
                },
                {
                    _id : "55f55901b81672730c000011",
                    name: "WhachApp"
                },
                {
                    _id : "55b92ad621e4b7c40f00068c",
                    name: "DRH manual"
                },
                {
                    _id : "55b92ad621e4b7c40f0006c0",
                    name: "TrumpT QA"
                },
                {
                    _id : "55b92ad621e4b7c40f0006b9",
                    name: "Curb testing"
                },
                {
                    _id : "55b92ad621e4b7c40f000673",
                    name: "Q/A digital QA"
                },
                {
                    _id : "55b92ad621e4b7c40f000675",
                    name: "iOS6"
                },
                {
                    _id : "55b92ad621e4b7c40f00066c",
                    name: "DesignShargo"
                },
                {
                    _id : "55b92ad621e4b7c40f000691",
                    name: "Faceworks"
                },
                {
                    _id : "55de2cd2f09cc2ec0b000053",
                    name: "Dragon Daze"
                },
                {
                    _id : "55b92ad621e4b7c40f000693",
                    name: "WP Player"
                },
                {
                    _id : "55b92ad621e4b7c40f0006b3",
                    name: "Loyalty"
                },
                {
                    _id : "55b92ad621e4b7c40f0006c1",
                    name: "Ganchak Help"
                },
                {
                    _id : "55b92ad621e4b7c40f0006ba",
                    name: "TocToc"
                },
                {
                    _id : "55b92ad621e4b7c40f0006b2",
                    name: "Player"
                },
                {
                    _id : "55cb770bfea413b50b000008",
                    name: "QualPro"
                },
                {
                    _id : "55b92ad621e4b7c40f00067d",
                    name: "Sharalike"
                },
                {
                    _id : "55b92ad621e4b7c40f000683",
                    name: "Bob"
                },
                {
                    _id : "55b92ad621e4b7c40f000667",
                    name: "PT2"
                },
                {
                    _id : "55b92ad621e4b7c40f0006a3",
                    name: "iOS dev"
                },
                {
                    _id : "55b92ad621e4b7c40f0006b1",
                    name: "Android Automation"
                },
                {
                    _id : "55b92ad621e4b7c40f000689",
                    name: "iOS4"
                },
                {
                    _id : "55de1e8ef09cc2ec0b000031",
                    name: "BlueLight"
                },
                {
                    _id : "55b92ad621e4b7c40f0006ab",
                    name: "QMR iOS"
                },
                {
                    _id : "55b92ad621e4b7c40f000661",
                    name: "Android2"
                },
                {
                    _id : "55b92ad621e4b7c40f0006ca",
                    name: "SketchTechPoints"
                },
                {
                    _id : "55b92ad621e4b7c40f0006ad",
                    name: "KX keyboard"
                },
                {
                    _id : "55b92ad621e4b7c40f000671",
                    name: "Kari"
                },
                {
                    _id : "55b92ad621e4b7c40f0006a8",
                    name: "sitefix"
                },
                {
                    _id : "55b92ad621e4b7c40f000662",
                    name: "QMr and It websites testing1"
                },
                {
                    _id : "55b92ad621e4b7c40f000664",
                    name: "BelgiumHTML"
                },
                {
                    _id : "55b92ad621e4b7c40f0006c6",
                    name: "Demo Rocket"
                },
                {
                    _id : "55b92ad621e4b7c40f000687",
                    name: "iOS/Tribesta"
                },
                {
                    _id : "5605736c002c16436b000007",
                    name: "Stentle CSS"
                },
                {
                    _id : "55b92ad621e4b7c40f000696",
                    name: "Software Testing of Web Application"
                },
                {
                    _id : "55b92ad621e4b7c40f00067f",
                    name: "Player iOS/And"
                },
                {
                    _id : "55b92ad621e4b7c40f000676",
                    name: "QA"
                },
                {
                    _id : "55b92ad621e4b7c40f0006b4",
                    name: "Vroup"
                },
                {
                    _id : "566d4bc3abccac87642cb523",
                    name: "Scatch"
                },
                {
                    _id : "55b92ad621e4b7c40f0006d1",
                    name: "Sales Tool"
                },
                {
                    _id : "55b92ad621e4b7c40f0006bb",
                    name: "MorfitRun"
                },
                {
                    _id : "56a23c5caa157ca50f21fae1",
                    name: "Demolition Derby"
                },
                {
                    _id : "55b92ad621e4b7c40f00069c",
                    name: "sTrader"
                },
                {
                    _id : "55b92ad621e4b7c40f00066b",
                    name: "Nikky"
                },
                {
                    _id : "55b92ad621e4b7c40f00068e",
                    name: "Phidget ANE"
                },
                {
                    _id : "55b92ad621e4b7c40f0006a6",
                    name: "Moriser"
                },
                {
                    _id : "566857caa3fc012a68f0d83a",
                    name: "SPS Mobile"
                },
                {
                    _id : "55b92ad621e4b7c40f0006b8",
                    name: "FindLost"
                },
                {
                    _id : "56ab5ceb74d57e0d56d6bda5",
                    name: "CAPT"
                },
                {},
                {
                    _id : "55b92ad621e4b7c40f00067e",
                    name: "SoulIntentions"
                },
                {
                    _id : "55b92ad621e4b7c40f000685",
                    name: "Travlr"
                },
                {
                    _id : "55b92ad621e4b7c40f000682",
                    name: "Connexus"
                },
                {
                    _id : "55b92ad621e4b7c40f0006cb",
                    name: "Bayzat"
                },
                {
                    _id : "55b92ad621e4b7c40f00069f",
                    name: "iOS5"
                },
                {
                    _id : "55b92ad621e4b7c40f000695",
                    name: "Consent APP"
                },
                {
                    _id : "55b92ad621e4b7c40f0006be",
                    name: "HBO"
                },
                {
                    _id : "55b92ad621e4b7c40f0006d4",
                    name: "M-Government"
                },
                {
                    _id : "55b92ad621e4b7c40f000663",
                    name: "ajaxbrowser.com"
                },
                {
                    _id : "55b92ad621e4b7c40f000666",
                    name: "blow.com"
                },
                {
                    _id : "55b92ad621e4b7c40f0006d9",
                    name: "Pilot"
                },
                {
                    _id : "55b92ad621e4b7c40f000692",
                    name: "WishExpress"
                },
                {
                    _id : "55b92ad621e4b7c40f0006af",
                    name: "Academic Website testing"
                },
                {
                    _id : "55b92ad621e4b7c40f000680",
                    name: "CodeThreads"
                },
                {
                    _id : "55b92ad621e4b7c40f000690",
                    name: "Max"
                },
                {
                    _id : "55b92ad621e4b7c40f0006d3",
                    name: "HashPlay"
                },
                {
                    _id : "55b92ad621e4b7c40f0006a5",
                    name: "Android"
                },
                {
                    _id : "55b92ad621e4b7c40f00067c",
                    name: "iQshop"
                },
                {
                    _id : "55b92ad621e4b7c40f0006ae",
                    name: "Kikast"
                },
                {
                    _id : "55b92ad621e4b7c40f0006d8",
                    name: "Casino Game"
                },
                {
                    _id : "55b92ad621e4b7c40f00068f",
                    name: "QMR Android"
                }
            ],
            supplier    : [
                {
                    _id : "56dff9147e20c5df25a36bbf",
                    name: "Lassic "
                },
                {
                    _id : "55b92ad621e4b7c40f00064b",
                    name: "Thomas "
                },
                {
                    _id : "56e291651f2850d361927dd0",
                    name: "Gil Strauss"
                },
                {
                    _id : "56dffe038594da632689f1ca",
                    name: "Takumi Networks "
                },
                {
                    _id : "56a8930ceb2b76c70ec74d1d",
                    name: "Sebastian Lyall"
                },
                {
                    _id : "569f57be62d172544baf0c3a",
                    name: "ETECTURE GmbH "
                },
                {
                    _id : "566d4b35abccac87642cb521",
                    name: "Scatch "
                },
                {
                    _id : "56a23c26aa157ca50f21fae0",
                    name: "Richard Hazenberg"
                },
                {
                    _id : "55b92ad521e4b7c40f000610",
                    name: "Norbert "
                },
                {
                    _id : "55b92ad621e4b7c40f000630",
                    name: "PPT Group "
                },
                {
                    _id : "55b92ad621e4b7c40f00064e",
                    name: "SetFile "
                },
                {
                    _id : "55b92ad621e4b7c40f00062d",
                    name: "Andreas Rabenseifner "
                },
                {
                    _id : "55b92ad521e4b7c40f000611",
                    name: "Remon "
                },
                {
                    _id : "55b92ad621e4b7c40f00063e",
                    name: "VTI "
                },
                {
                    _id : "55b92ad621e4b7c40f000629",
                    name: "Cristaliza "
                },
                {
                    _id : "55b92ad621e4b7c40f000637",
                    name: "Airsoft Holdings "
                },
                {
                    _id : "55b92ad621e4b7c40f00064c",
                    name: "Razvan Chisu "
                },
                {
                    _id : "55b92ad621e4b7c40f000628",
                    name: "Quimron "
                },
                {
                    _id : "55b92ad621e4b7c40f00063d",
                    name: "Gomez "
                },
                {
                    _id : "55b92ad521e4b7c40f00061b",
                    name: "Unlimited Conferencing "
                },
                {
                    _id : "5604170eb904af832d000005",
                    name: "Stentle "
                },
                {
                    _id : "55b92ad621e4b7c40f00065a",
                    name: "Technatives "
                },
                {
                    _id : "55b92ad621e4b7c40f000638",
                    name: "Unibet "
                },
                {
                    _id : "56d9a09a045bc8e93c16efe4",
                    name: "Michael FitzGerald"
                },
                {
                    _id : "55b92ad621e4b7c40f00062e",
                    name: "Web1 Syndication, Inc "
                },
                {
                    _id : "55b92ad621e4b7c40f000640",
                    name: "Oris4/TimWilson "
                },
                {
                    _id : "55b92ad621e4b7c40f00064d",
                    name: "ProTriever "
                },
                {
                    _id : "55b92ad521e4b7c40f00061e",
                    name: "Luke Raskino "
                },
                {
                    _id : "55cdc93c9b42266a4f000005",
                    name: "AgileFind "
                },
                {
                    _id : "55b92ad621e4b7c40f000633",
                    name: "Chris Mack "
                },
                {
                    _id : "55b92ad621e4b7c40f000656",
                    name: "ShiwaForce "
                },
                {
                    _id : "55b92ad621e4b7c40f000659",
                    name: "PBI-Solutions "
                },
                {
                    _id : "55b92ad621e4b7c40f000646",
                    name: "EtienneL "
                },
                {
                    _id : "55b92ad621e4b7c40f00065d",
                    name: "CloudFuze "
                },
                {
                    _id : "55b92ad521e4b7c40f00060d",
                    name: "Sportsman Tracker "
                },
                {
                    _id : "562ff202547f50b51d6de2b8",
                    name: "Appsmakerstore "
                },
                {
                    _id : "55b92ad621e4b7c40f000641",
                    name: "Global Forwarding LLC "
                },
                {
                    _id : "55b92ad621e4b7c40f000655",
                    name: "We do apps "
                },
                {
                    _id : "55b92ad621e4b7c40f00062b",
                    name: "HashPlay "
                },
                {
                    _id : "55b92ad621e4b7c40f000625",
                    name: "WishExpress "
                },
                {
                    _id : "55b92ad521e4b7c40f000613",
                    name: "Kikast "
                },
                {
                    _id : "56030d81fa3f91444e00000c",
                    name: "Peter F "
                },
                {
                    _id : "55cf362b4a91e37b0b0000c1",
                    name: "MobStar "
                },
                {
                    _id : "55b92ad521e4b7c40f000618",
                    name: "Tarun M. "
                },
                {
                    name: null
                },
                {
                    _id : "55b92ad521e4b7c40f000621",
                    name: "Mike Allstar "
                },
                {
                    _id : "55edaf167221afe30b000040",
                    name: "BetterIt "
                },
                {
                    _id : "55b92ad521e4b7c40f000622",
                    name: "Chamin "
                },
                {
                    _id : "55b92ad521e4b7c40f00061d",
                    name: "Buzinga "
                },
                {
                    _id : "55b92ad621e4b7c40f000648",
                    name: "Anand Gupta "
                },
                {
                    _id : "55b92ad521e4b7c40f000619",
                    name: "Israel "
                },
                {
                    _id : "55b92ad621e4b7c40f00064a",
                    name: "Carussel "
                },
                {
                    _id : "55b92ad621e4b7c40f000645",
                    name: "Vlad "
                },
                {
                    _id : "55b92ad621e4b7c40f000636",
                    name: "Constantine "
                },
                {
                    _id : "55b92ad521e4b7c40f000620",
                    name: "Thomas Sinquin "
                },
                {
                    _id : "55b92ad621e4b7c40f000651",
                    name: "Dan D. "
                },
                {
                    _id : "56574032bfd103f108eb4ad2",
                    name: "Marand "
                },
                {
                    _id : "56685d4fa3fc012a68f0d853",
                    name: "Nicolas Burer"
                },
                {
                    _id : "55b92ad621e4b7c40f000623",
                    name: "Vladi "
                },
                {
                    _id : "55b92ad621e4b7c40f000631",
                    name: "Tinybeans "
                },
                {
                    _id : "55b92ad521e4b7c40f000614",
                    name: "The Watch Enthusiast "
                },
                {
                    _id : "56ab5ca674d57e0d56d6bda4",
                    name: "Stian Maurstad"
                },
                {
                    _id : "55b92ad621e4b7c40f00065b",
                    name: "Kogan.com "
                },
                {
                    _id : "55b92ad621e4b7c40f00063a",
                    name: "TrumpMedia "
                },
                {
                    _id : "55cf4f834a91e37b0b000102",
                    name: "SharperBuilds "
                },
                {
                    _id : "55b92ad621e4b7c40f000649",
                    name: "Contegra Systems "
                },
                {
                    _id : "55b92ad621e4b7c40f000635",
                    name: "Academiacs "
                },
                {
                    _id : "55cf5c194a91e37b0b00012b",
                    name: "Global Workshop Solutions "
                },
                {
                    _id : "55b92ad621e4b7c40f000658",
                    name: "JellyGames "
                },
                {
                    _id : "55b92ad621e4b7c40f000634",
                    name: "Max "
                },
                {
                    _id : "569f603762d172544baf0d57",
                    name: "Nimrod Nahum"
                },
                {
                    _id : "55b92ad521e4b7c40f000615",
                    name: "TechJoiner "
                },
                {
                    _id : "55b92ad621e4b7c40f00064f",
                    name: "Kenlo Group Ltd "
                },
                {
                    _id : "55b92ad621e4b7c40f00063f",
                    name: "Hussam "
                },
                {
                    _id : "55b92ad621e4b7c40f000624",
                    name: "Giroptic "
                },
                {
                    _id : "55b92ad621e4b7c40f000650",
                    name: "PatrickMolander "
                },
                {
                    _id : "55b92ad521e4b7c40f00060e",
                    name: "Pekaboo/D.Kaufman "
                },
                {
                    _id : "55b92ad621e4b7c40f000653",
                    name: "Peter B. "
                },
                {
                    _id : "55b92ad621e4b7c40f000657",
                    name: "Nikky "
                },
                {
                    _id : "55b92ad621e4b7c40f00063c",
                    name: "DigiPresents "
                },
                {
                    _id : "55b92ad521e4b7c40f00061f",
                    name: "PostIndustria "
                },
                {
                    _id : "55f56406b81672730c00002e",
                    name: "App Institute "
                },
                {
                    _id : "55b92ad521e4b7c40f000612",
                    name: "Isaac S. "
                },
                {
                    _id : "55b92ad521e4b7c40f000617",
                    name: "Peter Hickey "
                },
                {
                    _id : "55b92ad621e4b7c40f00063b",
                    name: "Foxtrapp "
                },
                {
                    _id : "55b92ad621e4b7c40f000639",
                    name: "Digital Media "
                },
                {
                    _id : "55b92ad621e4b7c40f000632",
                    name: "evista "
                },
                {
                    _id : "55b92ad621e4b7c40f00062f",
                    name: "Mark "
                },
                {
                    _id : "55b92ad621e4b7c40f00062a",
                    name: "PeachInc "
                },
                {
                    _id : "55b92ad621e4b7c40f00062c",
                    name: "spscontrol "
                },
                {
                    _id : "55f55854b81672730c000010",
                    name: "MediaHeads "
                },
                {
                    _id : "55b92ad621e4b7c40f000643",
                    name: "Angelica "
                },
                {
                    _id : "55b92ad521e4b7c40f00061c",
                    name: "Genexies "
                },
                {
                    _id : "55b92ad621e4b7c40f00065e",
                    name: "Collections Tech "
                },
                {
                    _id : "55b92ad521e4b7c40f00060c",
                    name: "Alexey Blinov"
                },
                {
                    _id : "55b92ad621e4b7c40f000652",
                    name: "Zugara "
                },
                {
                    _id : "55b92ad521e4b7c40f00061a",
                    name: "Ivcarto "
                },
                {
                    _id : "55ba0df2d79a3a3439000015",
                    name: "Erez Leket"
                },
                {
                    _id : "55b92ad621e4b7c40f000642",
                    name: "Volodymyr Lychman "
                },
                {
                    _id : "55deb987ae2b22730b000018",
                    name: "Yello "
                },
                {
                    _id : "562bed4062461bfd59ef58d1",
                    name: "TreatMe "
                },
                {
                    _id : "562bc2db62461bfd59ef58c7",
                    name: "AppMedia "
                },
                {
                    _id : "5637a8e2bf9592df04c55115",
                    name: "Colestreet "
                },
                {
                    _id : "56a0d53b62d172544baf0e3c",
                    name: "Ivar Liden"
                },
                {
                    _id : "55b92ad621e4b7c40f000647",
                    name: "Joren Rapiny "
                },
                {
                    _id : "569f599062d172544baf0c3f",
                    name: "Gilad Nevo"
                }
            ],
            salesmanager: [
                {
                    _id : "565f0fa6f6427f253cf6bf19",
                    name: "Alex Lysachenko"
                },
                {
                    _id : "56029cc950de7f4138000005",
                    name: "Eugen Lendyel"
                },
                {
                    _id : "561ba8639ebb48212ea838c4",
                    name: "Nataliya Yartysh"
                },
                {
                    _id : "55b92ad221e4b7c40f0000bb",
                    name: "Igor Shepinka"
                },
                {
                    _id : "55b92ad221e4b7c40f00009b",
                    name: "Larysa Popp"
                },
                {
                    _id : "55b92ad221e4b7c40f0000a0",
                    name: "Ivan Bilak"
                },
                {
                    _id : "55b92ad221e4b7c40f000063",
                    name: "Yana Gusti"
                },
                {
                    _id : "55b92ad221e4b7c40f0000cb",
                    name: "Alona Yelahina"
                },
                {
                    _id : "55b92ad221e4b7c40f00005f",
                    name: "Peter Voloshchuk"
                },
                {
                    _id : "55b92ad221e4b7c40f00004a",
                    name: "Oleg Ostroverkh"
                },
                {
                    _id : "55b92ad221e4b7c40f000040",
                    name: "Vasiliy Almashiy"
                },
                {
                    _id : "55b92ad221e4b7c40f0000a2",
                    name: "Igor Stan"
                },
                {
                    _id : "56123232c90e2fb026ce064b",
                    name: "Olga Sikora"
                },
                {
                    _id : "561b756f9ebb48212ea838c0",
                    name: "Stanislav Romanyuk"
                },
                {
                    _id : "55b92ad221e4b7c40f00004f",
                    name: "Alex Sokhanych"
                },
                {
                    _id : "55b92ad221e4b7c40f00004b",
                    name: "Roland Katona"
                },
                {
                    name: null
                }
            ],
            workflow    : [
                {
                    _id : "5559f344dadd53e09d753ead",
                    name: "Canceled"
                },
                {},
                {
                    _id : "55647b932e4aa3804a765ec5",
                    name: "Not Invoiced"
                },
                {
                    _id : "55647b962e4aa3804a765ec6",
                    name: "Invoiced"
                }
            ]
        },
        salesQuotation  : {
            _id         : null,
            projectName : [
                {
                    _id : "55cb770bfea413b50b000008",
                    name: "QualPro"
                },
                {
                    _id : "56a0d60062d172544baf0e3d",
                    name: "BuddyBet"
                },
                {
                    _id : "56e2cc9b74ac46664a83e949",
                    name: "Backoffice 2.0 Stentle"
                },
                {
                    _id : "563295f6c928c61d052d5003",
                    name: "WordPress Sites"
                },
                {
                    _id : "56e2924a1f2850d361927dd1",
                    name: "Poems app"
                },
                {
                    _id : "55b92ad621e4b7c40f0006be",
                    name: "HBO"
                },
                {
                    _id : "55cf36d54a91e37b0b0000c2",
                    name: "Mobstar"
                },
                {
                    _id : "55b92ad621e4b7c40f000684",
                    name: "OnSite Unibet"
                },
                {
                    _id : "569f58df62d172544baf0c3d",
                    name: "Haie"
                },
                {
                    _id : "56dea0a5c235df7c05aa635c",
                    name: "PhotoShop app"
                },
                {
                    _id : "55f55d31b81672730c000020",
                    name: "Farmers App"
                },
                {
                    _id : "55b92ad621e4b7c40f0006d3",
                    name: "HashPlay"
                },
                {
                    _id : "55b92ad621e4b7c40f0006d4",
                    name: "M-Government"
                },
                {
                    _id : "568cea4977b14bf41bf2c32c",
                    name: "LocalCollector"
                },
                {
                    _id : "55b92ad621e4b7c40f0006d8",
                    name: "Casino Game"
                },
                {
                    _id : "56fe645769c37d5903700b20",
                    name: "Colgate"
                },
                {
                    _id : "56afdabef5c2bcd4555cb2f8",
                    name: "Design Slots"
                },
                {
                    _id : "57063f34c3a5da3e0347a4b9",
                    name: "PriceBox WEB"
                },
                {
                    _id : "55b92ad621e4b7c40f000671",
                    name: "Kari"
                },
                {
                    _id : "566d4bc3abccac87642cb523",
                    name: "Scatch"
                },
                {
                    _id : "56bc8fd2dfd8a81466e2f46b",
                    name: "WSpider"
                },
                {
                    _id : "55b92ad621e4b7c40f0006b8",
                    name: "FindLost"
                },
                {
                    _id : "55b92ad621e4b7c40f000694",
                    name: "QA iOS Purple Ocean"
                },
                {
                    _id : "561d1c3db51032d674856acc",
                    name: "PayFever"
                },
                {
                    _id : "56618227bb8be7814fb526e5",
                    name: "Otrema WP4"
                },
                {
                    _id : "562beda846bca6e4591f4930",
                    name: "TreatMe"
                },
                {
                    _id : "55b92ad621e4b7c40f0006c2",
                    name: "WP Wrapper Unibet"
                },
                {
                    _id : "56aa2cb4b4dc0d09232bd7aa",
                    name: "AngularJS - Stentle"
                },
                {
                    _id : "56030dbffa3f91444e00000d",
                    name: "Firderberg"
                },
                {
                    _id : "55b92ad621e4b7c40f0006cf",
                    name: "Kogan Apps"
                },
                {
                    _id : "562ff292b03714731dd8433b",
                    name: "Appsmakerstore"
                },
                {
                    _id : "56dff43eb07e2ad226b6893b",
                    name: "Smart360"
                },
                {
                    _id : "562bba6e4a431b5a5a3111fe",
                    name: "Spark"
                },
                {
                    _id : "56304d56547f50b51d6de2bb",
                    name: "Move for Less"
                },
                {
                    _id : "569ced3fea21e2ac7d729e18",
                    name: "MySmallCommunity"
                },
                {
                    _id : "55b92ad621e4b7c40f0006d9",
                    name: "Pilot"
                },
                {
                    _id : "55b92ad621e4b7c40f0006bb",
                    name: "MorfitRun"
                },
                {
                    _id : "568b85b33cce9254776f2b4c",
                    name: "FluxIOT"
                },
                {
                    _id : "55deb95bae2b22730b000017",
                    name: "YelloDrive"
                },
                {
                    _id : "55cf4fc74a91e37b0b000103",
                    name: "Legal Application"
                },
                {
                    _id : "55b92ad621e4b7c40f0006bd",
                    name: "Purple Ocean"
                },
                {
                    _id : "56ab891074d57e0d56d6be1f",
                    name: "Serial Box"
                },
                {
                    _id : "563767135d23a8eb04e80aec",
                    name: "Coach App"
                },
                {
                    _id : "55b92ad621e4b7c40f0006c7",
                    name: "BizRate"
                }
            ],
            supplier    : [
                {
                    _id : "562ff202547f50b51d6de2b8",
                    name: "Appsmakerstore "
                },
                {
                    _id : "56a0d53b62d172544baf0e3c",
                    name: "Ivar Liden"
                },
                {
                    _id : "56dff2c6622d25002676ffcd",
                    name: "Menachem Tauman"
                },
                {
                    _id : "55b92ad621e4b7c40f000639",
                    name: "Digital Media "
                },
                {
                    _id : "55cf362b4a91e37b0b0000c1",
                    name: "MobStar "
                },
                {
                    _id : "569f57be62d172544baf0c3a",
                    name: "ETECTURE GmbH "
                },
                {
                    _id : "55b92ad621e4b7c40f000658",
                    name: "JellyGames "
                },
                {
                    _id : "561d1bc0b51032d674856acb",
                    name: "Attrecto "
                },
                {
                    _id : "55b92ad521e4b7c40f000615",
                    name: "TechJoiner "
                },
                {
                    _id : "55b92ad521e4b7c40f000619",
                    name: "Israel "
                },
                {
                    _id : "562bed4062461bfd59ef58d1",
                    name: "TreatMe "
                },
                {
                    _id : "5637627bc928c61d052d500e",
                    name: "Tibor Bekefi"
                },
                {
                    _id : "55cf4f834a91e37b0b000102",
                    name: "SharperBuilds "
                },
                {
                    _id : "55deb987ae2b22730b000018",
                    name: "Yello "
                },
                {
                    _id : "5661805cbb8be7814fb52529",
                    name: "Otrema "
                },
                {
                    _id : "566d4b35abccac87642cb521",
                    name: "Scatch "
                },
                {
                    _id : "55b92ad621e4b7c40f000636",
                    name: "Constantine "
                },
                {
                    _id : "55b92ad621e4b7c40f00064f",
                    name: "Kenlo Group Ltd "
                },
                {
                    _id : "55b92ad621e4b7c40f000638",
                    name: "Unibet "
                },
                {
                    _id : "5604170eb904af832d000005",
                    name: "Stentle "
                },
                {
                    _id : "55b92ad621e4b7c40f00065b",
                    name: "Kogan.com "
                },
                {
                    _id : "55b92ad621e4b7c40f00063c",
                    name: "DigiPresents "
                },
                {
                    _id : "55b92ad621e4b7c40f00062b",
                    name: "HashPlay "
                },
                {
                    _id : "55b92ad621e4b7c40f000630",
                    name: "PPT Group "
                },
                {
                    _id : "55b92ad621e4b7c40f00063b",
                    name: "Foxtrapp "
                },
                {
                    _id : "56030d81fa3f91444e00000c",
                    name: "Peter F "
                },
                {
                    _id : "55b92ad621e4b7c40f00062d",
                    name: "Andreas Rabenseifner "
                },
                {
                    _id : "55b92ad521e4b7c40f00061f",
                    name: "PostIndustria "
                },
                {
                    _id : "55b92ad621e4b7c40f00062f",
                    name: "Mark "
                },
                {
                    _id : "55b92ad621e4b7c40f00063e",
                    name: "VTI "
                },
                {
                    _id : "55ba0df2d79a3a3439000015",
                    name: "Erez Leket"
                }
            ],
            salesmanager: [
                {
                    _id : "55b92ad221e4b7c40f0000bb",
                    name: "Igor Shepinka"
                },
                {
                    _id : "55b92ad221e4b7c40f0000a0",
                    name: "Ivan Bilak"
                },
                {
                    _id : "56029cc950de7f4138000005",
                    name: "Eugen Lendyel"
                },
                {
                    _id : "5602a01550de7f4138000008",
                    name: "Yana Dufynets"
                },
                {
                    _id : "55b92ad221e4b7c40f00005f",
                    name: "Peter Voloshchuk"
                },
                {
                    _id : "55b92ad221e4b7c40f0000cb",
                    name: "Alona Yelahina"
                },
                {
                    _id : "55b92ad221e4b7c40f000063",
                    name: "Yana Gusti"
                },
                {
                    _id : "55b92ad221e4b7c40f00004b",
                    name: "Roland Katona"
                },
                {
                    _id : "55b92ad221e4b7c40f00004a",
                    name: "Oleg Ostroverkh"
                },
                {
                    _id : "55b92ad221e4b7c40f000040",
                    name: "Vasiliy Almashiy"
                },
                {
                    _id : "561b756f9ebb48212ea838c0",
                    name: "Stanislav Romanyuk"
                },
                {
                    _id : "56123232c90e2fb026ce064b",
                    name: "Olga Sikora"
                },
                {
                    _id : "55b92ad221e4b7c40f0000a2",
                    name: "Igor Stan"
                }
            ],
            workflow    : [
                {
                    _id : "5555bf276a3f01acae0b5560",
                    name: "Not Ordered"
                },
                {
                    _id : "55647b932e4aa3804a765ec5",
                    name: "Not Invoiced"
                }
            ]
        },
        Tasks           : {
            _id       : null,
            project   : [
                {
                    _id : "56e689c75ec71b00429745a9",
                    name: "360CamSDK"
                },
                {
                    _id : "55cdc96d9b42266a4f000006",
                    name: "Absolute Vodka"
                },
                {}
            ],
            summary   : [
                {
                    _id : "573c65541d8f4ecb4c19a015",
                    name: "fdsf"
                },
                {
                    _id : "5717661c2c8b789c7a0bb82d",
                    name: "tttttt"
                },
                {
                    _id : "5350e815c3406b2c09000034",
                    name: "Weekly sprint 03-07.02.14"
                },
                {
                    _id : "5350e84ec3406b2c09000036",
                    name: "design"
                },
                {
                    _id : "5350e871c3406b2c09000037",
                    name: "testing"
                },
                {
                    _id : "5350ea5ac3406b2c0900003a",
                    name: "new features"
                },
                {
                    _id : "5350eb3fc3406b2c0900003c",
                    name: "finishing the project"
                },
                {
                    _id : "5350e82bc3406b2c09000035",
                    name: "wallpapers"
                },
                {
                    _id : "5350ea0dc3406b2c09000038",
                    name: "finish the design"
                },
                {
                    _id : "56dfd3e78c59375e055e0cc2",
                    name: "Test"
                },
                {
                    _id : "5350ea3ec3406b2c09000039",
                    name: "bug fixng"
                },
                {
                    _id : "5350eaabc3406b2c0900003b",
                    name: "new skins"
                }
            ],
            assignedTo: [
                {
                    _id : "55b92ad221e4b7c40f0000bd",
                    name: "Michael Vashkeba"
                },
                {
                    _id : "55b92ad221e4b7c40f000090",
                    name: "Gabriella Shterr"
                },
                {
                    _id : "55b92ad221e4b7c40f000030",
                    name: "Alex Svatuk"
                }
            ],
            workflow  : [
                {
                    _id : "528ce30cf3f67bc40b00000f",
                    name: "Fixed"
                },
                {
                    _id : "528ce0cdf3f67bc40b00000c",
                    name: "New"
                },
                {
                    _id : "528ce131f3f67bc40b00000d",
                    name: "In Progress"
                }
            ],
            type      : [
                {
                    _id : "Feature",
                    name: "Feature"
                },
                {
                    _id : "Bug",
                    name: "Bug"
                },
                {
                    _id : "Task",
                    name: "Task"
                }
            ]
        },
        salesProforma   : {
            _id        : null,
            workflow   : [
                {
                    _id : "56fabc6b5ad5d96f4fb08eab",
                    name: "Unpaid"
                },
                {
                    _id : "56fabcf0e71823e438e4e1ca",
                    name: "Invoiced"
                },
                {
                    _id : "56fabce2e71823e438e4e1c9",
                    name: "Paid"
                }
            ],
            project    : [
                {
                    _id : "5731dfc53c171d6620f8affe",
                    name: "test"
                },
                {
                    _id : "55b92ad621e4b7c40f0006d4",
                    name: "M-Government"
                },
                {
                    _id : "5715dcfa4b1f720a63ae7e9a",
                    name: "3DBolus"
                },
                {
                    _id : "563295f6c928c61d052d5003",
                    name: "WordPress Sites"
                },
                {
                    _id : "56ab891074d57e0d56d6be1f",
                    name: "Serial Box"
                },
                {
                    _id : "5613b6f0c90e2fb026ce068c",
                    name: "iTacit"
                },
                {
                    _id : "562beda846bca6e4591f4930",
                    name: "TreatMe"
                },
                {
                    _id : "56fe645769c37d5903700b20",
                    name: "Colgate"
                },
                {
                    _id : "55b92ad621e4b7c40f000686",
                    name: "Sensei"
                },
                {
                    _id : "56e2cc9b74ac46664a83e949",
                    name: "Backoffice 2.0 Stentle"
                },
                {
                    _id : "571789282c8b789c7a0bb82f",
                    name: "Richline Jewelry"
                },
                {
                    _id : "569ced3fea21e2ac7d729e18",
                    name: "MySmallCommunity"
                },
                {
                    _id : "56e292585def9136621b7800",
                    name: "Casino"
                },
                {
                    _id : "56ab958e74d57e0d56d6be3b",
                    name: "Planogram"
                },
                {
                    _id : "56a0d60062d172544baf0e3d",
                    name: "BuddyBet"
                }
            ],
            salesPerson: [
                {
                    name: null
                },
                {
                    _id : "55b92ad221e4b7c40f0000a0",
                    name: "Ivan Bilak"
                },
                {
                    _id : "56029cc950de7f4138000005",
                    name: "Eugen Lendyel"
                },
                {
                    _id : "55b92ad221e4b7c40f0000a2",
                    name: "Igor Stan"
                },
                {
                    _id : "55b92ad221e4b7c40f00005f",
                    name: "Peter Voloshchuk"
                },
                {
                    _id : "56123232c90e2fb026ce064b",
                    name: "Olga Sikora"
                },
                {
                    _id : "55b92ad221e4b7c40f00004a",
                    name: "Oleg Ostroverkh"
                },
                {
                    _id : "561b756f9ebb48212ea838c0",
                    name: "Stanislav Romanyuk"
                }
            ],
            supplier   : [
                {
                    _id : "55b92ad621e4b7c40f00063c",
                    name: "DigiPresents "
                },
                {
                    _id : "55ba0301d79a3a343900000d",
                    name: "#Play "
                },
                {
                    _id : "5717873cc6efb4847a5bc78c",
                    name: "CEEK VR "
                },
                {
                    _id : "56e291651f2850d361927dd0",
                    name: "Gil Strauss"
                },
                {
                    _id : "56a0d53b62d172544baf0e3c",
                    name: "Ivar Liden"
                },
                {
                    _id : "55cf4f834a91e37b0b000102",
                    name: "SharperBuilds "
                },
                {
                    _id : "5604170eb904af832d000005",
                    name: "Stentle "
                },
                {
                    _id : "55b92ad621e4b7c40f00064b",
                    name: "Thomas "
                },
                {
                    _id : "562bed4062461bfd59ef58d1",
                    name: "TreatMe "
                },
                {
                    _id : "55b92ad621e4b7c40f00063b",
                    name: "Foxtrapp "
                }
            ]
        },
        journalEntry: {
            journalName: [
                {
                    _id: "Retained Earnings Journal",
                    name: "Retained Earnings Journal"
                },
                {
                    _id: "Income Summary Journal",
                    name: "Income Summary Journal"
                }
            ],
            sourceDocument: [
                {
                    _id: "55bf45cf65cda0810b00000a",
                    name: "Liliya Shustur"
                },
                {
                    _id: "5614d4c7ab24a83b1dc1a7a8",
                    name: "Dmytro Babilia"
                },
                {
                    _id: "5684ec1a1fec73d05393a2a4",
                    name: "Maria Zaitseva"
                },
                {
                    _id: "56813fe29cceae182b907755",
                    name: "Taras Ukrainskiy"
                },
                {
                    _id: "566ada96a74aaf316eaea69d",
                    name: "Maxim Gladovskyy"
                },
                {
                    _id: "566add9aa74aaf316eaea6fc",
                    name: "Denis Saranyuk"
                },
                {
                    _id: "566fe2348453e8b464b70ba6",
                    name: "Andriy Lukashchuk"
                },
                {
                    _id: "565c66633410ae512364dc00",
                    name: "Alona Timochchenko"
                },
                {
                    _id: "564da59f9b85f8b16b574fe9",
                    name: "Andriy Chuprov"
                },
                {
                    _id: "5637710e5d23a8eb04e80aed",
                    name: "Viktoria Kovalenko"
                },
                {
                    _id: "564dac3e9b85f8b16b574fea",
                    name: "Alex Filchak"
                },
                {
                    _id: "5649b8ccad4bc9e53f1f6192",
                    name: "Sergiy Gevelev"
                },
                {
                    _id: "564a0186ad4bc9e53f1f6193",
                    name: "Liliya Orlenko"
                },
                {
                    _id: "561ba7039ebb48212ea838c3",
                    name: "Oleksandra Maliavska"
                },
                {
                    _id: "5626278d750d38934bfa1313",
                    name: "Viktoria Rogachenko"
                },
                {
                    _id: "55b92ad221e4b7c40f0000ad",
                    name: "Stepan Krovspey"
                },
                {
                    _id: "55b92ad221e4b7c40f0000c3",
                    name: "Olesia Prokoshkina"
                },
                {
                    _id: "55b92ad221e4b7c40f00008f",
                    name: "Yuriy Holovatskyi"
                },
                {
                    _id: "55b92ad221e4b7c40f000060",
                    name: "Roman Buchuk"
                },
                {
                    _id: "55b92ad221e4b7c40f000069",
                    name: "Michael Afendikov"
                }
            ],
            creditAccount: [
                {
                    _id: "565eb53a6aa50532e5df0bd2",
                    name: "101500 Cash USD"
                },
                {
                    _id: "565eb53a6aa50532e5df0bf3",
                    name: "300200 Retained Earnings"
                }
            ]
        }
    };
    var expect;
    
    chai.use(chaiJquery);
    chai.use(sinonChai);

    expect = chai.expect;

    describe('LoginView', function () {
        var $fixture;
        var $elFixture;

        describe('#initialize()', function () {
            var view;

            before(function () {
                $fixture = $(fixtures);
                $fixture.appendTo(document.body);
                $elFixture = $fixture.find('#wrapper');

                view = new LoginView({el: $elFixture});
            });

            after(function () {
                view.remove();
                $fixture.remove();
            });

            it('should have div tagName', function () {
                expect(view.tagName).to.be.equal('div');
            });
            it('view should have usernameFocus method', function () {
                expect(view).to.have.property('usernameFocus');
            });
            it('view should have passwordFocus method', function () {
                expect(view).to.have.property('passwordFocus');
            });
            it('this.$el id should be #wrapper', function () {
                expect(view.$el).to.have.attr('id');
                expect(view.$el).to.have.id('wrapper');
            });
        });

        describe('#initialize(options) options = {dbs: [db1, db2, ..]}', function () {
            var view;

            before(function () {
                $fixture = $(fixtures);
                $fixture.appendTo(document.body);
                $elFixture = $fixture.find('#wrapper');

                view = new LoginView({el: $elFixture, dbs: ['production', 'development']});
            });

            after(function () {
                $fixture.remove();
                view.remove();
            });

            it('should have div tagName', function () {
                expect(view.tagName).to.be.equal('div');
            });
        });

        describe('Test events', function () {
            var loginSpy;
            var customSpy;
            var view;
            var server;

            before(function () {
                var filterUrl = new RegExp('/filter/getFiltersValues', 'i');

                $fixture = $(fixtures);
                $fixture.appendTo(document.body);
                $elFixture = $fixture.find('#wrapper');

                server = sinon.fakeServer.create();
                server.autoRespond = true;
                server.respondWith("GET", filterUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeFilters)]);
                server.respondWith("GET", "/getDBS", [200, {"Content-Type": "application/json"}, JSON.stringify({
                    dbsNames: {
                        development: {
                            DBname: "development",
                            url   : "localhost"
                        },
                        production : {
                            DBname: "production",
                            url   : "localhost"
                        }
                    }
                })]);

                loginSpy = sinon.spy(LoginView.prototype, "login");
                customSpy = sinon.spy(Custom, "runApplication");
                view = new LoginView({el: $elFixture, dbs: ['production', 'development']});
            });

            after(function () {
                $fixture.remove();
                view.remove();
                loginSpy.restore();
                server.restore();
            });

            it('should have call login event, with predefined login & pass, trigger error callback, within status code !== 406', function () {
                var $thisEl = view.$el;
                var $loginButton = $thisEl.find('.login-button');
                var $login = $thisEl.find('#ulogin');
                var $password = $thisEl.find('#upass');
                var $loginForm = $thisEl.find("#loginForm");
                var $errorContainer = $loginForm.find('.error');

                $login.val('pupkin');
                $password.val('pupkin');

                server.respondWith("POST", "/users/login", [400, {"Content-Type": "application/json"}, JSON.stringify({error: 'Fail'})]);

                $loginButton.click();
                server.respond();

                expect($loginForm).to.have.class('notRegister');
                expect($errorContainer).to.contain('Wrong Password or such user');
                expect($loginButton).to.exist;
                expect(customSpy.called).to.be.false;
            });

            it('should return err & not send ajax call', function () {
                var $thisEl = view.$el;
                var $loginButton = $thisEl.find('.login-button');
                var $login = $thisEl.find('#ulogin');
                var $password = $thisEl.find('#upass');
                var $loginForm = $thisEl.find("#loginForm");
                var $errorContainer = $loginForm.find('.error');

                $login.val('');
                $password.val('p');

                $loginButton.click();

                expect($loginForm).to.have.class('notRegister');
                expect($errorContainer).to.contain('Login must be longer than 3 characters');
                expect($errorContainer).to.contain('Password must be longer than 3 characters');
                expect($loginButton).to.exist;
            });

            it('should have call login event, with predefined login & pass, trigger success callback', function () {
                var $thisEl = view.$el;
                var $loginButton = $thisEl.find('.login-button');
                var $login = $thisEl.find('#ulogin');
                var $password = $thisEl.find('#upass');

                $login.val('pupkin');
                $password.val('pupkin');

                server.respondWith("POST", "/users/login", [200, {"Content-Type": "application/json"}, JSON.stringify({success: 'loggedIn'})]);

                $loginButton.click();
                server.respond();
                server.respond();

                App.weTrack = true;

                expect($loginButton).to.exist;
                expect(loginSpy.called).to.be.true;
                expect(customSpy.called).to.be.true;
            });


            it('should focused in login input', function () {
                var $thisEl = view.$el;
                var $login = $thisEl.find('#ulogin');
                var $loginIcon = $thisEl.find(".icon-login");
                var loginHasActiveClass = $loginIcon.hasClass('active');

                $login.focusin();

                if (!loginHasActiveClass) {
                    expect($loginIcon).to.have.class('active');
                } else {
                    expect($loginIcon).to.not.have.class('active');
                }
            });
            it('should focused in password input', function () {
                var $thisEl = view.$el;
                var $password = $thisEl.find('#upass');
                var $passwordIcon = $thisEl.find(".icon-pass");
                var passwordHasActiveClass = $passwordIcon.hasClass('active');

                $password.focusin();

                if (!passwordHasActiveClass) {
                    expect($passwordIcon).to.have.class('active');
                } else {
                    expect($passwordIcon).to.not.have.class('active');
                }
            });
        });
    });
});
