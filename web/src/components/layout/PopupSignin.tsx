import Link from 'next/link'
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { Notify } from '@/src/util/useToastNotifications';

export default function PopupSignin({ isLogin, handleLogin, isRegister, handleRegister }: any) {
	const [showPassword, setShowPassword] = useState(false);
	const [isChecked, setIsChecked] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
    const router = useRouter();

	interface LoginFormElements extends HTMLFormControlsCollection {
		email: HTMLInputElement;
		password: HTMLInputElement;
	}

	interface LoginForm extends HTMLFormElement {
		readonly elements: LoginFormElements;
	}
	 
	const Login = async (e: React.FormEvent<LoginForm>) => {
		setError(null);
		e.preventDefault();
		const formData = new FormData(e.currentTarget);

		if (!formData.get("email") || !formData.get("password")) {
		setError("Email and password are required");
		setLoading(false);
		return;
		}
		setLoading(true);

		const signInResponse = await signIn("credentials", {
		email: formData.get("email") as string,
		password: formData.get("password") as string,
		redirect: false,
		});

		if (signInResponse?.error) {
		setError("Invalid email or password. Please try again.");
		setLoading(false);
		return;
		}
		if (signInResponse?.ok) {
		setLoading(false);
			handleLogin();
			Notify.success('You signed in successfully!')
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
				Notify.error('Failed to sign in with Google. Please make sure you have an account.');
				setLoading(false);
				return;
			}
			
			if (result?.ok) {
				// Close the popup and redirect
				handleLogin();
				Notify.success('Successfully signed in with Google!');
				window.location.href = '/';
			}
		} catch (error) {
			console.error('Google sign-in error:', error);
			Notify.error('Failed to sign in with Google');
			setLoading(false);
		}
	};


	return (
		<>

			<div className="popup-signin" style={{ display: `${isLogin ? "block" : "none"}` }}>
				<div className="popup-container">
					<div className="popup-content" style={{ maxHeight: '90vh', overflowY: 'auto' }}> <a className="close-popup-signin" onClick={handleLogin} />
						<div className="d-flex gap-2 align-items-center"><Link href="#"><img src="/assets/imgs/template/popup/logo.svg" alt="TOURZ" /></Link>
							<h4 className="neutral-1000">Hello there !</h4>
						</div>
						<div className="box-button-logins"> 
							<button 
								type="button" 
								className="btn btn-login btn-google mr-10" 
								onClick={handleGoogleSignIn}
								disabled={loading}
							>
								<img src="/assets/imgs/template/popup/google.svg" alt="TOURZ" />
								<span className="text-sm-bold">Sign in with Google</span>
							</button>
						</div>
						<div className="form-login">
							<form onSubmit={Login}>
								{error && (
									<div className="alert alert-danger" role="alert">
										{error}
									</div>
								)}
								<div className="form-group">
									<label className="text-sm-medium">User Email</label>
									<input className="form-control username" type="email" placeholder="Email / Username" name='email' />
								</div>
								<div className="form-group">
									<label className="text-sm-medium">Password</label>
									<input className="form-control password" type="password" name='password' />
								</div>
								<div className="form-group">
									<div className="box-remember-forgot">
										<div className="remeber-me">
											<label className="text-xs-medium neutral-500">
												<input className="cb-remember" type="checkbox" />Remember me
											</label>
										</div>
										<div className="forgotpass"> <Link className="text-xs-medium neutral-500" href="#">Forgot
											password?</Link></div>
									</div>
								</div>
								<div className="form-group mt-45 mb-30">
									<button 
									  className="btn btn-black-lg" 
									  type="submit" 
									  disabled={loading}
									>
										{loading ? 'signing in....' : 'signin'}
										<svg width={16} height={16} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
											<path d="M8 15L15 8L8 1M15 8L1 8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
										</svg>
									</button>
								</div>
								<p className="text-sm-medium neutral-500">Don’t have an account? 
									<a className="neutral-1000 btn-signup" onClick={() => { handleRegister(); handleLogin() }}> Register Here !</a>
								</p>
							</form>
						</div>
					</div>
				</div>
			</div>

		</>
	)
}
