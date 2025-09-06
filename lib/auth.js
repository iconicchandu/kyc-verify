import jwt from 'jsonwebtoken';
import User from '../models/User';
const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret';
const TOKEN_NAME = 'token';
export function signToken(payload){ return jwt.sign(payload, JWT_SECRET, {expiresIn:'7d'}); }
export function verifyToken(token){ try{ return jwt.verify(token, JWT_SECRET); } catch(e){ return null; } }
export async function getUserFromReq(req){
  const cookie=req.headers.cookie||''; const match=cookie.split(';').map(c=>c.trim()).find(c=>c.startsWith(TOKEN_NAME+'='));
  if(!match) return null;
  const token = match.split('=')[1]; const data=verifyToken(token);
  if(!data?.userId) return null;
  try{ const user=await User.findById(data.userId); return user||null; }catch(e){return null;}
}