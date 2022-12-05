/* eslint-disable no-undef */
import express, {query} from 'express';
import history from 'connect-history-api-fallback';
import cors from 'cors';
import Client from '@replit/database';
import api from './api.js';
import {getUserInfo} from '@replit/repl-auth';

const app = express();
app.use(cors({
  // eslint-disable-next-line no-undef
  origin: [`https://replit.com/@${process.env.REPL_OWNER}/${process.env.REPL_SLUG}`,
    `http://localhost:${process.env.VUE_DEV_PORT}`,
    `http://127.0.0.1:${process.env.EXPRESS_DEV_PORT}`,
    'http://127.0.0.1:3001/repl_auth']
}));
app.use(express.json());

if(process.env.VITE_LOCAL_ONLY != 'true' || process.env.VITE_LOCAL_ONLY === 'undefined'){
  app.use('/api',api);
}


app.use(function(req, res, next) {
  const authURls = [
    '/keys',
    '/key',
    '/delete/key',
    '/keys/all'
  ];

  if (!req.headers.db_url && authURls.includes(req.path)) {
    return res.status(403).json({ error: 'Did not received the DB url in the header' });
  }
  next();
});



app.get('/keys', async (req, res) => {
  const dbUrl = req.header('db_url');
  const prefix = req.query.prefix;
  const client = new Client(dbUrl);
  const keys = await client.list(prefix);
  res.json(keys);
});

app.get('/key', async (req, res) => {
  const dbUrl = req.header('db_url');
  const name = req.query.name;
  const client = new Client(dbUrl);
  const value = await client.get(name,{raw:true});
  res.json(value);
});

app.post('/key', (req, res) => {
  const dbUrl = req.header('db_url');
  const name = req.query.name;
  const client = new Client(dbUrl);
  client.set(name, req.body.updatedValue);
  res.send('ok');
});

app.get('/delete/key', async (req, res) => {
  const dbUrl = req.header('db_url');
  const name = req.query.name;
  const client = new Client(dbUrl);
  await client.delete(name);
  res.send('ok');
});

app.get('/keys/all', async (req, res) => {
  const dbUrl = req.header('db_url');
  const client = new Client(dbUrl);
  const all = await client.getAll();
  res.send(all);
});

// Middleware for serving '/dist' directory
const staticFileMiddleware = express.static('dist');
// 1st call for unredirected requests
app.use(staticFileMiddleware);
// Support history api
// this is the HTTP request path not the path on disk
app.use(history({
  index: '/index.html'
}));

// 2nd call for redirected requests
app.use(staticFileMiddleware);


// eslint-disable-next-line no-undef
app.listen(process.env.EXPRESS_DEV_PORT, function (err) {
  if (err) console.log(err);
  console.log('Replit db API listening on port 3001!');
});
