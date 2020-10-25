const router = require('express').Router();

router.get('/', (req, res) => {
  res.json({
    status: 'API is working',
    message: 'Welcome!'
  });
});

module.exports = router;
