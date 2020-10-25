const employeemodel = require('../model/employee.model');

exports.createEmployee = async (req, res, next) => {
  try {
    const newEmployee = await employeemodel.create(req.body);
    console.log(newEmployee);
    res.status(201).json(newEmployee);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
