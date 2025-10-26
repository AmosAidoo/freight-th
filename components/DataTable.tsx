import { VALID_MODES } from "@/lib/constants";
import { ColumnFiltersState, createColumnHelper, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable } from "@tanstack/react-table";
import { Loader2, CheckCircle, AlertCircle, ChevronDown } from "lucide-react";
import { useState } from "react";
import CellRenderer from "./CellRenderer";
import { Shipment, ShipmentMode, ShipmentRow } from "@/types";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { validateRow } from "@/lib/validation";

const columnHelper = createColumnHelper<ShipmentRow>();

interface DataTableProps {
	rows: ShipmentRow[];
	setRows: React.Dispatch<React.SetStateAction<ShipmentRow[]>>;
}

const DataTable = ({ rows, setRows }: DataTableProps) => {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10,
	});
	const [editValue, setEditValue] = useState("");
	const [editingCell, setEditingCell] = useState<{ rowIndex: number; field: string } | null>(null);

	const columns = [
		columnHelper.accessor("_status", {
			header: "Status",
			cell: ({ getValue, row }) => {
				const value = getValue();
				const err = row.original._validationErrors;

				if (value === "processing") return <Loader2 className="w-4 h-4 animate-spin text-blue-600 mx-auto" />;
				if (value === "success") return <CheckCircle className="w-4 h-4 text-green-600 mx-auto" />;
				if (value === "error") return <AlertCircle className="w-4 h-4 text-red-600 mx-auto" />;
				if (err) return <AlertCircle className="w-4 h-4 text-red-600 mx-auto" />;
				return <div className="w-4 h-4 bg-gray-200 rounded-full mx-auto" />;
			},
			enableSorting: false,
			enableColumnFilter: true,
			filterFn: "includesString",
		}),

		columnHelper.accessor("shipment_id", {
			header: "ID",
			cell: (info) => (
				<CellRenderer
					row={info.row.original}
					field="shipment_id"
					editingCell={editingCell}
					editValue={editValue}
					handleOpenEdit={handleOpenEdit}
					handleCellEdit={handleCellEdit}
					type="text"
				/>
			),
			enableSorting: false,
		}),

		columnHelper.accessor("origin_address", {
			header: "Origin",
			cell: (info) => (
				<CellRenderer
					row={info.row.original}
					field="origin_address"
					editingCell={editingCell}
					editValue={editValue}
					handleOpenEdit={handleOpenEdit}
					handleCellEdit={handleCellEdit}
					type="text"
				/>
			),
			enableSorting: false,
		}),

		columnHelper.accessor("destination_address", {
			header: "Destination",
			cell: (info) => (
				<CellRenderer
					row={info.row.original}
					field="destination_address"
					editingCell={editingCell}
					editValue={editValue}
					handleOpenEdit={handleOpenEdit}
					handleCellEdit={handleCellEdit}
					type="text"
				/>
			),
			enableSorting: false,
		}),

		columnHelper.accessor("mode", {
			header: "Mode",
			cell: (info) => (
				<CellRenderer
					row={info.row.original}
					field="mode"
					editingCell={editingCell}
					editValue={editValue}
					handleOpenEdit={handleOpenEdit}
					handleCellEdit={handleCellEdit}
					type="select"
					options={VALID_MODES}
				/>
			),
			enableSorting: false,
			enableColumnFilter: true,
			filterFn: (row, columnId, filterValue) => {
				return filterValue.length === 0 || filterValue.includes(row.getValue(columnId));
			},
		}),

		columnHelper.accessor("weight_kg", {
			header: "Weight (kg)",
			cell: (info) => (
				<CellRenderer
					row={info.row.original}
					field="weight_kg"
					editingCell={editingCell}
					editValue={editValue}
					handleOpenEdit={handleOpenEdit}
					handleCellEdit={handleCellEdit}
					type="number"
				/>
			),
			enableSorting: true,
		}),

		columnHelper.accessor("_emissions", {
			header: "CO₂e (kg)",
			cell: (info) => {
				const val = info.getValue();
				return val
					? <span>{val.toFixed(2)} kg</span>
					: "—";
			},
			enableSorting: false,
		}),

		columnHelper.accessor("_error", {
			header: "Error",
			cell: (info) => {
				const error = info.getValue() as string | undefined;
				if (!error) return "—";

				return (
					<Tooltip>
						<TooltipTrigger asChild>
							<span className="text-red-600 text-xs cursor-pointer block max-w-[150px] truncate">
								{error}
							</span>
						</TooltipTrigger>
						<TooltipContent>
							<p className="max-w-xs wrap-break-word">{error}</p>
						</TooltipContent>
					</Tooltip>
				);
			},
			enableSorting: false,
		}),

	];

	const table = useReactTable({
		data: rows,
		columns,
		state: { sorting, columnFilters, pagination },
		onColumnFiltersChange: setColumnFilters,
		onPaginationChange: setPagination,
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});

	const handleOpenEdit = (rowIndex: number, field: keyof Shipment, currentValue: string | number | undefined) => {
		if (rows.find(r => r._rowIndex === rowIndex)?._status !== "processing") {
			setEditingCell({ rowIndex, field });
			setEditValue(String(currentValue || ""));
		}
	};

	const handleCellEdit = (rowIndex: number, field: keyof Shipment, value: string) => {
		const updatedRows = [...rows];
		const row = updatedRows.find(r => r._rowIndex === rowIndex);
		if (!row) return;

		if (field === "weight_kg") {
			row[field] = parseFloat(value);
		} else if (field === "mode") {
			row[field] = value as ShipmentMode;
		} else {
			row[field] = value;
		}
		row._originalData[field] = row[field];

		const revalidated = validateRow(row as Shipment, rowIndex);
		updatedRows[rowIndex] = revalidated;
		setRows(updatedRows);
		setEditingCell(null);
	};

	return (
		<div className="mx-4 sm:mx-6 my-6 bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
			<div className="flex items-center justify-between px-4 py-3">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline">Filter by Mode <ChevronDown /></Button>
					</DropdownMenuTrigger>

					<DropdownMenuContent align="start" className="w-48">
						{VALID_MODES.map((mode) => {
							const currentFilter =
								(table.getColumn("mode")?.getFilterValue() as string[]) || [];
							const isChecked = currentFilter.includes(mode);

							return (
								<DropdownMenuCheckboxItem
									key={mode}
									checked={isChecked}
									onCheckedChange={(checked) => {
										const newFilter = checked
											? [...currentFilter, mode]
											: currentFilter.filter((m) => m !== mode);

										table.getColumn("mode")?.setFilterValue(newFilter);
									}}
								>
									{mode}
								</DropdownMenuCheckboxItem>
							);
						})}
					</DropdownMenuContent>
				</DropdownMenu>

				<Button
					variant="ghost"
					onClick={() => table.resetColumnFilters()}
					className="text-sm text-gray-500 hover:text-gray-700"
				>
					Clear Filters
				</Button>
			</div>

			<div className="overflow-x-auto">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map(headerGroup => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map(header => (
									<TableHead
										key={header.id}
										onClick={header.column.getToggleSortingHandler()}
									>
										{flexRender(header.column.columnDef.header, header.getContext())}
										{{
											asc: " ↑",
											desc: " ↓",
										}[header.column.getIsSorted() as "asc" | "desc"] ?? ""}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>

					<TableBody className="divide-y divide-gray-100">
						{table.getRowModel().rows.map(row => (
							<TableRow key={row.id}>
								{row.getVisibleCells().map(cell => (
									<TableCell key={cell.id} className="px-4 py-3">
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>
				</Table>

				{table.getRowModel().rows.length === 0 && (
					<div className="p-8 text-center text-gray-500">
						No data.
					</div>
				)}
			</div>

			<div className="flex items-center justify-between p-2">
				<Button
					variant="outline"
					onClick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}
				>
					Previous
				</Button>
				<span className="text-sm">
					Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
				</span>
				<Button
					variant="outline"
					onClick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}
				>
					Next
				</Button>
			</div>
		</div>
	);
}

export default DataTable;