import express, {query} from 'express';
import history from 'connect-history-api-fallback';
import cors from 'cors';
import Client from '@replit/database';
const app = express();
app.use(cors({
  origin: '*'
}));
app.use(express.json());

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
  client.set(name, req.body.updatedValue );
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



app.listen(3001, function (err) {
  if (err) console.log(err);
  console.log('Replit db API listening on port 3001!');
});
