import { useEffect } from "react";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./i18n";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
import { LanguageSwitcher } from "./components/language-switcher";
import { ThemeSwitcher } from "./components/theme-switcher";
import { ThemeProvider } from "./contexts/theme-context";
import { Icon } from "./components/icon";
import faviconUrl from "./assets/favicon.svg?url";
import "./styles/app.css";

export const links: Route.LinksFunction = () => [
  { rel: "icon", type: "image/svg+xml", href: faviconUrl },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const isHome = location.pathname === "/";
  const pageTitle = location.pathname.includes("wealth-calculator") ? t("simulatorTitle") : t("brand");

  useEffect(() => {
    document.title = isHome ? t("brand") : `${pageTitle} · ${t("brand")}`;
    document.documentElement.lang = i18n.language === "en" ? "en" : "es";
    document.querySelector('meta[name="description"]')?.setAttribute(
      "content",
      isHome ? t("homeDescription") : t("buildScenario"),
    );
  }, [i18n.language, isHome, pageTitle, t]);

  return (
    <ThemeProvider>
      <div className="app-shell">
      <header className="site-header">
        <div className="site-header__inner">
          {isHome ? <a className="brand" href="/" aria-label={`${t("brand")}, ${t("home")}`}><span className="brand__mark"><img src={faviconUrl} alt="" /></span><span>{t("brand")}</span></a> : <div className="contextual-brand"><a className="back-button" href="/" aria-label={t("backHome")}><Icon name="arrow-left" size={17} /></a><span>{pageTitle}</span></div>}
          <details className="settings-menu"><summary aria-label={t("settings")}><Icon name="settings" size={16} /><span>{t("settings")}</span></summary><div className="settings-menu__panel"><LanguageSwitcher /><ThemeSwitcher /></div></details>
        </div>
      </header>
      <Outlet />
      <footer className="site-footer"><span>{t("brand")}</span><span>{t("footer")}</span></footer>
      </div>
    </ThemeProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
