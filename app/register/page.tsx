"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { supabase, supabaseConfigured } from "../../lib/supabase";
import "./register.css";

export default function RegisterPage() {
  const [form, setForm] = useState({ full_name: "", student_id: "", email: "", password: "", phone: "", academic_year: "4th Year", branch: "", preferred_bus_stop: "", emergency_contact: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function change(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setError(""); setMessage("");
    if (!supabaseConfigured || !supabase) {
      setError("Supabase is not connected yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your local .env.local and Vercel project settings.");
      return;
    }
    setBusy(true);
    try {
      let user = (await supabase.auth.getUser()).data.user;
      if (!user) {
        const { data, error: authError } = await supabase.auth.signUp({ email: form.email.trim(), password: form.password, options: { data: { full_name: form.full_name.trim() } } });
        if (authError) throw authError;
        user = data.user;
        if (!user) throw new Error("Account creation did not complete. Please try again.");
        if (!data.session) {
          setMessage("Account created. Verify your email, then sign in and return to this form to submit your Student ID and transport details. No student request has been stored yet.");
          return;
        }
      }
      const { error: insertError } = await supabase.from("student_registration_requests").insert({
        user_id: user.id,
        full_name: form.full_name.trim(),
        student_id: form.student_id.trim(),
        email: (user.email || form.email).trim().toLowerCase(),
        phone: form.phone.trim(),
        academic_year: form.academic_year,
        branch: form.branch.trim(),
        preferred_bus_stop: form.preferred_bus_stop.trim(),
        emergency_contact: form.emergency_contact.trim(),
      });
      if (insertError) throw insertError;
      setMessage("Registration submitted. Your Student ID is awaiting manual admin review. Bus assignment is controlled by the college admin.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to register right now.");
    } finally { setBusy(false); }
  }

  return <main className="reg-shell">
    <section className="reg-brand"><div className="reg-logo">R</div><p className="reg-eyebrow">ROUTE-IQ · CAMPUS TRANSPORT</p><h1>Your journey,<br/><span>connected.</span></h1><p className="reg-intro">Register for your campus transport account. Access is granted only after email verification and college admin approval.</p><div className="reg-steps"><span>01 <b>Email verification</b></span><span>02 <b>Student ID review</b></span><span>03 <b>Admin bus assignment</b></span></div></section>
    <section className="reg-panel"><div className="reg-panel-head"><p className="reg-eyebrow">STUDENT PORTAL</p><h2>Create your account</h2><p>Use an email address you can verify.</p></div>
      {!supabaseConfigured && <div className="reg-alert">Supabase connection setup is pending. The form is ready, but account creation will work after the project keys are configured.</div>}
      {error && <div className="reg-alert" role="alert">{error}</div>}{message && <div className="reg-success" role="status">{message}</div>}
      <form onSubmit={submit} className="reg-form">
        <label>Full name<input name="full_name" value={form.full_name} onChange={change} autoComplete="name" required maxLength={120} placeholder="As recorded by your college"/></label>
        <label>College Student ID<input name="student_id" value={form.student_id} onChange={change} required maxLength={80} placeholder="Enter your official Student ID"/></label>
        <label>Email address<input name="email" type="email" value={form.email} onChange={change} autoComplete="email" required maxLength={254} placeholder="you@example.com"/></label>
        <label>Password<input name="password" type="password" value={form.password} onChange={change} autoComplete="new-password" minLength={8} required placeholder="At least 8 characters"/></label>
        <div className="reg-two"><label>Phone number<input name="phone" type="tel" value={form.phone} onChange={change} required maxLength={30} placeholder="+91…"/></label><label>Academic year<select name="academic_year" value={form.academic_year} onChange={change} required><option>1st Year</option><option>2nd Year</option><option>3rd Year</option><option>4th Year</option><option>Other / configured year</option></select></label></div>
        <label>Branch / Department<input name="branch" value={form.branch} onChange={change} required maxLength={100} placeholder="e.g. CSE, ECE, or your department"/></label>
        <label>Preferred bus stop<input name="preferred_bus_stop" value={form.preferred_bus_stop} onChange={change} required maxLength={160} placeholder="Your preferred pickup stop"/></label>
        <label>Emergency contact<input name="emergency_contact" value={form.emergency_contact} onChange={change} required maxLength={160} placeholder="Name and phone number"/></label>
        <button type="submit" disabled={busy}>{busy ? "Submitting…" : "Create account & request verification"}</button>
      </form>
      <p className="reg-foot">Already registered? <Link href="/login">Sign in</Link></p>
      <p className="reg-legal">Submitting this form does not grant transport access. Your Student ID is reviewed manually. Bus and route assignments are made by an authorized admin.</p>
    </section>
  </main>;
}
