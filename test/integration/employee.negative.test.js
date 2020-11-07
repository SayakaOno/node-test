const request = require('supertest');
const app = require('../../app');
const mongodb = require('../../mongodb/mongodb.utils');

const contactURL = '/api/contacts';

describe('Negative scenarios -> validate ' + contactURL, () => {
  beforeEach(async () => {
    await mongodb.connect();
    await mongodb.dropCollection(`myemployee_${process.env.NODE_ENV}`);
  });

  afterEach(async () => {
    await mongodb.disconnect();
  });

  test('POST ' + contactURL + ' create employee, no password', async () => {
    const response = await request(app)
      .post(contactURL)
      .send({
        name: 'Sayaka',
        email: 'sayaka@test.com'
      });
    expect(response.statusCode).toBe(400);
  });

  test(
    'POST ' + contactURL + ' create employee with existing email',
    async () => {
      let response = await request(app)
        .post(contactURL)
        .send({
          name: 'Sayaka',
          email: 'sayaka@test.com',
          password: '1234567890'
        });
      expect(response.statusCode).toBe(201);
      response = await request(app)
        .post(contactURL)
        .send({
          name: 'Reina',
          email: 'sayaka@test.com',
          password: '1234567890'
        });
      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual(
        'Email you provided already exist in our database'
      );
    }
  );

  test(
    'GET ' + contactURL + ' Get all employees return 404 when empty',
    done => {
      request(app)
        .get(contactURL)
        .expect(404)
        .then(response => {
          done();
        });
    }
  );

  test(
    'GET ' + contactURL + ' Get employee by ID, with wrong employee id',
    async () => {
      const responseOfGet = await request(app).get(
        contactURL + '/' + '5fa2592e4a619a9b134fde48'
      );
      expect(responseOfGet.statusCode).toBe(404);
    }
  );

  test(
    'GET ' +
      contactURL +
      ' Get employee by ID, with invalid employee id format',
    async () => {
      const responseOfGet = await request(app).get(contactURL + '/' + 'abc');
      expect(responseOfGet.statusCode).toBe(500);
    }
  );

  test(
    'GET ' +
      contactURL +
      ' Get employee by ID, with invalid employee id format',
    async () => {
      const responseOfGet = await request(app).get(contactURL + '/' + 'abc');
      expect(responseOfGet.statusCode).toBe(500);
    }
  );

  test(
    'PUT ' + contactURL + ' Update Employee by ID, with wrong employee id',
    async () => {
      const response = await request(app)
        .put(contactURL + '/' + '5fa2592e4a619a9b134fde48')
        .send({
          gender: 'male'
        });
      expect(response.statusCode).toBe(400);
    }
  );

  test('DELETE ' + contactURL + ' Employee for wrong ID', async () => {
    const responseOfCreate = await request(app)
      .post(contactURL)
      .send({
        name: 'John',
        email: 'john@test.com',
        password: '1234556789'
      });
    expect(responseOfCreate.statusCode).toBe(201);
    const responseOfDelete = await request(app)
      .delete(contactURL + '/' + '5fa2592e4a619a9b134fde48')
      .send({ employee_id: responseOfCreate.body._id });
    expect(responseOfDelete.statusCode).toBe(404);
    expect(responseOfDelete.body).toBe('User not found');
  });

  test(
    'POST ' + contactURL + '/login ' + 'Employee Login with wrong email',
    async () => {
      const responseOfCreate = await request(app)
        .post(contactURL)
        .send({
          name: 'Michael',
          email: 'michael@test.com',
          password: '123456789',
          gender: 'male'
        });
      expect(responseOfCreate.statusCode).toBe(201);

      const responseOfLogin = await request(app)
        .post(contactURL + '/login')
        .send({
          name: 'Michael',
          email: 'wrongemail@test.com',
          password: '123456789'
        });
      expect(responseOfLogin.statusCode).toBe(400);
      expect(responseOfLogin.body).toBe(
        'Email you provided does not exist in our database'
      );
    }
  );

  test(
    'POST ' + contactURL + '/login ' + 'Employee Login with wrong password',
    async () => {
      const responseOfCreate = await request(app)
        .post(contactURL)
        .send({
          name: 'Michael',
          email: 'michael@test.com',
          password: '123456789',
          gender: 'male'
        });
      expect(responseOfCreate.statusCode).toBe(201);

      const responseOfLogin = await request(app)
        .post(contactURL + '/login')
        .send({
          name: 'Michael',
          email: 'michael@test.com',
          password: '123456789000'
        });
      expect(responseOfLogin.statusCode).toBe(400);
      expect(responseOfLogin.text).toBe(
        'you provided an invalid password, please try again'
      );
    }
  );
});
