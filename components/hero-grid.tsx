import { GRID, BARS } from "@/lib/grid-data";

export function HeroGrid() {
  // Map of "col,row" -> color, where row=0 is the BOTTOM of the chart.
  const colorAt = new Map<string, "red" | "green">();
  for (const bar of BARS) {
    for (let h = 0; h < bar.height; h++) {
      colorAt.set(`${bar.col},${bar.row + h}`, bar.color);
    }
  }

  const total = GRID.cols * GRID.rows;

  return (
    <div className="w-full rounded-2xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_10px_30px_rgba(0,0,0,0.06)] border border-black/5 overflow-hidden">
      {/* Browser chrome */}
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-black/5">
        <span className="size-2.5 rounded-full bg-[#ff5f57]" />
        <span className="size-2.5 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 rounded-full bg-[#28c840]" />
      </div>

      {/* Grid canvas — fluid: cells size to container via 1fr cols + aspect-ratio */}
      <div className="px-3 py-3 sm:px-4 sm:py-4 lg:px-5 lg:py-5 xl:px-6 xl:py-6 2xl:px-8 2xl:py-8">
        <div
          className="grid w-full"
          style={{
            gridTemplateColumns: `repeat(${GRID.cols}, minmax(0, 1fr))`,
            aspectRatio: `${GRID.cols} / ${GRID.rows}`,
            gap: "clamp(1px, 0.32%, 3px)",
          }}
        >
          {Array.from({ length: total }, (_, i) => {
            const col = i % GRID.cols;
            // visual row 0 = bottom; CSS grid row 0 = top → invert.
            const visualRow = GRID.rows - 1 - Math.floor(i / GRID.cols);
            const c = colorAt.get(`${col},${visualRow}`);
            const bg =
              c === "red"
                ? "var(--color-bar-red)"
                : c === "green"
                  ? "var(--color-bar-green)"
                  : "rgba(0,0,0,0.07)";
            return (
              <div
                key={i}
                style={{ background: bg, borderRadius: "18%" }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
