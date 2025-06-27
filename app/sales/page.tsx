"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ShoppingCart, Plus, Save, Trash2, User, FileText, Calculator, Receipt, BoxIcon as Bottle } from "lucide-react"
import { useInventoryStore, type SaleItem } from "@/lib/inventory-store"
import { toast } from "@/hooks/use-toast"

function NewSaleDialog() {
  const { products, recordSale, getRecentSales } = useInventoryStore()
  const [open, setOpen] = useState(false)
  const [customerName, setCustomerName] = useState("")
  const [customerAddress, setCustomerAddress] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [notes, setNotes] = useState("")
  const [items, setItems] = useState<SaleItem[]>([])
  const [currentItem, setCurrentItem] = useState({
    productId: "",
    volume: "",
    sets: "",
    price: "",
  })

  const selectedProduct = products.find((p) => p.id === currentItem.productId)
  const selectedVariant = selectedProduct?.variants.find((v) => v.volume === currentItem.volume)

  const addItem = () => {
    if (!selectedProduct || !selectedVariant || !currentItem.sets || !currentItem.price) {
      toast({
        title: "Missing Information",
        description: "Please fill all item details",
        variant: "destructive",
      })
      return
    }

    const sets = Number.parseInt(currentItem.sets)
    const pricePerSet = Number.parseFloat(currentItem.price)

    if (sets > selectedVariant.currentSets) {
      toast({
        title: "Insufficient Stock",
        description: `Only ${selectedVariant.currentSets} sets available`,
        variant: "destructive",
      })
      return
    }

    const newItem: SaleItem = {
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      volume: selectedVariant.volume,
      setSize: selectedVariant.setSize,
      setsSold: sets,
      pricePerSet,
      totalPrice: sets * pricePerSet,
    }

    setItems([...items, newItem])
    setCurrentItem({ productId: "", volume: "", sets: "", price: "" })
    toast({
      title: "Item Added",
      description: `${sets} sets of ${selectedProduct.name} ${selectedVariant.volume} added to bill`,
    })
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0)

  const saveSale = () => {
    if (!customerName || items.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please add customer name and at least one item",
        variant: "destructive",
      })
      return
    }

    recordSale({
      customerName,
      customerAddress,
      customerPhone,
      items,
      totalAmount,
      notes,
    })

    toast({
      title: "Sale Recorded Successfully!",
      description: `Bill for ${customerName} - ₹${totalAmount.toFixed(2)}`,
    })

    // Reset form
    setCustomerName("")
    setCustomerAddress("")
    setCustomerPhone("")
    setNotes("")
    setItems([])
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 px-8 py-4 text-lg">
          <Plus className="w-6 h-6 mr-3" />
          New Sale
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
            Create New Sale
          </DialogTitle>
          <DialogDescription>Add customer details and items to create a new sale bill</DialogDescription>
        </DialogHeader>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Customer Details */}
          <Card className="border-0 bg-gradient-to-br from-blue-50/80 to-cyan-50/60 dark:from-blue-950/50 dark:to-cyan-950/30 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                <User className="w-5 h-5" />
                Customer Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="customerName">Customer Name *</Label>
                <Input
                  id="customerName"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter customer name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="customerPhone">Phone Number</Label>
                <Input
                  id="customerPhone"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Enter phone number"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="customerAddress">Address</Label>
                <Textarea
                  id="customerAddress"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="Enter customer address"
                  className="mt-1"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional notes"
                  className="mt-1"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Add Items */}
          <Card className="border-0 bg-gradient-to-br from-emerald-50/80 to-green-50/60 dark:from-emerald-950/50 dark:to-green-950/30 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                <ShoppingCart className="w-5 h-5" />
                Add Items
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Product</Label>
                  <Select
                    value={currentItem.productId}
                    onValueChange={(value) => setCurrentItem({ ...currentItem, productId: value, volume: "" })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
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
                  <Label>Volume</Label>
                  <Select
                    value={currentItem.volume}
                    onValueChange={(value) => setCurrentItem({ ...currentItem, volume: value })}
                    disabled={!selectedProduct}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select volume" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedProduct?.variants.map((variant) => (
                        <SelectItem key={variant.volume} value={variant.volume}>
                          <div className="flex items-center justify-between w-full">
                            <span>{variant.volume}</span>
                            <Badge variant="secondary" className="ml-2">
                              {variant.currentSets} sets
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Sets to Sell</Label>
                  <Input
                    type="number"
                    value={currentItem.sets}
                    onChange={(e) => {
                      const value = Number.parseInt(e.target.value) || 0
                      const maxAvailable = selectedVariant?.currentSets || 0
                      if (value <= maxAvailable) {
                        setCurrentItem({ ...currentItem, sets: e.target.value })
                      } else {
                        setCurrentItem({ ...currentItem, sets: maxAvailable.toString() })
                        toast({
                          title: "Stock Limit Reached",
                          description: `Maximum ${maxAvailable} sets available`,
                          variant: "destructive",
                        })
                      }
                    }}
                    placeholder="Number of sets"
                    min="1"
                    max={selectedVariant?.currentSets || 0}
                    className="mt-1"
                  />
                  {selectedVariant && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Available: {selectedVariant.currentSets} sets ({selectedVariant.setSize} bottles/set)
                      {selectedVariant.currentSets <= selectedVariant.threshold && (
                        <span className="text-red-500 font-medium"> - Low Stock!</span>
                      )}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Price per Set (₹)</Label>
                  <Input
                    type="number"
                    value={currentItem.price}
                    onChange={(e) => setCurrentItem({ ...currentItem, price: e.target.value })}
                    placeholder="Price per set"
                    min="0"
                    step="0.01"
                    className="mt-1"
                  />
                </div>
              </div>

              {currentItem.sets && currentItem.price && (
                <div className="p-4 bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 rounded-lg">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                    <Calculator className="w-4 h-4" />
                    <span className="font-medium">
                      Total: ₹{(Number.parseInt(currentItem.sets) * Number.parseFloat(currentItem.price)).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              <Button
                onClick={addItem}
                className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add to Bill
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Items List */}
        {items.length > 0 && (
          <Card className="border-0 bg-gradient-to-br from-purple-50/80 to-pink-50/60 dark:from-purple-950/50 dark:to-pink-950/30 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
                <Receipt className="w-5 h-5" />
                Bill Items ({items.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Product</TableHead>
                      <TableHead>Volume</TableHead>
                      <TableHead className="text-center">Sets</TableHead>
                      <TableHead className="text-center">Price/Set</TableHead>
                      <TableHead className="text-center">Total</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Bottle className="w-4 h-4 text-blue-600" />
                            <span className="font-medium">{item.productName}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.volume}</Badge>
                        </TableCell>
                        <TableCell className="text-center font-semibold">{item.setsSold}</TableCell>
                        <TableCell className="text-center">₹{item.pricePerSet.toFixed(2)}</TableCell>
                        <TableCell className="text-center font-bold text-green-600">
                          ₹{item.totalPrice.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(index)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-6 p-6 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl">
                <div className="flex items-center justify-between text-2xl font-bold text-green-700 dark:text-green-300">
                  <span>Total Amount:</span>
                  <span>₹{totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button
                  onClick={saveSale}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Sale
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  )
}

function RecentSalesCard() {
  const { getRecentSales, getTodaysSales } = useInventoryStore()
  const recentSales = getRecentSales()
  const todaysSales = getTodaysSales()
  const todaysRevenue = todaysSales.reduce((sum, sale) => sum + sale.totalAmount, 0)

  return (
    <Card className="border-0 bg-gradient-to-br from-white/90 via-white/70 to-white/50 dark:from-slate-900/90 dark:via-slate-800/70 dark:to-slate-700/50 backdrop-blur-xl shadow-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
            <Receipt className="w-6 h-6 text-white" />
          </div>
          Recent Sales
        </CardTitle>
        <div className="flex gap-4">
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 px-4 py-2">
            Today: {todaysSales.length} sales
          </Badge>
          <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 px-4 py-2">
            Revenue: ₹{todaysRevenue.toFixed(2)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {recentSales.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">No sales recorded yet</p>
            <p className="text-sm text-muted-foreground mt-2">Create your first sale to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentSales.map((sale) => (
              <div
                key={sale.id}
                className="p-6 rounded-xl border bg-gradient-to-r from-white/80 to-gray-50/60 dark:from-slate-800/80 dark:to-slate-700/60 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-bold text-lg text-slate-800 dark:text-slate-200">{sale.customerName}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{sale.customerPhone}</p>
                    {sale.customerAddress && (
                      <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">{sale.customerAddress}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">₹{sale.totalAmount.toFixed(2)}</div>
                    <div className="text-xs text-slate-500">{sale.timestamp.toLocaleString()}</div>
                  </div>
                </div>

                <div className="grid gap-2">
                  {sale.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-sm bg-white/50 dark:bg-slate-700/50 p-3 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <Bottle className="w-4 h-4 text-blue-600" />
                        <span>
                          {item.productName} {item.volume}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-slate-600 dark:text-slate-400">{item.setsSold} sets</span>
                        <span className="font-semibold">₹{item.totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {sale.notes && (
                  <div className="mt-4 p-3 bg-blue-50/80 dark:bg-blue-950/30 rounded-lg">
                    <div className="flex items-start gap-2">
                      <FileText className="w-4 h-4 text-blue-600 mt-0.5" />
                      <span className="text-sm text-blue-700 dark:text-blue-300">{sale.notes}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function SalesPage() {
  return (
    <div className="space-y-10">
      {/* Premium Header */}
      <div className="text-center space-y-6 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-blue-500/10 rounded-3xl" />
        <div className="relative z-10 py-8">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Sales Management
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Create comprehensive sales bills with multiple items and customer details
          </p>
        </div>
      </div>

      {/* Action Section */}
      <div className="flex justify-center">
        <NewSaleDialog />
      </div>

      {/* Recent Sales */}
      <RecentSalesCard />
    </div>
  )
}
