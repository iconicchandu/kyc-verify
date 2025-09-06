import dbConnect from '../../lib/mongodb';
import User from '../../models/User';
import Stripe from 'stripe';
import { getUserFromReq } from '../../lib/auth';
const stripe=new Stripe(process.env.STRIPE_SECRET_KEY,{apiVersion:'2024-11-15'});
export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).end();
  await dbConnect();
  const user=await getUserFromReq(req);
  if(!user) return res.status(401).json({error:'Unauthorized'});
  try{
    const session=await stripe.identity.verificationSessions.create({
      type:'document',
      options:{document:{require_matching_selfie:true}},
      metadata:{internalUserId:String(user._id),email:user.email},
    });
    user.stripeVerificationId=session.id;
    user.stripeVerificationUrl=session.url||'';
    user.verificationStatus='pending';
    await user.save();
    res.json({url:session.url,client_secret:session.client_secret||null});
  }catch(err){ console.error(err); res.status(500).json({error:'Failed to create verification'});}
}