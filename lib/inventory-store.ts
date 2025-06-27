"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface ProductVariant {
  volume: string
  setSize: number
  currentSets: number
  threshold: number
}

export interface Product {
  id: string
  name: string
  color: string
  variants: ProductVariant[]
  lastUpdated: Date
}

export interface SaleItem {
  productId: string
  productName: string
  volume: string
  setSize: number
  setsSold: number
  pricePerSet: number
  totalPrice: number
}

export interface Sale {
  id: string
  customerName: string
  customerAddress: string
  customerPhone: string
  items: SaleItem[]
  totalAmount: number
  notes?: string
  timestamp: Date
}

export interface IncomingEntry {
  id: string
  productId: string
  productName: string
  volume: string
  setSize: number
  setsReceived: number
  notes?: string
  timestamp: Date
}

interface InventoryStore {
  products: Product[]
  sales: Sale[]
  incomingHistory: IncomingEntry[]

  // Actions
  initializeProducts: () => void
  addNewProduct: (product: Omit<Product, "lastUpdated">) => void
  addNewVariant: (productId: string, variant: ProductVariant) => void
  updateThreshold: (productId: string, volume: string, threshold: number) => void
  recordSale: (sale: Omit<Sale, "id" | "timestamp">) => void
  recordIncoming: (entry: Omit<IncomingEntry, "id" | "timestamp">) => void
  getProductVariant: (productId: string, volume: string) => { product: Product; variant: ProductVariant } | null
  getLowStockVariants: () => Array<{ product: Product; variant: ProductVariant }>
  getCriticalStockVariants: () => Array<{ product: Product; variant: ProductVariant }>
  getTotalInventoryValue: () => {
    totalProducts: number
    totalVariants: number
    totalSets: number
    lowStockCount: number
    criticalStockCount: number
  }
  getTodaysSales: () => Sale[]
  getRecentSales: () => Sale[]
  updateProduct: (productId: string, updates: Partial<Omit<Product, 'id' | 'variants' | 'lastUpdated'>>) => void
  deleteProduct: (productId: string) => void
  updateVariant: (productId: string, volume: string, updates: Partial<ProductVariant>) => void
  deleteVariant: (productId: string, volume: string) => void
}

const initialProducts: Product[] = [
  {
    id: "coca-cola",
    name: "Coca-Cola",
    color: "from-red-600 via-red-500 to-red-700",
    variants: [
      { volume: "200ml", setSize: 24, currentSets: 45, threshold: 10 },
      { volume: "750ml", setSize: 12, currentSets: 38, threshold: 8 },
      { volume: "2.25L", setSize: 9, currentSets: 25, threshold: 5 },
    ],
    lastUpdated: new Date(),
  },
  {
    id: "thums-up",
    name: "Thums Up",
    color: "from-gray-800 via-gray-700 to-gray-900",
    variants: [
      { volume: "200ml", setSize: 24, currentSets: 35, threshold: 8 },
      { volume: "750ml", setSize: 12, currentSets: 22, threshold: 6 },
      { volume: "300ml", setSize: 20, currentSets: 18, threshold: 4 },
    ],
    lastUpdated: new Date(),
  },
  {
    id: "sprite",
    name: "Sprite",
    color: "from-emerald-500 via-green-500 to-teal-600",
    variants: [
      { volume: "200ml", setSize: 24, currentSets: 52, threshold: 12 },
      { volume: "750ml", setSize: 12, currentSets: 28, threshold: 8 },
      { volume: "2.25L", setSize: 9, currentSets: 15, threshold: 4 },
    ],
    lastUpdated: new Date(),
  },
  {
    id: "fanta",
    name: "Fanta",
    color: "from-orange-500 via-amber-500 to-yellow-500",
    variants: [
      { volume: "200ml", setSize: 24, currentSets: 42, threshold: 10 },
      { volume: "750ml", setSize: 12, currentSets: 25, threshold: 6 },
      { volume: "2.25L", setSize: 9, currentSets: 12, threshold: 3 },
    ],
    lastUpdated: new Date(),
  },
  {
    id: "limca",
    name: "Limca",
    color: "from-lime-500 via-green-400 to-emerald-500",
    variants: [
      { volume: "200ml", setSize: 24, currentSets: 18, threshold: 6 },
      { volume: "750ml", setSize: 12, currentSets: 15, threshold: 4 },
    ],
    lastUpdated: new Date(),
  },
  {
    id: "maaza",
    name: "Maaza",
    color: "from-yellow-500 via-orange-400 to-red-500",
    variants: [
      { volume: "200ml", setSize: 24, currentSets: 28, threshold: 8 },
      { volume: "600ml", setSize: 15, currentSets: 20, threshold: 5 },
      { volume: "1.2L", setSize: 12, currentSets: 14, threshold: 3 },
    ],
    lastUpdated: new Date(),
  },
  {
    id: "kinley",
    name: "Kinley",
    color: "from-blue-500 via-cyan-500 to-teal-500",
    variants: [
      { volume: "500ml", setSize: 24, currentSets: 30, threshold: 8 },
      { volume: "1L", setSize: 12, currentSets: 22, threshold: 5 },
      { volume: "2L", setSize: 6, currentSets: 16, threshold: 3 },
    ],
    lastUpdated: new Date(),
  },
]

