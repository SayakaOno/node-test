const httpMock = require('node-mocks-http');
const controller = require('../../controller/employee.controller');
const model = require('../../model/employee.model');
const mockEmployeeList = require('../mockdata/employees.json');
model.findByIdAndDelete = jest.fn();

let req, res, next;
beforeEach(() => {
  model.findByIdAndDelete.mockClear();
  req = httpMock.createRequest();
  res = httpMock.createResponse();
  next = null;
  req.params.employee_id = mockEmployeeList[0]._id;
});

describe('controller.deleteEmployeeById', () => {
  test('deleteEmployeeById function is defined', () => {
    expect(typeof controller.deleteEmployeeById).toBe('function');
  });

  test('delete a valid employee', async () => {
    model.findByIdAndDelete.mockResolvedValue(mockEmployeeList[0]);
    await controller.deleteEmployeeById(req, res, next);
    expect(model.findByIdAndDelete).toBeCalledWith(req.params.employee_id);
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toStrictEqual(mockEmployeeList[0]);
  });

  test('return 404 when to be deleted not present in database', async () => {
    model.findByIdAndDelete.mockResolvedValue(null);
    await controller.deleteEmployeeById(req, res, next);
    expect(model.findByIdAndDelete).toHaveBeenCalledWith(
      req.params.employee_id
    );
    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toStrictEqual('User not found');
  });

  test('return 500 when model.findByIdAndDelete throws exception', async () => {
    model.findByIdAndDelete.mockRejectedValue(
      'fake exception from findByIdAndDelete'
    );
    await controller.deleteEmployeeById(req, res, next);
    expect(model.findByIdAndDelete).toHaveBeenCalledWith(
      req.params.employee_id
    );
    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toStrictEqual(
      'fake exception from findByIdAndDelete'
    );
  });
});
