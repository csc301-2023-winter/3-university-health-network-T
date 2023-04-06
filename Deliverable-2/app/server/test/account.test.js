const chai = require('chai');
const sinon = require('sinon');
const chaiHttp = require('chai-http');

const expect = chai.expect;
const app = require('../server.js');
chai.use(chaiHttp);

describe('Account', () => {
  describe('GET /signin', () => {
    it('should return a message indicating the login page', (done) => {
      chai.request(app)
        .get('/account/signin')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal('Login page');
          done();
        });
    });
  });

  describe('POST /signin', () => {
    it('should return an error message for invalid username or password', (done) => {
      chai.request(app)
        .post('/account/signin')
        .send({ email: 'invalid@example.com', password: 'invalid' })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.message).to.equal('Invalid username or password');
          done();
        });
    });
  });

  describe('GET /signup', () => {
    it('should return a message indicating the signup page', (done) => {
        chai.request(app)
        .get('/account/signup')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal('Signup page');
          done();
        });
    });
  });

  describe('POST /signup', () => {
    it('should return an error message for already exists this account', (done) => {
        chai.request(app)
        .post('/account/signup')
        .send({ email: 'zhou@gmail.com', password: '123' })
        .end((err, res) => {
            expect(res.status).to.equal(409);
            expect(res.body.message).to.equal('Email already exists');
            done();
        });
    });

    it('should return an error message for required field', (done) => {
        chai.request(app)
        .post('/account/signup')
        .send({ email: 'zhou@gmail.com'})
        .end((err, res) => {
            expect(res.status).to.equal(400);
            expect(res.body.message).to.equal('Email and password are required');
            done();
        });
    });
  });

});