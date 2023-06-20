/* eslint-disable comma-dangle */
/* eslint-disable consistent-return */
const express = require('express');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const verifyJWT = require('./auth');

const prisma = new PrismaClient();

const router = express.Router();
router.post('/', async (req, res, next) => {
  if (!req.body.username || !req.body.password) {
    return res.status(400).send({
      success: false,
      message: 'missing username or password',
    });
  }
  const user = await prisma.users.findUnique({
    where: {
      username: req.body.username,
    },
  });
  if (!user) {
    return res.status(404).send({ sucess: false, message: 'User not found!' });
  }
  bcrypt.compare(req.body.password, user.password).then((isCorrect) => {
    if (!isCorrect) {
      return res
        .status(401)
        .send({ sucess: false, message: 'Incorrect Password' });
    }
    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: 10800,
      },
      async (err, token) => {
        if (err) next(err);
        try {
          const TokenExistsInDB = await prisma.AuthToken.findUnique({
            where: {
              id: user.id,
            },
          });
          if (TokenExistsInDB) {
            await prisma.AuthToken.delete({
              where: {
                id: user.id,
              },
            });
          }
          await prisma.AuthToken.create({
            data: {
              Username: user.username,
              id: user.id,
              Token: token,
            },
          });
        } catch (error) {
          next(error);
        }

        return res.status(200).send({
          success: 'true',
          message: 'User logged in successfully',
          data: {
            token: `Bearer ${token}`,
          },
        });
      }
    );
  });
});
router.get('/', verifyJWT, async (req, res, next) => {
  try {
    res.status(200).send({
      success: true,
      message: 'Current User',
      data: {
        username: req.user.username,
        team: req.user.team,
        email: req.user.email,
        role: req.user.role,
      },
    });
  } catch (error) {
    next(error);
  }
});
module.exports = router;
