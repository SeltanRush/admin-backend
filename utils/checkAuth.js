const jwt = require('jsonwebtoken');

function checkAuth(req, res, next) {
  const token = req.header('Access-Token');
  if (!token) return res.status(401).send('Unauthorized');
  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid token. Access denied' });
  }
}

module.exports = checkAuth;