import { useEffect,useState } from 'react'; import Link from 'next/link';
export default function Home(){
  const [user,setUser]=useState(null); const [form,setForm]=useState({email:'',password:'',name:''});
  useEffect(()=>{ fetch('/api/auth/me').then(r=>r.json()).then(d=>setUser(d.user)); },[]);
  async function register(e){e.preventDefault(); const res=await fetch('/api/auth/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)}); const data=await res.json(); if(data.user)setUser(data.user); else alert(data.error||'Register failed');}
  async function login(e){e.preventDefault(); const res=await fetch('/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:form.email,password:form.password})}); const data=await res.json(); if(data.user)setUser(data.user); else alert(data.error||'Login failed');}
  async function logout(){await fetch('/api/auth/logout'); setUser(null);}
  return (<div style={{padding:40}}><h1>OnlyFans-style Platform — KYC Starter</h1>
  {user?(<div><p>Signed in as <strong>{user.email}</strong> — verification: <em>{user.verificationStatus}</em></p><button onClick={logout}>Logout</button> <Link href="/verify"><button>Start verification</button></Link></div>):
  (<div><h3>Register / Login</h3><form><input placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/><input placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/><input type="password" placeholder="Password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/><button onClick={register}>Register</button><button onClick={login}>Login</button></form></div>)}</div>);}