export const useInventoryStore = create<InventoryStore>()(
  persist(
    (set, get) => ({
      products: [],
      sales: [],
      incomingHistory: [],

      initializeProducts: () => {
        const { products } = get()
        if (products.length === 0) {
          set({ products: initialProducts })
        }
      },

      addNewProduct: (product: Omit<Product, "lastUpdated">) => {
        set((state) => ({
          products: [
            ...state.products,
            {
              ...product,
              lastUpdated: new Date(),
            },
          ],
        }))
      },

      addNewVariant: (productId: string, variant: ProductVariant) => {
        set((state) => ({
          products: state.products.map((product) =>
            product.id === productId
              ? {
                  ...product,
                  variants: [...product.variants, variant],
                  lastUpdated: new Date(),
                }
              : product,
          ),
        }))
      },

      updateThreshold: (productId: string, volume: string, threshold: number) => {
        set((state) => ({
          products: state.products.map((product) =>
            product.id === productId
              ? {
                  ...product,
                  variants: product.variants.map((variant) =>
                    variant.volume === volume ? { ...variant, threshold } : variant,
                  ),
                  lastUpdated: new Date(),
                }
              : product,
          ),
        }))
      },

      recordSale: (sale: Omit<Sale, "id" | "timestamp">) => {
        const newSale: Sale = {
          ...sale,
          id: Date.now().toString(),
          timestamp: new Date(),
        }

        set((state) => {
          const updatedProducts = state.products.map((product) => {
            const updatedVariants = product.variants.map((variant) => {
              const saleItem = sale.items.find(
                (item) => item.productId === product.id && item.volume === variant.volume,
              )
              if (saleItem) {
                return {
                  ...variant,
                  currentSets: Math.max(0, variant.currentSets - saleItem.setsSold),
                }
              }
              return variant
            })
            return {
              ...product,
              variants: updatedVariants,
              lastUpdated: new Date(),
            }
          })

          return {
            products: updatedProducts,
            sales: [...state.sales, newSale],
          }
        })
      },

      recordIncoming: (entry: Omit<IncomingEntry, "id" | "timestamp">) => {
        const newEntry: IncomingEntry = {
          ...entry,
          id: Date.now().toString(),
          timestamp: new Date(),
        }

        set((state) => {
          const updatedProducts = state.products.map((product) => {
            if (product.id === entry.productId) {
              const updatedVariants = product.variants.map((variant) =>
                variant.volume === entry.volume
                  ? {
                      ...variant,
                      currentSets: variant.currentSets + entry.setsReceived,
                    }
                  : variant,
              )
              return {
                ...product,
                variants: updatedVariants,
                lastUpdated: new Date(),
              }
            }
            return product
          })

          return {
            products: updatedProducts,
            incomingHistory: [...state.incomingHistory, newEntry],
          }
        })
      },

      getProductVariant: (productId: string, volume: string) => {
        const product = get().products.find((p) => p.id === productId)
        if (!product) return null

        const variant = product.variants.find((v) => v.volume === volume)
        if (!variant) return null

        return { product, variant }
      },

      getLowStockVariants: () => {
        const { products } = get()
        const lowStock: Array<{ product: Product; variant: ProductVariant }> = []

        products.forEach((product) => {
          product.variants.forEach((variant) => {
            if (variant.currentSets <= variant.threshold && variant.currentSets > 0) {
              lowStock.push({ product, variant })
            }
          })
        })

        return lowStock
      },

      getCriticalStockVariants: () => {
        const { products } = get()
        const criticalStock: Array<{ product: Product; variant: ProductVariant }> = []

        products.forEach((product) => {
          product.variants.forEach((variant) => {
            if (variant.currentSets === 0) {
              criticalStock.push({ product, variant })
            }
          })
        })

        return criticalStock
      },

      getTotalInventoryValue: () => {
        const { products } = get()
        const totalProducts = products.length
        const totalVariants = products.reduce((sum, product) => sum + product.variants.length, 0)
        const totalSets = products.reduce(
          (sum, product) => sum + product.variants.reduce((variantSum, variant) => variantSum + variant.currentSets, 0),
          0,
        )
        const lowStockCount = get().getLowStockVariants().length
        const criticalStockCount = get().getCriticalStockVariants().length

        return { totalProducts, totalVariants, totalSets, lowStockCount, criticalStockCount }
      },

      getTodaysSales: () => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        return get().sales.filter((sale) => sale.timestamp >= today)
      },

      getRecentSales: () => {
        return get().sales.slice(-10).reverse()
      },

      updateProduct: (productId, updates) => {
        set((state) => ({
          products: state.products.map((product) =>
            product.id === productId
              ? { ...product, ...updates, lastUpdated: new Date() }
              : product
          ),
        }))
      },

      deleteProduct: (productId) => {
        set((state) => ({
          products: state.products.filter((product) => product.id !== productId),
        }))
      },

      updateVariant: (productId, volume, updates) => {
        set((state) => ({
          products: state.products.map((product) =>
            product.id === productId
              ? {
                  ...product,
                  variants: product.variants.map((variant) =>
                    variant.volume === volume ? { ...variant, ...updates } : variant
                  ),
                  lastUpdated: new Date(),
                }
              : product
          ),
        }))
      },

      deleteVariant: (productId, volume) => {
        set((state) => ({
          products: state.products.map((product) =>
            product.id === productId
              ? {
                  ...product,
                  variants: product.variants.filter((variant) => variant.volume !== volume),
                  lastUpdated: new Date(),
                }
              : product
          ),
        }))
      },
    }),
    {
      name: "inventory-storage",
    },
  ),
)
