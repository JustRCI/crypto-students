import { Poppins } from "next/font/google";
import "./globals.css";
import CustomAlert from "@/components/CustomAlert";

const poppins = Poppins({
  variable: "--font-poppins", 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "Crypto Student",
  description: "Platform Learning Crypto terpercaya",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
      </head>
      <body className={`${poppins.variable} antialiased min-h-screen`}>
        <CustomAlert />
        {children}
      </body>
    </html>
  );
}