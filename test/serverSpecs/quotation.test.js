/**
 * Created by Roman on 24.08.2015.
 */
var request = require('supertest');
var expect = require('chai').expect;
var url = 'http://localhost:8089/';
var aggent;

describe("Quotation Specs", function () {
    var id;

    before(function (done) {
        aggent = request.agent(url);

        aggent
            .post('users/login')
            .send({
                login: 'admin',
                pass : '1q2w3eQWE',
                dbId : 'production'
            })
            .expect(200, done);
    });

    it("should create quotation", function (done) {
        var body = {
            "supplier"         : "55b92ad621e4b7c40f00064f",
            "project"          : "55b92ad621e4b7c40f00069c",
            "workflow"         : "5555bf276a3f01acae0b5560",
            "supplierReference": null,
            "orderDate"        : "28 Dec, 2015",
            "expectedDate"     : "Mon Dec 28 2015 00:00:00 GMT+0200 (Фінляндія (зима))",
            "name"             : "PO",
            "invoiceControl"   : null,
            "invoiceRecived"   : false,
            "paymentTerm"      : null,
            "fiscalPosition"   : null,
            "destination"      : null,
            "incoterm"         : null,
            "products"         : [
                {
                    "product"      : "5540d528dacb551c24000003",
                    "unitPrice"    : "500",
                    "quantity"     : "1",
                    "scheduledDate": "28 Dec, 2015",
                    "taxes"        : "0.00",
                    "description"  : "",
                    "subTotal"     : "500",
                    "jobs"         : "564cfd8ba6e6390160c9edf7"
                }
            ],
            "currency"         : {
                _id: "565eab29aeb95fa9c0f9df2d",
                name: 'EUR'
            },
            "forSales"         : true,
            "deliverTo"        : "55543831d51bdef79ea0d58c",
            "populate"         : true,
            "paymentInfo"      : {
                "total"  : "500.00",
                "unTaxed": "500.00",
                "taxes"  : "0.00"
            },
            "groups"           : {
                "owner": "55ba28c8d79a3a3439000016",
                "users": [],
                "group": []
            },
            "whoCanRW"         : "everyOne"
        };

        aggent
            .post('quotation')
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
                    .to.have.property('_id');
                expect(body)
                    .to.have.property('currency')
                    .and.to.be.instanceOf(Object)
                    .and.have.property('rate')
                    .and.to.be.below(1);
                expect(body)
                    .to.have.property('products');
                expect(body.products)
                    .to.be.instanceOf(Array);
                expect(body.products.length)
                    .not.to.be.equal(0);

                id = body._id;

                done();
            });
    });

    it("should delete quotation", function (done) {
        aggent
            .delete('quotation/' + id)
            .expect(200, done);
    });
});

