import "./globals.css";
import { Metadata } from "next";
// import { usePagesStore } from "@/store/usePagesStore";

export const metadata: Metadata = {
  title: "Planera",
  description:
    `Planera is a modern planning and execution platform designed to help individuals, teams, and 
    organizations think clearly, plan effectively, and execute confidently.`,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
