const jwt = require('jsonwebtoken');

function verifyJWT(req, res, next) {
  if (!req.headers['x-access-token']) {
    res.status(401).send({
      error: 401,
      message: 'No Token Given',
    });
    return;
  }
  const token = req.headers['x-access-token'].split(' ')[1];
  if (token) {
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
