const request = require('supertest');
const app = require('../../app');
const mongodb = require('../../mongodb/mongodb.utils');
const endpointURL = '/api';

describe('Validate ' + endpointURL, () => {
  test('Get / ', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.body).toBe('hello from employee app');
  });

  test('Get ' + endpointURL, async () => {
    const response = await request(app).get(endpointURL);
    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual({
      status: 'API is working',
      message: 'Welcome!'
    });
    expect(response.body).toHaveProperty('status', 'API is working');
    expect(response.body).toMatchObject({
      status: 'API is working',
      message: 'Welcome!'
    });
    expect(JSON.stringify(response.body)).toEqual(
      JSON.stringify({
        status: 'API is working',
        message: 'Welcome!'
      })
    );
  });
});
