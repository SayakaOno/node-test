const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const httpMock = require('node-mocks-http');
const controller = require('../../controller/employee.controller');
const model = require('../../model/employee.model');
const mockEmployee = require('../mockdata/employeeReqPayload.json');

model.create = jest.fn();
model.findOne = jest.fn();
bcrypt.compare = jest.fn();
jwt.sign = jest.fn();

let req, res, next;
beforeEach(() => {
  model.create.mockClear();
  model.findOne.mockClear();
  bcrypt.compare.mockClear();
  jwt.sign.mockClear();
  req = httpMock.createRequest();
  res = httpMock.createResponse();
  next = null;
  req.body = { ...mockEmployee };
});

describe('controller.createEmployee', () => {
  test('createEmployee function is defined', () => {
    expect(typeof controller.createEmployee).toBe('function');
  });

  test('login from a valid employee', async () => {
    model.findOne.mockReturnValue(mockEmployee);
    bcrypt.compare.mockReturnValue(true);
    jwt.sign.mockReturnValue('fakejwttoken');
    await controller.login(req, res, next);
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toStrictEqual(mockEmployee);
    expect(res._getHeaders()['auth-token']).toStrictEqual('fakejwttoken');
  });

  test('login from a valid employee but jwt sign fails', async () => {
    model.findOne.mockReturnValue(mockEmployee);
    bcrypt.compare.mockReturnValue(true);
    jwt.sign.mockRejectedValue('fake jwt sign exception');
    await controller.login(req, res, next);
    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toStrictEqual('fake jwt sign exception');
    expect(res._getHeaders()['auth-token']).toBeUndefined;
  });

  test('login from a employee when password validation fails', async () => {
    model.findOne.mockReturnValue(mockEmployee);
    bcrypt.compare.mockRejectedValue('fake password validation exception');
    await controller.login(req, res, next);
    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toStrictEqual(
      'fake password validation exception'
    );
    expect(res._getHeaders()['auth-token']).toBeUndefined;
  });

  test('login from a employee when not registered already with provided email', async () => {
    model.findOne.mockReturnValue(null);
    await controller.login(req, res, next);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toStrictEqual(
      'Email you provided does not exist in our database'
    );
  });
});
