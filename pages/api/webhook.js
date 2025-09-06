import { buffer } from 'micro';
import Stripe from 'stripe';
import dbConnect from '../../lib/mongodb';
import User from '../../models/User';
export const config={api:{bodyParser:false}};
const stripe=new Stripe(process.env.STRIPE_SECRET_KEY,{apiVersion:'2024-11-15'});
export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).end();
  const sig=req.headers['stripe-signature']; const webhookSecret=process.env.STRIPE_WEBHOOK_SECRET;
  if(!webhookSecret) return res.status(500).end('Webhook not configured');
  const buf=await buffer(req);
  let event;
  try{ event=stripe.webhooks.constructEvent(buf,sig,webhookSecret);}catch(err){return res.status(400).send(`Webhook Error: ${err.message}`);}
  if(event.type && event.type.startsWith('identity.verification_session')){
    const session=event.data.object; await dbConnect();
    try{
      const internalUserId=session.metadata?.internalUserId;
      if(internalUserId){ const user=await User.findById(internalUserId); if(user){
        if(session.status==='verified') user.verificationStatus='verified';
        else if(session.status==='processing') user.verificationStatus='pending';
        else user.verificationStatus='failed';
        user.stripeVerificationUrl=session.url||user.stripeVerificationUrl;
        user.stripeVerificationId=session.id; await user.save();
      }}
    }catch(err){console.error(err);}
  }
  res.json({received:true});
}