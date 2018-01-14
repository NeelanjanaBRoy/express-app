'use strict';

let _mocha = require('mocha');

let _chai = require('chai');

let _chai2 = _interopRequireDefault(_chai);

let _chaiHttp = require('chai-http');

let _chaiHttp2 = _interopRequireDefault(_chaiHttp);

let _app = require('../app.js');

let _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_chai2.default.use(_chaiHttp2.default);

// i will use "should" style assertions
_chai2.default.should();

let login = "/login";

(0, _mocha.describe)('Invalid routes', function () {
    (0, _mocha.it)('should return error', function (done) {
        _chai2.default.request(_app2.default).post('/').end(function (err, res) {
            res.should.have.status(404);
            done();
        });
    });
});

(0, _mocha.describe)("User Login", function () {
    (0, _mocha.it)("It should return the token of username and password", function (done) {
        _chai2.default.request(_app2.default).post(login).send({ "username": "me", "password": "123" }).end(function (err, res) {
            res.should.have.status(200);
            res.body.should.have.property('token');
            done();
        });
    });
    (0, _mocha.it)("It should return error if username property does not exist", function (done) {
        _chai2.default.request(_app2.default).post(login).send({ "password": "123" }).end(function (err, res) {
            res.should.have.status(400);
            res.body.should.have.property('message');
            done();
        });
    });
    (0, _mocha.it)("it should return error if password property does not exists", function (done) {
        _chai2.default.request(_app2.default).post(login).send({ "username": "me" }).end(function (err, res) {
            res.should.have.status(400);
            res.body.should.have.property('message');
            done();
        });
    });
});

(0, _mocha.describe)("authorize", function () {
    (0, _mocha.it)("should return the username and password if correct token is given", function (done) {
        let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFuaWwiLCJwYXNzd29yZCI6Imhkc2ZkcyIsImlhdCI6MTUwNjgwMTEzMn0.y05aZEHqVdjgU2A6Oi8UuufNGy5IGfjdS2N3Jw0cINI";
        _chai2.default.request(_app2.default).post('/authorize').set('Authorization', token).end(function (err, res) {
            res.should.have.status(200);
            res.body.should.have.property('username');
            res.body.should.have.property('password');
            done();
        });
    });
    (0, _mocha.it)("should return error if token is invalid", function (done) {
        let invalidToken = "eyJhbGciOiJIUzI1NiIsIqR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFuaWwiLCJwYXNzd29yZCI6Imhkc2ZkcyIsImlhdCI6MTUwNjgwMTEzMn0.y05aZEHqVdjgU2A6Oi8UuufNGy5IGfjdS2N3Jw0cINI";
        _chai2.default.request(_app2.default).post('/authorize').set('Authorization', invalidToken).end(function (err, res) {
            res.should.have.status(400);
            res.body.should.have.property('message');
            done();
        });
    });
    (0, _mocha.it)("should return error if token is not provided", function (done) {
        _chai2.default.request(_app2.default).post('/authorize').end(function (err, res) {
            res.should.have.status(400);
            res.body.should.have.property('message');
            done();
        });
    });
});