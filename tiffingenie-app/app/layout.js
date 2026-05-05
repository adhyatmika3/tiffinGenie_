import { AuthProvider } from "../context/AuthContext";
import Layout from "../components/Layout";

export const metadata = {
  title: "TiffinGenie | Smart Meal Planning for Kids",
  description: "AI-powered personalized meal plans for your children.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Layout>{children}</Layout>
        </AuthProvider>
      </body>
    </html>
  );
}
