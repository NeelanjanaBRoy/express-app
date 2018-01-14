import chai from 'chai'
import chaiHttp from 'chai-http'
import { describe, it } from 'mocha'
import server from '../app.js'
let should = chai.should();
chai.use(chaiHttp);

//##############################################################################################
//                              TEST CASE FOR JSON-PATCHING
//##############################################################################################

let patch = "/api/patch"
let token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFuaWwiLCJwYXNzd29yZCI6Imhkc2ZkcyIsImlhdCI6MTUwNjc5MTYzMn0.x1oCejqbDVv_xnmqKTdMoMNMzKyV_qqWpjekCqsgLtM"
let invalidToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFubWwiLCJwYXNzd29yZCI6Imhkc2ZkcyIsImlhdCI6MTUwNjc5MTYzMn0.x1oCejqbDVv_xnmqKTdMoMNMzKyV_qqWpjekCqsgLtM"
let jsonPatch = {
    "jsonObject":{
        "baz": "qux",
        "foo": "bar"
    },
    "Patch":[
        { "op": "replace", "path": "/baz", "value": "boo" },
        { "op": "add", "path": "/hello", "value": ["world"] },
        { "op": "remove", "path": "/foo"}
    ]
}

describe('json-Patch', function () {
    it("it should return patched json if correct data given", function (done) {
        chai.request(server).post(patch).send(jsonPatch).set("Authorization", token).end( function (err, res) {
            res.should.have.status(200)
            res.body.should.have.property("patch");
            done();
        })
    });
    it("it should not authenticate if token is invalid", function (done) {
        chai.request(server).post(patch).send(jsonPatch).set("Authorization", invalidToken).end( function (err, res) {
            res.should.have.status(403)
            res.body.should.have.property("message")
            done()
        })
    });
    it("it should not authenticate if token is not given", function (done) {
        chai.request(server).post(patch).send(jsonPatch).end( function (err, res) {
            res.should.have.status(403)
            res.body.should.have.property("message")
            done()
        })
    });
    it("it should return error if wrong patch operation is given", function (done) {
        let jsonPatch = {
            "jsonObject":{
                "baz": "qux",
                "foo": "bar"
            },
            "Patch":[
                { "op": "replace", "path": "/baz", "value": "boo" },
                { "op": "add", "path": "/hello", "value": ["world"] },
                { "op": "remove"}
            ]
        }
        chai.request(server).post(patch).send(jsonPatch).set("Authorization", token).end( function (err, res) {
            res.should.have.status(400)
            res.body.should.have.property("message");
            done();
        })
    });
    it("It should return error if patch operation is not provided", function (done) {
        let jsonPatch = {
            "jsonObject":{
                "baz": "qux",
                "foo": "bar"
            }}
        chai.request(server).post(patch).send(jsonPatch).set("Authorization", token).end( function (err, res) {
            res.should.have.status(400)
            res.body.should.have.property("message");
            done();
        })

    })

})


//############################################################################################################

//                              TEST CASE FOR THUMBNAIL_GENERATIONS

//############################################################################################################

let imageUrl='https://www.sitebuilderreport.com/assets/facebook-stock-up-446fff24fb11820517c520c4a5a4c032.jpg'
let notImageUrl='https://youtube.com'
let url = '/api/thumbnail?imageUrl='

describe('Thumbnail Generations', function () {
    this.timeout(20000)
    it('should return thumbnail image if image url is correct', function(done) {
        chai.request(server)
            .post(url + imageUrl)
            .set('Authorization', token)
            .end( function(err, res) {
                res.should.have.status(200)
                done()
            })
    })
    it('should not authenticate if invalid jwt token is provided', function(done) {
        chai.request(server)
            .post(url + imageUrl)
            .set('Authorization', invalidToken)
            .end( function(err, res) {
                // res.should.have.property('message')
                res.should.have.status(403)
                done()
            })
    })
    it('should not authenticate if jwt token is not provided', function(done) {
        chai.request(server)
            .post(url + imageUrl)
            .end( function(err, res) {
                // res.should.have.property('message')
                res.should.have.status(403)
                done()
            })
    })
    it('should return thumbnail image if URL does not contains image', function(done) {
        chai.request(server)
            .post(url + notImageUrl)
            .set('Authorization', token)
            .end( function(err, res) {
                res.should.have.status(400)
                done()
            })
    })
    it('should return error if image size exceeds than 10 MB', function(done) {
            let urlImage = "https://upload.wikimedia.org/wikipedia/commons/9/93/Canon_EF_16-35mm_f4L_IS_USM_collage.jpg"
            chai.request(server)
                .post(url + urlImage)
                .set('Authorization', token)
                .end( function(err, res) {
                    res.should.have.status(400)
                    done()
                })
        })
    it('should return error if image url is not provided', function(done) {
        chai.request(server)
            .post('/api/thumbnail')
            .set('Authorization', token)
            .end( function(err, res) {
                // res.should.have.property('message')
                res.should.have.status(400)
                done()
            })
    })
})