import { ReactNode } from "react";

interface PokedexFrameProps {
  children: ReactNode;
  rightScreen?: ReactNode;
}

export function PokedexFrame({ children, rightScreen }: PokedexFrameProps) {
  return (
    <div className="flex items-center justify-center h-screen w-screen bg-slate-950 p-2 md:p-4 overflow-hidden font-mono">
      <div className="relative w-full h-full max-w-7xl bg-gradient-to-br from-red-500 via-red-600 to-red-700 rounded-3xl shadow-[10px_10px_0px_#7f1d1d,20px_20px_50px_rgba(0,0,0,0.7)] border-4 border-red-800 flex flex-col md:flex-row overflow-hidden">
        <div className="absolute top-4 left-4 flex gap-2 z-10">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-sky-100 rounded-full border-[5px] border-white shadow-[0_0_15px_rgba(56,189,248,0.8)] flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/50 to-transparent"></div>
            <div className="w-8 h-8 md:w-10 md:h-10 bg-sky-400 rounded-full animate-pulse shadow-[0_0_20px_#38bdf8]"></div>
          </div>
          <div className="flex gap-2 mt-1 pl-2">
            <div className="w-4 h-4 md:w-5 md:h-5 bg-red-500 rounded-full border-2 border-red-900 shadow-[0_0_8px_#ef4444]"></div>
            <div className="w-4 h-4 md:w-5 md:h-5 bg-yellow-400 rounded-full border-2 border-yellow-700 shadow-[0_0_8px_#facc15]"></div>
            <div className="w-4 h-4 md:w-5 md:h-5 bg-green-500 rounded-full border-2 border-green-800 shadow-[0_0_8px_#22c55e]"></div>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-4 pt-20 md:p-6 md:pt-28 flex flex-col h-full relative">
          <div className="flex-grow min-h-0 bg-slate-800 rounded-xl border-4 border-slate-700 p-2 md:p-3 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] flex flex-col relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[size:4px_4px] pointer-events-none z-10 opacity-50"></div>
            <div className="flex-grow overflow-y-auto custom-scrollbar bg-slate-900 rounded p-2 relative z-20">
              {children}
            </div>
          </div>

          <div className="flex justify-between items-center mt-4 h-12 md:h-16 shrink-0 relative z-10">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-slate-900 rounded-full border-4 border-slate-800 shadow-[0_4px_0_#0f172a] relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-3 bg-slate-700 rounded"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-8 bg-slate-700 rounded"></div>
            </div>
            <div className="flex gap-3">
              <div className="w-12 h-3 bg-red-500 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] border border-red-700"></div>
              <div className="w-12 h-3 bg-sky-500 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] border border-sky-700"></div>
            </div>
          </div>
        </div>

        <div className="hidden md:flex flex-col items-center justify-center w-8 shrink-0 bg-gradient-to-r from-red-600 via-red-500 to-red-700 border-l-2 border-r-2 border-red-800/50 relative z-10">
          <div className="w-full h-1 border-b-2 border-red-800/30 my-8"></div>
          <div className="w-full h-1 border-b-2 border-red-800/30 my-8"></div>
          <div className="w-full h-1 border-b-2 border-red-800/30 my-8"></div>
        </div>

        <div className="hidden md:flex w-1/2 p-6 pt-28 flex-col h-full relative">
          <div className="flex-grow min-h-0 bg-slate-950 rounded-xl border-4 border-slate-800 shadow-[inset_0_0_30px_rgba(0,0,0,0.8)] flex flex-col relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none z-0"></div>

            <div className="absolute inset-0 overflow-y-auto custom-scrollbar p-4 z-10">
              {rightScreen ? (
                rightScreen
              ) : (
                <div className="h-full w-full flex flex-col items-center justify-center text-sky-500 animate-pulse">
                  <svg
                    className="w-16 h-16 mb-4 opacity-50"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 2c4.08 0 7.45 3.05 7.94 7h-4.06c-.44-1.73-2.01-3-3.88-3s-3.44 1.27-3.88 3H4.06C4.55 7.05 7.92 4 12 4zm0 16c-4.08 0-7.45-3.05-7.94-7h4.06c.44 1.73 2.01 3 3.88 3s3.44-1.27 3.88-3h4.06c-.49 3.95-3.86 7-7.94 7zm0-10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                  </svg>
                  <p>&gt; POKÉDEX_OS v2.0</p>
                  <p>&gt; WAITING FOR INPUT...</p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-5 gap-2 mt-6 shrink-0 z-10">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="h-10 md:h-12 bg-sky-500 rounded border border-sky-400 shadow-[0_4px_0_#0284c7]"
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
