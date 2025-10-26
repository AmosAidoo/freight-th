import type { ShipmentRow } from "@/types";
import { AlertCircle } from "lucide-react";

const ValidationSummary = ({ rows }: { rows: ShipmentRow[] }) => {
	const errorRows = rows.filter(r => r._validationErrors);
	if (errorRows.length === 0) return null;

	// Aggregate errors by type/field
	const fieldErrorCounts = errorRows.reduce((acc, row) => {
		Object.keys(row._validationErrors || {}).forEach(field => {
			acc[field] = (acc[field] || 0) + 1;
		});
		return acc;
	}, {} as Record<string, number>);

	return (
		<div className="mx-4 sm:mx-6 mt-6 bg-red-100 border border-red-300 text-red-800 rounded-xl p-4 shadow-md transition-all duration-300">
			<h2 className="text-lg font-bold flex items-center gap-2 mb-3">
				<AlertCircle className="w-5 h-5" />
				{errorRows.length} Rows with Validation Errors
			</h2>
			<div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
				{Object.entries(fieldErrorCounts).map(([field, count]) => (
					<div key={field} className="font-medium">
						<span className="font-mono text-red-900 bg-red-200 px-2 py-0.5 rounded-full text-xs mr-1">{field}</span>
						({count} issues)
					</div>
				))}
			</div>
			<p className="text-sm mt-3">Please fix the highlighted cells in the table to enable processing.</p>
		</div>
	);
};

export default ValidationSummary;