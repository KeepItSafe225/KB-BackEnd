const express = require('express');

const login = require('./login');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

router.use('/login', login);

module.exports = router;
