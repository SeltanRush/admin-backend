const router = require('express').Router();

const checkAuth = require('../utils/checkAuth');
const User = require('../models/User');

router.get('/list', checkAuth, async (req, res) => {
  try {
    const users = await User.find();
    return res.json({ message: 'Users list', result: users });
  } catch (e) {
    return res.status(500).json({ message: e });
  }
});

module.exports = router;