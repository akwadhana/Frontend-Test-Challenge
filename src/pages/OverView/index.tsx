import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Search from "../../assets/Search.svg"

type DateRange = { from: string; to: string };

const formatRange = (r: DateRange) => {
  const fmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });
  return `${fmt.format(new Date(r.from))} - ${fmt.format(new Date(r.to))}`;
};

const todayISO = () => new Date().toISOString().slice(0, 10);
const addDaysISO = (d: number) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + d);
  return dt.toISOString().slice(0, 10);
};

export default function OverviewEmpty({
  onCreate,
  onExport,
}: {
  onCreate?: () => void;
  onExport?: (range: DateRange) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [customOpen, setCustomOpen] = useState(false);
  const [range, setRange] = useState<DateRange>({ from: addDaysISO(-6), to: todayISO() });
  const [custom, setCustom] = useState<DateRange>(range);

  const label = useMemo(() => formatRange(range), [range]);

  const presets: Array<{ name: string; get: () => DateRange }> = [
    { name: "Today", get: () => ({ from: todayISO(), to: todayISO() }) },
    { name: "Last 7 days", get: () => ({ from: addDaysISO(-6), to: todayISO() }) },
    { name: "Last 30 days", get: () => ({ from: addDaysISO(-29), to: todayISO() }) },
    { name: "This month", get: () => {
        const now = new Date();
        const from = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
        return { from, to: todayISO() };
      }
    },
  ];

  return (
    <div className="min-h-[70vh] bg-emerald-50/20 p-4 sm:p-8">
      {/* Header row */}
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-xl font-semibold text-teal-800">Overview</h1>

          <div className="flex items-center gap-2">
            {/* Date Range dropdown */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm hover:bg-gray-50"
              >
                <CalendarIcon className="h-4 w-4 text-emerald-700" />
                <span className="hidden sm:inline">Date Range:</span>
                <span className="truncate max-w-[160px] text-gray-900">{label}</span>
                <ChevronDownIcon className="h-4 w-4 text-gray-500" />
              </button>

              {menuOpen && (
                <div
                  className="absolute right-0 z-20 mt-2 w-72 rounded-md border border-gray-200 bg-white p-2 shadow-lg"
                  onMouseLeave={() => setMenuOpen(false)}
                >
                  <div className="p-1">
                    {presets.map((p) => (
                      <button
                        key={p.name}
                        onClick={() => {
                          setRange(p.get());
                          setCustomOpen(false);
                          setMenuOpen(false);
                        }}
                        className="w-full rounded px-2 py-2 text-left text-sm hover:bg-gray-50"
                      >
                        {p.name}
                      </button>
                    ))}
                    <button
                      onClick={() => setCustomOpen((v) => !v)}
                      className="mt-1 w-full rounded px-2 py-2 text-left text-sm hover:bg-gray-50"
                    >
                      Custom…
                    </button>
                  </div>

                  {customOpen && (
                    <div className="mt-2 rounded-md border border-gray-200 p-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="mb-1 block text-xs text-gray-600">From</label>
                          <input
                            type="date"
                            value={custom.from}
                            onChange={(e) => setCustom((c) => ({ ...c, from: e.target.value }))}
                            className="w-full rounded-md border-gray-300 text-sm focus:border-emerald-600 focus:ring-emerald-600"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs text-gray-600">To</label>
                          <input
                            type="date"
                            value={custom.to}
                            onChange={(e) => setCustom((c) => ({ ...c, to: e.target.value }))}
                            className="w-full rounded-md border-gray-300 text-sm focus:border-emerald-600 focus:ring-emerald-600"
                          />
                        </div>
                      </div>
                      <div className="mt-3 flex justify-end gap-2">
                        <button
                          onClick={() => setCustomOpen(false)}
                          className="rounded-md border border-gray-300 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            if (custom.from && custom.to && custom.from <= custom.to) {
                              setRange(custom);
                              setMenuOpen(false);
                              setCustomOpen(false);
                            }
                          }}
                          className="rounded-md bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-800"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Export button */}
            <button
              onClick={() => onExport?.(range)}
              className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm hover:bg-gray-50"
            >
              <DownloadIcon className="h-4 w-4 text-emerald-700" />
              Export
            </button>
          </div>
        </div>

        {/* Empty state */}
        <div className="mx-auto flex max-w-xl flex-col items-center rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-black/5">
          <EmptyIllustration className="h-32 w-32 text-gray-300" />
          <p className="mt-6 text-sm text-gray-600">
            No activity yet. Create a new campaign to get started
          </p>
          <Link to ={"/dashboard/newcampaign"}
            onClick={() => onCreate?.()}
            className="mt-5 inline-flex items-center gap-2 rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-800"
          >
            <PlusIcon className="h-4 w-4" />
            New Campaign
          </Link>
        </div>
      </div>
    </div>
  );
}

/* Icons + simple empty illustration */
function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="1.7" />
      <path d="M16 2v4M8 2v4M3 10h18" strokeWidth="1.7" />
    </svg>
  );
}
function ChevronDownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.17l3.71-2.94a.75.75 0 111.06 1.06l-4.24 3.36a.75.75 0 01-.94 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
    </svg>
  );
}
function DownloadIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path d="M12 3v12m0 0l4-4m-4 4l-4-4" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" strokeWidth="1.7" />
    </svg>
  );
}
function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path d="M10 4a1 1 0 011 1v4h4a1 1 0 110 2h-4v4a1 1 0 11-2 0v-4H5a1 1 0 110-2h4V5a1 1 0 011-1z" />
    </svg>
  );
}
function EmptyIllustration(_props: React.SVGProps<SVGSVGElement>) {
  return (

  <img src={Search} alt="" />
   
  );
}