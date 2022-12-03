import express, {query} from 'express';
import history from 'connect-history-api-fallback';
import cors from 'cors';
import Client from '@replit/database';
const app = express();
app.use(cors({
  origin: '*'
}));
// Middleware for serving '/dist' directory
const staticFileMiddleware = express.static('dist');


app.get('/keys', async (req, res) => {
  const dbUrl = req.header('db_url');
  const prefix = req.query.prefix;
  const client = new Client(dbUrl);
  const keys = await client.list(prefix);
  console.log(keys);
  res.json(keys);
});

app.get('/key', async (req, res) => {
  const dbUrl = req.header('db_url');
  const name = req.query.name;
  const client = new Client(dbUrl);
  const value = await client.get(name);
  console.log(value);
  res.json(value);
});

app.post('/key', (req, res) => {
  const dbUrl = req.header('db_url');
  const name = req.query.name;
  const client = new Client(dbUrl);
  client.set(name, req.body);
  res.json();
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
