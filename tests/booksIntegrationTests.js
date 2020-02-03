require('should');

const request = require('supertest');
const mongoose = require('mongoose');

process.env.ENV = 'Test';

const app = require('../app.js');

const Book = mongoose.model('Book');
const agent = request.agent(app);

describe('Book CRUD Test', () => {
  it('should allow a book to be posted and return read and _id', (done) => {
    const bookPost = { title: 'My Book', author: 'Jon', genre: 'Fiction' };

    agent
      .post('/api/books')
      .send(bookPost)
      .expect(200)
      .end((err, results) => {
        results.body.read.should.not.equal(true);

        results.body.should.have.property('_id');

        done();
      });
  });

  afterEach((done) => {
    Book.deleteMany({}).exec();
    done();
  });

  // if not it will keep listening
  after((done) => {
    mongoose.connection.close(); // close db connection

    app.server.close(done()); // close express
  });
});
