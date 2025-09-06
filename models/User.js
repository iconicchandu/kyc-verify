import mongoose from 'mongoose';
const UserSchema=new mongoose.Schema({
  email:{type:String, required:true, unique:true},
  name:String,
  verificationStatus:{type:String, enum:['unverified','pending','verified','failed'], default:'unverified'},
  stripeVerificationId:String,
  stripeVerificationUrl:String,
  passwordHash:String
},{timestamps:true});
export default mongoose.models.User || mongoose.model('User',UserSchema);