"use client";

import { useEffect, useState } from "react";
import { useInsure } from "../../store/insureStore";
import FloatingIconsBackground from "../ui/FloatingIconsBackground";

type Mode = "signin" | "signup" | "forgot";

export default function Auth() {
  const { login, setActivePage } = useInsure();
  const [mode, setMode] = useState<Mode>("signin");
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [signUp, setSignUp] = useState({ name: "", phone: "", countryCode: "", email: "", pan: "", aadhaar: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [forgotStep, setForgotStep] = useState<"enter" | "otp" | "reset">("enter");
  const [forgotData, setForgotData] = useState({ email: "", otp: "", newPassword: "", confirmPassword: "" });

  function validateSignIn() {
    const e: Record<string, string> = {};
    if (!signInEmail) e.signInEmail = "Email/Phone is required";
    if (!signInPassword) e.signInPassword = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateSignUp() {
    const e: Record<string, string> = {};
    if (!signUp.name) e.name = "Full name is required";
    if (!signUp.phone) e.phone = "Phone is required";
    if (!signUp.email) e.email = "Email is required";
    if (!signUp.password || signUp.password.length < 6) e.password = "Min 6 characters";
    if (signUp.confirm !== signUp.password) e.confirm = "Passwords do not match";
    if (signUp.pan && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(signUp.pan)) e.pan = "Invalid PAN format";
    const aadhaarDigits = signUp.aadhaar.replace(/-/g, "");
    if (signUp.aadhaar && aadhaarDigits.length !== 16) e.aadhaar = "Aadhaar must be 16 digits";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateForgotStep() {
    const e: Record<string, string> = {};
    if (forgotStep === "enter") {
      if (!forgotData.email) e.email = "Email/Phone/PAN is required";
    } else if (forgotStep === "otp") {
      if (!forgotData.otp || forgotData.otp.length !== 6) e.otp = "Please enter 6-digit OTP";
    } else if (forgotStep === "reset") {
      if (!forgotData.newPassword || forgotData.newPassword.length < 6) e.newPassword = "Password must be at least 6 characters";
      if (!forgotData.confirmPassword) e.confirmPassword = "Please confirm your password";
      if (forgotData.newPassword !== forgotData.confirmPassword) {
        e.confirmPassword = "Passwords do not match";
        e.passwordMismatch = "Passwords do not match. Please try again.";
      }
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    if (validateSignIn()) {
      login();
    }
  }
  function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    if (validateSignUp()) {
      login();
    }
  }

  function handleForgotStep(e: React.FormEvent) {
    e.preventDefault();
    if (validateForgotStep()) {
      if (forgotStep === "enter") {
        setForgotStep("otp");
      } else if (forgotStep === "otp") {
        setForgotStep("reset");
      } else if (forgotStep === "reset") {
        setMode("signin");
        setForgotStep("enter");
        setForgotData({ email: "", otp: "", newPassword: "", confirmPassword: "" });
      }
    }
  }

  useEffect(() => {
    // clear errors on mode change for better UX
    setErrors({});
  }, [mode]);

  useEffect(() => {
    // Clear OTP when step changes
    if (forgotStep === "otp") {
      setForgotData(prev => ({ ...prev, otp: "" }));
    }
  }, [forgotStep]);

  useEffect(() => {
    // Real-time password validation
    if (forgotStep === "reset" && forgotData.newPassword && forgotData.confirmPassword) {
      if (forgotData.newPassword !== forgotData.confirmPassword) {
        setErrors(prev => ({ ...prev, passwordMismatch: "Passwords do not match. Please try again." }));
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.passwordMismatch;
          return newErrors;
        });
      }
    }
  }, [forgotStep, forgotData.newPassword, forgotData.confirmPassword]);

  return (
    <div className="flex justify-center items-center min-h-screen p-4 relative">
      <FloatingIconsBackground />
      <div className="w-full max-w-5xl relative z-20">
        <div className="mb-6">
          <button 
            onClick={() => setActivePage("homePage")}
            className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
          >
            <i className="fa-solid fa-arrow-left mr-2" />
            Back to Home
          </button>
        </div>
        {mode !== "forgot" && (
          <div id="auth-container" className={`relative overflow-hidden rounded-2xl w-full min-h-[720px] shadow-2xl bg-white ${mode === "signup" ? "right-panel-active" : ""}`}>
            {/* Sign Up Form (left, hidden by default) */}
            <div className="sign-up-container absolute top-0 left-0 h-full w-1/2 opacity-0 z-10 transition-all duration-700 ease-in-out">
              <form onSubmit={handleSignUp} className="bg-white flex items-center justify-center flex-col px-8 h-full text-center overflow-y-auto py-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Create Your InsureVault</h1>
                <div className="w-full max-w-md space-y-2">
                  <div>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3"><i className="fa-regular fa-user text-gray-600" /></span>
                      <input value={signUp.name} onChange={(e)=>setSignUp({...signUp,name:e.target.value})} placeholder="Full Name *" className={`animated-input bg-slate-100 border ${errors.name?"border-red-400":"border-slate-200"} text-gray-900 text-sm rounded-lg w-full pl-10 p-3`} />
                    </div>
                    {errors.name && <p className="text-xs text-red-500 mt-1 text-left">{errors.name}</p>}
                  </div>
                  <div>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3"><i className="fa-solid fa-phone text-gray-600" /></span>
                      <input value={signUp.phone} onChange={(e)=>setSignUp({...signUp,phone:e.target.value.replace(/\D/g,'')})} placeholder="Phone *" className={`animated-input bg-slate-100 border ${errors.phone?"border-red-400":"border-slate-200"} text-gray-900 text-sm rounded-lg w-full pl-10 p-3`} />
                    </div>
                    {errors.phone && <p className="text-xs text-red-500 mt-1 text-left">{errors.phone}</p>}
                  </div>
                  <div>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3"><i className="fa-regular fa-envelope text-gray-600" /></span>
                      <input type="email" value={signUp.email} onChange={(e)=>setSignUp({...signUp,email:e.target.value})} placeholder="Email ID *" className={`animated-input bg-slate-100 border ${errors.email?"border-red-400":"border-slate-200"} text-gray-900 text-sm rounded-lg w-full pl-10 p-3`} />
                    </div>
                    {errors.email && <p className="text-xs text-red-500 mt-1 text-left">{errors.email}</p>}
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3"><i className="fa-regular fa-id-card text-gray-600" /></span>
                        <input value={signUp.pan} onChange={(e)=>setSignUp({...signUp,pan:e.target.value.toUpperCase().slice(0,10)})} placeholder="PAN Number" className={`animated-input bg-slate-100 border ${errors.pan?"border-red-400":"border-slate-200"} text-gray-900 text-sm rounded-lg w-full pl-10 p-3`} />
                      </div>
                      {errors.pan && <p className="text-xs text-red-500 mt-1 text-left">{errors.pan}</p>}
                    </div>
                    <div>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3"><i className="fa-regular fa-id-card text-gray-600" /></span>
                        <input value={signUp.aadhaar} onChange={(e)=>{ const v=e.target.value.replace(/\D/g,''); const f=v.match(/.{1,4}/g)?.join('-')||''; setSignUp({...signUp,aadhaar:f}); }} placeholder="Aadhaar Number" className={`animated-input bg-slate-100 border ${errors.aadhaar?"border-red-400":"border-slate-200"} text-gray-900 text-sm rounded-lg w-full pl-10 p-3`} />
                      </div>
                      {errors.aadhaar && <p className="text-xs text-red-500 mt-1 text-left">{errors.aadhaar}</p>}
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3"><i className="fa-solid fa-lock text-gray-600" /></span>
                        <input type="password" value={signUp.password} onChange={(e)=>setSignUp({...signUp,password:e.target.value})} placeholder="Password *" className={`animated-input bg-slate-100 border ${errors.password?"border-red-400":"border-slate-200"} text-gray-900 text-sm rounded-lg w-full pl-10 p-3`} />
                      </div>
                      {errors.password && <p className="text-xs text-red-500 mt-1 text-left">{errors.password}</p>}
                    </div>
                    <div>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3"><i className="fa-solid fa-lock text-gray-600" /></span>
                        <input type="password" value={signUp.confirm} onChange={(e)=>setSignUp({...signUp,confirm:e.target.value})} placeholder="Confirm Password *" className={`animated-input bg-slate-100 border ${errors.confirm?"border-red-400":"border-slate-200"} text-gray-900 text-sm rounded-lg w-full pl-10 p-3`} />
                      </div>
                      {errors.confirm && <p className="text-xs text-red-500 mt-1 text-left">{errors.confirm}</p>}
                    </div>
                  </div>
                  <div className="flex justify-center mt-2">
                    <div className="g-recaptcha opacity-60 select-none pointer-events-none">reCAPTCHA placeholder</div>
                  </div>
                </div>
                <button type="submit" className="w-full max-w-xs rounded-full bg-primary-blue bg-primary-blue-hover text-white text-sm font-bold uppercase py-3 tracking-wider transition-transform active:scale-95 mt-4">Sign Up</button>
              </form>
            </div>

            {/* Sign In Form (left visible by default) */}
            <div className="sign-in-container absolute top-0 left-0 h-full w-1/2 z-20 transition-all duration-700 ease-in-out">
              <div className="bg-white flex items-center justify-center flex-col px-12 h-full text-center">
                <form onSubmit={handleSignIn} className="w-full max-w-sm">
                  <div className="flex items-center mb-6">
                    <div className="bg-blue-600 p-3 rounded-lg mr-4"><i className="fa-solid fa-shield-halved text-white text-2xl" /></div>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-800">InsureVault</h1>
                      <p className="text-sm text-gray-700">Smart Policy Management</p>
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
                  <p className="text-gray-700 mb-6">Sign in to access your dashboard.</p>
                  <div className="relative mb-2">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <i className="fa-solid fa-user text-gray-600"></i>
                    </span>
                    <input value={signInEmail} onChange={(e)=>setSignInEmail(e.target.value)} placeholder="Email / Phone / PAN" className={`bg-slate-100 border ${errors.signInEmail?"border-red-400":"border-slate-200"} text-gray-900 text-sm rounded-lg w-full pl-10 p-3`} />
                  </div>
                  {errors.signInEmail && <p className="text-xs text-red-500 mb-2 text-left">{errors.signInEmail}</p>}
                  <div className="relative mb-2">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <i className="fa-solid fa-lock text-gray-600"></i>
                    </span>
                    <input type="password" value={signInPassword} onChange={(e)=>setSignInPassword(e.target.value)} placeholder="Password" className={`bg-slate-100 border ${errors.signInPassword?"border-red-400":"border-slate-200"} text-gray-900 text-sm rounded-lg w-full pl-10 p-3`} />
                  </div>
                  {errors.signInPassword && <p className="text-xs text-red-500 mb-4 text-left">{errors.signInPassword}</p>}
                  <button type="button" onClick={()=>setMode("forgot")} className="text-sm text-blue-600 hover:underline mb-6">Forgot your password?</button>
                  <button type="submit" className="w-full rounded-full bg-primary-blue bg-primary-blue-hover text-white text-sm font-bold uppercase py-3 tracking-wider transition-transform active:scale-95">Sign In</button>
                </form>
              </div>
            </div>

            {/* Overlay */}
            <div className="overlay-container absolute top-0 left-1/2 w-1/2 h-full overflow-hidden z-50 transition-transform duration-700 ease-in-out">
              <div className="overlay bg-gradient-to-br from-blue-500 to-blue-700 relative -left-full h-full w-[200%] transform transition-transform duration-700 ease-in-out">
                <div className="overlay-left absolute flex items-center justify-center flex-col px-10 text-center top-0 h-full w-1/2 transition-transform duration-700 ease-in-out">
                  <h1 className="text-3xl font-bold text-white mb-4">Already a Member?</h1>
                  <p className="text-base font-light leading-relaxed text-blue-100 mb-6">Sign in to access your policy dashboard and manage your coverage.</p>
                  <button onClick={()=>setMode("signin")} className="rounded-full bg-transparent border-2 border-white text-white text-sm font-bold uppercase px-12 py-3 tracking-wider hover:bg-white hover:text-blue-600 transition-all active:scale-95">Sign In</button>
                </div>
                <div className="overlay-right absolute flex items-center justify-center flex-col px-10 text-center top-0 right-0 h-full w-1/2 transform transition-transform duration-700 ease-in-out">
                  <h1 className="text-3xl font-bold text-white mb-4">New to InsureVault?</h1>
                  <p className="text-base font-light leading-relaxed text-blue-100 mb-6">Securely manage all your insurance policies in one place. Get started in minutes.</p>
                  <button onClick={()=>setMode("signup")} className="rounded-full bg-transparent border-2 border-white text-white text-sm font-bold uppercase px-12 py-3 tracking-wider hover:bg-white hover:text-blue-600 transition-all active:scale-95" id="signUp">Sign Up</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {mode === "forgot" && (
          <div className="relative rounded-2xl w-full min-h-[520px] shadow-2xl bg-white p-8 md:p-12 flex items-center justify-center">
            <div className="w-full max-w-md">
              {forgotStep === "enter" && (
                <>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">Forgot Password?</h2>
                  <p className="text-gray-700 mb-6 text-center">No worries, we&apos;ll send you reset instructions.</p>
                  <form onSubmit={handleForgotStep}>
                    <div className="relative mb-4">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <i className="fa-solid fa-user text-gray-600"></i>
                      </span>
                      <input 
                        value={forgotData.email} 
                        onChange={(e) => setForgotData({...forgotData, email: e.target.value})} 
                        placeholder="Enter your Email / Phone / PAN" 
                        className={`bg-slate-100 border ${errors.email ? "border-red-400" : "border-slate-200"} text-gray-900 text-sm rounded-lg w-full pl-10 p-3`} 
                      />
                    </div>
                    {errors.email && <p className="text-xs text-red-500 mb-2 text-left">{errors.email}</p>}
                    <button 
                      type="submit" 
                      disabled={!forgotData.email.trim()}
                      className={`w-full rounded-full text-white text-sm font-bold uppercase py-3 tracking-wider transition-transform ${
                        !forgotData.email.trim() 
                          ? "bg-gray-400 cursor-not-allowed" 
                          : "bg-primary-blue bg-primary-blue-hover active:scale-95"
                      }`}
                    >
                      Send OTP
                    </button>
                    <p className="text-center mt-6"><button type="button" onClick={()=>setMode("signin")} className="text-sm text-blue-600 hover:underline">&larr; Back to Sign In</button></p>
                  </form>
                </>
              )}
              {forgotStep === "otp" && (
                <>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">Enter Security Code</h2>
                  <p className="text-gray-700 mb-6 text-center">We&apos;ve sent a 6-digit code to your registered contact.</p>
                  <form onSubmit={handleForgotStep}>
                    <div className="flex justify-center gap-2 mb-6">
                      {Array.from({length:6}).map((_,i)=> (
                        <input 
                          key={i} 
                          maxLength={1} 
                          value={forgotData.otp[i] || ""}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, ''); // Only allow digits
                            if (value.length <= 1) {
                              const newOtp = forgotData.otp.split('');
                              newOtp[i] = value;
                              setForgotData({...forgotData, otp: newOtp.join('')});
                              
                              // Auto-focus next input
                              if (value && i < 5) {
                                setTimeout(() => {
                                  const nextInput = document.querySelector(`input[data-index="${i + 1}"]`) as HTMLInputElement;
                                  nextInput?.focus();
                                }, 0);
                              }
                            }
                          }}
                          onKeyDown={(e) => {
                            // Handle backspace to go to previous input
                            if (e.key === 'Backspace' && !forgotData.otp[i] && i > 0) {
                              const prevInput = document.querySelector(`input[data-index="${i - 1}"]`) as HTMLInputElement;
                              prevInput?.focus();
                            }
                          }}
                          onPaste={(e) => {
                            e.preventDefault();
                            const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
                            if (pastedData.length > 0) {
                              setForgotData({...forgotData, otp: pastedData});
                              // Focus the next empty input or the last one
                              const nextIndex = Math.min(pastedData.length, 5);
                              setTimeout(() => {
                                const nextInput = document.querySelector(`input[data-index="${nextIndex}"]`) as HTMLInputElement;
                                nextInput?.focus();
                              }, 0);
                            }
                          }}
                          data-index={i}
                          className={`w-10 h-10 text-center text-lg border rounded-lg text-gray-900 font-semibold ${
                            errors.otp ? "border-red-400 bg-red-50" : "bg-slate-100 border-slate-200"
                          }`} 
                        />
                      ))}
                    </div>
                    {errors.otp && <p className="text-xs text-red-500 mb-4 text-center">{errors.otp}</p>}
                    <button 
                      type="submit" 
                      disabled={forgotData.otp.length !== 6}
                      className={`w-full rounded-full text-white text-sm font-bold uppercase py-3 tracking-wider transition-transform ${
                        forgotData.otp.length !== 6 
                          ? "bg-gray-400 cursor-not-allowed" 
                          : "bg-primary-blue bg-primary-blue-hover active:scale-95"
                      }`}
                    >
                      Verify
                    </button>
                    <p className="text-center mt-6"><button type="button" onClick={()=>setForgotStep("enter")} className="text-sm text-blue-600 hover:underline">&larr; Back</button></p>
                  </form>
                </>
              )}
              {forgotStep === "reset" && (
                <>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">Set New Password</h2>
                  <p className="text-gray-700 mb-6 text-center">Your new password must be different from previous ones.</p>
                  <form onSubmit={handleForgotStep}>
                    <div className="relative mb-3">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <i className="fa-solid fa-lock text-gray-600"></i>
                      </span>
                      <input 
                        type="password" 
                        value={forgotData.newPassword}
                        onChange={(e) => setForgotData({...forgotData, newPassword: e.target.value})}
                        placeholder="New Password" 
                        className={`bg-slate-100 border ${errors.newPassword ? "border-red-400" : "border-slate-200"} text-gray-900 text-sm rounded-lg w-full pl-10 p-3`} 
                      />
                    </div>
                    {errors.newPassword && <p className="text-xs text-red-500 mb-2 text-left">{errors.newPassword}</p>}
                    <div className="relative mb-4">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <i className="fa-solid fa-lock text-gray-600"></i>
                      </span>
                      <input 
                        type="password" 
                        value={forgotData.confirmPassword}
                        onChange={(e) => setForgotData({...forgotData, confirmPassword: e.target.value})}
                        placeholder="Confirm New Password" 
                        className={`bg-slate-100 border ${errors.confirmPassword ? "border-red-400" : "border-slate-200"} text-gray-900 text-sm rounded-lg w-full pl-10 p-3`} 
                      />
                    </div>
                    {errors.confirmPassword && <p className="text-xs text-red-500 mb-2 text-left">{errors.confirmPassword}</p>}
                    {errors.passwordMismatch && <p className="text-xs text-red-500 mb-4 text-center bg-red-50 p-2 rounded-lg">{errors.passwordMismatch}</p>}
                    <button 
                      type="submit" 
                      disabled={!forgotData.newPassword.trim() || !forgotData.confirmPassword.trim() || forgotData.newPassword !== forgotData.confirmPassword}
                      className={`w-full rounded-full text-white text-sm font-bold uppercase py-3 tracking-wider transition-transform ${
                        !forgotData.newPassword.trim() || !forgotData.confirmPassword.trim() || forgotData.newPassword !== forgotData.confirmPassword
                          ? "bg-gray-400 cursor-not-allowed" 
                          : "bg-primary-blue bg-primary-blue-hover active:scale-95"
                      }`}
                    >
                      Reset Password
                    </button>
                    <p className="text-center mt-6"><button type="button" onClick={()=>setMode("signin")} className="text-sm text-blue-600 hover:underline">&larr; Back to Sign In</button></p>
                  </form>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



