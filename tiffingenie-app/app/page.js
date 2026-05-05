"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export default function Home() {
    const { isAuthenticated } = useAuth();

    return (
        <div className="hero-section">
            <div className="hero-content">
                <h1 className="reveal">
                    Your Child's <span>Healthiest Week</span> Starts Here.
                </h1>
                <p>
                    TiffinGenie uses smart AI to build personalized, balanced meal plans 
                    from real Indian home recipes — so mornings are stress-free and 
                    tiffins are nutritious.
                </p>

                <div className="hero-cta">
                    {!isAuthenticated ? (
                        <Link href="/onboarding" className="btn btn-primary">
                            Get Started Free
                        </Link>
                    ) : (
                        <Link href="/dashboard" className="btn btn-primary">
                            Go to Dashboard 📊
                        </Link>
                    )}
                    <button className="btn btn-outline">
                        See How It Works ↓
                    </button>
                </div>
            </div>

            <style jsx>{`
                .hero-section {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 80px 5%;
                    min-height: 80vh;
                    text-align: center;
                }
                .hero-content { max-width: 800px; }
                h1 {
                    font-family: 'Fredoka', sans-serif;
                    font-size: 56px;
                    line-height: 1.1;
                    margin-bottom: 25px;
                    color: #111827;
                }
                h1 span {
                    background: linear-gradient(135deg, #ff7aa2, #ff4d88);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                p {
                    font-size: 18px;
                    color: #4b5563;
                    line-height: 1.6;
                    margin-bottom: 40px;
                }
                .hero-cta { display: flex; gap: 20px; justify-content: center; }
                
                .btn {
                    padding: 15px 35px;
                    border-radius: 50px;
                    font-weight: 700;
                    text-decoration: none;
                    transition: 0.3s;
                    border: none;
                    cursor: pointer;
                    font-size: 16px;
                }
                .btn-primary {
                    background: linear-gradient(135deg, #ff7aa2, #ff4d88);
                    color: white;
                    box-shadow: 0 10px 25px rgba(255,122,162,0.3);
                }
                .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 15px 30px rgba(255,122,162,0.4); }
                
                .btn-outline {
                    background: white;
                    color: #4b5563;
                    border: 1px solid #e5e7eb;
                }
                .btn-outline:hover { border-color: #ff7aa2; color: #ff7aa2; }
            `}</style>
        </div>
    );
}
