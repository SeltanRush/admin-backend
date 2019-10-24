const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('@hapi/joi');

const User = require('../models/User');

const registerSchema = {
  name: Joi.string().min(2).required(),
  email: Joi.string().min(6).required().email(),
  password: Joi.string().min(6).required(),
  secretWord: Joi.string().required(),
}

const loginSchema = {
  email: Joi.string().min(6).required().email(),
  password: Joi.string().min(6).required(),
}

router.post('/register', async (req, res) => {
  // Проверка body запроса
  const { error } =  Joi.validate(req.body, registerSchema);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { name, email, password, secretWord } = req.body;

  //Проверка секретного слова
  if (process.env.SECRET_REGISTER_WORD !== secretWord) res.status(400).json({ message: 'Wrong secret word' })

  // Проверяем существует ли user с таким же email
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).json({ message: 'Email already exist' });

  // Хешируем пароль
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  // Создаем юзера
  const user = new User({ name, email, password: hashPassword });
  try {
    const savedUser = await user.save();
    res.json({
      result: savedUser,
      message: 'User successfully created',
    });
  } catch(err) {
    res.status(500).json({ message: err });
  }
});

router.post('/login', async (req, res) => {
  const { error } = Joi.validate(req.body, loginSchema);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { email, password } = req.body;

  // Проверяем существует ли юзер
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).json({ message: 'Email or password is wrong' });

  // Проверяем пароль на соответствие
  const isPassValid = await bcrypt.compare(password, user.password);
  if(!isPassValid) return res.status(400).json({ message: 'Email or password is wrong' });

  if(!user.isActive) return res.status(400).json({ message: 'User is unactive '});

  const { name, _id, createdOn } = user;

  // Создаем токен
  const token = jwt.sign({ _id }, process.env.TOKEN_SECRET);

  res
    .header('Access-Token', token)
    .json({ message: 'User was logged', result: { name, _id, createdOn, email, token } });
})

module.exports = router;