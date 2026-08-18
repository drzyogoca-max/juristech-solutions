import { SpeedInsights } from "@vercel/speed-insights/next";
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar">
      <body className="bg-slate-950 text-white">
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
