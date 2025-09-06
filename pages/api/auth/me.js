import dbConnect from '../../../lib/mongodb';
import { getUserFromReq } from '../../../lib/auth';
export default async function handler(req,res){
  await dbConnect();
  const user=await getUserFromReq(req);
  res.json({user:user?{id:user._id,email:user.email,name:user.name,verificationStatus:user.verificationStatus}:null});
}