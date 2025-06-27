"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toast } from "@/hooks/use-toast"
import {
  TrendingUp,
  BoxIcon as Bottle,
  Plus,
  Save,
  Calculator,
  CheckCircle,
  XCircle,
  CalendarIcon,
  Trash2,
  Package,
  Truck,
  Clock,
  FileText,
} from "lucide-react"
import { useInventoryStore } from "@/lib/inventory-store"
import { format } from "date-fns"

// Product data with volume options and set sizes
const productData = [
  {
    id: "coca-cola",
    name: "Coca-Cola",
    color: "from-red-600 via-red-500 to-red-700",
    volumes: [
      { size: "200ml", setSize: 24, unit: "bottles" },
      { size: "750ml", setSize: 12, unit: "bottles" },
      { size: "2.25L", setSize: 9, unit: "bottles" },
      { size: "250ml PET", setSize: 20, unit: "bottles" },
    ],
  },
  {
    id: "thums-up",
    name: "Thums Up",
    color: "from-gray-800 via-gray-700 to-gray-900",
    volumes: [
      { size: "200ml", setSize: 24, unit: "bottles" },
      { size: "750ml", setSize: 12, unit: "bottles" },
      { size: "2.25L", setSize: 9, unit: "bottles" },
      { size: "300ml", setSize: 20, unit: "bottles" },
    ],
  },
  {
    id: "sprite",
    name: "Sprite",
    color: "from-emerald-500 via-green-500 to-teal-600",
    volumes: [
      { size: "200ml", setSize: 24, unit: "bottles" },
      { size: "750ml", setSize: 12, unit: "bottles" },
      { size: "2.25L", setSize: 9, unit: "bottles" },
      { size: "250ml PET", setSize: 20, unit: "bottles" },
    ],
  },
  {
    id: "fanta",
    name: "Fanta",
    color: "from-orange-500 via-amber-500 to-yellow-500",
    volumes: [
      { size: "200ml", setSize: 24, unit: "bottles" },
      { size: "750ml", setSize: 12, unit: "bottles" },
      { size: "2.25L", setSize: 9, unit: "bottles" },
      { size: "250ml PET", setSize: 20, unit: "bottles" },
    ],
  },
  {
    id: "limca",
    name: "Limca",
    color: "from-lime-500 via-green-400 to-emerald-500",
    volumes: [
      { size: "200ml", setSize: 24, unit: "bottles" },
      { size: "750ml", setSize: 12, unit: "bottles" },
    ],
  },
  {
    id: "maaza",
    name: "Maaza",
    color: "from-yellow-500 via-orange-400 to-red-500",
    volumes: [
      { size: "200ml", setSize: 24, unit: "bottles" },
      { size: "600ml", setSize: 15, unit: "bottles" },
      { size: "1.2L", setSize: 12, unit: "bottles" },
    ],
  },
  {
    id: "kinley",
    name: "Kinley",
    color: "from-blue-500 via-cyan-500 to-teal-500",
    volumes: [
      { size: "500ml", setSize: 24, unit: "bottles" },
      { size: "1L", setSize: 12, unit: "bottles" },
      { size: "2L", setSize: 6, unit: "bottles" },
    ],
  },
]

interface IncomingStockEntry {
  id: string
  productId: string
  productName: string
  productColor: string
  volume: string
  setSize: number
  setsReceived: number
  totalBottles: number
  notes: string
  timestamp: Date
}

