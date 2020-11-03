const employeeModel = require('../model/employee.model');
const joi = require('@hapi/joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;

const schema = joi.object({
  name: joi.string().required(),
  email: joi
    .string()
    .required()
    .email(),
  password: joi
    .string()
    .min(6)
    .max(12)
    .required(),
  gender: joi.string(),
  naphoneme: joi.string()
});

exports.createEmployee = async (req, res, next) => {
  try {
    const joiCheck = await schema.validate(req.body);
    if (joiCheck.error) {
      return res.status(400).json(joiCheck.error);
    }
    const doEmailExist = await employeeModel.findOne({ email: req.body.email });
    if (doEmailExist) {
      return res
        .status(400)
        .json('Email you provided already exist in our database');
    }
    const salt = await bcrypt.genSalt(saltRounds);
    const encryptedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = encryptedPassword;
    const newEmployee = await employeeModel.create(req.body);
    res.status(201).json(newEmployee);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

exports.getAllEmployees = async (req, res, next) => {
  try {
    const allEmployees = await employeeModel.find({});
    if (allEmployees && allEmployees.length > 0) {
      res.status(200).json(allEmployees);
    } else {
      res.status(404).send();
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getEmployeeById = async (req, res, next) => {
  try {
    const employee = await employeeModel.findById(req.params.employee_id);
    if (employee) {
      res.status(200).json(employee);
    } else {
      res.status(404).send();
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

// using callback
// exports.getEmployeeById = async (req, res, next) => {
//   try {
//     employeeModel.findById(req.params.employee_id, function(err, employee) {
//       if (err) {
//         return res.send(err);
//       } else {
//         if (employee) {
//           return res.status(200).json(employee);
//         } else {
//           return res.status(404).json('User not found');
//         }
//       }
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json(err);
//   }
// };

exports.updateEmployeeById = async (req, res, next) => {
  try {
    const updatedEmployee = await employeeModel.findByIdAndUpdate(
      req.params.employee_id,
      req.body,
      {
        useFindAndModify: false
      }
    );
    if (updatedEmployee) {
      res.status(201).json(updatedEmployee);
    } else {
      res.status(400).send();
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

exports.deleteEmployeeById = async (req, res, next) => {
  employeeModel
    .findByIdAndDelete(req.params.employee_id)
    .then(result => {
      if (result) {
        res.status(200).json(result);
      } else {
        console.log('User Not Found');
        res.status(404).json('User not found');
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
};

exports.login = async (req, res, next) => {
  try {
    const joiCheck = await schema.validate(req.body);
    if (joiCheck.error) {
      return res.status(400).json(joiCheck.error.message);
    }
    const employee = await employeeModel.findOne({ email: req.body.email });
    if (!employee) {
      return res
        .status(400)
        .json('Email you provided does not exist in our database');
    }
    const validatePassword = await bcrypt.compare(
      req.body.password,
      employee.password
    );
    if (!validatePassword) {
      return res
        .status(400)
        .send('you provided an invalid password, please try again');
    }
    const jwtToken = await jwt.sign(
      {
        data: employee
      },
      process.env.JWT_TOKEN_KEY,
      { expiresIn: '1h' }
    );
    res.header('auth-token', jwtToken);
    res.status(201).json(employee);
  } catch (err) {
    res.status(500).json(err);
  }
};
