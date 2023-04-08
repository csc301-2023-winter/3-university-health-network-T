const chai = require('chai');
const sinon = require('sinon');
const chaiHttp = require('chai-http');

const expect = chai.expect;
const app = require('../server.js');
chai.use(chaiHttp);

describe('Contact', () => {
    describe('POST /contact', () => {
        it('should post the message successfully', (done) => {
            const examplecode = Math.floor(10000 + Math.random() * 90000);

            chai.request(app)
            .post('/contact')
            .send({ name: 'test', email: 'test@example.com', message: `Send test code is ${examplecode}` })
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body.message).to.equal('Received your feedback successfully!');
                done();
            })
        })
    });
});

describe('Blog', () => {
    describe('GET /blog/blogs/1', () => {
        it('should retrieve blogs successfully', (done) => {
            chai.request(app)
            .get('/blog/blogs/1')
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body.message).to.equal('Retrieved blogs successfully');
                done();
            })
        })
    });

    describe('GET /detail', () => {
        it('should mention that the blog is not found', (done) => {
            chai.request(app)
            .get('/blog/detail/1000')
            .end((err, res) => {
                expect(res.status).to.equal(404);
                expect(res.body.message).to.equal('Blog not found');
                done();
            });
        });

        it('should retrieve blog successfully', (done) => {
            chai.request(app)
            .get('/blog/detail/1')
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body.message).to.equal('Retrieved blog successfully');
                expect(res.body).to.have.property('data');
                done();
            });
        });
    });
});