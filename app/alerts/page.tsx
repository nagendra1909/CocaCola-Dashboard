"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertTriangle,
  BoxIcon as Bottle,
  Search,
  Grid3X3,
  List,
  ShoppingCart,
  Bell,
  AlertCircle,
  Filter,
  Package,
  TrendingUp,
  Settings,
} from "lucide-react"
import { useInventoryStore } from "@/lib/inventory-store"

type ViewMode = "grid" | "list"
type SortBy = "product" | "urgency" | "stock"

function AlertCard({
  product,
  variant,
  viewMode,
}: {
  product: any
  variant: any
  viewMode: ViewMode
}) {
  const isCritical = variant.currentSets === 0
  const isLow = variant.currentSets <= variant.threshold && variant.currentSets > 0
  const stockPercentage = Math.min((variant.currentSets / (variant.threshold * 2)) * 100, 100)

  const getSeverityBadge = () => {
    if (isCritical) {
      return (
        <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0 animate-pulse shadow-lg">
          🔴 Critical
        </Badge>
      )
    }
    return (
      <Badge className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white border-0 shadow-lg">
        🟠 Low Stock
      </Badge>
    )
  }

  const getSeverityGlow = () => {
    if (isCritical) {
      return "shadow-red-200 dark:shadow-red-900/50 border-red-300 dark:border-red-700 bg-gradient-to-br from-red-50/80 to-red-100/60 dark:from-red-950/50 dark:to-red-900/30"
    }
    return "shadow-orange-200 dark:shadow-orange-900/50 border-orange-300 dark:border-orange-700 bg-gradient-to-br from-orange-50/80 to-yellow-100/60 dark:from-orange-950/50 dark:to-yellow-900/30"
  }

  if (viewMode === "list") {
    return (
      <Card className={`hover:shadow-xl transition-all duration-300 border-2 backdrop-blur-xl ${getSeverityGlow()}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 bg-gradient-to-br ${product.color} rounded-2xl flex items-center justify-center shadow-lg`}
              >
                <Bottle className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <Badge variant="outline" className="text-sm">
                    {variant.volume}
                  </Badge>
                  {getSeverityBadge()}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Current: {variant.currentSets} sets</span>
                  <span>Threshold: {variant.threshold} sets</span>
                  <span>Total: {variant.currentSets * variant.setSize} bottles</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Restock
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`hover:shadow-xl transition-all duration-500 border-2 backdrop-blur-xl ${getSeverityGlow()}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-14 h-14 bg-gradient-to-br ${product.color} rounded-2xl flex items-center justify-center shadow-xl`}
            >
              <Bottle className="w-7 h-7 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">{product.name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-sm">
                  {variant.volume}
                </Badge>
                {isCritical ? (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                )}
              </div>
            </div>
          </div>
          {getSeverityBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Current Stock</span>
            <span className="font-bold text-lg">{variant.currentSets} sets</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Threshold</span>
            <span className="font-semibold text-red-600 dark:text-red-400">{variant.threshold} sets</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Bottles</span>
            <span className="font-semibold">{variant.currentSets * variant.setSize}</span>
          </div>
        </div>

        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner">
          <div
            className={`h-3 rounded-full transition-all duration-1000 shadow-sm ${
              isCritical ? "bg-gradient-to-r from-red-500 to-red-600" : "bg-gradient-to-r from-orange-500 to-yellow-500"
            }`}
            style={{
              width: `${Math.max(stockPercentage, 5)}%`,
            }}
          />
        </div>

        <div className="flex gap-2">
          <Button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Restock
          </Button>
          <Button variant="outline" size="sm" className="bg-white/80 backdrop-blur-sm">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function AlertsSummary({
  criticalCount,
  lowCount,
  totalAlerts,
}: {
  criticalCount: number
  lowCount: number
  totalAlerts: number
}) {
  return (
    <div className="grid gap-6 md:grid-cols-3 mb-8">
      <Card className="border-0 bg-gradient-to-br from-red-50/80 to-red-100/60 dark:from-red-950/50 dark:to-red-900/30 backdrop-blur-xl shadow-xl">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-xl">
              <AlertCircle className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-red-600">{criticalCount}</p>
              <p className="text-sm text-muted-foreground">Critical Alerts</p>
              <p className="text-xs text-red-600">Out of Stock</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 bg-gradient-to-br from-orange-50/80 to-yellow-100/60 dark:from-orange-950/50 dark:to-yellow-900/30 backdrop-blur-xl shadow-xl">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center shadow-xl">
              <AlertTriangle className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-orange-600">{lowCount}</p>
              <p className="text-sm text-muted-foreground">Low Stock Alerts</p>
              <p className="text-xs text-orange-600">Below Threshold</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 bg-gradient-to-br from-blue-50/80 to-cyan-100/60 dark:from-blue-950/50 dark:to-cyan-900/30 backdrop-blur-xl shadow-xl">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl">
              <Bell className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-600">{totalAlerts}</p>
              <p className="text-sm text-muted-foreground">Total Alerts</p>
              <p className="text-xs text-blue-600">Need Attention</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AlertsPage() {
  const { products, getLowStockVariants, getCriticalStockVariants } = useInventoryStore()
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [sortBy, setSortBy] = useState<SortBy>("urgency")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all")

  const lowStockVariants = getLowStockVariants()
  const criticalStockVariants = getCriticalStockVariants()
  const allAlerts = [...criticalStockVariants, ...lowStockVariants]

  // Filter and sort alerts
  const filteredAlerts = allAlerts
    .filter((alert) => {
      const matchesSearch =
        alert.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.variant.volume.toLowerCase().includes(searchTerm.toLowerCase())
      const isCritical = alert.variant.currentSets === 0
      const isLow = alert.variant.currentSets <= alert.variant.threshold && alert.variant.currentSets > 0

      if (selectedSeverity === "critical") return matchesSearch && isCritical
      if (selectedSeverity === "low") return matchesSearch && isLow
      return matchesSearch
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "product":
          return a.product.name.localeCompare(b.product.name)
        case "urgency":
          const aIsCritical = a.variant.currentSets === 0
          const bIsCritical = b.variant.currentSets === 0
          if (aIsCritical && !bIsCritical) return -1
          if (!aIsCritical && bIsCritical) return 1
          return a.variant.currentSets - b.variant.currentSets
        case "stock":
          return a.variant.currentSets - b.variant.currentSets
        default:
          return 0
      }
    })

  const criticalCount = criticalStockVariants.length
  const lowCount = lowStockVariants.length
  const totalAlerts = allAlerts.length

  return (
    <div className="space-y-8">
      {/* Premium Header */}
      <div className="text-center space-y-4 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-transparent to-orange-500/10 rounded-3xl" />
        <div className="relative z-10 py-6">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent mb-3">
            Stock Alerts
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Monitor products that need immediate attention based on your custom thresholds
          </p>
        </div>
      </div>

      {totalAlerts > 0 && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-red-50/80 to-orange-50/60 dark:from-red-950/50 dark:to-orange-950/30 border-2 border-red-200 dark:border-red-800 backdrop-blur-xl shadow-xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-red-700 dark:text-red-300">Urgent Attention Required</h3>
              <p className="text-red-600 dark:text-red-400">
                You have {criticalCount} critical alerts and {lowCount} low stock warnings
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white border-0 shadow-lg">
              <TrendingUp className="w-4 h-4 mr-2" />
              Bulk Restock
            </Button>
            <Button variant="outline" className="bg-white/80 backdrop-blur-sm">
              <Package className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>
      )}

      <AlertsSummary criticalCount={criticalCount} lowCount={lowCount} totalAlerts={totalAlerts} />

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64 bg-white/80 backdrop-blur-sm"
            />
          </div>

          <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
            <SelectTrigger className="w-40 bg-white/80 backdrop-blur-sm">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Alerts</SelectItem>
              <SelectItem value="critical">Critical Only</SelectItem>
              <SelectItem value="low">Low Stock Only</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortBy)}>
            <SelectTrigger className="w-40 bg-white/80 backdrop-blur-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="urgency">By Urgency</SelectItem>
              <SelectItem value="product">By Product</SelectItem>
              <SelectItem value="stock">By Stock Level</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className={
              viewMode === "grid"
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0"
                : "bg-white/80 backdrop-blur-sm"
            }
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
            className={
              viewMode === "list"
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0"
                : "bg-white/80 backdrop-blur-sm"
            }
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {filteredAlerts.length === 0 ? (
        <Card className="border-0 bg-gradient-to-br from-white/90 via-white/70 to-white/50 dark:from-slate-900/90 dark:via-slate-800/70 dark:to-slate-700/50 backdrop-blur-xl shadow-xl">
          <CardContent className="p-12 text-center">
            <Bell className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-xl">No alerts match your current filters</p>
            <p className="text-sm text-muted-foreground mt-2">All products are above their threshold levels</p>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="bg-white/80 backdrop-blur-sm shadow-lg">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              All Alerts ({filteredAlerts.length})
            </TabsTrigger>
            <TabsTrigger
              value="critical"
              className="text-red-600 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-700 data-[state=active]:text-white"
            >
              Critical ({criticalCount})
            </TabsTrigger>
            <TabsTrigger
              value="low"
              className="text-orange-600 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-yellow-600 data-[state=active]:text-white"
            >
              Low Stock ({lowCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {viewMode === "grid" ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredAlerts.map((alert, index) => (
                  <AlertCard
                    key={`${alert.product.id}-${alert.variant.volume}`}
                    product={alert.product}
                    variant={alert.variant}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAlerts.map((alert, index) => (
                  <AlertCard
                    key={`${alert.product.id}-${alert.variant.volume}`}
                    product={alert.product}
                    variant={alert.variant}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="critical" className="space-y-4">
            {viewMode === "grid" ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {criticalStockVariants.map((alert, index) => (
                  <AlertCard
                    key={`${alert.product.id}-${alert.variant.volume}`}
                    product={alert.product}
                    variant={alert.variant}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {criticalStockVariants.map((alert, index) => (
                  <AlertCard
                    key={`${alert.product.id}-${alert.variant.volume}`}
                    product={alert.product}
                    variant={alert.variant}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="low" className="space-y-4">
            {viewMode === "grid" ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {lowStockVariants.map((alert, index) => (
                  <AlertCard
                    key={`${alert.product.id}-${alert.variant.volume}`}
                    product={alert.product}
                    variant={alert.variant}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {lowStockVariants.map((alert, index) => (
                  <AlertCard
                    key={`${alert.product.id}-${alert.variant.volume}`}
                    product={alert.product}
                    variant={alert.variant}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
