const express = require('express');
const { PrismaClient } = require('@prisma/client');
const verifyJWT = require('./auth');

const prisma = new PrismaClient();
const allowedRoles = ['SuperAdmin', 'Author'];

const router = express.Router();
router.post('/', verifyJWT, async (req, res, next) => {
  try {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(401).send({
        success: false,
        message: 'You have no power here',
      });
    }
    const { title, content, published } = req.body;

    const createdArticle = await prisma.post.create({
      data: {
        title,
        content,
        published,
        User: {
          connect: {
            id: req.user.id,
          },
        },
      },
    });
    return res.status(201).send({
      success: true,
      message: 'Article created',
      article: createdArticle,
    });
  } catch (error) {
    next(error);
  }
});
router.get('/:id?', verifyJWT, async (req, res, next) => {
  try {
    if (req.params.id) return res.status(200).send('got1id');
    const articleList = await prisma.post.findMany({
      where: {
        published: true,
      },
    });
    return res.status(200).send({
      succes: true,
      message: 'Articles fetched successfully',
      article: articleList,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
