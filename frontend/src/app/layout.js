import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./components/context"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "NP Data Hub",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dashboard-color">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
