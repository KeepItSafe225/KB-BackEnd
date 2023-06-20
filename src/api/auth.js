const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
async function verifyJWT(req, res, next) {
  if (!req.headers['x-access-token']) {
    res.status(401).send({
      error: 401,
      message: 'No Token Given',
    });
    return;
  }
  const token = req.headers['x-access-token'].split(' ')[1];
  if (token) {
    try {
      const DBToken = await prisma.AuthToken.findUnique({
        where: {
          Token: token,
        },
      });
      if (!DBToken) {
        return res.status(500).send({
          success: false,
          message: 'Token Not Found in DB! Please Login first',
        });
      }
    } catch (error) {
      next(error);
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(498).send({
          error: 498,
          message: err.message,
        });
      }
      req.user = {};
      req.user.id = decoded.id;
      req.user.username = decoded.username;
      req.user.email = decoded.email;
      req.user.role = decoded.role;
      return next();
    });
  } else {
    res.json(401).send({
      error: 401,
      message: 'Incorrect Token Given',
    });
  }
}

module.exports = verifyJWT;
