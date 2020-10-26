const controller = require('../controller/employee.controller');
const router = require('express').Router();

router.get('/', (req, res) => {
  res.json({
    status: 'API is working',
    message: 'Welcome!'
  });
});

router.post('/contacts', controller.createEmployee);

module.exports = router;
