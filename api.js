/* eslint-disable no-undef */
import express from 'express';
const router = express.Router();
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import {getUserInfo} from '@replit/repl-auth';
import jwt_decode from 'jwt-decode';
import Client from '@replit/database';

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
      id: process.env.TEST_REPL_USER_ID ?? '',
      name: process.env.TEST_REPL_USERNAME,
      profileImage: process.env.TEST_REPL_USER_PROFILE_PIC ?? ''
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
  const {data, error} = await supabase.from('databases').select(
    'user_id, database_id, created_at, db_url, token, url_expire_date, url_issued_at, slug,user, user_backups (database_id, created_at)'
  ).eq('user_id', userInfo.id)
    .order('created_at', {foreignTable: 'user_backups', ascending: false})
    .limit(1, {foreignTable: 'user_backups'});

  if(data){
    res.json(data);
  }else{
    console.log(error);
    res.status(500).json('Error loading resource from supabase');
  }
});

router.get('/database/backup/add', async (req, res) => {
  const userInfo = getReplInfo(req);
  const dbId = req.query.id;
  const dbData = await supabase.from('databases')
    .select()
    .match({database_id: dbId, user_id: userInfo.id})
    .limit(1).single();

  if(dbData.error){
    console.log(dbData.error);
    return res.status(500).json('There was an issue getting the database');
  }

  if(dbData.data === null){
    return res.status(404).json('Database not found');
  }

  if(new Date(dbData.data.url_expire_date) < new Date()){
    return res.status(500).json('The token has expired. Need to update the db url');
  }
  const client = new Client(dbData.data.db_url);
  const dbBackup = await client.getAll();
  const { error } = await supabase
    .from('user_backups')
    .insert({
      user_id: userInfo.id,
      data: dbBackup,
      database_id: dbId
    });
  if(error){
    console.log(error);
    return res.status(500).json('There was an issue saving the database');
  }
  return res.json('ok');
});

router.get('/database/delete', async (req, res) => {
  const userInfo = getReplInfo(req);
  const dbId = req.query.id;
  const backupsDelete = await supabase
    .from('user_backups')
    .delete()
    .match({database_id: dbId, user_id: userInfo.id});
  if(backupsDelete.error){
    console.log(backupsDelete.error);
    return res.status(500).json('There was an issue deleting the database');
  }

  const dbsDelete = await supabase
    .from('databases')
    .delete()
    .match({database_id: dbId, user_id: userInfo.id});
  if(dbsDelete.error){
    console.log(dbsDelete.error);
    return res.status(500).json('There was an issue deleting the database');
  }
  return res.json('ok');
});

router.get('/database/backups', async (req, res) => {
  const userInfo = getReplInfo(req);
  const dbId = req.query.id;
  const backups = await supabase.from('databases').select(
    'user_id, database_id, created_at, db_url, token, url_expire_date, url_issued_at, slug,user, user_backups (created_at, user_id, database_id, id)'
  ).eq('user_id', userInfo.id)
    .order('created_at', {foreignTable: 'user_backups', ascending: false})
    .limit(1)
    .single();

  if(backups.error){
    console.log(backups.error);
    return res.status(500).json('There was an listing your backups');
  }
  return res.json(backups.data);
});

router.get('/database/backup/get', async (req, res) => {
  const userInfo = getReplInfo(req);
  const backupUpId = req.query.id;

  const backup = await supabase.from('user_backups').select().match({user_id: userInfo.id, id: backupUpId})
    .limit(1)
    .single();

  if(backup.error){
    console.log(backup.error);
    return res.status(500).json('There was an getting your backups');
  }
  return res.json(backup.data);
});

router.get('/database/backup/delete', async (req, res) => {
  const userInfo = getReplInfo(req);
  const backupUpId = req.query.id;
  const backup = await supabase.from('user_backups').delete().match({user_id: userInfo.id, id: backupUpId});
  if(backup.error){
    console.log(backup.error);
    return res.status(500).json('There was an getting your backups');
  }
  return res.json('ok');
});

router.get('/database/backup/restore', async (req, res) => {
  const userInfo = getReplInfo(req);
  const backupUpId = req.query.id;
  const backup = await supabase
    .from('user_backups')
    .select('data, databases (db_url)')
    .match({user_id: userInfo.id, id: backupUpId})
    .limit(1)
    .limit(1,  { foreignTable: 'databases' })
    .single();

  if(backup.error){
    console.log(backup.error);
    return res.status(500).json('There was an getting your backups');
  }
  const client = new Client(backup.data.databases.db_url);
  await client.empty();
  await client.setAll(backup.data.data);

  return res.json('ok');
});


export default router;
