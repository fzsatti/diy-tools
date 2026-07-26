import { useState, useMemo } from 'react'

function parseNum(s: string): number {
  const n = parseFloat(s)
  return isNaN(n) || n <= 0 ? 0 : n
}

function fmt(n: number): string {
  return parseFloat(n.toFixed(6)).toString()
}


export default function FuelConsumptionCalculator() {
  const [distance, setDistance] = useState('')
  const [consumption, setConsumption] = useState('7')
  const [gasPrice, setGasPrice] = useState('')

  const d = parseNum(distance)
  const c = parseNum(consumption)
  const p = parseNum(gasPrice)

  const liters = useMemo(() => {
    if (d <= 0 || c <= 0) return null
    return (d / 100) * c
  }, [d, c])

  const cost = useMemo(() => {
    if (liters === null || p <= 0) return null
    return liters * p
  }, [liters, p])

  const valid = d > 0 && c > 0

  const barData = useMemo(() => {
    if (!valid) return null
    const items: { km: number, liters: number, isUser: boolean }[] = []
    for (let km = 100; km <= d; km += 100) {
      const exact = Math.abs(km - d) < 0.5
      items.push({ km, liters: (km / 100) * c, isUser: exact })
    }
    const lastExact = items.length > 0 && items[items.length - 1].isUser
    if (!lastExact || items.length === 0) {
      items.push({ km: d, liters: liters!, isUser: true })
    }
    const maxL = Math.max(...items.map((it) => it.liters))
    return { items, maxL }
  }, [valid, d, c, liters])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Fuel Consumption Calculator</h1>
        <p className="text-gray-500 text-sm mt-1">
          liters = (distance / 100) &middot; consumption — Calculate fuel needed for your trip.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Distance (km)
            </label>
            <input
              type="number"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              min="0"
              step="any"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm"
              placeholder="Enter trip distance"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Consumption (L/100km)
            </label>
            <input
              type="number"
              value={consumption}
              onChange={(e) => setConsumption(e.target.value)}
              min="0"
              step="any"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm"
              placeholder="Enter vehicle consumption"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Gas price (per liter) — <span className="text-gray-400">optional</span>
            </label>
            <input
              type="number"
              value={gasPrice}
              onChange={(e) => setGasPrice(e.target.value)}
              min="0"
              step="any"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm"
              placeholder="Enter gas price per liter"
            />
          </div>

          {valid && (
            <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-200">
              <p className="text-sm font-mono text-indigo-700">
                ({d} / 100) &middot; {c}
              </p>
              <p className="text-xl font-bold text-indigo-600 mt-1">
                = {fmt(liters!)} L
              </p>
              {cost !== null && (
                <p className="text-sm font-semibold text-indigo-500 mt-1.5">
                  Total cost = {fmt(cost)}
                </p>
              )}
            </div>
          )}

          {!valid && (
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
              <p className="text-sm text-amber-700">
                Enter distance and consumption to calculate fuel usage.
              </p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Trip Comparison</h3>
          <div className="flex items-center justify-center">
            <svg viewBox="0 0 320 280" className="w-full">
              <rect x="20" y="20" width="280" height="240" rx="12" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />

              {barData ? (
                <>
                  <line x1="30" y1="230" x2="290" y2="230" stroke="#e2e8f0" strokeWidth="1" />

                  {barData.items.map((item, i) => {
                    const barW = 280 / Math.max(barData.items.length, 1) - 16
                    const x = 48 + i * (barW + 16)
                    const h = (item.liters / barData.maxL) * 190
                    const y = 230 - h
                    const color = item.isUser ? '#6366f1' : '#d1d5db'

                    return (
                      <g key={item.km}>
                        <rect
                          x={x}
                          y={y}
                          width={barW}
                          height={h}
                          rx="4"
                          fill={color}
                        />
                        <text
                          x={x + barW / 2}
                          y={y - 6}
                          textAnchor="middle"
                          fill={item.isUser ? '#4f46e5' : '#94a3b8'}
                          fontSize="11"
                          fontWeight={item.isUser ? '600' : '400'}
                        >
                          {fmt(item.liters)} L
                        </text>
                        <text
                          x={x + barW / 2}
                          y="250"
                          textAnchor="middle"
                          fill={item.isUser ? '#4f46e5' : '#94a3b8'}
                          fontSize="10"
                          fontWeight={item.isUser ? '600' : '400'}
                        >
                          {item.km} km
                        </text>
                      </g>
                    )
                  })}
                </>
              ) : (
                <text x="160" y="150" textAnchor="middle" fill="#9ca3af" fontSize="14">
                  Enter values to see the comparison
                </text>
              )}
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Formula Breakdown</h3>
        <div className="bg-gray-50 rounded-xl p-4 font-mono text-sm text-gray-700 space-y-1.5">
          <p>fuel (L) = (distance (km) / 100) &middot; consumption (L/100km)</p>
          <p className="text-gray-400 text-xs mt-2">Cost (if gas price is given):</p>
          <p className="text-gray-500">cost = fuel (L) &middot; gas price (per L)</p>

          {valid && (
            <div className="text-indigo-600 mt-3 space-y-1">
              <p>fuel = ({d} / 100) &middot; {c}</p>
              <p>fuel = {fmt(d / 100)} &middot; {c}</p>
              <p className="font-semibold">fuel = {fmt(liters!)} L</p>
              {cost !== null && (
                <>
                  <p className="mt-2">cost = {fmt(liters!)} &middot; {p}</p>
                  <p className="font-semibold">cost = {fmt(cost)}</p>
                </>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

