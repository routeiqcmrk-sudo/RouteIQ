"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, supabaseConfigured } from "../../lib/supabase";
import "../register/register.css";

export default function LoginPage() {
  const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [message,setMessage]=useState(""); const [error,setError]=useState(""); const [busy,setBusy]=useState(false); const router=useRouter();
  async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();setError("");setMessage("");if(!supabaseConfigured||!supabase){setError("Supabase is not connected yet. Add the project URL and publishable/anon key to Vercel environment variables.");return;}setBusy(true);try{const {error}=await supabase.auth.signInWithPassword({email:email.trim(),password});if(error)throw error;router.push("/student");}catch(err){setError(err instanceof Error?err.message:"Unable to sign in.");}finally{setBusy(false);}}
  return <main className="reg-shell"><section className="reg-brand"><div className="reg-logo">R</div><p className="reg-eyebrow">ROUTE-IQ · CAMPUS TRANSPORT</p><h1>Welcome<br/><span>back.</span></h1><p className="reg-intro">Sign in to check your verification status and your assigned transport details.</p></section><section className="reg-panel"><div className="reg-panel-head"><p className="reg-eyebrow">STUDENT PORTAL</p><h2>Sign in</h2><p>Your email must be verified to continue.</p></div>{error&&<div className="reg-alert" role="alert">{error}</div>}{message&&<div className="reg-success" role="status">{message}</div>}<form className="reg-form" onSubmit={submit}><label>Email address<input type="email" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email" required/></label><label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete="current-password" required/></label><button disabled={busy}>{busy?"Signing in…":"Sign in"}</button></form><p className="reg-foot">New student? <Link href="/register">Create an account</Link></p><p className="reg-legal">Student access requires manual Student ID approval. Bus assignments are controlled by an authorized admin.</p></section></main>;
}
