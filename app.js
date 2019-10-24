const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');

const URL_PREFIX = '/api'

dotenv.config();

const app = express();

app.use(express.json());

mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true },
  () => console.log('DB connection success!')
);

app.use(`${URL_PREFIX}/user`, authRouter);
app.use(`${URL_PREFIX}/users`, usersRouter);
app.use(`${URL_PREFIX}/posts`, postsRouter);

app.listen(3000);