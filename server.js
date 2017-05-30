const express = require('express');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare()
  .then(() => {
    const server = express();

    server.use('/api', require('./apis'));

    server.get('*', (req, res) => {
      return handle(req, res)
    });

    const port = dev ? 3000 : process.env.PORT;
    server.listen(port, (err) => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${port}`)
    });
  });
