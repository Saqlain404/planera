import "./globals.css";
import { PagesProvider } from "@/context/PagesContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <PagesProvider>{children}</PagesProvider>
      </body>
    </html>
  );
}
