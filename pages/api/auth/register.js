import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';
import { signToken } from '../../../lib/auth';
export default async function handler(req,res){
  await dbConnect();
  if(req.method!=='POST') return res.status(405).end('Method Not Allowed');
  const {email,password,name}=req.body||{};
  if(!email||!password) return res.status(400).json({error:'email and password required'});
  const existing=await User.findOne({email});
  if(existing) return res.status(409).json({error:'User exists'});
  const hashed=await bcrypt.hash(password,10);
  const user=await User.create({email,name:name||'',verificationStatus:'unverified',passwordHash:hashed});
  const token=signToken({userId:String(user._id),email:user.email});
  res.setHeader('Set-Cookie',`token=${token}; HttpOnly; Path=/; Max-Age=${60*60*24*7}`);
  res.json({ok:true,user:{id:user._id,email:user.email,name:user.name}});
}