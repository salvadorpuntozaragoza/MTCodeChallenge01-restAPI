let chai = require('chai');
let chaiHttp = require('chai-http');
const expect = require('chai').expect;

chai.use(chaiHttp);

const url = 'http://localhost:3000';
let token = '';
let userid = '';

describe('Login with valid user and password', () => {
  it('should return a success response status', (done) => {
    chai.request(url)
    .post('/users/login')
    .send({ email: "uprueba1@mail.com", password: "123456" })
    .end(function(err,res) {
      token = res.body.token;
      expect(res).to.have.status(200);
      done();
    })
  })
});

describe('Signup successfully', () => {
  it('should return a user created response status', (done) => {
    chai.request(url)
    .post('/users/register')
    .send({ name: "Usuario de prueba", email: "testuser3@mail.com", password: "123456" })
    .end(function(err,res) {
      expect(res).to.have.status(201);
      done();
    })
  })
});

describe('Signup failed due to email already in use', () => {
  it('should return a bad request response status', (done) => {
    chai.request(url)
    .post('/users/register')
    .send({ name: "Usuario de prueba", email: "testuser3@mail.com", password: "123456" })
    .end(function(err,res) {
      expect(res).to.have.status(400);
      done();
    })
  })
});

describe('Request array of users registered', () => {
  it('should return an array of users', (done) => {
    chai.request(url)
    .get('/users')
    .end(function(err,res) {
      expect(res.body).to.be.an('array');
      done();
    })
  })
});