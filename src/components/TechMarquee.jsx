import { Sparkles } from "lucide-react";
import { usePortfolio } from "../data/PortfolioProvider";

export function TechMarquee() {
  const { marqueeItems } = usePortfolio();
  const items = [...marqueeItems, ...marqueeItems];

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {items.map((item, index) => (
          <span className="marquee-item" key={`${item}-${index}`}>
            <Sparkles size={13} />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
