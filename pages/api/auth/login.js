import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';
import { signToken } from '../../../lib/auth';
export default async function handler(req,res){
  await dbConnect();
  if(req.method!=='POST') return res.status(405).end();
  const {email,password}=req.body||{};
  if(!email||!password) return res.status(400).json({error:'email and password required'});
  const user=await User.findOne({email});
  if(!user) return res.status(401).json({error:'Invalid credentials'});
  const ok=await bcrypt.compare(password,user.passwordHash||'');
  if(!ok) return res.status(401).json({error:'Invalid credentials'});
  const token=signToken({userId:String(user._id),email:user.email});
  res.setHeader('Set-Cookie',`token=${token}; HttpOnly; Path=/; Max-Age=${60*60*24*7}`);
  res.json({ok:true,user:{id:user._id,email:user.email,name:user.name}});
}