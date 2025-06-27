"use client"
import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "../../components/ui/dialog"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../components/ui/select"
import { useInventoryStore, Product, ProductVariant } from "../../lib/inventory-store"
import { toast } from "../../components/ui/use-toast"
import { Plus, Edit, Trash2 } from "lucide-react"

const VOLUME_OPTIONS = [
  "200ml",
  "250ml",
  "500ml",
  "750ml",
  "1L",
  "1.5L",
  "2L",
  "2.25L",
  "5L"
]

function NewFlavorDialog() {
  const { addNewProduct } = useInventoryStore()
  const [open, setOpen] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: "",
    color: "from-blue-500 to-blue-600",
    volume: "",
    setSize: "",
    currentSets: "",
    threshold: "",
  })

  const colorOptions = [
    { name: "Blue", value: "from-blue-500 to-blue-600" },
    { name: "Red", value: "from-red-500 to-red-600" },
    { name: "Green", value: "from-green-500 to-green-600" },
    { name: "Orange", value: "from-orange-500 to-orange-600" },
    { name: "Purple", value: "from-purple-500 to-purple-600" },
    { name: "Pink", value: "from-pink-500 to-pink-600" },
    { name: "Teal", value: "from-teal-500 to-teal-600" },
    { name: "Indigo", value: "from-indigo-500 to-indigo-600" },
  ]

  const handleAddProduct = () => {
    if (
      !newProduct.name ||
      !newProduct.volume ||
      !newProduct.setSize ||
      !newProduct.currentSets ||
      !newProduct.threshold
    ) {
      toast({
        title: "Missing Information",
        description: "Please fill all product details",
        variant: "destructive",
      })
      return
    }

    const product = {
      id: newProduct.name.toLowerCase().replace(/\s+/g, "-"),
      name: newProduct.name,
      color: newProduct.color,
      variants: [
        {
          volume: newProduct.volume,
          setSize: Number.parseInt(newProduct.setSize),
          currentSets: Number.parseInt(newProduct.currentSets),
          threshold: Number.parseInt(newProduct.threshold),
        },
      ],
    }

    addNewProduct(product)
    setNewProduct({
      name: "",
      color: "from-blue-500 to-blue-600",
      volume: "",
      setSize: "",
      currentSets: "",
      threshold: "",
    })
    setOpen(false)

    toast({
      title: "Flavor Added Successfully!",
      description: `${product.name} has been added to your inventory`,
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 text-white border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 px-8 py-3 text-lg">
          <Plus className="w-5 h-5 mr-3" />
          Add New Flavor
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent">
            Add New Flavor
          </DialogTitle>
          <DialogDescription>Create a new product flavor with initial volume and stock settings</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="productName">Product Name</Label>
            <Input
              id="productName"
              placeholder="e.g., Coca-Cola Zero, Fanta Grape"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            />
          </div>
          <div>
            <Label>Brand Color</Label>
            <Select value={newProduct.color} onValueChange={(value: string) => setNewProduct({ ...newProduct, color: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select brand color" />
              </SelectTrigger>
              <SelectContent>
                {colorOptions.map((color) => (
                  <SelectItem key={color.value} value={color.value}>
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${color.value}`} />
                      {color.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="initialVolume">Initial Volume</Label>
            <Select
              value={newProduct.volume}
              onValueChange={(value: string) => setNewProduct({ ...newProduct, volume: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select volume" />
              </SelectTrigger>
              <SelectContent>
                {VOLUME_OPTIONS.map((vol) => (
                  <SelectItem key={vol} value={vol}>{vol}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="initialSetSize">Bottles per Set</Label>
            <Input
              id="initialSetSize"
              type="number"
              placeholder="e.g., 24, 12, 6"
              value={newProduct.setSize}
              onChange={(e) => setNewProduct({ ...newProduct, setSize: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="initialStock">Initial Stock (Sets)</Label>
            <Input
              id="initialStock"
              type="number"
              placeholder="Current sets in stock"
              value={newProduct.currentSets}
              onChange={(e) => setNewProduct({ ...newProduct, currentSets: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="initialThreshold">Low Stock Threshold (Sets)</Label>
            <Input
              id="initialThreshold"
              type="number"
              placeholder="Alert when stock falls below"
              value={newProduct.threshold}
              onChange={(e) => setNewProduct({ ...newProduct, threshold: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddProduct} className="bg-gradient-to-r from-red-600 to-purple-600">
              Add Flavor
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function AddVolumeDialog({ productId }: { productId: string }) {
  const { addNewVariant } = useInventoryStore()
  const [open, setOpen] = useState(false)
  const [newVariant, setNewVariant] = useState({
    volume: "",
    setSize: "",
    currentSets: "",
    threshold: "",
  })

  const handleAddVariant = () => {
    if (!newVariant.volume || !newVariant.setSize || !newVariant.currentSets || !newVariant.threshold) {
      toast({
        title: "Missing Information",
        description: "Please fill all variant details",
        variant: "destructive",
      })
      return
    }
    addNewVariant(productId, {
      volume: newVariant.volume,
      setSize: Number.parseInt(newVariant.setSize),
      currentSets: Number.parseInt(newVariant.currentSets),
      threshold: Number.parseInt(newVariant.threshold),
    })
    setNewVariant({ volume: "", setSize: "", currentSets: "", threshold: "" })
    setOpen(false)
    toast({
      title: "Volume Added Successfully!",
      description: `New volume variant added to product`,
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 px-6 py-2 text-md">
          <Plus className="w-4 h-4 mr-2" />
          Add Volume
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Add New Volume
          </DialogTitle>
          <DialogDescription>Add a new volume variant with initial stock and threshold settings</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="volume">Volume Size</Label>
            <Select
              value={newVariant.volume}
              onValueChange={(value: string) => setNewVariant({ ...newVariant, volume: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select volume" />
              </SelectTrigger>
              <SelectContent>
                {VOLUME_OPTIONS.map((vol) => (
                  <SelectItem key={vol} value={vol}>{vol}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddVariant} className="bg-gradient-to-r from-blue-600 to-purple-600">
              Add Volume
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function EditFlavorDialog({ product, onSave }: { product: Product; onSave: (updates: any) => void }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(product.name)
  const [color, setColor] = useState(product.color)

  const colorOptions = [
    { name: "Blue", value: "from-blue-500 to-blue-600" },
    { name: "Red", value: "from-red-500 to-red-600" },
    { name: "Green", value: "from-green-500 to-green-600" },
    { name: "Orange", value: "from-orange-500 to-orange-600" },
    { name: "Purple", value: "from-purple-500 to-purple-600" },
    { name: "Pink", value: "from-pink-500 to-pink-600" },
    { name: "Teal", value: "from-teal-500 to-teal-600" },
    { name: "Indigo", value: "from-indigo-500 to-indigo-600" },
  ]

  const handleSave = () => {
    if (!name) {
      toast({ title: "Name required", variant: "destructive" })
      return
    }
    onSave({ name, color })
    setOpen(false)
    toast({ title: "Flavor updated!" })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost"><Edit className="w-4 h-4" /></Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Flavor</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <Label>Brand Color</Label>
            <Select value={color} onValueChange={setColor}>
              <SelectTrigger><SelectValue placeholder="Select color" /></SelectTrigger>
              <SelectContent>
                {colorOptions.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${c.value}`} />
                      {c.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function EditVolumeDialog({ variant, onSave }: { variant: ProductVariant; onSave: (updates: any) => void }) {
  const [open, setOpen] = useState(false)
  const [volume, setVolume] = useState(variant.volume)
  const [setSize, setSetSize] = useState(variant.setSize)
  const [currentSets, setCurrentSets] = useState(variant.currentSets)
  const [threshold, setThreshold] = useState(variant.threshold)

  const handleSave = () => {
    if (!volume || !setSize || !currentSets || !threshold) {
      toast({ title: "All fields required", variant: "destructive" })
      return
    }
    onSave({ volume, setSize, currentSets, threshold })
    setOpen(false)
    toast({ title: "Volume updated!" })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost"><Edit className="w-4 h-4" /></Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Volume</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Volume</Label>
            <Select value={volume} onValueChange={setVolume}>
              <SelectTrigger><SelectValue placeholder="Select volume" /></SelectTrigger>
              <SelectContent>
                {VOLUME_OPTIONS.map((vol) => (
                  <SelectItem key={vol} value={vol}>{vol}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Bottles per Set</Label>
            <Input type="number" value={setSize} onChange={e => setSetSize(Number(e.target.value))} />
          </div>
          <div>
            <Label>Current Sets</Label>
            <Input type="number" value={currentSets} onChange={e => setCurrentSets(Number(e.target.value))} />
          </div>
          <div>
            <Label>Low Stock Threshold</Label>
            <Input type="number" value={threshold} onChange={e => setThreshold(Number(e.target.value))} />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function SettingsPage() {
  const {
    products,
    updateProduct,
    deleteProduct,
    updateVariant,
    deleteVariant,
    initializeProducts,
  } = useInventoryStore()
  useState(() => { initializeProducts() })

  return (
    <div className="max-w-4xl mx-auto py-10 px-2 space-y-10">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Add New Flavor</h2>
        <NewFlavorDialog />
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-4">Manage Flavors & Volumes</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border rounded-lg text-sm">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800">
                <th className="p-2 text-left">Flavor</th>
                <th className="p-2 text-left">Color</th>
                <th className="p-2 text-left">Volumes</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b">
                  <td className="p-2 font-semibold">{product.name}</td>
                  <td className="p-2">
                    <span className={`inline-block w-6 h-6 rounded-full bg-gradient-to-r ${product.color}`} />
                  </td>
                  <td className="p-2">
                    <ul className="space-y-1">
                      {product.variants.map((variant) => (
                        <li key={variant.volume} className="flex items-center gap-2">
                          <span className="font-mono bg-slate-200 dark:bg-slate-700 rounded px-2 py-0.5">{variant.volume}</span>
                          <span className="text-xs text-slate-500">({variant.setSize}/set, {variant.currentSets} sets, threshold {variant.threshold})</span>
                          <EditVolumeDialog
                            variant={variant}
                            onSave={(updates) => updateVariant(product.id, variant.volume, updates)}
                          />
                          <Button size="icon" variant="ghost" onClick={() => {
                            deleteVariant(product.id, variant.volume)
                            toast({ title: "Volume deleted!" })
                          }}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="p-2 flex flex-col gap-2 min-w-[120px]">
                    <AddVolumeDialog productId={product.id} />
                    <EditFlavorDialog
                      product={product}
                      onSave={(updates) => updateProduct(product.id, updates)}
                    />
                    <Button size="icon" variant="ghost" onClick={() => {
                      deleteProduct(product.id)
                      toast({ title: "Flavor deleted!" })
                    }}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
} 