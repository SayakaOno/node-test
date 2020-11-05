const request = require('supertest');
const app = require('../../app');
const mongodb = require('../../mongodb/mongodb.utils');
const mockEmployeeRequest = require('../mockdata/employeeReqPayload.json');
const contactURL = '/api/contacts';

describe('Positive scenarios -> validate ' + contactURL, () => {
  beforeAll(async () => {
    await mongodb.connect();
    await mongodb.dropCollection(`myemployee_${process.env.NODE_ENV}`);
  });

  afterAll(async () => {
    await mongodb.disconnect();
  });

  test('post ' + contactURL, async () => {
    const response = await request(app)
      .post(contactURL)
      .send(mockEmployeeRequest);
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('name', mockEmployeeRequest.name);
    expect(response.body).toHaveProperty('email', mockEmployeeRequest.email);
    expect(response.body).toHaveProperty('_id');
    expect(response.body).toHaveProperty('password');
    expect(response.body).toHaveProperty('created_date');
    expect(Object.keys(response.body).length).toBe(6);
  });

  test('GET ' + contactURL + ' Get all employees', done => {
    request(app)
      .get(contactURL)
      .expect(200)
      .then(response => {
        expect(response.body.length).toBeGreaterThan(0);
        done();
      });
  });

  test('DELETE ' + contactURL + ' Employee by ID', async () => {
    const responseOfCreate = await request(app)
      .post(contactURL)
      .send({
        name: 'John',
        email: 'john@test.com',
        password: '1234556789'
      });
    expect(responseOfCreate.statusCode).toBe(201);
    const responseOfDelete = await request(app)
      .delete(contactURL + '/' + responseOfCreate.body._id)
      .send({ employee_id: responseOfCreate.body._id });
    expect(responseOfDelete.statusCode).toBe(200);
    const responseOfGet = await request(app).get(
      contactURL + '/' + responseOfCreate.body._id
    );
    expect(responseOfGet.statusCode).toBe(404);

    const responseOfDelete2 = await request(app)
      .delete(contactURL + '/' + responseOfCreate.body._id)
      .send({ employee_id: responseOfCreate.body._id });
    expect(responseOfDelete2.statusCode).toBe(404);
  });

  test('PUT ' + contactURL + ' Update Employee by ID', async () => {
    const responseOfCreate = await request(app)
      .post(contactURL)
      .send({
        name: 'Sara',
        email: 'sara@test.com',
        password: '1234567890',
        gender: 'male'
      });
    expect(responseOfCreate.statusCode).toBe(201);
    expect(responseOfCreate.body).toHaveProperty('gender', 'male');

    const responseOfLogin = await request(app)
      .post(contactURL + '/login')
      .send({
        name: 'Sara',
        email: 'sara@test.com',
        password: '1234567890'
      });
    const token = responseOfLogin.header['auth-token'];

    const responseOfUpdate = await request(app)
      .put(contactURL + '/' + responseOfCreate.body._id)
      .set('auth-token', token)
      .send({ gender: 'female' });
    expect(responseOfUpdate.statusCode).toBe(201);

    const responseOfGet = await request(app).get(
      contactURL + '/' + responseOfCreate.body._id
    );
    expect(responseOfGet.statusCode).toBe(200);
    expect(responseOfGet.body).toHaveProperty('name', 'Sara');
    expect(responseOfGet.body).toHaveProperty('email', 'sara@test.com');
    expect(responseOfGet.body).toHaveProperty('_id', responseOfCreate.body._id);
    expect(responseOfGet.body).toHaveProperty('gender', 'female');
    expect(responseOfGet.body).toHaveProperty('created_date');
    expect(Object.keys(responseOfGet.body).length).toBe(7);
  });

  test('POST ' + contactURL + '/login ' + 'Employee Login ', async () => {
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
        password: '123456789'
      });
    expect(responseOfLogin.statusCode).toBe(201);
    expect(responseOfLogin.header['auth-token']).toBeTruthy;
  });
});
