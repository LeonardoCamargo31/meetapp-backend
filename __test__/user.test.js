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

describe('User', () => {
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

  describe('Save', () => {
    it('Deve salvar um novo usuário', done => {
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
    it('Deve retornar erro ao salvar um novo usuário', done => {
      request(app)
        .post('/user')
        .send({
          name: 'Felipe Smith',
          password: '123456',
        })
        .expect(400)
        .then(res => {
          expect(res.body.error).to.equal('validation error');
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
