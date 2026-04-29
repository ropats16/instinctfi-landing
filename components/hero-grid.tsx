import { GRID, BARS, type Bar } from "@/lib/grid-data";

// Cell size is driven by the `--cell` CSS variable (default 11px).
// Override per breakpoint at the wrapper to scale the grid responsively.
const CELL_VAR = "var(--cell, 11px)";

export function HeroGrid() {
  return (
    <div className="rounded-2xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.06)] border border-black/5 overflow-hidden inline-block">
      {/* Browser chrome */}
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-black/5">
        <span className="size-2.5 rounded-full bg-[#ff5f57]" />
        <span className="size-2.5 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 rounded-full bg-[#28c840]" />
      </div>

      {/* Grid canvas */}
      <div
        className="relative mx-auto my-6"
        style={{
          width: `calc(${GRID.cols} * ${CELL_VAR})`,
          height: `calc(${GRID.rows} * ${CELL_VAR})`,
        }}
      >
        {/* Dotted cell grid */}
        <div
          className="absolute inset-0 grid"
          style={{
            gridTemplateColumns: `repeat(${GRID.cols}, ${CELL_VAR})`,
            gridTemplateRows: `repeat(${GRID.rows}, ${CELL_VAR})`,
          }}
        >
          {Array.from({ length: GRID.cols * GRID.rows }, (_, i) => {
            const col = i % GRID.cols;
            const row = Math.floor(i / GRID.cols);
            return (
              <div
                key={i}
                data-col={col}
                data-row={row}
                className="flex items-center justify-center"
              >
                <span className="size-[2px] rounded-full bg-black/15" />
              </div>
            );
          })}
        </div>

        {/* Bars */}
        {BARS.map((bar, i) => (
          <BarShape key={i} bar={bar} />
        ))}
      </div>
    </div>
  );
}

function BarShape({ bar }: { bar: Bar }) {
  const bg = bar.color === "red" ? "var(--color-bar-red)" : "var(--color-bar-green)";
  return (
    <span
      className="absolute rounded-[2px]"
      style={{
        left: `calc(${bar.col} * ${CELL_VAR})`,
        bottom: `calc(${bar.row} * ${CELL_VAR})`,
        width: `calc(${CELL_VAR} - 2px)`,
        height: `calc(${bar.height} * ${CELL_VAR} - 2px)`,
        background: bg,
      }}
    />
  );
}
