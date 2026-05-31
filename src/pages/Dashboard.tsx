import { Link } from 'react-router-dom'

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div className="text-center py-10">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3">
          DIY Tools
        </h1>
        <p className="text-gray-500 text-lg max-w-md mx-auto">
          A collection of handy calculation and utility tools for your everyday projects.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          to="/pythagoras"
          className="group bg-white rounded-2xl border border-gray-200 p-6 hover:border-indigo-300 hover:shadow-md transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
            △
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Pythagoras Calculator</h2>
          <p className="text-sm text-gray-500">
            Calculate the hypotenuse or legs of a right triangle with real-time visualization.
          </p>
        </Link>

        <Link
          to="/circle-chord"
          className="group bg-white rounded-2xl border border-gray-200 p-6 hover:border-indigo-300 hover:shadow-md transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
            ◉
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Circle Chord Calculator</h2>
          <p className="text-sm text-gray-500">
            Calculate the distance between adjacent points on a circle given the radius and number of points.
          </p>
        </Link>

        <Link
          to="/rule-of-three"
          className="group bg-white rounded-2xl border border-gray-200 p-6 hover:border-indigo-300 hover:shadow-md transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
            ∷
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Rule of Three</h2>
          <p className="text-sm text-gray-500">
            Solve proportions — given three values, find the fourth.
          </p>
        </Link>

        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-6 flex items-center justify-center">
          <p className="text-sm text-gray-400">More tools coming soon</p>
        </div>
      </div>
    </div>
  )
}
