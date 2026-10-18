import type { SVGProps } from "react";
import iconSpriteUrl from "../assets/icons.svg?url";

export type IconName =
  | "arrow-left"
  | "arrow-right"
  | "arrow-up-right"
  | "calculator"
  | "close"
  | "expand"
  | "landmark"
  | "moon"
  | "plus"
  | "settings"
  | "sliders"
  | "sun"
  | "system"
  | "trend-up"
  | "wallet"
  | "compress";

type Props = SVGProps<SVGSVGElement> & { name: IconName; size?: number };

export function Icon({ name, size = 20, ...props }: Props) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      height={size}
      width={size}
      viewBox="0 0 24 24"
      {...props}
    >
      <use href={`${iconSpriteUrl}#${name}`} />
    </svg>
  );
}
