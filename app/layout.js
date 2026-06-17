import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import Providers from "./providers";
import "./globals.css";

export const metadata = {
  title: "Admin Dashboard",
  description: "Next.js + MUI + Zustand admin dashboard powered by DummyJSON",
};

// Root layout (Server Component).
// AppRouterCacheProvider is MUI's official adapter for the App Router – it
// makes sure Emotion styles are injected during SSR so there's no flash of
// unstyled content. Everything else lives in <Providers /> (a Client Component).
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <Providers>{children}</Providers>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