function IncomingStockForm({
  onAddEntry,
  selectedDate,
}: {
  onAddEntry: (entry: Omit<IncomingStockEntry, "id" | "timestamp">) => void
  selectedDate: Date
}) {
  const [selectedProduct, setSelectedProduct] = useState<string>("")
  const [selectedVolume, setSelectedVolume] = useState<string>("")
  const [setsReceived, setSetsReceived] = useState("")
  const [notes, setNotes] = useState("")
  const [errors, setErrors] = useState<string[]>([])

  const currentProduct = productData.find((p) => p.id === selectedProduct)
  const currentVolumeData = currentProduct?.volumes.find((v) => v.size === selectedVolume)

  // Calculate totals in real-time
  const setsNum = Number.parseInt(setsReceived) || 0
  const totalBottles = currentVolumeData ? setsNum * currentVolumeData.setSize : 0

  const handleAddEntry = () => {
    const newErrors: string[] = []

    if (!selectedProduct) newErrors.push("Please select a product")
    if (!selectedVolume) newErrors.push("Please select a volume")
    if (!setsReceived || setsNum <= 0) newErrors.push("Please enter a valid number of sets received")

    setErrors(newErrors)

    if (newErrors.length === 0 && currentProduct && currentVolumeData) {
      const entry: Omit<IncomingStockEntry, "id" | "timestamp"> = {
        productId: selectedProduct,
        productName: currentProduct.name,
        productColor: currentProduct.color,
        volume: selectedVolume,
        setSize: currentVolumeData.setSize,
        setsReceived: setsNum,
        totalBottles,
        notes: notes.trim(),
      }

      onAddEntry(entry)

      // Reset form
      setSelectedProduct("")
      setSelectedVolume("")
      setSetsReceived("")
      setNotes("")
      setErrors([])

      toast({
        title: "Entry Added",
        description: `${setsNum} sets of ${currentProduct.name} ${selectedVolume} added to incoming stock.`,
      })
    }
  }

  return (
    <Card className="border-0 bg-gradient-to-br from-white/90 via-white/70 to-white/50 dark:from-slate-900/90 dark:via-slate-800/70 dark:to-slate-700/50 backdrop-blur-xl shadow-xl">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
            <Truck className="w-5 h-5 text-white" />
          </div>
          Log Incoming Stock
        </CardTitle>
        <CardDescription>Record stock received from factory on {format(selectedDate, "MMMM d, yyyy")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {errors.length > 0 && (
          <div className="p-3 rounded-lg bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950/50 dark:to-red-900/30 border border-red-200 dark:border-red-800">
            <div className="flex items-start gap-2">
              <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
              <div className="text-red-800 dark:text-red-300 text-sm">
                <ul className="list-disc list-inside space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label className="text-sm font-medium mb-2 block">Product</Label>
            <Select value={selectedProduct} onValueChange={setSelectedProduct}>
              <SelectTrigger>
                <SelectValue placeholder="Select product" />
              </SelectTrigger>
              <SelectContent>
                {productData.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${product.color}`} />
                      {product.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">Volume</Label>
            <Select value={selectedVolume} onValueChange={setSelectedVolume} disabled={!selectedProduct}>
              <SelectTrigger>
                <SelectValue placeholder="Select volume" />
              </SelectTrigger>
              <SelectContent>
                {currentProduct?.volumes.map((volume) => (
                  <SelectItem key={volume.size} value={volume.size}>
                    <div className="flex items-center justify-between w-full">
                      <span>{volume.size}</span>
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {volume.setSize}/set
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="sets-received" className="text-sm font-medium mb-2 block">
            Sets Received
          </Label>
          <Input
            id="sets-received"
            type="number"
            min="1"
            placeholder="Enter number of sets"
            value={setsReceived}
            onChange={(e) => setSetsReceived(e.target.value)}
            disabled={!currentVolumeData}
          />
          {currentVolumeData && (
            <p className="text-xs text-muted-foreground mt-1">
              Each set contains {currentVolumeData.setSize} {currentVolumeData.unit}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="notes" className="text-sm font-medium mb-2 block">
            Notes (Optional)
          </Label>
          <Textarea
            id="notes"
            placeholder="e.g., Late delivery, Urgent stock, Quality check passed..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
          />
        </div>

        {totalBottles > 0 && currentVolumeData && (
          <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-2">
              <Calculator className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-green-800 dark:text-green-300">
                Total Incoming: {totalBottles.toLocaleString()} bottles
              </span>
            </div>
            <p className="text-xs text-green-600 dark:text-green-400">
              {setsNum} sets × {currentVolumeData.setSize} bottles/set
            </p>
          </div>
        )}

        <Button
          onClick={handleAddEntry}
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
          size="lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Incoming Stock Entry
        </Button>
      </CardContent>
    </Card>
  )
}

function IncomingStockPreview({
  entries,
  onDeleteEntry,
  selectedDate,
}: {
  entries: IncomingStockEntry[]
  onDeleteEntry: (id: string) => void
  selectedDate: Date
}) {
  const totalBottlesReceived = entries.reduce((sum, entry) => sum + entry.totalBottles, 0)
  const totalSetsReceived = entries.reduce((sum, entry) => sum + entry.setsReceived, 0)
  const totalEntries = entries.length

  if (entries.length === 0) {
    return (
      <Card className="border-0 bg-gradient-to-br from-white/90 via-white/70 to-white/50 dark:from-slate-900/90 dark:via-slate-800/70 dark:to-slate-700/50 backdrop-blur-xl shadow-xl">
        <CardContent className="p-8 text-center">
          <Truck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            No incoming stock logged for {format(selectedDate, "MMMM d, yyyy")} yet.
          </p>
          <p className="text-sm text-muted-foreground mt-2">Add your first delivery entry above to get started.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 bg-gradient-to-br from-white/90 via-white/70 to-white/50 dark:from-slate-900/90 dark:via-slate-800/70 dark:to-slate-700/50 backdrop-blur-xl shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            Today's Incoming Stock
          </div>
          <div className="flex gap-2">
            <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 px-3 py-1">
              {totalEntries} deliveries
            </Badge>
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 px-3 py-1">
              {totalSetsReceived} sets
            </Badge>
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 px-3 py-1">
              {totalBottlesReceived.toLocaleString()} bottles
            </Badge>
          </div>
        </CardTitle>
        <CardDescription>Stock received on {format(selectedDate, "MMMM d, yyyy")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="p-4 border rounded-xl hover:shadow-lg transition-all duration-200 bg-gradient-to-r from-white/80 to-gray-50/60 dark:from-slate-800/80 dark:to-slate-700/60"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div
                    className={`w-10 h-10 bg-gradient-to-br ${entry.productColor} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}
                  >
                    <Bottle className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{entry.productName}</h4>
                      <Badge variant="outline">{entry.volume}</Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-muted-foreground mb-2">
                      <div className="flex items-center gap-1">
                        <Package className="w-3 h-3" />
                        <span>{entry.setsReceived} sets</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Bottle className="w-3 h-3" />
                        <span>{entry.totalBottles} bottles</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{format(entry.timestamp, "HH:mm")}</span>
                      </div>
                    </div>
                    {entry.notes && (
                      <div className="flex items-start gap-1 text-sm">
                        <FileText className="w-3 h-3 mt-0.5 text-muted-foreground flex-shrink-0" />
                        <span className="text-muted-foreground italic">{entry.notes}</span>
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteEntry(entry.id)}
                  className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function DailySummaryCard({ entries }: { entries: IncomingStockEntry[] }) {
  const totalBottles = entries.reduce((sum, entry) => sum + entry.totalBottles, 0)
  const totalSets = entries.reduce((sum, entry) => sum + entry.setsReceived, 0)
  const uniqueProducts = new Set(entries.map((entry) => entry.productId)).size

  return (
    <Card className="border-0 bg-gradient-to-br from-white/90 via-white/70 to-white/50 dark:from-slate-900/90 dark:via-slate-800/70 dark:to-slate-700/50 backdrop-blur-xl shadow-xl">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          Daily Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/30 rounded-lg">
            <p className="text-xl font-bold text-blue-600">{uniqueProducts}</p>
            <p className="text-xs text-muted-foreground">Products</p>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/30 rounded-lg">
            <p className="text-xl font-bold text-green-600">{totalSets}</p>
            <p className="text-xs text-muted-foreground">Sets</p>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/30 rounded-lg">
            <p className="text-xl font-bold text-purple-600">{totalBottles.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Bottles</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function IncomingStockPage() {
  const { recordIncoming } = useInventoryStore()
  const [stockEntries, setStockEntries] = useState<IncomingStockEntry[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddEntry = (entry: Omit<IncomingStockEntry, "id" | "timestamp">) => {
    const newEntry: IncomingStockEntry = {
      ...entry,
      id: Date.now().toString(),
      timestamp: new Date(),
    }
    setStockEntries((prev) => [...prev, newEntry])
  }

  const handleDeleteEntry = (id: string) => {
    setStockEntries((prev) => prev.filter((entry) => entry.id !== id))
    toast({
      title: "Entry Removed",
      description: "Incoming stock entry has been removed.",
      variant: "destructive",
    })
  }

  const handleSaveStock = async () => {
    if (stockEntries.length === 0) return

    setIsSubmitting(true)

    try {
      // Save each entry to the store
      stockEntries.forEach((entry) => {
        recordIncoming({
          productId: entry.productId,
          productName: entry.productName,
          volume: entry.volume,
          setSize: entry.setSize,
          setsReceived: entry.setsReceived,
          notes: entry.notes,
        })
      })

      toast({
        title: "Stock Saved Successfully!",
        description: `${stockEntries.length} incoming stock entries for ${format(selectedDate, "MMMM d, yyyy")} have been saved to inventory.`,
      })

      // Reset entries after successful save
      setStockEntries([])
    } catch (error) {
      toast({
        title: "Error Saving Stock",
        description: "There was an error saving the incoming stock entries. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Premium Header */}
      <div className="text-center space-y-4 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-cyan-500/10 rounded-3xl" />
        <div className="relative z-10 py-6">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent mb-3">
            Incoming Stock
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Record stock received from factory with automatic inventory updates
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Log Incoming Stock</h2>
          <p className="text-muted-foreground">Record deliveries and update inventory in real-time</p>
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 bg-white/80 backdrop-blur-sm">
              <CalendarIcon className="w-4 h-4" />
              {format(selectedDate, "MMM d, yyyy")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <IncomingStockForm onAddEntry={handleAddEntry} selectedDate={selectedDate} />
          <IncomingStockPreview entries={stockEntries} onDeleteEntry={handleDeleteEntry} selectedDate={selectedDate} />
        </div>

        <div className="space-y-6">
          <DailySummaryCard entries={stockEntries} />

          {stockEntries.length > 0 && (
            <div className="sticky top-6 space-y-4">
              <Button
                onClick={handleSaveStock}
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Saving to Inventory...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save to Inventory ({stockEntries.length})
                  </>
                )}
              </Button>

              <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    This will add {stockEntries.reduce((sum, entry) => sum + entry.totalBottles, 0).toLocaleString()}{" "}
                    bottles to your current inventory.
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile floating save button */}
      {stockEntries.length > 0 && (
        <div className="fixed bottom-6 right-6 lg:hidden">
          <Button
            onClick={handleSaveStock}
            disabled={isSubmitting}
            size="lg"
            className="rounded-full shadow-2xl bg-gradient-to-r from-green-600 to-emerald-600"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
