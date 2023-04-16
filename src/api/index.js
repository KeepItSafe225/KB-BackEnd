const express = require('express');

const login = require('./login');

const AddUser = require('./AddUser');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

router.use('/login', login);
router.use('/adduser', AddUser);
module.exports = router;
