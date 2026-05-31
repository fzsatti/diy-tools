import { useState, useMemo } from 'react'

function parseNum(s: string): number {
  const n = parseFloat(s)
  return isNaN(n) || n <= 0 ? 0 : n
}

function fmt(n: number): string {
  return parseFloat(n.toFixed(6)).toString()
}

export default function CircleChordCalculator() {
  const [radius, setRadius] = useState('10')
  const [nrPoints, setNrPoints] = useState('6')

  const r = parseNum(radius)
  const n = Math.max(2, Math.floor(parseNum(nrPoints)))

  const chord = useMemo(() => {
    if (r <= 0 || n < 2) return 0
    return 2 * r * Math.sin(Math.PI / n)
  }, [r, n])

  const points = useMemo(() => {
    if (n < 2) return []
    const cx = 160
    const cy = 160
    const visualR = 115
    return Array.from({ length: n }, (_, i) => {
      const angle = (2 * Math.PI * i) / n - Math.PI / 2
      return {
        x: cx + visualR * Math.cos(angle),
        y: cy + visualR * Math.sin(angle),
      }
    })
  }, [n])

  const valid = r > 0 && n >= 2

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Circle Chord Calculator</h1>
        <p className="text-gray-500 text-sm mt-1">
          chord = 2 &middot; r &middot; sin(&pi; / n) — Distance between two adjacent points on a circle.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Radius (r)
            </label>
            <input
              type="number"
              value={radius}
              onChange={(e) => setRadius(e.target.value)}
              min="0"
              step="any"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm"
              placeholder="Enter radius"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Number of points (n)
            </label>
            <input
              type="number"
              value={nrPoints}
              onChange={(e) => setNrPoints(e.target.value)}
              min="2"
              step="1"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm"
              placeholder="Enter number of points"
            />
          </div>

          {valid && (
            <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-200">
              <p className="text-sm font-mono text-indigo-700">
                chord = 2 &middot; {r} &middot; sin(&pi; / {n})
              </p>
              <p className="text-xl font-bold text-indigo-600 mt-1">= {fmt(chord)}</p>
            </div>
          )}

          {!valid && (
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
              <p className="text-sm text-amber-700">
                Enter a positive radius and at least 2 points.
              </p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Preview</h3>
          <div className="flex items-center justify-center">
            <svg viewBox="0 0 320 320" className="w-full max-w-xs">
              <rect x="20" y="20" width="280" height="280" rx="12" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />

              {valid ? (
                <>
                  <circle
                    cx="160"
                    cy="160"
                    r="115"
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                    opacity="0.3"
                  />

                  <polygon
                    points={points.map((p) => `${p.x},${p.y}`).join(' ')}
                    fill="#6366f1"
                    fillOpacity="0.08"
                    stroke="#6366f1"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />

                  {points.map((p, i) => (
                    <circle key={i} cx={p.x} cy={p.y} r="4" fill="#4f46e5" />
                  ))}

                  {points.length >= 2 && (
                    <>
                      <line
                        x1={points[0].x}
                        y1={points[0].y}
                        x2={points[1].x}
                        y2={points[1].y}
                        stroke="#f59e0b"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />

                      <text
                        x={(points[0].x + points[1].x) / 2}
                        y={(points[0].y + points[1].y) / 2 - 10}
                        textAnchor="middle"
                        fill="#d97706"
                        fontSize="12"
                        fontWeight="600"
                      >
                        {fmt(chord)}
                      </text>
                    </>
                  )}

                  <line
                    x1="160"
                    y1="160"
                    x2={points[0].x}
                    y2={points[0].y}
                    stroke="#6366f1"
                    strokeWidth="1.2"
                    strokeDasharray="6 3"
                    opacity="0.5"
                  />

                  <text
                    x={(160 + points[0].x) / 2 + 14}
                    y={(160 + points[0].y) / 2}
                    textAnchor="middle"
                    fill="#6366f1"
                    fontSize="11"
                    opacity="0.7"
                  >
                    r={r}
                  </text>

                  <text
                    x="160"
                    y="290"
                    textAnchor="middle"
                    fill="#6b7280"
                    fontSize="12"
                  >
                    n = {n} points
                  </text>
                </>
              ) : (
                <text x="160" y="165" textAnchor="middle" fill="#9ca3af" fontSize="14">
                  Enter a radius and number of points
                </text>
              )}
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Formula Breakdown</h3>
        <div className="bg-gray-50 rounded-xl p-4 font-mono text-sm text-gray-700 space-y-1.5">
          <p>chord = 2 &middot; r &middot; sin(&pi; / n)</p>
          {valid && (
            <div className="text-indigo-600 mt-2 space-y-1">
              <p>
                central angle = 360&deg; / {n} = {fmt((360 / n))}&deg;
              </p>
              <p>
                half-angle = {fmt(180 / n)}&deg; = &pi; / {n} rad
              </p>
              <p>
                sin(&pi; / {n}) = {fmt(Math.sin(Math.PI / n))}
              </p>
              <p className="font-semibold mt-1">
                chord = 2 &middot; {r} &middot; {fmt(Math.sin(Math.PI / n))} = {fmt(chord)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
