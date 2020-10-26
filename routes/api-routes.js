const controller = require('../controller/employee.controller');
const router = require('express').Router();
const verifytoken = require('./jwt-token-verify');

router.get('/', (req, res) => {
  res.json({
    status: 'API is working',
    message: 'Welcome!'
  });
});

router.post('/contacts', controller.createEmployee);
router.get('/contacts', controller.getAllEmployees);
router.get('/contacts/:employee_id', controller.getEmployeeById);
router.put(
  '/contacts/:employee_id',
  verifytoken,
  controller.updateEmployeeById
);
router.delete('/contacts/:employee_id', controller.deleteEmployeeById);

router.post('/contacts/login', controller.login);

module.exports = router;
