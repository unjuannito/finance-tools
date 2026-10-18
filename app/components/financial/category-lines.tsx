import type { TimelinePoint } from "../../utils/financial-calculations";

type Category = keyof TimelinePoint["breakdown"];

type Props = {
  timeline: TimelinePoint[];
  categories: Category[];
  categoryColors: Record<Category, string>;
  chartMaximum: number;
};

export function CategoryLines({ timeline, categories, categoryColors, chartMaximum }: Props) {
  if (timeline.length < 2 || categories.length === 0) return null;

  return (
    <svg
      className="timeline-category-lines"
      viewBox="0 0 1000 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {categories.map((category) => (
        <g key={category} className={`timeline-category-line timeline-category-line--${categoryColors[category]}`}>
          <polyline
            points={timeline
              .map((point, index) => `${((index + 0.5) / timeline.length) * 1000},${100 - (point.breakdown[category] / chartMaximum) * 100}`)
              .join(" ")}
          />
        </g>
      ))}
    </svg>
  );
}
