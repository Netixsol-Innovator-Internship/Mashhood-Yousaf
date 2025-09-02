import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "NestJS + NextJS App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900">
        <Navbar />
        <main className="p-6">{children}</main>
        <Toaster position="top-right" reverseOrder={false} />
      </body>
    </html>
  );
}
