"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
    const { user, isAuthenticated, logout } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const displayName = user?.parentName || user?.childName || user?.email?.split("@")[0] || "User";

    return (
        <nav className="nav-main">
            <div className="nav-container">
                <div className="nav-logo-section">
                    <Link href="/">
                        <h2>TiffinGenie</h2>
                    </Link>
                </div>

                <ul className="nav-links">
                    <li><Link href="/">Home</Link></li>
                    <li><Link href="/about">About Us</Link></li>
                    <li><Link href="/pricing">Pricing</Link></li>
                    <li><Link href="/how-it-works">How It Works</Link></li>
                    <li><Link href="/dashboard">Dashboard</Link></li>
                    <li><Link href="/contact">Contact</Link></li>
                </ul>

                <div className="nav-auth-section">
                    {!isAuthenticated ? (
                        <div className="guest-links">
                            <Link href="/login" className="nav-link-secondary">Login</Link>
                            <Link href="/onboarding" className="btn-primary">Get Started</Link>
                        </div>
                    ) : (
                        <div className="auth-profile-container">
                            <button className="nav-notif-btn">
                                🔔
                                <span className="notif-badge">0</span>
                            </button>

                            <div className="user-dropdown-wrapper">
                                <button 
                                    className="user-profile-trigger"
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                >
                                    <div className="user-avatar">
                                        {displayName.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="user-info">
                                        <span className="user-role">Parent Account</span>
                                        <span className="user-name">Hi, {displayName}</span>
                                    </div>
                                    <span className="chevron">▼</span>
                                </button>

                                {dropdownOpen && (
                                    <div className="nav-dropdown">
                                        <Link href="/dashboard" onClick={() => setDropdownOpen(false)}>📊 My Dashboard</Link>
                                        <Link href="/profile" onClick={() => setDropdownOpen(false)}>👤 My Profile</Link>
                                        <Link href="/recipes" onClick={() => setDropdownOpen(false)}>📖 Recipe Library</Link>
                                        <button onClick={logout} className="logout-btn">🚪 Logout</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .nav-main {
                    width: 100%;
                    background: white;
                    box-shadow: 0 2px 15px rgba(0,0,0,0.06);
                    position: sticky;
                    top: 0;
                    z-index: 1000;
                    padding: 15px 5%;
                }
                .nav-container {
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .nav-logo-section h2 {
                    font-family: 'Fredoka', sans-serif;
                    color: #ff7aa2;
                    margin: 0;
                    cursor: pointer;
                }
                .nav-links {
                    display: flex;
                    gap: 30px;
                    list-style: none;
                    margin: 0;
                    padding: 0;
                }
                .nav-links a {
                    text-decoration: none;
                    color: #333;
                    font-weight: 500;
                    font-size: 15px;
                    transition: 0.3s;
                }
                .nav-links a:hover { color: #ff7aa2; }
                
                .nav-auth-section { display: flex; align-items: center; gap: 20px; }
                .guest-links { display: flex; gap: 20px; align-items: center; }
                .nav-link-secondary { color: #6aa9ff; font-weight: 600; text-decoration: none; }
                
                .btn-primary {
                    background: linear-gradient(135deg, #ff7aa2, #ff4d88);
                    color: white;
                    padding: 10px 25px;
                    border-radius: 25px;
                    text-decoration: none;
                    font-weight: 600;
                    box-shadow: 0 4px 15px rgba(255,122,162,0.3);
                }

                .auth-profile-container { display: flex; align-items: center; gap: 15px; }
                .nav-notif-btn { background: none; border: none; font-size: 20px; cursor: pointer; position: relative; }
                .notif-badge {
                    position: absolute; top: -5px; right: -5px;
                    background: #ef4444; color: white; border-radius: 50%;
                    width: 16px; height: 16px; font-size: 10px;
                    display: flex; align-items: center; justify-content: center;
                }

                .user-dropdown-wrapper { position: relative; }
                .user-profile-trigger {
                    display: flex; align-items: center; gap: 10px;
                    background: white; border: 1px solid #e5e7eb;
                    padding: 6px 14px; border-radius: 50px; cursor: pointer;
                }
                .user-avatar {
                    width: 32px; height: 32px; background: #ff7aa2;
                    border-radius: 50%; color: white;
                    display: flex; align-items: center; justify-content: center; font-weight: bold;
                }
                .user-info { display: flex; flex-direction: column; text-align: left; line-height: 1.2; }
                .user-role { font-size: 10px; color: #9ca3af; font-weight: 600; }
                .user-name { font-size: 13px; font-weight: 600; color: #111827; }
                
                .nav-dropdown {
                    position: absolute; top: 50px; right: 0;
                    background: white; min-width: 200px;
                    border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                    border: 1px solid #f0f0f0; overflow: hidden;
                }
                .nav-dropdown a, .logout-btn {
                    display: block; padding: 12px 20px; text-decoration: none;
                    color: #333; font-size: 14px; text-align: left;
                    width: 100%; border: none; background: none; cursor: pointer;
                }
                .nav-dropdown a:hover, .logout-btn:hover { background: #fff0f5; color: #ff7aa2; }
                .logout-btn { color: #ef4444; border-top: 1px solid #f9fafb; }
            `}</style>
        </nav>
    );
}
