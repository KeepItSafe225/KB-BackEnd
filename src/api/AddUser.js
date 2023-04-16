/* eslint-disable comma-dangle */
/* eslint-disable operator-linebreak */
/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
const express = require('express');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const verifyJWT = require('./auth');

const prisma = new PrismaClient();

const router = express.Router();

router.post('/', verifyJWT, async (req, res, next) => {
  try {
    if (req.user.role !== 'SuperAdmin') {
      return res.status(401).send({
        success: false,
        message: 'insufficient role',
      });
    }
    if (
      !req.body.name ||
      !req.body.surname ||
      !req.body.email ||
      !req.body.password ||
      !req.body.role
    ) {
      return res.status(400).send({
        success: false,
        message: 'Fields Missing!',
      });
    }
    const AddedUser = await prisma.Users.create({
      data: {
        username: `${req.body.name.replace(
          /\s/g,
          ''
        )}.${req.body.surname.replace(/\s/g, '')}`.toLowerCase(),
        email: req.body.email.trim(),
        role: req.body.role,
        password: await bcrypt.hash(req.body.password, 10),
      },
    });
    res.status(201).send(AddedUser);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
