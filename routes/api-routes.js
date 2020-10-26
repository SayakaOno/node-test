const controller = require('../controller/employee.controller');
const router = require('express').Router();

router.get('/', (req, res) => {
  res.json({
    status: 'API is working',
    message: 'Welcome!'
  });
});

router.post('/contacts', controller.createEmployee);
router.get('/contacts', controller.getAllEmployees);
router.get('/contacts/:employee_id', controller.getEmployeeById);
router.put('/contacts/:employee_id', controller.updateEmployeeById);
router.delete('/contacts/:employee_id', controller.deleteEmployeeById);

module.exports = router;
