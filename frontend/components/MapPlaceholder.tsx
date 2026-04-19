export function MapPlaceholder() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-900/5 p-6 shadow-soft">
      <div className="flex h-72 flex-col justify-center rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8 text-white shadow-xl">
        <p className="text-sm uppercase tracking-[0.4em] text-slate-400">Live Map Integration</p>
        <h2 className="mt-6 text-3xl font-semibold leading-tight">Map & Route Planning</h2>
        <p className="mt-4 max-w-xl text-slate-300">
          Placeholder for a full map experience. Connect this section to map SDKs like Mapbox or Leaflet.
        </p>
      </div>
    </div>
  );
}
