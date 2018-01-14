import { describe, it } from 'mocha'
import chai from 'chai'
import chaiHttp from 'chai-http'
import server from '../app.js'
chai.use(chaiHttp)

// i will use "should" style assertions
chai.should();

let login = "/login"

describe('Invalid routes', function() {
    it('should return error', function(done) {
        chai.request(server)
            .post('/')
            .end( function(err, res) {
                res.should.have.status(404)
                done()
            })
    })
})

describe("User Login", function () {
   it("It should return the token of username and password", function (done) {
       chai.request(server).post(login).send({"username":"me", "password":"123"}).end( function (err, res) {
           res.should.have.status(200)
           res.body.should.have.property('token')
           done()
       });
   });
    it("It should return error if username property does not exist", function (done) {
        chai.request(server).post(login).send({"password":"123"}).end( function (err, res) {
            res.should.have.status(400);
            res.body.should.have.property('message');
            done()
        });
    });
    it("it should return error if password property does not exists", function (done) {
        chai.request(server).post(login).send({"username":"me"}).end( function (err, res) {
            res.should.have.status(400)
            res.body.should.have.property('message')
            done()
        })
    })
});

describe("authorize", function () {
    it("should return the username and password if correct token is given", function (done) {
        let token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFuaWwiLCJwYXNzd29yZCI6Imhkc2ZkcyIsImlhdCI6MTUwNjgwMTEzMn0.y05aZEHqVdjgU2A6Oi8UuufNGy5IGfjdS2N3Jw0cINI"
        chai.request(server).post('/authorize').set('Authorization', token).end( function (err, res) {
          res.should.have.status(200)
            res.body.should.have.property('username')
            res.body.should.have.property('password')
            done()
        })
    })
    it("should return error if token is invalid", function (done) {
        let invalidToken="eyJhbGciOiJIUzI1NiIsIqR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFuaWwiLCJwYXNzd29yZCI6Imhkc2ZkcyIsImlhdCI6MTUwNjgwMTEzMn0.y05aZEHqVdjgU2A6Oi8UuufNGy5IGfjdS2N3Jw0cINI"
        chai.request(server).post('/authorize').set('Authorization', invalidToken).end( function (err, res) {
            res.should.have.status(400)
            res.body.should.have.property('message')
            done()
        })
    })
    it("should return error if token is not provided", function (done) {
        chai.request(server).post('/authorize').end( function (err, res) {
            res.should.have.status(400)
            res.body.should.have.property('message')
            done()
        })
    })

})
