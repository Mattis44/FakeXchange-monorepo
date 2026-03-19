import { useState } from "react";

const tabs = ["Positions", "Open Orders", "Trade History", "Order History"] as const;

export function AccountSummary() {
  const [active, setActive] = useState<(typeof tabs)[number]>("Positions");

  return (
    <div className="flex flex-col h-full bg-bg-secondary">
      <div className="flex border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActive(tab)}
            className={`px-4 py-2 text-xs font-medium transition-colors ${
              active === tab
                ? "text-text-primary border-b-2 border-accent"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 flex items-center justify-center text-text-disabled text-sm">
        No {active.toLowerCase()} yet
      </div>
    </div>
  );
}
