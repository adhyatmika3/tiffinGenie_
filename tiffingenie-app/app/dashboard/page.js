"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

export default function DashboardPage() {
    const { user, isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push("/login");
        }
    }, [isAuthenticated, loading, router]);

    if (loading || !isAuthenticated) return <div>Loading...</div>;

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h2>📊 Parent Dashboard</h2>
                <p>Welcome back, <strong>{user?.parentName || "User"}</strong>!</p>
            </div>

            <div className="dashboard-grid">
                <div className="stat-card">
                    <h3>Week Plan</h3>
                    <p>7/7 Meals Set</p>
                </div>
                <div className="stat-card">
                    <h3>Pro Status</h3>
                    <p>{user?.isPro ? "Active" : "Free Plan"}</p>
                </div>
            </div>

            <style jsx>{`
                .dashboard-container { padding: 40px 5%; }
                .dashboard-header { margin-bottom: 40px; }
                h2 { font-family: 'Fredoka'; font-size: 32px; color: #111827; }
                .dashboard-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; }
                .stat-card {
                    background: white; padding: 30px; border-radius: 20px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.05); text-align: center;
                }
                .stat-card h3 { color: #ff7aa2; font-family: 'Fredoka'; margin-bottom: 10px; }
                .stat-card p { font-size: 18px; font-weight: 600; color: #4b5563; }
            `}</style>
        </div>
    );
}
