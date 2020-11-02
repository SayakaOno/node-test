const httpMock = require('node-mocks-http');
const controller = require('../../controller/employee.controller');
const model = require('../../model/employee.model');

const mockEmployeeList = require('../mockdata/employees.json');
model.findByIdAndUpdate = jest.fn();

let req, res, next;
beforeEach(() => {
  req = httpMock.createRequest();
  res = httpMock.createResponse();
  next = null;
});

afterEach(() => {
  model.findByIdAndUpdate.mockClear();
});

describe('controller.findByIdAndUpdate', () => {
  test('findByIdAndUpdate function is defined', () => {
    expect(typeof controller.updateEmployeeById).toBe('function');
  });

  test('update an exisiting employee with phone number', async () => {
    let toUpdate = { ...mockEmployeeList[0], phone: '00000000' };
    req.params.employee_id = mockEmployeeList[0]._id;
    req.body = { ...toUpdate };
    model.findByIdAndUpdate.mockReturnValue(toUpdate);
    await controller.updateEmployeeById(req, res, next);
    expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
      req.params.employee_id,
      req.body,
      {
        useFindAndModify: false
      }
    );
    expect(res.statusCode).toEqual(201);
    expect(res._getJSONData()).toStrictEqual(toUpdate);
  });

  test('return 400 when ID is not found', async () => {
    model.findByIdAndUpdate.mockReturnValue(null);
    await controller.updateEmployeeById(req, res, next);
    expect(res.statusCode).toEqual(400);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res._getData()).toBeNull;
  });

  test('return 500 when findByIdAndUpdate raises exception', async () => {
    model.findByIdAndUpdate.mockRejectedValue('fake error');
    await controller.updateEmployeeById(req, res, next);
    expect(res.statusCode).toBe(500);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res._getJSONData()).toStrictEqual('fake error');
  });
});
