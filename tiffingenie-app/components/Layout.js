import Navbar from "./Navbar";

export default function Layout({ children }) {
    return (
        <div className="app-layout">
            <Navbar />
            <main className="content-area">
                {children}
            </main>
            <footer className="footer-mini">
                <p>© 2026 TiffinGenie | Built for Modern Parents</p>
            </footer>

            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600&family=Poppins:wght@300;400;500;600&display=swap');
                
                * { box-sizing: border-box; margin: 0; padding: 0; }
                body {
                    font-family: 'Poppins', sans-serif;
                    background: linear-gradient(135deg, #ffeaf3, #e9f6ff);
                    min-height: 100vh;
                    color: #333;
                }
                .content-area {
                    min-height: calc(100vh - 80px - 60px);
                }
                .footer-mini {
                    text-align: center;
                    padding: 20px;
                    font-size: 13px;
                    color: #64748b;
                    border-top: 1px solid rgba(0,0,0,0.05);
                }
            `}</style>
        </div>
    );
}
