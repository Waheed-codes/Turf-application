import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@/app/globals.css";
import { SessionNavigation } from "./session-navigation";
import { LoginIdentifierProvider } from "./login-identifier";

export const metadata: Metadata = {
  title: "Sports booking platform",
  description: "Foundation for a mobile-first sports venue booking platform.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionNavigation>
          <LoginIdentifierProvider>{children}</LoginIdentifierProvider>
        </SessionNavigation>
      </body>
    </html>
  );
}
