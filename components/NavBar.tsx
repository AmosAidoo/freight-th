import { ShipmentRow, ShipmentStats } from "@/types";
import { Button } from "./ui/button";
import { AlertCircle, CheckCircle, Download, Loader2, Zap } from "lucide-react";
import { Progress } from "./ui/progress";
import { exportResults } from "@/lib/csv";

interface NavBarProps {
	stats: ShipmentStats;
	allValid: boolean;
	isProcessing: boolean;
	processingProgress: number;
	rows: ShipmentRow[];
	processRows: () => Promise<void>;
	handleUploadNewFile: () => void;
}

const NavBar = ({
	stats,
	allValid,
	rows,
	isProcessing,
	processingProgress,
	processRows,
	handleUploadNewFile
}: NavBarProps) => {
	return (
		<div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-lg">
			<div className="px-4 sm:px-6 py-4 max-w-7xl mx-auto">
				<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3">
					<h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-0">Results Dashboard</h1>
					<Button
						variant="secondary"
						onClick={handleUploadNewFile}
					>
						Upload New File
					</Button>
				</div>

				<div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 md:gap-0">
					{/* Status Indicators */}
					<div className="flex flex-col xs:flex-row items-start xs:items-center gap-2 xs:gap-6">
						<div className="flex items-center gap-2">
							{allValid ? (
								<>
									<CheckCircle className="w-5 h-5 text-green-500" />
									<span className="text-sm font-medium text-gray-700">
										All {rows.length} rows valid
									</span>
								</>
							) : (
								<>
									<AlertCircle className="w-5 h-5 text-red-500" />
									<span className="text-sm font-medium text-gray-700">
										{stats.errorCount} validation errors found
									</span>
								</>
							)}
						</div>

						{stats.processedCount > 0 && (
							<div className="text-sm text-gray-600 font-medium">
								{stats.processedCount} processed successfully
							</div>
						)}
					</div>

					{/* Actions */}
					<div className="flex gap-3 w-full md:w-auto mt-2 md:mt-0">
						{stats.processedCount > 0 && (
							<Button
								variant="outline"
								onClick={() => exportResults(rows)}
							>
								<Download /> <span className="hidden sm:inline">Export Results</span>
							</Button>
						)}

						<Button
							variant="default"
							onClick={processRows}
							disabled={!allValid}
						>
							{!isProcessing && <Zap />}
							{isProcessing ? (
								<>
									<Loader2 className="animate-spin" />
									<span className="hidden sm:inline">Processing</span>
								</>
							) : (
								"Calculate Emissions"
							)}
						</Button>
					</div>
				</div>

				{/* Overall Progress Bar */}
				<Progress className="mt-4" value={processingProgress} />
			</div>
		</div>
	)
}

export default NavBar;