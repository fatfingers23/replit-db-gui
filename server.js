import express from 'express';
import history from 'connect-history-api-fallback';

import Client from '@replit/database';
const app = express();

// Middleware for serving '/dist' directory
const staticFileMiddleware = express.static('dist');


app.get('/keys', async (req, res) => {
  const dbUrl = req.header('db_url');
  const client = new Client(dbUrl);
  const keys = await client.list();
  console.log(keys);
  res.json(keys);
});


// 1st call for unredirected requests
app.use(staticFileMiddleware);
// Support history api
// this is the HTTP request path not the path on disk
app.use(history({
  index: '/index.html'
}));

// 2nd call for redirected requests
app.use(staticFileMiddleware);



app.listen(3001, function () {
  console.log('Replit db API listening on port 3001!');
});
