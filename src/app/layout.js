import Footer from "@/components/Footer/Footer";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import { Toaster } from "react-hot-toast";
import ReduxProvider from "@/redux/ReduxProvider";

export const metadata = {
  title: "Seller - Inquiry Bazaar",
  description: "Inquiry Bazaar B2B marketplace",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <ReduxProvider>
          <Navbar />
          <Toaster position="top-center" />
          {children}
          <Footer />
        </ReduxProvider>
      </body>
    </html>
  );
}