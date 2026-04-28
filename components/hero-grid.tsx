import { GRID, BARS, type Bar } from "@/lib/grid-data";

const CELL = 11; // px

export function HeroGrid() {
  const widthPx = GRID.cols * CELL;
  const heightPx = GRID.rows * CELL;

  return (
    <div className="rounded-2xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.06)] border border-black/5 overflow-hidden">
      {/* Browser chrome */}
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-black/5">
        <span className="size-2.5 rounded-full bg-[#ff5f57]" />
        <span className="size-2.5 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 rounded-full bg-[#28c840]" />
      </div>

      {/* Grid canvas */}
      <div
        className="relative mx-auto my-6"
        style={{ width: widthPx, height: heightPx }}
      >
        {/* Dotted cell grid */}
        <div
          className="absolute inset-0 grid"
          style={{
            gridTemplateColumns: `repeat(${GRID.cols}, ${CELL}px)`,
            gridTemplateRows: `repeat(${GRID.rows}, ${CELL}px)`,
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
  const left = bar.col * CELL;
  const bottom = bar.row * CELL;
  const width = CELL - 2;
  const height = bar.height * CELL - 2;
  const bg = bar.color === "red" ? "var(--color-bar-red)" : "var(--color-bar-green)";
  return (
    <span
      className="absolute rounded-[2px]"
      style={{ left, bottom, width, height, background: bg }}
    />
  );
}
