import { ShipmentStats } from "@/types";

interface ProcessingSummaryProps {
	stats: ShipmentStats
}

const ProcessingSummary = ({ stats }: ProcessingSummaryProps) => {
	return (
		<div className="mx-4 sm:mx-6 mt-6 bg-white border border-gray-200 rounded-xl p-6 shadow-md">
			<h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Processing Summary</h2>
			<div className="grid sm:grid-cols-2 md:grid-cols-5 gap-4">
				<div className="rounded-xl p-4 shadow">
					<div className="text-3xl font-extrabold">{stats.totalRows}</div>
					<div className="text-sm text-gray-600">Total Shipments</div>
				</div>
				<div className="rounded-xl p-4 shadow">
					<div className="text-3xl font-extrabold">{stats.totalEmissions.toFixed(1)} kg</div>
					<div className="text-sm text-gray-600">Total CO₂e</div>
				</div>
				<div className="rounded-xl p-4 shadow">
					<div className="text-3xl font-extrabold">{stats.avgEmissions.toFixed(1)} kg</div>
					<div className="text-sm text-gray-600">Avg per Shipment</div>
				</div>
				<div className="md:col-span-2 rounded-xl p-4 shadow">
					<h3 className="font-semibold text-gray-700 mb-2">Emissions Breakdown by Mode</h3>
					<div className="flex flex-wrap gap-4">
						{Object.entries(stats.emissionsByMode).map(([mode, emissions]) => (
							<div key={mode} className="flex flex-col items-start">
								<span className="text-lg font-bold text-gray-900">{emissions.toFixed(1)} kg</span>
								<span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">{mode}</span>
							</div>
						))}
					</div>
				</div>
				{stats.topRoute && (
					<div className="sm:col-span-2 rounded-xl p-4 shadow">
						<h3 className="font-semibold text-gray-700 mb-2">Top Route</h3>
						<div>
							<div className="text-sm text-gray-600">{stats.topRoute.route}</div>
							<div className="text-lg font-semibold">
								{stats.topRoute.emissions.toFixed(2)} kg CO₂e
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

export default ProcessingSummary;