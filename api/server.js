// implement your server here
const express = require('express');
const cors = require('cors');

const postsRouter = require('./posts/posts-router');

const server = express();

server.use(express.json());

server.use(cors());

// require your posts router and connect it here
server.use('/api/posts', postsRouter);

module.exports = server;