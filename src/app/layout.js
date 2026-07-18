import Footer from "@/components/Footer/Footer";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import { Toaster } from "react-hot-toast";
import ReduxProvider from "@/redux/ReduxProvider";
import Stickyfooter from "@/components/Footer/StickyFooter";

export const metadata = {
  title: "Seller Registration | Sell Online & Get Verified B2B Leads | Inquiry Bazaar",
  description: "Create your seller account on Inquiry Bazaar to list products, increase online visibility and receive high-intent B2B inquiries from verified buyers. Grow your business with India's hybrid B2B marketplace.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <ReduxProvider>
          <Navbar />
          <Toaster position="top-center" />
          {children}
          <Stickyfooter />
          <Footer />
        </ReduxProvider>
      </body>
    </html>
  );
}