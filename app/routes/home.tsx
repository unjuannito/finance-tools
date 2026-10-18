import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import type { Route } from "./+types/home";
import { Icon } from "../components/icon";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Finanzas claras · Calculadora de patrimonio" },
    { name: "description", content: "Planifica tu patrimonio con una proyección sencilla de ahorro e inversión." },
  ];
}

export default function Home() {
  const { t } = useTranslation();

  return (
    <main>
      <section className="hero home-hero page-container">
        <h1>{t("homeTitle")}</h1>
        <p className="hero__copy">{t("homeDescription")}</p>
      </section>
      <section className="tools-section home-tools page-container" aria-labelledby="tools-title">
        <div className="section-heading"><div><p className="section-kicker">{t("workspaceKicker")}</p><h2 id="tools-title">{t("availableTools")}</h2></div></div>
        <Link className="tool-card" to="/tools/wealth-calculator">
          <div className="tool-card__icon"><Icon name="calculator" size={24} /></div>
          <div className="tool-card__body"><h3>{t("simulatorTitle")}</h3><p>{t("simulatorDescription")}</p></div>
          <span className="tool-card__arrow"><Icon name="arrow-right" size={19} /></span>
        </Link>
        <div className="coming-soon home-coming-soon"><div><strong>{t("moreTools")}</strong></div></div>
      </section>
    </main>
  );
}

