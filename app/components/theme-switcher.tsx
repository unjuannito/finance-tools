import { useTranslation } from "react-i18next";
import { useTheme, type ThemePreference } from "../contexts/theme-context";
import { Icon } from "./icon";

const options: ThemePreference[] = ["system", "light", "dark"];

export function ThemeSwitcher() {
  const { preference, setPreference } = useTheme();
  const { t } = useTranslation();

  return (
    <fieldset className="theme-switcher">
      <legend>{t("theme")}</legend>
      {options.map((option) => (
        <button
          aria-pressed={preference === option}
          className={preference === option ? "theme-switcher__option theme-switcher__option--active" : "theme-switcher__option"}
          key={option}
          onClick={() => setPreference(option)}
          title={t(`theme${option[0].toUpperCase()}${option.slice(1)}`)}
          type="button"
        >
          <Icon name={option === "system" ? "system" : option === "light" ? "sun" : "moon"} size={16} />
          <span className="sr-only">{t(`theme${option[0].toUpperCase()}${option.slice(1)}`)}</span>
        </button>
      ))}
    </fieldset>
  );
}
