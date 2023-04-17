const express = require('express');

const login = require('./login');

const user = require('./user');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

router.use('/login', login);
router.use('/user', user);
module.exports = router;
