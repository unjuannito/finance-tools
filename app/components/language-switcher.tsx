import { useTranslation } from "react-i18next";

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const nextLanguage = i18n.language === "en" ? "es" : "en";
  const nextLanguageLabel = nextLanguage === "en" ? "English" : "Español";

  return (
    <button
      className="language-switcher__button"
      type="button"
      onClick={() => void i18n.changeLanguage(nextLanguage)}
      aria-label={`${t("language")}: ${nextLanguageLabel}`}
      title={`${t("language")}: ${nextLanguageLabel}`}
    >
      {nextLanguageLabel}
    </button>
  );
}
