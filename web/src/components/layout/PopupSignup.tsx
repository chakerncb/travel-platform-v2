import { Notify } from '@/src/util/useToastNotifications';
import Link from 'next/link'
import React, { useState, SyntheticEvent } from "react";

export default function PopupSignup({ isLogin, handleLogin, isRegister, handleRegister }: any) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


    const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setError("");

    const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;
    if (!usernameRegex.test(username)) {
      setError("FullName must be at least 3 characters long and can only contain letters, numbers, and underscores");
      // notifyError("Username must be at least 3 characters long and can only contain letters, numbers, and underscores");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Invalid email address");
      // notifyError("Invalid email address");
      return;
    }
    
    const phoneRegex = /^\+?[0-9]{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setError("Phone number must be 10 digits");
      // notifyError("Phone number must be 10 digits");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      // notifyError("Passwords do not match");
      return;
    }
    
    if (!isChecked) {
      setError("Please accept the terms and conditions");
      // notifyError("Please accept the terms and conditions");
      return;
    }
    
    if (password.length < 8) {
      setError("New password must be at least 6 characters long");
      return;
    }

    // password validation regex (starts with a uppercase letter, contains at least one number, one special character, and is at least 8 characters long)
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(password)) {
        setError("New password must contain at least one uppercase letter, one number, and one special character, and be at least 8 characters long");
        return;
        }
    
    try {
      setLoading(true);
      setError("");
      
      const registerData = {
        username,
        email,
        phoneNumber,
        password,
        companyName
      };
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/account/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });
            
      if (!response.ok) {
        const text = await response.text(); 
        setError(text || 'Registration failed');
        Notify.error('Registration failed');
        return;
      }
      
      Notify.success("Registration successful. Please check your email to confirm your account.");
      setTimeout(() => {
        router.push('/signin');
      }, 3000); 

    } catch (error) {
      console.error("Registration error:", error);
      notifyError('An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };
    return (
        <>

            <div className="popup-signup" style={{ display: `${isRegister ? "block" : "none"}` }}>
                <div className="popup-container">
                    <div className="popup-content"> <a className="close-popup-signup" onClick={handleRegister} />
                        <div className="d-flex gap-2 align-items-center"><Link href="#"><img src="/assets/imgs/template/popup/logo.svg" alt="Travila" /></Link>
                            <h4 className="neutral-1000">Register</h4>
                        </div>
                        <div className="box-button-logins"> <Link className="btn btn-login btn-google mr-10" href="#"><img src="/assets/imgs/template/popup/google.svg" alt="Travila" /><span className="text-sm-bold">Sign up
                            with Google</span></Link><Link className="btn btn-login mr-10" href="#"><img src="/assets/imgs/template/popup/facebook.svg" alt="Travila" /></Link><Link className="btn btn-login" href="#"><img src="/assets/imgs/template/popup/apple.svg" alt="Travila" /></Link></div>
                        <div className="form-login">
                            <form action="#">
                                <div className="form-group">
                                    <label className="text-sm-medium">Username *</label>
                                    <input className="form-control username" type="text" placeholder="Username" name='username' />
                                </div>
                                <div className="form-group">
                                    <label className="text-sm-medium">Your email *</label>
                                    <input className="form-control email" type="email" placeholder="Email / Username" name='email' />
                                </div>
                                <div className="row">
                                    <div className="col-6">
                                        <div className="form-group">
                                            <label className="text-sm-medium">Password *</label>
                                            <input className="form-control password" type="password" placeholder="***********" name='password' />
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="form-group">
                                            <label className="text-sm-medium">Confirm Password *</label>
                                            <input className="form-control password" type="password" placeholder="***********" name='confirmedPassword' />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="box-remember-forgot">
                                        <div className="remeber-me">
                                            <label className="text-xs-medium neutral-500">
                                                <input className="cb-remember" type="checkbox" />I agree to term and conditions
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group mt-45 mb-30"> <Link className="btn btn-black-lg" href="#">Create New Account
                                    <svg width={16} height={16} viewBox="0 0 16 16"  xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8 15L15 8L8 1M15 8L1 8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg></Link></div>
                                <p className="text-sm-medium neutral-500">Already have an account?  
                                    <a className="neutral-1000 btn-signin"  onClick={() => { handleRegister(); handleLogin() }}> Login Here !</a>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}
