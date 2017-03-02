var request = require('supertest');
var expect = require('chai').expect;
var url = 'http://localhost:8089/';
var aggent;
var CONSTANTS = require('../../constants/constantsTest');

require('../../config/environment/development');

describe('Product Specs', function () {
    'use strict';

    describe('Product with admin', function () {
        var id;
        var productTypeId;
        var optionId;
        var optionValueId;
        var priceListId;
        var categoryId;

        this.timeout(10000);

        before(function (done) {
            aggent = request.agent(url);
            aggent
                .post('users/login')
                .send({
                    login: 'superAdmin',
                    pass : '111111',
                    dbId : 'micheldb'
                })
                .expect(200, done);
        });

        after(function (done) {
            aggent
                .get('logout')
                .expect(302, done);
        });

        it('should create Product', function (done) {
            var body = {
                canBeSold     : true,
                canBeExpensed : false,
                canBePurchased: false,
                imageSrc      : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC',
                name          : 'testProduct',
                info          : {
                    productType: '57f1fbff9d3291200b4d9d3f',
                    category   : '57e3d5695460144248099ab5',
                    SKU        : '',
                    UPC        : '',
                    ISBN       : '',
                    EAN        : ''
                },
                groups        : {owner: null, users: [], group: []},
                isBundle      : false,
                bundles       : {},
                inventory     : {
                    weight   : '',
                    main     : {minStockLevel: '', reorderQuantity: '', defaultLocation: ''},
                    overStock: {minStockLevel: '', reorderQuantity: '', defaultLocation: ''}
                },
                accounting    : {category: {_id: '57e3d5695460144248099ab5', name: 'All'}},
                prices        : [{
                    priceLists: '57e4eca9c02f86ec2c916d6b',
                    prices    : [{count: 0, price: 0}, {count: 0, price: 0}, {
                        count: 0,
                        price: 0
                    }, {
                        count: 0, price: 0
                    }, {count: 0, price: 0}]
                }, {
                    priceLists: '57e4ecb6c02f86ec2c916d6c',
                    prices    : [{count: 0, price: 0}, {count: 0, price: 0}, {
                        count: 0,
                        price: 0
                    }, {count: 0, price: 0}, {count: 0, price: 0}]
                }, {
                    priceLists: '57e90f27d9f087e86526c8ca',
                    prices    : [{count: 0, price: 0}, {count: 0, price: 0}, {
                        count: 0,
                        price: 0
                    }, {count: 0, price: 0}, {count: 0, price: 0}]
                }, {
                    priceLists: '57ed2a5122d8a65a16dc205c',
                    prices    : [{count: 0, price: 0}, {count: 0, price: 0}, {
                        count: 0,
                        price: 0
                    }, {count: 0, price: 0}, {count: 0, price: 0}]
                }, {
                    priceLists: '57ed2b3822d8a65a16dc205d',
                    prices    : [{count: 0, price: 0}, {count: 0, price: 0}, {
                        count: 0,
                        price: 0
                    }, {count: 0, price: 0}, {count: 0, price: 0}]
                }]
            };

            aggent
                .post('products')
                .send(body)
                .expect(201)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.be.instanceOf(Object);
                    expect(body)
                        .to.have.property('success')
                        .and.to.have.property('_id');
                    expect(body.success)
                        .to.have.property('name');

                    id = body.success._id;

                    done();
                });
        });

        it('should fail create Product', function (done) {
            var body = {};

            aggent
                .post('products')
                .send(body)
                .expect(400, done);
        });

        it('should patch Product', function (done) {
            var body = {
                name: 'New product - updated'
            };

            aggent
                .patch('products/' + id)
                .send(body)
                .expect(200, done);
        });

        it('should fail patch product', function (done) {
            var body = {};

            aggent
                .patch('products/123cba')
                .send(body)
                .expect(500, done);

        });

        describe('Specs for productCategories', function () {
            it('should create productCategory', function (done) {
                var body = {
                    name               : 'New ProductCategory',
                    parent             : '57e3d5695460144248099ab5',
                    nestingLevel       : 2,
                    sequence           : 0,
                    fullName           : 'All / New ProductCategory',
                    debitAccount       : null,
                    creditAccount      : null,
                    taxesAccount       : null,
                    bankExpensesAccount: null,
                    otherIncome        : null,
                    otherLoss          : null
                };

                aggent
                    .post('category')
                    .send(body)
                    .expect(200)
                    .end(function (err, res) {
                        var body = res.body;

                        if (err) {
                            return done(err);
                        }

                        expect(body)
                            .to.be.instanceOf(Object)
                            .and.to.have.property('_id');

                        categoryId = body._id;

                        done();
                    });
            });

            it('should update productCategory', function (done) {
                var body = {
                    validate           : false,
                    _id                : categoryId,
                    __v                : 0,
                    otherLoss          : null,
                    otherIncome        : null,
                    bankExpensesAccount: null,
                    creditAccount      : null,
                    debitAccount       : null,
                    taxesAccount       : null,
                    externalId         : null,
                    productsCount      : 0,
                    main               : false,
                    sequence           : 3,
                    nestingLevel       : 3,
                    editedBy           : {date: '2016-10-04T09:48:11.799Z', user: '57d7b7a25f5122383e097253'},
                    createdBy          : {date: '2016-10-04T09:48:11.799Z', user: '57d7b7a25f5122383e097253'},
                    users              : [],
                    child              : [],
                    parent             : '57e3d5695460144248099ab5',
                    fullName           : 'All / New ProducCategory / New ProducCategory - renamed',
                    name               : 'New ProducCategory - renamed',
                    isChangedLevel     : false
                };

                aggent
                    .put('category/' + categoryId)
                    .send(body)
                    .expect(200)
                    .end(function (err, res) {
                        var body = res.body;

                        if (err) {
                            return done(err);
                        }

                        expect(body)
                            .to.be.instanceOf(Object)
                            .and.to.have.property('success', 'Category updated success');

                        done();
                    });
            });

            it('should get productCategory by id', function (done) {

                aggent
                    .get('category/' + categoryId)
                    .expect(200)
                    .end(function (err, res) {
                        var body = res.body;

                        if (err) {
                            return done(err);
                        }

                        expect(body)
                            .to.be.instanceOf(Object)
                            .and.to.have.property('_id');

                        done();
                    });
            });

            it('should get productCategories', function (done) {

                aggent
                    .get('category')
                    .expect(200)
                    .end(function (err, res) {
                        var body = res.body;

                        if (err) {
                            return done(err);
                        }

                        expect(body)
                            .to.be.instanceOf(Object)
                            .and.to.have.property('data')
                            .and.to.be.instanceOf(Array);

                        if (body.data.length) {
                            expect(body.data)
                                .to.have.deep.property('[0].name');
                        }

                        done();
                    });
            });

            it('should get productCategory by id', function (done) {

                aggent
                    .get('category/' + categoryId)
                    .expect(200)
                    .end(function (err, res) {
                        var body = res.body;

                        if (err) {
                            return done(err);
                        }

                        expect(body)
                            .to.be.instanceOf(Object)
                            .and.to.have.property('_id');

                        done();
                    });
            });

            it('should delete productCategory', function (done) {

                aggent
                    .delete('category/' + categoryId)
                    .expect(200, done);
            });
        });

        it('should get products Alphabet', function (done) {

            aggent
                .get('products/getProductsAlphabet')
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.be.instanceOf(Object)
                        .and.to.have.property('data')
                        .and.to.be.instanceOf(Array);

                    done();
                });
        });

        it('should get products all', function (done) {
            var query = {
                canBeSold: true
            };

            aggent
                .get('products')
                .query(query)
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.be.instanceOf(Object)
                        .and.to.have.property('success')
                        .and.to.be.instanceOf(Array);

                    if (body.success.length) {
                        expect(body.success)
                            .to.have.deep.property('[0]')
                            .and.to.have.property('canBeSold', true);
                    }

                    done();
                });
        });

        it('should get products images', function (done) {

            aggent
                .get('products/getProductsImages')
                .query({'ids[0]': id})
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.be.instanceOf(Object)
                        .and.to.have.property('data')
                        .and.to.be.instanceOf(Array);

                    if (body.data.length) {
                        expect(body.data)
                            .and.to.have.deep.property('[0]')
                            .and.to.have.property('imageSrc');
                    }

                    done();
                });
        });

        // todo exportToXlsx test

        // todo exportToCsv test

        it('should get productsType for Dd', function (done) {

            aggent
                .get('products/getProductsTypeForDd')
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.be.instanceOf(Object)
                        .and.to.have.property('data')
                        .and.to.be.instanceOf(Array);

                    if (body.data.length) {
                        expect(body.data)
                            .and.to.have.deep.property('[0].name');
                    }

                    done();
                });
        });

        it('should create SKU(Unique product number)', function (done) {
            var body = {
                skus: [{
                    productId: '57ee159c993c9da62c38ff66',
                    sku      : 'SKU_2'
                }, {productId: '57ee78477d83f5ad59838064', sku: 'SKU_1'}, {
                    productId: '57ee78477d83f5ad59838065',
                    sku      : 'SKU_2'
                }, {productId: '57ee78477d83f5ad59838066', sku: 'SKU_1'}, {
                    productId: '57ee78477d83f5ad59838067',
                    sku      : 'SKU_1'
                }]
            };

            aggent
                .post('products/sku')
                .send(body)
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.be.instanceOf(Object)
                        .and.to.have.property('success', 'Updated success');

                    done();
                });
        });

        it('should create variants for product', function (done) {
            var body = {
                variants: [
                    ['57dbc563de5cae24254de6a1', '57ecb6fd80793d3f1b975f0f'],
                    ['57dbc563de5cae24254de6a1', '57ecb6fd80793d3f1b975f10'],
                    ['57dbc563de5cae24254de6a2', '57ecb6fd80793d3f1b975f10']],

                isNew: false
            };

            aggent
                .post('products/variants/' + id)
                .send(body)
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.be.instanceOf(Object)
                        .and.to.have.property('success', 'Variants created success');

                    done();
                });
        });

        describe('Specs for productOptions and ProductOptions values', function () {
            it('should create productsOption', function (done) {
                var body = {
                    name: 'New Option'
                };

                aggent
                    .post('products/options/')
                    .send(body)
                    .expect(200)
                    .end(function (err, res) {
                        var body = res.body;

                        if (err) {
                            return done(err);
                        }

                        expect(body)
                            .to.be.instanceOf(Object)
                            .to.have.property('success', 'Product options created');

                        optionId = body.id;

                        done();
                    });
            });

            it('should update productsOption', function (done) {
                var body = {
                    checkedNow    : ['57f218e6c3d540e222241b3a'],
                    checkedPrTypes: [],
                    name          : 'New Option'
                };

                aggent
                    .patch('products/options/' + optionId)
                    .send(body)
                    .expect(200)
                    .end(function (err, res) {
                        var body = res.body;

                        if (err) {
                            return done(err);
                        }

                        expect(body)
                            .to.be.instanceOf(Object)
                            .to.have.property('success', 'Options update is success');

                        done();
                    });
            });

            it('should get productsOptions', function (done) {

                aggent
                    .get('products/options')
                    .expect(200)
                    .end(function (err, res) {
                        var body = res.body;

                        if (err) {
                            return done(err);
                        }

                        expect(body)
                            .to.be.instanceOf(Object)
                            .to.have.property('data')
                            .to.be.instanceOf(Array);

                        if (body.data.length) {
                            expect(body.data)
                                .to.have.deep.property('[0]._id');
                            expect(body.data)
                                .to.have.deep.property('[0].name');
                        }

                        done();
                    });
            });

            it('should create optionsValues', function (done) {
                var body = {
                    optionsValues: [{value: 'crazyFrog', optionId: optionId}]
                };

                aggent
                    .post('products/optionsValues')
                    .send(body)
                    .expect(200)
                    .end(function (err, res) {
                        var body = res.body;

                        if (err) {
                            return done(err);
                        }

                        expect(body)
                            .to.be.instanceOf(Object)
                            .to.have.property('id');

                        optionValueId = body.id;

                        done();
                    });
            });

            it('should update optionsValue', function (done) {
                var body = {
                    id   : optionValueId,
                    value: 'updatedNameOfOptionValue'
                };

                aggent
                    .patch('products/optionsValues')
                    .send(body)
                    .expect(200)
                    .end(function (err, res) {
                        var body = res.body;

                        if (err) {
                            return done(err);
                        }

                        expect(body)
                            .to.be.instanceOf(Object)
                            .to.have.property('success', 'Options updated success');

                        done();
                    });
            });

            it('should get optionsValues', function (done) {
                var query = {
                    id: optionId
                };

                aggent
                    .get('products/optionsValues')
                    .query(query)
                    .expect(200)
                    .end(function (err, res) {
                        var body = res.body;

                        if (err) {
                            return done(err);
                        }

                        expect(body)
                            .to.be.instanceOf(Array);

                        if (body.length) {
                            expect(body)
                                .to.have.deep.property('[0].value');
                        }

                        done();
                    });
            });

            it('should delete optionsValue', function (done) {
                var body = {
                    id: optionValueId
                };

                aggent
                    .delete('products/optionsValues')
                    .send(body)
                    .expect(200)
                    .end(function (err, res) {
                        var body = res.body;

                        if (err) {
                            return done(err);
                        }

                        expect(body)
                            .to.be.instanceOf(Object)
                            .to.have.property('success', 'Product options deleted');

                        done();
                    });
            });

            it('should delete productsOptions', function (done) {
                var body = {
                    contentType: 'productSettings',
                    ids        : [optionId]
                };

                aggent
                    .delete('products/options')
                    .send(body)
                    .expect(200)
                    .end(function (err, res) {
                        var body = res.body;

                        if (err) {
                            return done(err);
                        }

                        expect(body)
                            .to.be.instanceOf(Object)
                            .to.have.property('success', 'Product options with values deleted');

                        done();
                    });
            });
        });

        describe('Specs for ProductType', function () {
            it('should create productType', function (done) {
                var body = {
                    name   : 'New product type',
                    options: []
                };

                aggent
                    .post('products/productTypes/')
                    .send(body)
                    .expect(200)
                    .end(function (err, res) {
                        var body = res.body;

                        if (err) {
                            return done(err);
                        }

                        expect(body)
                            .to.be.instanceOf(Object)
                            .to.have.property('id');

                        productTypeId = body.id;
                        done();
                    });
            });

            it('should update productType', function (done) {
                var body = {
                    options: ['57dbc4ff7ae3ca7a767492d4']
                };

                aggent
                    .patch('products/productTypes/' + productTypeId)
                    .send(body)
                    .expect(200)
                    .end(function (err, res) {
                        var body = res.body;

                        if (err) {
                            return done(err);
                        }

                        expect(body)
                            .to.be.instanceOf(Object)
                            .to.have.property('success', 'Product type updated success');

                        done();
                    });
            });

            it('should get productTypes', function (done) {

                aggent
                    .get('products/productTypes/')
                    .expect(200)
                    .end(function (err, res) {
                        var body = res.body;

                        if (err) {
                            return done(err);
                        }

                        expect(body)
                            .to.be.instanceOf(Object)
                            .to.have.property('data')
                            .to.be.instanceOf(Array);

                        if (body.data.length) {
                            expect(body.data)
                                .to.have.deep.property('[0]._id');
                            expect(body.data)
                                .to.have.deep.property('[0].name');
                        }

                        done();
                    });
            });

            it('should get productType', function (done) {

                aggent
                    .get('products/productTypes/' + productTypeId)
                    .expect(200)
                    .end(function (err, res) {
                        var body = res.body;

                        if (err) {
                            return done(err);
                        }

                        expect(body)
                            .to.be.instanceOf(Object)
                            .to.have.property('name');

                        done();
                    });
            });

            it('should delete productType', function (done) {
                var body = {
                    contentType: 'productType',
                    ids        : [productTypeId]
                };

                aggent
                    .delete('products/productTypes/')
                    .send(body)
                    .expect(200)
                    .end(function (err, res) {
                        var body = res.body;

                        if (err) {
                            return done(err);
                        }

                        expect(body)
                            .to.be.instanceOf(Object)
                            .to.have.property('success', 'Product type is deleted');

                        done();
                    });
            });
        });

        /*it('should get products totalCollectionLength', function (done) {
         var query = {
         filter: {
         canBeSold: {
         key: 'canBeSold'
         }
         }
         };

         aggent
         .get('products/totalCollectionLength')
         .query(query)
         .query({'filter[canBeSold][value][0]': true})
         .expect(200)
         .end(function (err, res) {
         var body = res.body;

         if (err) {
         return done(err);
         }

         expect(body)
         .to.be.instanceOf(Object);

         expect(body)
         .to.have.property('count')
         .and.to.be.gte(1);

         done();
         });
         });*/

        describe('Specs for PriceLists', function () {
            it('should create priceList for Product', function (done) {
                var body = {
                    currency      : CONSTANTS.EURO,
                    name          : 'New priceList',
                    priceListCode : 'PL_New',
                    priceListsCode: ''
                };

                aggent
                    .post('priceList/')
                    .send(body)
                    .expect(200)
                    .end(function (err, res) {
                        var body = res.body;

                        if (err) {
                            return done(err);
                        }

                        expect(body)
                            .to.be.instanceOf(Object)
                            .to.have.property('success', 'Price list created');

                        priceListId = body.id;

                        done();
                    });
            });

            it('should update priceList for Product', function (done) {
                var body = {
                    currency: CONSTANTS.DOLLAR
                };

                aggent
                    .patch('priceList/' + priceListId)
                    .send(body)
                    .expect(200)
                    .end(function (err, res) {
                        var body = res.body;

                        if (err) {
                            return done(err);
                        }

                        expect(body)
                            .to.be.instanceOf(Object)
                            .to.have.property('success', 'Price list is updated success');

                        done();
                    });
            });

            it('should get priceList for Product', function (done) {

                aggent
                    .get('priceList/forProduct')
                    .expect(200)
                    .end(function (err, res) {
                        var body = res.body;

                        if (err) {
                            return done(err);
                        }

                        expect(body)
                            .to.be.instanceOf(Array);

                        if (body.length) {
                            expect(body)
                                .to.have.deep.property('[0].priceListCode');
                        }

                        done();
                    });
            });

            it('should bulk delete priceLists', function (done) {
                var body = {
                    contentType: 'productSettings',
                    ids        : [priceListId]
                };

                aggent
                    .delete('priceList')
                    .send(body)
                    .expect(200)
                    .end(function (err, res) {
                        var body = res.body;

                        if (err) {
                            return done(err);
                        }

                        expect(body)
                            .to.be.instanceOf(Object)
                            .to.have.property('success', 'Price list is deleted');

                        done();
                    });
            });
        });

        it('should get product by id', function (done) {
            var query = {
                id: id
            };

            aggent
                .get('products/')
                .query(query)
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }
                    expect(body)
                        .to.be.instanceOf(Object);
                    expect(body)
                        .to.have.property('_id')
                        .and.to.be.equal(id);

                    done();
                });
        });

        it('should fail get product by id', function (done) {
            var query = {
                id: '123cba'
            };

            aggent
                .get('products/')
                .query(query)
                .expect(400, done);

        });

        it('should delete product', function (done) {
            aggent
                .delete('products/' + id)
                .expect(200, done);
        });

        it('should fail delete product', function (done) {
            aggent
                .delete('products/123cba')
                .expect(500, done);
        });

        describe('Test: if some of product use some option, then you can\'t delete this option or it\'s optionValues', function () {

            var id;
            var productTypeId;
            var optionId;
            var optionValueId;

            it('should create productsOption', function (done) {
                var body = {
                    name: 'Creatures clothes'
                };

                aggent
                    .post('products/options/')
                    .send(body)
                    .expect(200)
                    .end(function (err, res) {
                        var body = res.body;

                        if (err) {
                            return done(err);
                        }

                        expect(body)
                            .to.be.instanceOf(Object)
                            .to.have.property('success', 'Product options created');

                        optionId = body.id;

                        done();
                    });
            });

            it('should create optionsValues', function (done) {
                var body = {
                    optionsValues: [{value: 'crazyFrog', optionId: optionId}]
                };

                aggent
                    .post('products/optionsValues')
                    .send(body)
                    .expect(200)
                    .end(function (err, res) {
                        var body = res.body;

                        if (err) {
                            return done(err);
                        }

                        expect(body)
                            .to.be.instanceOf(Object)
                            .to.have.property('id');

                        optionValueId = body.id;

                        done();
                    });
            });

            it('should create productType', function (done) {
                var body = {
                    name   : 'New product type (Test)',
                    options: [optionId]
                };

                aggent
                    .post('products/productTypes/')
                    .send(body)
                    .expect(200)
                    .end(function (err, res) {
                        var body = res.body;

                        if (err) {
                            return done(err);
                        }

                        expect(body)
                            .to.be.instanceOf(Object)
                            .to.have.property('id');

                        productTypeId = body.id;
                        done();
                    });
            });

            it('should create Product', function (done) {
                var body = {
                    canBeSold     : true,
                    canBeExpensed : false,
                    canBePurchased: false,
                    imageSrc      : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC',
                    name          : 'newProduct(Test)',
                    info          : {
                        productType: productTypeId,
                        category   : '57e3d5695460144248099ab5',
                        SKU        : '',
                        UPC        : '',
                        ISBN       : '',
                        EAN        : ''
                    },
                    groups        : {owner: null, users: [], group: []},
                    isBundle      : false,
                    bundles       : {},
                    inventory     : {
                        weight   : '',
                        main     : {minStockLevel: '', reorderQuantity: '', defaultLocation: ''},
                        overStock: {minStockLevel: '', reorderQuantity: '', defaultLocation: ''}
                    },
                    accounting    : {category: {_id: '57e3d5695460144248099ab5', name: 'All'}},
                    prices        : [{
                        priceLists: '57e4eca9c02f86ec2c916d6b',
                        prices    : [{count: 0, price: 0}, {count: 0, price: 0}, {
                            count: 0,
                            price: 0
                        }, {
                            count: 0, price: 0
                        }, {count: 0, price: 0}]
                    }, {
                        priceLists: '57e4ecb6c02f86ec2c916d6c',
                        prices    : [{count: 0, price: 0}, {count: 0, price: 0}, {
                            count: 0,
                            price: 0
                        }, {count: 0, price: 0}, {count: 0, price: 0}]
                    }, {
                        priceLists: '57e90f27d9f087e86526c8ca',
                        prices    : [{count: 0, price: 0}, {count: 0, price: 0}, {
                            count: 0,
                            price: 0
                        }, {count: 0, price: 0}, {count: 0, price: 0}]
                    }, {
                        priceLists: '57ed2a5122d8a65a16dc205c',
                        prices    : [{count: 0, price: 0}, {count: 0, price: 0}, {
                            count: 0,
                            price: 0
                        }, {count: 0, price: 0}, {count: 0, price: 0}]
                    }, {
                        priceLists: '57ed2b3822d8a65a16dc205d',
                        prices    : [{count: 0, price: 0}, {count: 0, price: 0}, {
                            count: 0,
                            price: 0
                        }, {count: 0, price: 0}, {count: 0, price: 0}]
                    }]
                };

                aggent
                    .post('products')
                    .send(body)
                    .expect(201)
                    .end(function (err, res) {
                        var body = res.body;

                        if (err) {
                            return done(err);
                        }

                        expect(body)
                            .to.be.instanceOf(Object);
                        expect(body)
                            .to.have.property('success')
                            .and.to.have.property('_id');
                        expect(body.success)
                            .to.have.property('name');

                        id = body.success._id;

                        done();
                    });
            });

            it('should create variants for product', function (done) {
                var body = {
                    variants: [{
                        optionId  : optionId,
                        optionName: 'Creatures clothes',
                        values    : [optionValueId]
                    }],

                    isNew: true
                };

                aggent
                    .post('products/variants/' + id)
                    .send(body)
                    .expect(200)
                    .end(function (err, res) {
                        var body = res.body;

                        if (err) {
                            return done(err);
                        }

                        expect(body)
                            .to.be.instanceOf(Object)
                            .and.to.have.property('success', 'Variants created success');

                        id = body.id;

                        done();
                    });
            });

            it('should fail delete optionValue', function (done) {
                var body = {
                    id: optionValueId
                };

                aggent
                    .delete('products/optionsValues')
                    .send(body)
                    .expect(400, done);
            });

            it('should fail delete productsOptions', function (done) {
                var body = {
                    contentType: 'productSettings',
                    ids        : [optionId]
                };

                aggent
                    .delete('products/options')
                    .send(body)
                    .expect(400, done);
            });

            it('should delete product', function (done) {
                aggent
                    .delete('products/' + id)
                    .expect(200, done);
            });

            it('should delete optionsValue', function (done) {
                var body = {
                    id: optionValueId
                };

                aggent
                    .delete('products/optionsValues')
                    .send(body)
                    .expect(200)
                    .end(function (err, res) {
                        var body = res.body;

                        if (err) {
                            return done(err);
                        }

                        expect(body)
                            .to.be.instanceOf(Object)
                            .to.have.property('success', 'Product options deleted');

                        done();
                    });
            });

            it('should delete productsOptions', function (done) {
                var body = {
                    contentType: 'productSettings',
                    ids        : [optionId]
                };

                aggent
                    .delete('products/options')
                    .send(body)
                    .expect(200)
                    .end(function (err, res) {
                        var body = res.body;

                        if (err) {
                            return done(err);
                        }

                        expect(body)
                            .to.be.instanceOf(Object)
                            .to.have.property('success', 'Product options with values deleted');

                        done();
                    });
            });

            it('should delete productType', function (done) {
                var body = {
                    contentType: 'productType',
                    ids        : [productTypeId]
                };

                aggent
                    .delete('products/productTypes/')
                    .send(body)
                    .expect(200)
                    .end(function (err, res) {
                        var body = res.body;

                        if (err) {
                            return done(err);
                        }

                        expect(body)
                            .to.be.instanceOf(Object)
                            .to.have.property('success', 'Product type is deleted');

                        done();
                    });
            });

        });

    });

    describe('Product with user without a license', function () {

        before(function (done) {
            aggent = request.agent(url);

            aggent
                .post('users/login')
                .send({
                    login: 'ArturMyhalko',
                    pass : 'thinkmobiles2015',
                    dbId : 'micheldb'
                })
                .expect(200, done);
        });

        after(function (done) {
            aggent
                .get('logout')
                .expect(302, done);
        });

        it('should fail create Product', function (done) {

            var body = {
                canBeSold     : true,
                canBeExpensed : false,
                canBePurchased: false,
                imageSrc      : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC',
                name          : 'testProduct',
                info          : {
                    productType: '57e3c6795f5ec59938c5fbbb',
                    category   : '57e3d5695460144248099ab5',
                    SKU        : '',
                    UPC        : '',
                    ISBN       : '',
                    EAN        : ''
                },
                groups        : {owner: null, users: [], group: []},
                isBundle      : false,
                bundles       : {},
                inventory     : {
                    weight   : '',
                    main     : {minStockLevel: '', reorderQuantity: '', defaultLocation: ''},
                    overStock: {minStockLevel: '', reorderQuantity: '', defaultLocation: ''}
                },
                accounting    : {category: {_id: '57e3d5695460144248099ab5', name: 'All'}},
                prices        : [{
                    priceLists: '57e4eca9c02f86ec2c916d6b',
                    prices    : [{count: 0, price: 0}, {count: 0, price: 0}, {
                        count: 0,
                        price: 0
                    }, {
                        count: 0, price: 0
                    }, {count: 0, price: 0}]
                }, {
                    priceLists: '57e4ecb6c02f86ec2c916d6c',
                    prices    : [{count: 0, price: 0}, {count: 0, price: 0}, {
                        count: 0,
                        price: 0
                    }, {count: 0, price: 0}, {count: 0, price: 0}]
                }, {
                    priceLists: '57e90f27d9f087e86526c8ca',
                    prices    : [{count: 0, price: 0}, {count: 0, price: 0}, {
                        count: 0,
                        price: 0
                    }, {count: 0, price: 0}, {count: 0, price: 0}]
                }, {
                    priceLists: '57ed2a5122d8a65a16dc205c',
                    prices    : [{count: 0, price: 0}, {count: 0, price: 0}, {
                        count: 0,
                        price: 0
                    }, {count: 0, price: 0}, {count: 0, price: 0}]
                }, {
                    priceLists: '57ed2b3822d8a65a16dc205d',
                    prices    : [{count: 0, price: 0}, {count: 0, price: 0}, {
                        count: 0,
                        price: 0
                    }, {count: 0, price: 0}, {count: 0, price: 0}]
                }]
            };

            aggent
                .post('products')
                .send(body)
                .expect(403, done);
        });
    });

    describe('Product with no authorise', function () {

        it('should fail get Product for View', function (done) {

            aggent
                .get('products')
                .expect(404, done);
        });

    });

});