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
        message: 'You have no power here',
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
router.get('/', verifyJWT, async (req, res) => {
  try {
    if (req.user.role !== 'SuperAdmin') {
      return res.status(401).send({
        success: false,
        message: 'You have no power',
      });
    }
    const UserList = await prisma.Users.findMany();

    UserList.forEach((element) => {
      delete element.password;
    });
    return res.status(201).send({
      success: true,
      message: 'List of all users Fetched Succesfully',
      list: UserList,
    });
  } catch (error) {
    console.error(error);
  }
});
router.put('/', verifyJWT, async (req, res) => {
  try {
    if (req.user.role !== 'SuperAdmin') {
      return res.status(401).send({
        succes: false,
        message: 'You have no power',
      });
    }
    const { id, name, surname, email, role, password } = req.body;
    if (!id) {
      return res.status(400).send({
        success: false,
        message: 'User ID is required',
      });
    }
    const updatedUser = await prisma.Users.update({
      where: { id },
      data: {
        username: `${req.body.name.replace(
          /\s/g,
          ''
        )}.${req.body.surname.replace(/\s/g, '')}`.toLowerCase(),
        email,
        role,
        password: password ? await bcrypt.hash(password, 10) : undefined,
      },
    });
    const FetchData = await prisma.AuthToken.findMany({
      where: {
        id: id,
      },
    });
    if (FetchData.length !== 0) {
      await prisma.AuthToken.delete({
        where: {
          id: id,
        },
      });
    }
    delete updatedUser.password;
    return res.status(200).send({
      succes: true,
      message: 'User has been updated',
      user: updatedUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      succes: false,
      message: 'something went wrong whilst updating the user',
    });
  }
});
module.exports = router;
