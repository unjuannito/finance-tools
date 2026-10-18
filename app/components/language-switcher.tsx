import { useTranslation } from "react-i18next";
import { cn } from "../utils/cn";

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  return (
    <div className="language-switcher" aria-label={t("language")}>
      {(["es", "en"] as const).map((language) => (
        <button
          className={cn("language-switcher__button", i18n.language === language && "language-switcher__button--active")}
          key={language}
          type="button"
          onClick={() => void i18n.changeLanguage(language)}
          aria-pressed={i18n.language === language}
        >
          {language.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
