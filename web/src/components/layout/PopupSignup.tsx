import { Notify } from '@/src/util/useToastNotifications';
import Link from 'next/link'
import React, { useState, SyntheticEvent } from "react";
import { signIn } from 'next-auth/react';
import { authService } from '@/src/services/authService';
import { useRouter } from 'next/navigation';

export default function PopupSignup({ isLogin, handleLogin, isRegister, handleRegister }: any) {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setError("");

    // Validate first name
    if (!firstName || firstName.trim().length < 2) {
      setError("First name must be at least 2 characters long");
      Notify.error("First name must be at least 2 characters long");
      return;
    }

    // Validate last name
    if (!lastName || lastName.trim().length < 2) {
      setError("Last name must be at least 2 characters long");
      Notify.error("Last name must be at least 2 characters long");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Invalid email address");
      Notify.error("Invalid email address");
      return;
    }
    
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!phoneRegex.test(phone)) {
      setError("Phone number must be between 10-15 digits");
      Notify.error("Phone number must be between 10-15 digits");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      Notify.error("Passwords do not match");
      return;
    }
    
    if (!isChecked) {
      setError("Please accept the terms and conditions");
      Notify.error("Please accept the terms and conditions");
      return;
    }
    
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      Notify.error("Password must be at least 8 characters long");
      return;
    }

    // password validation regex (starts with a uppercase letter, contains at least one number, one special character, and is at least 8 characters long)
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError("Password must contain at least one uppercase letter, one number, and one special character, and be at least 8 characters long");
      Notify.error("Password must contain at least one uppercase letter, one number, and one special character");
      return;
    }
    
    try {
      setLoading(true);
      setError("");
      
      const registerData = {
        f_name: firstName,
        l_name: lastName,
        email,
        phone,
        password,
        password_confirmation: confirmPassword,
        address: address || undefined,
      };
      
      await authService.register(registerData);
      
      Notify.success("Registration successful! Please check your email to verify your account.");
      
      // Close register popup and open login popup
      handleRegister();
      setTimeout(() => {
        handleLogin();
      }, 2000); 

    } catch (error: any) {
      console.error("Registration error:", error);
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      setError(errorMessage);
      Notify.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const result = await signIn('google', { 
        redirect: false,
        callbackUrl: '/' 
      });
      
      if (result?.error) {
        Notify.error('Failed to sign in with Google');
        setLoading(false);
        return;
      }
      
      if (result?.ok) {
        // Close the popup and redirect
        handleRegister();
        Notify.success('Successfully signed in with Google!');
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      Notify.error('Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };
    return (
        <>

            <div className="popup-signup" style={{ display: `${isRegister ? "block" : "none"}` }}>
                <div className="popup-container">
                    <div className="popup-content" style={{ maxHeight: '90vh', overflowY: 'auto' }}> <a className="close-popup-signup" onClick={handleRegister} />
                        <div className="d-flex gap-2 align-items-center"><Link href="#"><img src="/assets/imgs/template/popup/logo.svg" alt="T7wisa" /></Link>
                            <h4 className="neutral-1000">Register</h4>
                        </div>
                        <div className="box-button-logins"> 
                            <button 
                                type="button" 
                                className="btn btn-login btn-google mr-10" 
                                onClick={handleGoogleSignIn}
                                disabled={loading}
                            >
                                <img src="/assets/imgs/template/popup/google.svg" alt="T7wisa" />
                                <span className="text-sm-bold">Sign up with Google</span>
                            </button>
                        </div>
                        <div className="form-login">
                            <form onSubmit={handleSubmit}>
                                {error && (
                                    <div className="alert alert-danger mb-3" role="alert">
                                        {error}
                                    </div>
                                )}
                                <div className="row">
                                    <div className="col-6">
                                        <div className="form-group">
                                            <label className="text-sm-medium">First Name *</label>
                                            <input 
                                                className="form-control" 
                                                type="text" 
                                                placeholder="John" 
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                                required
                                                disabled={loading}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="form-group">
                                            <label className="text-sm-medium">Last Name *</label>
                                            <input 
                                                className="form-control" 
                                                type="text" 
                                                placeholder="Doe" 
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                                required
                                                disabled={loading}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="text-sm-medium">Email *</label>
                                    <input 
                                        className="form-control email" 
                                        type="email" 
                                        placeholder="user@example.com" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        disabled={loading}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="text-sm-medium">Phone Number *</label>
                                    <input 
                                        className="form-control" 
                                        type="tel" 
                                        placeholder="+213555123456" 
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        required
                                        disabled={loading}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="text-sm-medium">Address (Optional)</label>
                                    <input 
                                        className="form-control" 
                                        type="text" 
                                        placeholder="Your address" 
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>
                                <div className="row">
                                    <div className="col-6">
                                        <div className="form-group">
                                            <label className="text-sm-medium">Password *</label>
                                            <input 
                                                className="form-control password" 
                                                type={showPassword ? "text" : "password"} 
                                                placeholder="***********" 
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                disabled={loading}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="form-group">
                                            <label className="text-sm-medium">Confirm Password *</label>
                                            <input 
                                                className="form-control password" 
                                                type={showPassword ? "text" : "password"} 
                                                placeholder="***********" 
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                required
                                                disabled={loading}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="box-remember-forgot">
                                        <div className="remeber-me">
                                            <label className="text-xs-medium neutral-500">
                                                <input 
                                                    className="cb-remember" 
                                                    type="checkbox" 
                                                    checked={isChecked}
                                                    onChange={(e) => setIsChecked(e.target.checked)}
                                                    disabled={loading}
                                                />
                                                I agree to terms and conditions
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group mt-45 mb-30"> 
                                    <button 
                                        type="submit" 
                                        className="btn btn-black-lg" 
                                        disabled={loading}
                                    >
                                        {loading ? 'Creating Account...' : 'Create New Account'}
                                        <svg width={16} height={16} viewBox="0 0 16 16"  xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8 15L15 8L8 1M15 8L1 8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                </div>
                                <p className="text-sm-medium neutral-500">Already have an account?  
                                    <a className="neutral-1000 btn-signin" style={{cursor: 'pointer'}} onClick={() => { handleRegister(); handleLogin() }}> Login Here !</a>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}
