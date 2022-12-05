/* eslint-disable no-undef */
import express from 'express';
const router = express.Router();
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import {getUserInfo} from '@replit/repl-auth';
import jwt_decode from 'jwt-decode';

dotenv.config();

const supabase = createClient(process.env.SUPA_BASE_URL, process.env.SUPA_BASE_SECRET);

const getReplInfo = (req) => {
  let userInfo = null;
  //If running on repl get info from request
  if(process.env.REPL_OWNER){
    userInfo = getUserInfo(req);
  }else if(process.env.TEST_REPL_USERNAME){
    //if not running on a repl use a test user
    userInfo = {
      id: process.env.TEST_REPL_USER_ID,
      name: process.env.TEST_REPL_USERNAME
    };
  }
  return userInfo;
};



const getTokenFromUrl = (dbUrl) => {
  const url = new URL(dbUrl);
  const splitUrlPaths = url.pathname.split('/');
  return splitUrlPaths[2];

};

router.use(function(req, res, next) {
  if(getReplInfo() === null){
    return res.status(403).json({ error: 'Need to be an authenticated Repl user.' });
  }
  next();
});


router.get('/repl_auth', async (req, res) => {
  const userInfo = getReplInfo(req);
  const { data, error } = await supabase
    .from('repl_users')
    .upsert({ user_id: userInfo.id})
    .select();
  if(error){
    console.log(error);
    return res.status(500);
  }
  res.json(userInfo);
});


router.get('/test', async (req, res) => {

// Create a single supabase client for interacting with your database
  const {data, error} = await supabase.from('repl_users').select();
  res.json(data);
});

router.post('/database/add', async(req, res) => {
  const dbUrl = req.body.dbUrl;
  const userInfo = getReplInfo(req);
  const stringToken = getTokenFromUrl(dbUrl);
  const token = jwt_decode(stringToken);
  const expireDate = new Date(0);
  const issuedDate = new Date(0);
  expireDate.setSeconds(token.exp);
  issuedDate.setSeconds(token.iat);

  const { data, error } = await supabase
    .from('databases')
    .upsert({
      user_id: userInfo.id,
      db_url: dbUrl,
      url_expire_date: expireDate,
      database_id: token.database_id,
      token: stringToken,
      url_issued_at:issuedDate,
      slug: token.slug,
      user: token.user
    }
      )
    .select();

  if(data){
    res.send('ok');

  }else{
    console.log(error);
    res.status(500).json('Error creating or updating a database');
  }
});

router.get('/database/list', async (req, res) => {
  const userInfo = getReplInfo(req);
  const {data, error} = await supabase.from('databases').select().eq('user_id', userInfo.id);
  if(data){
    res.json(data);
  }else{
    console.log(error);
    res.status(500).json('Error loading resource from supabase');
  }
});


export default router;
