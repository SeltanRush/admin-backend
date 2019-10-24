const router = require('express').Router();
const Joi = require('@hapi/joi');
const jwt = require('jsonwebtoken');

const checkAuth = require('../utils/checkAuth');
const Post = require('../models/Post');
const User = require('../models/User');

const postSchema = {
  title: Joi.string().min(1).required(),
  text: Joi.string().min(20).required(),
}

router.get('/list', checkAuth, async (req, res) => {
  try {
    const posts = await Post.find();
    return res.json({ message: 'Posts list', result: posts });
  } catch (e) {
    return res.status(500).json({ message: e });
  }
});

router.post('/create', checkAuth, async (req, res) => {
  const { error } =  Joi.validate(req.body, postSchema);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { text, title } = req.body;

  const token = req.header('Access-Token');
  const { _id } = jwt.verify(token, process.env.TOKEN_SECRET);
  const user = await User.findById(_id);

  const post = new Post({ author: user.email, text, title });

  try {
    const savedPost = await post.save();
    res.json({
      result: savedPost,
      message: 'Post successfully created',
    });
  } catch(err) {
    res.status(500).json({ message: err });
  }
})

module.exports = router;