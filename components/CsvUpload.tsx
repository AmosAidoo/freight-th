import { Input } from "./ui/input"

interface CsvUploadProps {
	handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const CsvUpload = ({ handleFileUpload }: CsvUploadProps) => {
	return (
		<div className="min-h-screen bg-gray-50 p-4 sm:p-8">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Freight Shipment Footprint</h1>
				<div className="bg-white rounded-xl shadow-lg border p-8 sm:p-12 text-center">
					<h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">Upload CSV</h2>
					<Input
						id="file-upload"
						type="file"
						onChange={handleFileUpload}
						accept=".csv"
					/>
				</div>
			</div>
		</div>
	)
}

export default CsvUpload;