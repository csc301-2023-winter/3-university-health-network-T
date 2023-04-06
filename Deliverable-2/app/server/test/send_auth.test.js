const chai = require('chai');
const sinon = require('sinon');
const nodemailer = require('nodemailer');
const chaiHttp = require('chai-http');

const expect = chai.expect;
const app = require('../server.js');

chai.use(chaiHttp);

describe('Send Auth', () => {
    describe('POST /auth', () => {
        let sendMailStub;

        beforeEach(() => {
            sendMailStub = sinon.stub(nodemailer, 'createTransport').returns({
                sendMail: sinon.stub().resolves('Email sent successfully'),
            });
        });

        afterEach(() => {sendMailStub.restore();});

        it('should send varification code', (done) => {
            chai
            .request(app)
            .post('/auth')
            .send({ email: 'anexample@example.com' })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('message');
                expect(res.body.message).to.equal(
                    'Verification code has been sent to your email'
                );
                expect(res.body).to.have.property('code');
                expect(sendMailStub.calledOnce).to.be.true;
                done();
            });
        });
    })
})