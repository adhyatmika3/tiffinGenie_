"use client";

import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuth();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Mock login for demonstration
        const mockUser = {
            email,
            parentName: email.split("@")[0],
            childName: "Kid"
        };
        const mockToken = "mock-jwt-token";
        login(mockToken, mockUser);
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-card">
                <h2>Welcome Back</h2>
                <div className="form-group">
                    <label>Email Address</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                    />
                </div>
                <button type="submit" className="btn-login">Sign In</button>
            </form>

            <style jsx>{`
                .login-container {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 70vh;
                }
                .login-card {
                    background: white;
                    padding: 40px;
                    border-radius: 20px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                    width: 100%;
                    max-width: 400px;
                    text-align: center;
                }
                h2 { font-family: 'Fredoka'; color: #ff7aa2; margin-bottom: 30px; }
                .form-group { text-align: left; margin-bottom: 20px; }
                label { display: block; font-size: 14px; color: #666; margin-bottom: 8px; font-weight: 600; }
                input {
                    width: 100%;
                    padding: 12px;
                    border: 1px solid #e5e7eb;
                    border-radius: 10px;
                    font-size: 15px;
                }
                .btn-login {
                    width: 100%;
                    padding: 14px;
                    background: linear-gradient(135deg, #ff7aa2, #ff4d88);
                    color: white;
                    border: none;
                    border-radius: 50px;
                    font-weight: 700;
                    cursor: pointer;
                    margin-top: 10px;
                    transition: 0.3s;
                }
                .btn-login:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(255,122,162,0.3); }
            `}</style>
        </div>
    );
}
