define([], function () {
   return {
       stats: {
           importedOrders: [
               {
                   _id: "584fc1a7150bde5a2d9a686c",
                   count: 4
               },
               {
                   _id: "584fb3461e5d070ece3a521d",
                   count: 5
               }
           ],
           importedProducts: [
               {
                   _id: "584fb3461e5d070ece3a521d",
                   count: 15
               },
               {
                   _id: "584fc1a7150bde5a2d9a686c",
                   count: 98
               }
           ],
           conflictProducts: [
               {
                   _id: "584fc1a7150bde5a2d9a686c",
                   count: 7
               },
               {
                   _id: null,
                   count: 2
               },
               {
                   _id: "584fb3461e5d070ece3a521d",
                   count: 3
               }
           ],
           unlinkedOrders: [
               {
                   _id: "584fc1a7150bde5a2d9a686c",
                   count: 4
               },
               {
                   _id: "584fb3461e5d070ece3a521d",
                   count: 2
               }
           ]
       },
       result: [
           {
               _id: "584fb3461e5d070ece3a521d",
               baseUrl: "https://supervasya.myshopify.com",
               channelName: "Shopik",
               type: "shopify",
               password: "71abdb9af61f8902ff0fcbd18fbb61d536262fda40ffcdb807f81f5a2223f713fd9e72fbcbf09858a21744ddfa4286b1",
               token: "Basic MzE0ODIxMGM2Y2FjYWNiNjRlNTRhMDM2ZWZiMzBmNGU6YzVkZDcwYjI1OTRmNzhkNTM1ZmU2MTJlNzZhYjE5ZDk=",
               priceList: {
                   _id: "584fb343150bde5a2d9a65ea",
                   __v: 0,
                   cost: false,
                   currency: "USD",
                   name: "Shopify_Prices",
                   priceListCode: "SP"
               },
               user: "5836ec22d291dd500cf6e16a",
               dbName: "micheldb",
               username: "3148210c6cacacb64e54a036efb30f4e",
               __v: 0,
               warehouseSettings: {
                   location: {
                       _id: "57dfc7076066337b771e99e4",
                       __v: 0,
                       editedBy: {
                           date: "2016-12-01T13:14:05.189Z",
                           user: null
                       },
                       createdBy: {
                           date: "2016-12-01T13:14:05.124Z",
                           user: null
                       },
                       zone: null,
                       warehouse: "57dfc6ea6066337b771e99e2",
                       groupingD: "0",
                       groupingC: "0",
                       groupingB: "0",
                       groupingA: "0",
                       name: "0.0.0.0"
                   },
                   warehouse: {
                       _id: "57dfc6ea6066337b771e99e2",
                       __v: 0,
                       account: "5788b4be52adaf4c49e4b51c",
                       editedBy: {
                           date: "2016-12-01T13:14:05.155Z",
                           user: null
                       },
                       createdBy: {
                           date: "2016-12-01T13:14:05.124Z",
                           user: null
                       },
                       main: false,
                       isOwn: true,
                       address: {
                           country: "",
                           zip: "",
                           state: "",
                           city: "",
                           street: ""
                       },
                       name: "Main Warehouse"
                   }
               }
           },
           {
               _id: "584fc1a7150bde5a2d9a686c",
               bankAccount: null,
               priceList: {
                   _id: "584fc1a5150bde5a2d9a686b",
                   __v: 0,
                   cost: false,
                   currency: "USD",
                   name: "Magento_Prices",
                   priceListCode: "MP"
               },
               consumerSecret: "",
               consumerKey: "",
               secret: "",
               token: "r06021uyj5anc1s2wvpqwjm1gjh9mnhb",
               active: false,
               updateShippingMethod: false,
               updateShippingStatus: false,
               baseUrl: "http://magento-easyerp.test.thinkmobiles.com",
               password: "60217475dfe1a8eab8d8ead8cd4a8aad",
               username: "roma",
               user: "5836ec22d291dd500cf6e16a",
               type: "magento",
               dbName: "micheldb",
               channelName: "Magik",
               __v: 0,
               warehouseSettings: {
                   location: {
                       _id: "57dfc7076066337b771e99e4",
                       __v: 0,
                       editedBy: {
                           date: "2016-12-01T13:14:05.189Z",
                           user: null
                       },
                       createdBy: {
                           date: "2016-12-01T13:14:05.124Z",
                           user: null
                       },
                       zone: null,
                       warehouse: "57dfc6ea6066337b771e99e2",
                       groupingD: "0",
                       groupingC: "0",
                       groupingB: "0",
                       groupingA: "0",
                       name: "0.0.0.0"
                   },
                   warehouse: {
                       _id: "57dfc6ea6066337b771e99e2",
                       __v: 0,
                       account: "5788b4be52adaf4c49e4b51c",
                       editedBy: {
                           date: "2016-12-01T13:14:05.155Z",
                           user: null
                       },
                       createdBy: {
                           date: "2016-12-01T13:14:05.124Z",
                           user: null
                       },
                       main: false,
                       isOwn: true,
                       address: {
                           country: "",
                           zip: "",
                           state: "",
                           city: "",
                           street: ""
                       },
                       name: "Main Warehouse"
                   }
               },
               shippingMethod: {
                   name: "",
                   _id: 0
               }
           }
       ]
   }
});