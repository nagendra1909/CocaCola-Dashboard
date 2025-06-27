"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/hooks/use-toast"
import {
  Download,
  BoxIcon as Bottle,
  FileSpreadsheet,
  CalendarIcon,
  Search,
  Filter,
  ArrowUpDown,
  Clock,
  TrendingUp,
  Package,
  Activity,
  ShoppingCart,
} from "lucide-react"
import { useInventoryStore } from "@/lib/inventory-store"
import { format, startOfMonth, endOfMonth, isToday, isThisMonth } from "date-fns"
import * as XLSX from "xlsx"

type ExportType = "today" | "month" | "all"
type SortField = "date" | "type" | "product" | "volume" | "quantity"
type SortOrder = "asc" | "desc"

interface ExportData {
  id: string
  date: string
  time: string
  type: "Sale" | "Incoming"
  productName: string
  volume: string
  sets: number
  bottles: number
  customerName?: string
  notes?: string
  amount?: number
}

function ExportButtons({ onExport, isExporting }: { onExport: (type: ExportType) => void; isExporting: boolean }) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card className="hover:shadow-2xl transition-all duration-500 cursor-pointer group border-0 bg-gradient-to-br from-blue-50/80 to-cyan-50/60 dark:from-blue-950/50 dark:to-cyan-950/30 backdrop-blur-xl">
        <CardContent className="p-8">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-2xl">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-xl mb-2 text-slate-800 dark:text-slate-200">Today's Activity</h3>
              <p className="text-sm text-muted-foreground">Export today's sales and incoming stock</p>
            </div>
          </div>
          <Button
            onClick={() => onExport("today")}
            disabled={isExporting}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 py-3"
            size="lg"
          >
            {isExporting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
            ) : (
              <Download className="w-5 h-5 mr-3" />
            )}
            Export Today
          </Button>
        </CardContent>
      </Card>

      <Card className="hover:shadow-2xl transition-all duration-500 cursor-pointer group border-0 bg-gradient-to-br from-green-50/80 to-emerald-50/60 dark:from-green-950/50 dark:to-emerald-950/30 backdrop-blur-xl">
        <CardContent className="p-8">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-2xl">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-xl mb-2 text-slate-800 dark:text-slate-200">This Month</h3>
              <p className="text-sm text-muted-foreground">Export current month's complete data</p>
            </div>
          </div>
          <Button
            onClick={() => onExport("month")}
            disabled={isExporting}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 py-3"
            size="lg"
          >
            {isExporting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
            ) : (
              <Download className="w-5 h-5 mr-3" />
            )}
            Export Month
          </Button>
        </CardContent>
      </Card>

      <Card className="hover:shadow-2xl transition-all duration-500 cursor-pointer group border-0 bg-gradient-to-br from-purple-50/80 to-pink-50/60 dark:from-purple-950/50 dark:to-pink-950/30 backdrop-blur-xl">
        <CardContent className="p-8">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-2xl">
              <Package className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-xl mb-2 text-slate-800 dark:text-slate-200">All Activity</h3>
              <p className="text-sm text-muted-foreground">Complete sales and stock history</p>
            </div>
          </div>
          <Button
            onClick={() => onExport("all")}
            disabled={isExporting}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 py-3"
            size="lg"
          >
            {isExporting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
            ) : (
              <Download className="w-5 h-5 mr-3" />
            )}
            Export All
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

