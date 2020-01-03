import request from 'supertest';
import mongoose from 'mongoose';
import { expect } from 'chai';
import app from '../src/app';

const uriMongo = 'mongodb://localhost:27017/meetapp-test';
const optionsMongo = { useNewUrlParser: true, useFindAndModify: true };
mongoose.Promise = global.Promise;

const connect = (uri, options) => {
  return new Promise((resolve, reject) => {
    mongoose.connect(uri, options).then((res, err) => {
      if (err) return reject(err);
      return resolve();
    });
  });
};

describe('Session', () => {
  before(done => {
    connect(uriMongo, optionsMongo)
      .then(() => {
        console.log('connect success');
        done();
      })
      .catch(err => {
        console.log('connect failed', err);
        done();
      });
  });

  describe('authenticate', () => {
    before('get token', done => {
      request(app)
        .post('/user')
        .send({
          name: 'Felipe Smith',
          email: 'teste@teste.com',
          password: '123456',
        })
        .expect(200)
        .then(res => {
          expect(res.body.name).to.equal('Felipe Smith');
          expect(res.body.email).to.equal('teste@teste.com');
          done();
        })
        .catch(err => done(err));
    });

    it('Deve dar sucesso ao autenticar', done => {
      request(app)
        .post('/session')
        .send({
          email: 'teste@teste.com',
          password: '123456',
        })
        .expect(200)
        .then(res => {
          expect(res.body.user.name).to.equal('Felipe Smith');
          expect(res.body.user.email).to.equal('teste@teste.com');
          expect(res.body.token).to.be.a('string');
          done();
        })
        .catch(err => done(err));
    });
    it('Deve dar erro ao enviar senha inválida', done => {
      request(app)
        .post('/session')
        .send({
          email: 'teste@teste.com',
          password: '1234567',
        })
        .expect(401)
        .then(res => {
          expect(res.body.error).to.equal('Password does not match');
          done();
        })
        .catch(err => done(err));
    });
    it('Deve dar erro ao enviar usuário inexistente', done => {
      request(app)
        .post('/session')
        .send({
          email: 'teste1@teste.com',
          password: '1234567',
        })
        .expect(401)
        .then(res => {
          expect(res.body.error).to.equal('User not found');
          done();
        })
        .catch(err => done(err));
    });
  });

  after('Limpar registros do banco de dados de teste', done => {
    mongoose.connection.db.dropDatabase(() => {
      mongoose.connection.close(() => {
        console.log('close connection');
        done();
      });
    });
  });
});
