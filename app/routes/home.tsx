import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Finanzas claras · Herramientas financieras" },
    { name: "description", content: "Calculadoras financieras sencillas para planificar con claridad." },
  ];
}

export default function Home() {
  const { t } = useTranslation();

  return (
    <main>
      <section className="hero page-container">
        <div className="eyebrow"><span className="eyebrow__dot" />{t("homeEyebrow")}</div>
        <h1>{t("homeTitle")}</h1>
        <p className="hero__copy">{t("homeDescription")}</p>
        <Link className="button button--primary" to="/calculadoras/simulador-financiero">
          {t("exploreSimulator")} <span aria-hidden="true">→</span>
        </Link>
        <div className="hero__note"><span aria-hidden="true">✦</span> {t("homeNote")}</div>
      </section>

      <section className="tools-section page-container" aria-labelledby="tools-title">
        <div className="section-heading"><div><p className="section-kicker">{t("workspaceKicker")}</p><h2 id="tools-title">{t("availableTools")}</h2></div><span className="section-count">{t("availableCount")}</span></div>
        <Link className="tool-card" to="/calculadoras/simulador-financiero">
          <div className="tool-card__icon" aria-hidden="true">◒</div>
          <div className="tool-card__body"><span className="tool-card__tag">{t("availableNow")}</span><h3>{t("simulatorTitle")}</h3><p>{t("simulatorDescription")}</p><span className="tool-card__link">{t("openTool")} <span aria-hidden="true">↗</span></span></div>
          <span className="tool-card__arrow" aria-hidden="true">→</span>
        </Link>
        <div className="coming-soon"><span aria-hidden="true">＋</span><div><strong>{t("moreTools")}</strong><p>{t("moreToolsDescription")}</p></div></div>
      </section>
    </main>
  );
}

