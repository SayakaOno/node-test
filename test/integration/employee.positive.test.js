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
});
