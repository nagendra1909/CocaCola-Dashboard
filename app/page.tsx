"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Package, AlertTriangle, BoxIcon as Bottle, Plus, Layers, Settings, TrendingUp, DollarSign } from "lucide-react"
import { useInventoryStore } from "@/lib/inventory-store"
import { toast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  trend,
}: {
  title: string
  value: string | number
  subtitle: string
  icon: any
  color: string
  trend?: { value: string; positive: boolean }
}) {
  return (
    <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white/80 via-white/60 to-white/40 dark:from-slate-900/80 dark:via-slate-800/60 dark:to-slate-700/40 backdrop-blur-xl">
      <div
        className={`absolute inset-0 bg-gradient-to-br ${color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 relative z-10 p-4">
        <CardTitle className="text-xs font-medium text-slate-600 dark:text-slate-300">{title}</CardTitle>
        <div
          className={`w-8 h-8 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className="h-4 w-4 text-white" />
        </div>
      </CardHeader>
      <CardContent className="relative z-10 p-4 pt-0">
        <div className="text-2xl font-bold mb-1 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
          {typeof value === "number" ? value.toLocaleString() : value}
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
          {trend && (
            <Badge
              variant={trend.positive ? "default" : "destructive"}
              className="text-xs bg-gradient-to-r from-emerald-500 to-green-500 text-white border-0 px-2 py-0"
            >
              {trend.value}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function ThresholdDialog({ product, variant }: { product: any; variant: any }) {
  const [threshold, setThreshold] = useState(variant.threshold)
  const { updateThreshold } = useInventoryStore()
  const [open, setOpen] = useState(false)

  const handleSave = () => {
    updateThreshold(product.id, variant.volume, threshold)
    setOpen(false)
    toast({
      title: "Threshold Updated",
      description: `${product.name} ${variant.volume} threshold set to ${threshold} sets`,
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="h-8 px-2">
          <Settings className="w-3 h-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Set Threshold</DialogTitle>
          <DialogDescription>
            Set the minimum stock threshold for {product.name} {variant.volume}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="threshold">Threshold (sets)</Label>
            <Input
              id="threshold"
              type="number"
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              min="0"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Threshold</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function ProductRow({ product }: { product: any }) {
  const { addNewVariant } = useInventoryStore()
  const [showAddVariant, setShowAddVariant] = useState(false)
  const [newVariant, setNewVariant] = useState({
    volume: "",
    setSize: "",
    currentSets: "",
    threshold: "",
  })

  const getLowStockVariants = () => {
    return product.variants.filter(
      (variant: any) => variant.currentSets <= variant.threshold && variant.currentSets > 0,
    )
  }

  const getCriticalStockVariants = () => {
    return product.variants.filter((variant: any) => variant.currentSets === 0)
  }

  const lowStockVariants = getLowStockVariants()
  const criticalStockVariants = getCriticalStockVariants()

  const handleAddVariant = () => {
    if (!newVariant.volume || !newVariant.setSize || !newVariant.currentSets || !newVariant.threshold) {
      toast({
        title: "Missing Information",
        description: "Please fill all variant details",
        variant: "destructive",
      })
      return
    }

    const variant = {
      volume: newVariant.volume,
      setSize: Number.parseInt(newVariant.setSize),
      currentSets: Number.parseInt(newVariant.currentSets),
      threshold: Number.parseInt(newVariant.threshold),
    }

    addNewVariant(product.id, variant)
    setNewVariant({ volume: "", setSize: "", currentSets: "", threshold: "" })
    setShowAddVariant(false)

    toast({
      title: "Variant Added Successfully!",
      description: `${variant.volume} variant added to ${product.name}`,
    })
  }

  return (
    <>
      <Card className="group hover:shadow-xl transition-all duration-500 border-0 bg-gradient-to-r from-white/90 via-white/70 to-white/50 dark:from-slate-900/90 dark:via-slate-800/70 dark:to-slate-700/50 backdrop-blur-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <CardContent className="p-4 relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 bg-gradient-to-br ${product.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500 relative`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl" />
                <Bottle className="w-6 h-6 text-white relative z-10" />
              </div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                  {product.name}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">{product.variants.length} variants</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {criticalStockVariants.length > 0 && (
                <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0 px-3 py-1 text-xs animate-pulse">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {criticalStockVariants.length} Critical
                </Badge>
              )}
              {lowStockVariants.length > 0 && (
                <Badge className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white border-0 px-3 py-1 text-xs">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {lowStockVariants.length} Low
                </Badge>
              )}
              <Button
                size="sm"
                onClick={() => setShowAddVariant(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Volume
              </Button>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {product.variants.map((variant: any, index: number) => {
              const isLowStock = variant.currentSets <= variant.threshold && variant.currentSets > 0
              const isCritical = variant.currentSets === 0
              const stockPercentage = Math.min((variant.currentSets / (variant.threshold * 2)) * 100, 100)

              return (
                <div
                  key={variant.volume}
                  className={`p-3 rounded-xl border-2 transition-all duration-300 hover:shadow-lg backdrop-blur-sm ${
                    isCritical
                      ? "border-red-300 bg-gradient-to-br from-red-50/80 to-red-100/60 dark:from-red-950/50 dark:to-red-900/30 dark:border-red-700"
                      : isLowStock
                        ? "border-orange-300 bg-gradient-to-br from-orange-50/80 to-yellow-100/60 dark:from-orange-950/50 dark:to-yellow-900/30 dark:border-orange-700"
                        : "border-emerald-300 bg-gradient-to-br from-emerald-50/80 to-green-100/60 dark:from-emerald-950/50 dark:to-green-900/30 dark:border-emerald-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">{variant.volume}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{variant.setSize}/set</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <ThresholdDialog product={product} variant={variant} />
                      <Badge
                        className={`text-xs ${
                          isCritical
                            ? "bg-gradient-to-r from-red-500 to-red-600 text-white"
                            : isLowStock
                              ? "bg-gradient-to-r from-orange-500 to-yellow-500 text-white"
                              : "bg-gradient-to-r from-emerald-500 to-green-500 text-white"
                        } border-0`}
                      >
                        {isCritical ? "Critical" : isLowStock ? "Low" : "Good"}
                      </Badge>
                    </div>
                  </div>

                  <div className="text-center mb-3">
                    <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {variant.currentSets}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-300">Sets</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      ({variant.currentSets * variant.setSize} bottles)
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all duration-1000 ${
                          stockPercentage > 50
                            ? "bg-gradient-to-r from-emerald-400 to-green-500"
                            : stockPercentage > 25
                              ? "bg-gradient-to-r from-yellow-400 to-orange-500"
                              : "bg-gradient-to-r from-red-400 to-red-500"
                        }`}
                        style={{ width: `${stockPercentage}%` }}
                      />
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 text-center">
                      Threshold: {variant.threshold}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Add Volume Dialog */}
      <Dialog open={showAddVariant} onOpenChange={setShowAddVariant}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Add New Volume to {product.name}
            </DialogTitle>
            <DialogDescription>Add a new volume variant with initial stock and threshold settings</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="volume">Volume Size</Label>
              <Input
                id="volume"
                placeholder="e.g., 500ml, 1.5L, 250ml PET"
                value={newVariant.volume}
                onChange={(e) => setNewVariant({ ...newVariant, volume: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="setSize">Bottles per Set</Label>
              <Input
                id="setSize"
                type="number"
                placeholder="e.g., 24, 12, 6"
                value={newVariant.setSize}
                onChange={(e) => setNewVariant({ ...newVariant, setSize: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="currentSets">Initial Stock (Sets)</Label>
              <Input
                id="currentSets"
                type="number"
                placeholder="Current sets in stock"
                value={newVariant.currentSets}
                onChange={(e) => setNewVariant({ ...newVariant, currentSets: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="threshold">Low Stock Threshold (Sets)</Label>
              <Input
                id="threshold"
                type="number"
                placeholder="Alert when stock falls below"
                value={newVariant.threshold}
                onChange={(e) => setNewVariant({ ...newVariant, threshold: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddVariant(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddVariant} className="bg-gradient-to-r from-blue-600 to-purple-600">
                Add Volume
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default function Dashboard() {
  const {
    products,
    initializeProducts,
    getTotalInventoryValue,
    getLowStockVariants,
    getCriticalStockVariants,
    getTodaysSales,
  } = useInventoryStore()

  useEffect(() => {
    initializeProducts()
  }, [initializeProducts])

  const { totalProducts, totalVariants, totalSets, lowStockCount, criticalStockCount } = getTotalInventoryValue()
  const todaysSales = getTodaysSales()
  const todaysRevenue = todaysSales.reduce((sum, sale) => sum + sale.totalAmount, 0)

  return (
    <div className="space-y-10">
      {/* Premium Header */}
      <div className="text-center space-y-6 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-transparent to-blue-500/10 rounded-3xl" />
        <div className="relative z-10 py-8">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-red-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Inventory Dashboard
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Premium real-time inventory management with intelligent analytics and insights
          </p>
        </div>
      </div>

      {/* Premium Stats Cards */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Flavors"
          value={totalProducts}
          subtitle="Active product flavors"
          icon={Package}
          color="from-blue-600 to-purple-600"
          trend={{ value: "+2.5%", positive: true }}
        />
        <StatsCard
          title="Total Variants"
          value={totalVariants}
          subtitle="Volume variants"
          icon={Layers}
          color="from-purple-600 to-pink-600"
          trend={{ value: "+5.1%", positive: true }}
        />
        <StatsCard
          title="Total Sets"
          value={totalSets}
          subtitle="Sets in inventory"
          icon={Bottle}
          color="from-emerald-600 to-teal-600"
          trend={{ value: "+12.3%", positive: true }}
        />
        <StatsCard
          title="Today's Revenue"
          value={`₹${(todaysRevenue / 1000).toFixed(1)}K`}
          subtitle="Sales revenue today"
          icon={DollarSign}
          color="from-green-600 to-emerald-600"
          trend={{ value: "+18.7%", positive: true }}
        />
      </div>

      {/* Critical Alerts */}
      {(criticalStockCount > 0 || lowStockCount > 0) && (
        <div className="grid gap-6 md:grid-cols-2">
          {criticalStockCount > 0 && (
            <Card className="border-0 bg-gradient-to-br from-red-50/80 to-red-100/60 dark:from-red-950/50 dark:to-red-900/30 backdrop-blur-xl shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-red-700 dark:text-red-300">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-xl">
                    <AlertTriangle className="w-6 h-6 text-white" />
                  </div>
                  Critical Stock Alert
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-red-600 dark:text-red-400 mb-4 text-lg">
                  {criticalStockCount} product variants are completely out of stock!
                </p>
                <Button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0 shadow-xl">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Restock Now
                </Button>
              </CardContent>
            </Card>
          )}

          {lowStockCount > 0 && (
            <Card className="border-0 bg-gradient-to-br from-orange-50/80 to-yellow-100/60 dark:from-orange-950/50 dark:to-yellow-900/30 backdrop-blur-xl shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-orange-700 dark:text-orange-300">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center shadow-xl">
                    <AlertTriangle className="w-6 h-6 text-white" />
                  </div>
                  Low Stock Warning
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-orange-600 dark:text-orange-400 mb-4 text-lg">
                  {lowStockCount} product variants are running low on stock.
                </p>
                <Button className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white border-0 shadow-xl">
                  <Package className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Products Grid */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
            Product Inventory by Flavor
          </h2>
        </div>

        <div className="space-y-8">
          {products.map((product) => (
            <ProductRow key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  )
}
