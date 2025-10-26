import { Upload } from "lucide-react";
import { Input } from "./ui/input"
import { REQUIRED_FIELDS } from "@/lib/constants";

interface CsvUploadProps {
	handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const CsvUpload = ({ handleFileUpload }: CsvUploadProps) => {
	return (
		<div className="min-h-screen bg-gray-50 p-4 sm:p-8">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Freight Shipment Footprint</h1>
				<div className="bg-white rounded-xl shadow-lg border p-8 sm:p-12 text-center">
					<Upload className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4" />
					<h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">Upload CSV</h2>
					<Input
						className="max-w-sm"
						id="file-upload"
						type="file"
						onChange={handleFileUpload}
						accept=".csv"
					/>
					<div className="mt-10 text-left max-w-md mx-auto">
						<p className="text-sm font-semibold text-gray-700 mb-2">Required fields for processing:</p>
						<div className="bg-gray-100 rounded-lg p-4 text-sm font-mono text-gray-700 space-y-1">
							{REQUIRED_FIELDS.map(f => <div key={f.key}>• {f.label}</div>)}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default CsvUpload;