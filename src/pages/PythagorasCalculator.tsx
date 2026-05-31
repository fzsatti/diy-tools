import { useState, useCallback, useMemo } from 'react'

type Side = 'a' | 'b' | 'c'

function parseNum(s: string): number {
  const n = parseFloat(s)
  return isNaN(n) || n <= 0 ? 0 : n
}

function fmt(n: number): string {
  return parseFloat(n.toFixed(6)).toString()
}

export default function PythagorasCalculator() {
  const [sideA, setSideA] = useState('3')
  const [sideB, setSideB] = useState('4')
  const [sideC, setSideC] = useState('')

  const a = parseNum(sideA)
  const b = parseNum(sideB)
  const c = parseNum(sideC)

  const handleChange = useCallback((field: Side, raw: string) => {
    if (field === 'a') {
      setSideA(raw)
      const newA = parseNum(raw)
      if (newA > 0) {
        if (b > 0) {
          setSideC(fmt(Math.sqrt(newA * newA + b * b)))
        } else if (c > 0 && c > newA) {
          setSideB(fmt(Math.sqrt(c * c - newA * newA)))
        }
      }
    } else if (field === 'b') {
      setSideB(raw)
      const newB = parseNum(raw)
      if (newB > 0) {
        if (a > 0) {
          setSideC(fmt(Math.sqrt(a * a + newB * newB)))
        } else if (c > 0 && c > newB) {
          setSideA(fmt(Math.sqrt(c * c - newB * newB)))
        }
      }
    } else {
      setSideC(raw)
      const newC = parseNum(raw)
      if (newC > 0) {
        if (a > 0 && newC > a) {
          setSideB(fmt(Math.sqrt(newC * newC - a * a)))
        } else if (b > 0 && newC > b) {
          setSideA(fmt(Math.sqrt(newC * newC - b * b)))
        }
      }
    }
  }, [a, b, c])

  const triangle = useMemo(() => {
    const legs = [a, b].filter((v) => v > 0)
    const hyp = c > 0 ? c : (legs.length === 2 ? Math.sqrt(legs[0] * legs[0] + legs[1] * legs[1]) : 0)

    const legA = a > 0 ? a : (b > 0 && c > 0 && c > b ? Math.sqrt(c * c - b * b) : 0)
    const legB = b > 0 ? b : (a > 0 && c > 0 && c > a ? Math.sqrt(c * c - a * a) : 0)
    const legC = hyp

    if (legA <= 0 || legB <= 0 || legC <= 0) return null

    const maxSide = Math.max(legA, legB, legC)
    const scale = 260 / maxSide
    const ax = 30
    const ay = 260
    const bx = ax + legA * scale
    const by = ay
    const cx = ax
    const cy = ay - legB * scale

    return { ax, ay, bx, by, cx, cy, aScaled: legA * scale, bScaled: legB * scale, cScaled: legC * scale, legA, legB, legC }
  }, [a, b, c])

  const info = useMemo(() => {
    const count = [a, b, c].filter((v) => v > 0).length
    let formula = ''
    let result = ''

    if (a > 0 && b > 0) {
      const hyp = Math.sqrt(a * a + b * b)
      formula = `c = √(${a}² + ${b}²)`
      result = fmt(hyp)
    } else if (a > 0 && c > 0 && c > a) {
      const leg = Math.sqrt(c * c - a * a)
      formula = `b = √(${c}² − ${a}²)`
      result = fmt(leg)
    } else if (b > 0 && c > 0 && c > b) {
      const leg = Math.sqrt(c * c - b * b)
      formula = `a = √(${c}² − ${b}²)`
      result = fmt(leg)
    }

    return { count, formula, result }
  }, [a, b, c])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pythagoras Calculator</h1>
        <p className="text-gray-500 text-sm mt-1">
          a² + b² = c² — Enter any two sides to compute the third.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Side a (leg)
            </label>
            <input
              type="number"
              value={sideA}
              onChange={(e) => handleChange('a', e.target.value)}
              min="0"
              step="any"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm"
              placeholder="Enter leg a"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Side b (leg)
            </label>
            <input
              type="number"
              value={sideB}
              onChange={(e) => handleChange('b', e.target.value)}
              min="0"
              step="any"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm"
              placeholder="Enter leg b"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Side c (hypotenuse)
            </label>
            <input
              type="number"
              value={sideC}
              onChange={(e) => handleChange('c', e.target.value)}
              min="0"
              step="any"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm"
              placeholder="Enter hypotenuse c"
            />
          </div>

          {info.count === 2 && info.result && (
            <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-200">
              <p className="text-sm font-mono text-indigo-700">{info.formula}</p>
              <p className="text-xl font-bold text-indigo-600 mt-1">= {info.result}</p>
            </div>
          )}

          {info.count === 3 && (
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
              <p className="text-sm text-amber-700">
                All three sides are set. Edit any side to recalculate — the triangle will update automatically.
              </p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Triangle Preview</h3>
          <div className="flex items-center justify-center">
            <svg viewBox="0 0 320 320" className="w-full max-w-xs">
              <rect x="20" y="20" width="280" height="280" rx="12" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />

              {triangle ? (
                <>
                  <rect
                    x={triangle.ax - 5}
                    y={triangle.cy - 5}
                    width="10"
                    height="10"
                    rx="2"
                    transform={`rotate(45 ${triangle.ax} ${triangle.cy})`}
                    fill="#4f46e5"
                    opacity="0.15"
                  />

                  <polygon
                    points={`${triangle.ax},${triangle.ay} ${triangle.bx},${triangle.by} ${triangle.cx},${triangle.cy}`}
                    fill="#6366f1"
                    fillOpacity="0.15"
                    stroke="#6366f1"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                  />

                  <circle cx={triangle.ax} cy={triangle.ay} r="5" fill="#6366f1" />
                  <circle cx={triangle.bx} cy={triangle.by} r="5" fill="#6366f1" />
                  <circle cx={triangle.cx} cy={triangle.cy} r="5" fill="#4f46e5" />

                  <text
                    x={triangle.ax + triangle.aScaled / 2}
                    y={triangle.ay + 18}
                    textAnchor="middle"
                    className="text-xs fill-gray-600"
                    fontSize="13"
                    fontWeight="500"
                  >
                    a={triangle.legA}
                  </text>

                  <text
                    x={triangle.ax - 18}
                    y={triangle.ay - triangle.bScaled / 2}
                    textAnchor="middle"
                    className="text-xs fill-gray-600"
                    fontSize="13"
                    fontWeight="500"
                    transform={`rotate(-90 ${triangle.ax - 18} ${triangle.ay - triangle.bScaled / 2})`}
                  >
                    b={triangle.legB}
                  </text>

                  <text
                    x={triangle.ax + triangle.cScaled / 3}
                    y={triangle.ay - triangle.bScaled / 3 - 8}
                    textAnchor="middle"
                    className="text-xs fill-indigo-600"
                    fontSize="13"
                    fontWeight="600"
                  >
                    c={triangle.legC.toFixed(2)}
                  </text>
                </>
              ) : (
                <text
                  x="160"
                  y="165"
                  textAnchor="middle"
                  className="fill-gray-400"
                  fontSize="14"
                >
                  Enter at least two sides
                </text>
              )}
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Pythagorean Theorem</h3>
        <div className="bg-gray-50 rounded-xl p-4 font-mono text-sm text-gray-700 space-y-1.5">
          <p>a² + b² = c² &nbsp;&nbsp;<span className="text-gray-400">(where c is the hypotenuse)</span></p>
          <div className="text-gray-500 space-y-1 mt-2">
            {a > 0 && <p>a = {a}{b > 0 && c > 0 ? `, a² = ${(a * a)}` : ''}</p>}
            {b > 0 && <p>b = {b}{a > 0 && c > 0 ? `, b² = ${(b * b)}` : ''}</p>}
            {c > 0 && <p>c = {c}{a > 0 && b > 0 ? `, c² = ${(c * c).toFixed(6)}` : ''}</p>}
          </div>
          {a > 0 && b > 0 && (
            <p className="text-indigo-600 mt-2">
              {a}² + {b}² = {a * a} + {b * b} = {a * a + b * b} &nbsp;|&nbsp; c² = {Math.sqrt(a * a + b * b).toFixed(6)}²
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
