/* eslint-disable no-undef */
import express from 'express';
const router = express.Router();
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import {getUserInfo} from '@replit/repl-auth';
dotenv.config();

const supabase = createClient(process.env.SUPA_BASE_URL, process.env.SUPA_BASE_SECRET);


router.use(function(req, res, next) {
  if(getUserInfo(req) === null){
    return res.status(403).json({ error: 'Need to be an authenticated Repl user.' });
  }
  next();
});

router.get('/test', async (req, res) => {
  console.log(getUserInfo(req));

// Create a single supabase client for interacting with your database
  const {data, error} = await supabase.from('repl_users').select();
  const {pubdata, puberror} = await anonsupabase.from('repl_users').select();
  console.log(pubdata);
  res.json(data);
});

router.post('/database/add', (req, res) => {
  const dbUrl = req.header('db_url');
  const name = req.query.name;
  const client = new Client(dbUrl);
  client.set(name, req.body.updatedValue);
  res.send('ok');
});


export default router;
