import { useState, useCallback } from 'react'

type Field = 'a' | 'b' | 'c' | 'x'

function parseNum(s: string): number {
  const n = parseFloat(s)
  return isNaN(n) ? 0 : n
}

function fmt(n: number): string {
  return parseFloat(n.toFixed(6)).toString()
}

export default function RuleOfThree() {
  const [valueA, setValueA] = useState('2')
  const [valueB, setValueB] = useState('')
  const [valueC, setValueC] = useState('6')
  const [valueX, setValueX] = useState('')

  const a = parseNum(valueA)
  const b = parseNum(valueB)
  const c = parseNum(valueC)
  const x = parseNum(valueX)

  const handleChange = useCallback((field: Field, raw: string) => {
    const vals = { a: valueA, b: valueB, c: valueC, x: valueX } as Record<Field, string>
    vals[field] = raw
    const nums = {
      a: parseNum(vals.a),
      b: parseNum(vals.b),
      c: parseNum(vals.c),
      x: parseNum(vals.x),
    }
    const filled = (['a', 'b', 'c', 'x'] as Field[]).filter((k) => nums[k] > 0)

    if (field === 'a') {
      setValueA(raw)
      if (nums.a > 0) {
        if (filled.length === 4) return
        if (nums.b > 0 && nums.c > 0) setValueX(fmt((nums.c * nums.b) / nums.a))
        else if (nums.b > 0 && nums.x > 0) setValueC(fmt((nums.a * nums.x) / nums.b))
        else if (nums.c > 0 && nums.x > 0) setValueB(fmt((nums.a * nums.x) / nums.c))
      }
    } else if (field === 'b') {
      setValueB(raw)
      if (nums.b > 0) {
        if (filled.length === 4) return
        if (nums.a > 0 && nums.c > 0) setValueX(fmt((nums.c * nums.b) / nums.a))
        else if (nums.a > 0 && nums.x > 0) setValueC(fmt((nums.a * nums.x) / nums.b))
        else if (nums.c > 0 && nums.x > 0) setValueA(fmt((nums.c * nums.b) / nums.x))
      }
    } else if (field === 'c') {
      setValueC(raw)
      if (nums.c > 0) {
        if (filled.length === 4) return
        if (nums.a > 0 && nums.b > 0) setValueX(fmt((nums.c * nums.b) / nums.a))
        else if (nums.a > 0 && nums.x > 0) setValueB(fmt((nums.a * nums.x) / nums.c))
        else if (nums.b > 0 && nums.x > 0) setValueA(fmt((nums.c * nums.b) / nums.x))
      }
    } else {
      setValueX(raw)
      if (nums.x > 0) {
        if (filled.length === 4) return
        if (nums.a > 0 && nums.b > 0) setValueC(fmt((nums.a * nums.x) / nums.b))
        else if (nums.a > 0 && nums.c > 0) setValueB(fmt((nums.a * nums.x) / nums.c))
        else if (nums.b > 0 && nums.c > 0) setValueA(fmt((nums.c * nums.b) / nums.x))
      }
    }
  }, [valueA, valueB, valueC, valueX])

  const filled = [a, b, c, x].filter((v) => v > 0).length
  const valid = filled >= 3

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Rule of Three</h1>
        <p className="text-gray-500 text-sm mt-1">
          A : B = C : X — Enter any three values to compute the fourth.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5 max-w-lg">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">A</label>
            <input
              type="number"
              value={valueA}
              onChange={(e) => handleChange('a', e.target.value)}
              min="0"
              step="any"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm"
              placeholder="Enter A"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">B</label>
            <input
              type="number"
              value={valueB}
              onChange={(e) => handleChange('b', e.target.value)}
              min="0"
              step="any"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm"
              placeholder="Enter B"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">C</label>
            <input
              type="number"
              value={valueC}
              onChange={(e) => handleChange('c', e.target.value)}
              min="0"
              step="any"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm"
              placeholder="Enter C"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">X</label>
            <input
              type="number"
              value={valueX}
              onChange={(e) => handleChange('x', e.target.value)}
              min="0"
              step="any"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm"
              placeholder="Enter X"
            />
          </div>
        </div>

        {valid && (
          <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-200 text-sm font-mono">
            <p className="text-indigo-700">
              {a > 0 && b > 0 && c > 0 && x > 0 && (
                <>
                  {a} : {b} = {c} : {x}
                </>
              )}
              {a > 0 && b > 0 && c > 0 && !x && (
                <>X = ({c} &middot; {b}) / {a} = {fmt((c * b) / a)}</>
              )}
              {a > 0 && b > 0 && !c && x > 0 && (
                <>C = ({a} &middot; {x}) / {b} = {fmt((a * x) / b)}</>
              )}
              {a > 0 && !b && c > 0 && x > 0 && (
                <>B = ({a} &middot; {x}) / {c} = {fmt((a * x) / c)}</>
              )}
              {!a && b > 0 && c > 0 && x > 0 && (
                <>A = ({c} &middot; {b}) / {x} = {fmt((c * b) / x)}</>
              )}
            </p>
          </div>
        )}

        {!valid && (
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
            <p className="text-sm text-amber-700">
              Fill any three values to calculate the fourth.
            </p>
          </div>
        )}

        {filled === 4 && (
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
            <p className="text-sm text-amber-700">
              All four values are set. Edit any to recalculate.
            </p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 max-w-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Formula</h3>
        <div className="bg-gray-50 rounded-xl p-4 font-mono text-sm text-gray-700 space-y-1.5">
          <p>A : B = C : X</p>
          <p className="text-gray-400 text-xs mt-2">Equivalent forms:</p>
          <ul className="text-gray-500 list-disc list-inside space-y-0.5">
            <li>X = C &middot; B / A</li>
            <li>C = A &middot; X / B</li>
            <li>B = A &middot; X / C</li>
            <li>A = C &middot; B / X</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