function DataPreviewTable({
  data,
  searchTerm,
  sortField,
  sortOrder,
  onSort,
}: {
  data: ExportData[]
  searchTerm: string
  sortField: SortField
  sortOrder: SortOrder
  onSort: (field: SortField) => void
}) {
  const filteredData = data.filter(
    (item) =>
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.volume.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.customerName && item.customerName.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const sortedData = [...filteredData].sort((a, b) => {
    let aValue: any, bValue: any

    switch (sortField) {
      case "date":
        aValue = new Date(a.date).getTime()
        bValue = new Date(b.date).getTime()
        break
      case "type":
        aValue = a.type
        bValue = b.type
        break
      case "product":
        aValue = a.productName
        bValue = b.productName
        break
      case "volume":
        aValue = a.volume
        bValue = b.volume
        break
      case "quantity":
        aValue = a.sets
        bValue = b.sets
        break
      default:
        return 0
    }

    if (typeof aValue === "string") {
      return sortOrder === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }

    return sortOrder === "asc" ? aValue - bValue : bValue - aValue
  })

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => onSort(field)}
      className="h-auto p-0 font-semibold hover:bg-transparent text-slate-700 dark:text-slate-300"
    >
      {children}
      <ArrowUpDown className="w-3 h-3 ml-1" />
    </Button>
  )

  return (
    <div className="space-y-4">
      {/* Desktop Table */}
      <div className="hidden md:block rounded-xl border-0 overflow-hidden shadow-xl">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 border-0">
              <TableHead className="font-bold">
                <SortButton field="date">Date & Time</SortButton>
              </TableHead>
              <TableHead className="font-bold">
                <SortButton field="type">Type</SortButton>
              </TableHead>
              <TableHead className="font-bold">
                <SortButton field="product">Product</SortButton>
              </TableHead>
              <TableHead className="font-bold">
                <SortButton field="volume">Volume</SortButton>
              </TableHead>
              <TableHead className="text-center font-bold">
                <SortButton field="quantity">Quantity</SortButton>
              </TableHead>
              <TableHead className="font-bold">Details</TableHead>
              <TableHead className="text-center font-bold">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((item, index) => (
              <TableRow
                key={item.id}
                className={`${index % 2 === 0 ? "bg-white/50 dark:bg-slate-900/50" : "bg-slate-50/50 dark:bg-slate-800/50"} border-0 hover:bg-slate-100/80 dark:hover:bg-slate-700/80 transition-colors`}
              >
                <TableCell>
                  <div className="text-sm">
                    <div className="font-medium">{item.date}</div>
                    <div className="text-muted-foreground text-xs">{item.time}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    className={`${
                      item.type === "Sale"
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                        : "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                    } border-0 shadow-md`}
                  >
                    {item.type === "Sale" ? (
                      <ShoppingCart className="w-3 h-3 mr-1" />
                    ) : (
                      <TrendingUp className="w-3 h-3 mr-1" />
                    )}
                    {item.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Bottle className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">{item.productName}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-white/80 backdrop-blur-sm">
                    {item.volume}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <div className="text-sm">
                    <div className="font-bold text-lg">{item.sets}</div>
                    <div className="text-muted-foreground text-xs">{item.bottles} bottles</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {item.customerName && <div className="font-medium">{item.customerName}</div>}
                    {item.notes && <div className="text-muted-foreground text-xs italic">{item.notes}</div>}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  {item.amount && <div className="font-bold text-green-600">₹{item.amount.toFixed(2)}</div>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {sortedData.map((item) => (
          <Card
            key={item.id}
            className="hover:shadow-lg transition-all duration-200 border-0 bg-gradient-to-r from-white/90 to-slate-50/60 dark:from-slate-900/90 dark:to-slate-800/60 backdrop-blur-xl"
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Bottle className="w-8 h-8 text-blue-600" />
                  <div>
                    <h4 className="font-semibold text-slate-800 dark:text-slate-200">{item.productName}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="bg-white/80 backdrop-blur-sm text-xs">
                        {item.volume}
                      </Badge>
                      <Badge
                        className={`${
                          item.type === "Sale"
                            ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                            : "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                        } border-0 text-xs`}
                      >
                        {item.type}
                      </Badge>
                    </div>
                  </div>
                </div>
                {item.amount && (
                  <div className="text-right">
                    <div className="font-bold text-green-600">₹{item.amount.toFixed(2)}</div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-xs text-muted-foreground">Date & Time</div>
                  <div className="font-medium">{item.date}</div>
                  <div className="text-xs text-muted-foreground">{item.time}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Quantity</div>
                  <div className="font-bold text-lg">{item.sets} sets</div>
                  <div className="text-xs text-muted-foreground">{item.bottles} bottles</div>
                </div>
              </div>

              {(item.customerName || item.notes) && (
                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                  {item.customerName && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Customer: </span>
                      <span className="font-medium">{item.customerName}</span>
                    </div>
                  )}
                  {item.notes && <div className="text-sm text-muted-foreground italic mt-1">{item.notes}</div>}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function ExportSummary({ data }: { data: ExportData[] }) {
  const salesData = data.filter((item) => item.type === "Sale")
  const incomingData = data.filter((item) => item.type === "Incoming")

  const totalSales = salesData.length
  const totalIncoming = incomingData.length
  const totalSets = data.reduce((sum, item) => sum + item.sets, 0)
  const totalBottles = data.reduce((sum, item) => sum + item.bottles, 0)
  const totalRevenue = salesData.reduce((sum, item) => sum + (item.amount || 0), 0)

  return (
    <Card className="border-0 bg-gradient-to-br from-white/90 via-white/70 to-white/50 dark:from-slate-900/90 dark:via-slate-800/70 dark:to-slate-700/50 backdrop-blur-xl shadow-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl">
          <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl">
            <FileSpreadsheet className="w-6 h-6 text-white" />
          </div>
          Export Summary
        </CardTitle>
        <CardDescription className="text-lg">Overview of data to be exported ({data.length} records)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/30 rounded-xl shadow-lg">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-lg">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-green-600">{totalSales}</p>
            <p className="text-xs text-muted-foreground">Sales</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/30 rounded-xl shadow-lg">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-blue-600">{totalIncoming}</p>
            <p className="text-xs text-muted-foreground">Incoming</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/30 rounded-xl shadow-lg">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-lg">
              <Package className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-purple-600">{totalSets.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total Sets</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-950/50 dark:to-yellow-950/30 rounded-xl shadow-lg">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-lg">
              <Bottle className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-orange-600">{totalBottles.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total Bottles</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/30 rounded-xl shadow-lg">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-lg">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-emerald-600">₹{(totalRevenue / 1000).toFixed(1)}K</p>
            <p className="text-xs text-muted-foreground">Revenue</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ExportPage() {
  const { sales, incomingHistory } = useInventoryStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<SortField>("date")
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")
  const [isExporting, setIsExporting] = useState(false)
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  })

  // Combine sales and incoming data
  const allData: ExportData[] = [
    ...sales.map((sale) => ({
      id: `sale-${sale.id}`,
      date: format(sale.timestamp, "MMM d, yyyy"),
      time: format(sale.timestamp, "HH:mm"),
      type: "Sale" as const,
      productName: sale.items.map((item) => `${item.productName} ${item.volume}`).join(", "),
      volume: sale.items.map((item) => item.volume).join(", "),
      sets: sale.items.reduce((sum, item) => sum + item.setsSold, 0),
      bottles: sale.items.reduce((sum, item) => sum + item.setsSold * item.setSize, 0),
      customerName: sale.customerName,
      notes: sale.notes,
      amount: sale.totalAmount,
    })),
    ...incomingHistory.map((incoming) => ({
      id: `incoming-${incoming.id}`,
      date: format(incoming.timestamp, "MMM d, yyyy"),
      time: format(incoming.timestamp, "HH:mm"),
      type: "Incoming" as const,
      productName: incoming.productName,
      volume: incoming.volume,
      sets: incoming.setsReceived,
      bottles: incoming.setsReceived * incoming.setSize,
      notes: incoming.notes,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("asc")
    }
  }

  const downloadExcel = (data: ExportData[], filename: string) => {
    const worksheet = XLSX.utils.json_to_sheet(
      data.map((item) => ({
        Date: item.date,
        Time: item.time,
        Type: item.type,
        Product: item.productName,
        Volume: item.volume,
        Sets: item.sets,
        Bottles: item.bottles,
        Customer: item.customerName || "",
        Notes: item.notes || "",
        Amount: item.amount || "",
      })),
    )

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Activity Data")

    // Auto-size columns
    const colWidths = [
      { wch: 12 }, // Date
      { wch: 8 }, // Time
      { wch: 10 }, // Type
      { wch: 25 }, // Product
      { wch: 10 }, // Volume
      { wch: 8 }, // Sets
      { wch: 10 }, // Bottles
      { wch: 20 }, // Customer
      { wch: 30 }, // Notes
      { wch: 12 }, // Amount
    ]
    worksheet["!cols"] = colWidths

    XLSX.writeFile(workbook, filename)
  }

  const handleExport = async (type: ExportType) => {
    setIsExporting(true)

    try {
      let dataToExport: ExportData[] = []
      let filename = ""

      switch (type) {
        case "today":
          dataToExport = allData.filter((item) => isToday(new Date(item.date)))
          filename = `coca-cola-today-${format(new Date(), "yyyy-MM-dd")}.xlsx`
          break
        case "month":
          dataToExport = allData.filter((item) => isThisMonth(new Date(item.date)))
          filename = `coca-cola-month-${format(new Date(), "yyyy-MM")}.xlsx`
          break
        case "all":
          dataToExport = allData
          filename = `coca-cola-all-activity-${format(new Date(), "yyyy-MM-dd")}.xlsx`
          break
      }

      if (dataToExport.length === 0) {
        toast({
          title: "No Data to Export",
          description: "No records found for the selected period.",
          variant: "destructive",
        })
        return
      }

      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 1500))

      downloadExcel(dataToExport, filename)

      const exportTypeLabels = {
        today: "Today's Activity",
        month: "This Month's Activity",
        all: "All Activity Data",
      }

      toast({
        title: "Export Complete!",
        description: `${exportTypeLabels[type]} (${dataToExport.length} records) has been downloaded successfully.`,
      })
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting the data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Premium Header */}
      <div className="text-center space-y-4 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-transparent to-blue-500/10 rounded-3xl" />
        <div className="relative z-10 py-6">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Export Activity Data
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Export comprehensive sales and incoming stock data to Excel for analysis
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Export Business Activity</h2>
          <p className="text-muted-foreground">Generate detailed reports with real sales and stock data</p>
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 bg-white/80 backdrop-blur-sm shadow-lg">
              <CalendarIcon className="w-4 h-4" />
              {format(dateRange.from, "MMM d")} - {format(dateRange.to, "MMM d, yyyy")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="range"
              selected={{ from: dateRange.from, to: dateRange.to }}
              onSelect={(range) => {
                if (range?.from && range?.to) {
                  setDateRange({ from: range.from, to: range.to })
                }
              }}
              numberOfMonths={2}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <ExportButtons onExport={handleExport} isExporting={isExporting} />

      <ExportSummary data={allData} />

      {allData.length === 0 ? (
        <Card className="border-0 bg-gradient-to-br from-white/90 via-white/70 to-white/50 dark:from-slate-900/90 dark:via-slate-800/70 dark:to-slate-700/50 backdrop-blur-xl shadow-2xl">
          <CardContent className="p-12 text-center">
            <FileSpreadsheet className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-xl">No activity data available</p>
            <p className="text-sm text-muted-foreground mt-2">
              Start making sales or adding incoming stock to see data here
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-0 bg-gradient-to-br from-white/90 via-white/70 to-white/50 dark:from-slate-900/90 dark:via-slate-800/70 dark:to-slate-700/50 backdrop-blur-xl shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl">Activity Data Preview</CardTitle>
            <CardDescription className="text-lg">
              Preview of sales and incoming stock data to be exported
            </CardDescription>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search activity..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/80 backdrop-blur-sm"
                />
              </div>
              <Select
                value={`${sortField}-${sortOrder}`}
                onValueChange={(value) => {
                  const [field, order] = value.split("-") as [SortField, SortOrder]
                  setSortField(field)
                  setSortOrder(order)
                }}
              >
                <SelectTrigger className="w-48 bg-white/80 backdrop-blur-sm">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">Latest First</SelectItem>
                  <SelectItem value="date-asc">Oldest First</SelectItem>
                  <SelectItem value="type-asc">By Type</SelectItem>
                  <SelectItem value="product-asc">By Product A-Z</SelectItem>
                  <SelectItem value="quantity-desc">Highest Quantity</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <DataPreviewTable
              data={allData}
              searchTerm={searchTerm}
              sortField={sortField}
              sortOrder={sortOrder}
              onSort={handleSort}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
