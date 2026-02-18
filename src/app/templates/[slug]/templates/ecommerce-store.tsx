"use client"

import { useState } from "react"
import { ShoppingCartIcon, SearchIcon, StarIcon, HeartIcon, XIcon, PlusIcon, MinusIcon } from "lucide-react"

const categories = ["All", "Electronics", "Clothing", "Books", "Home", "Sports"]

const products = [
  { id: 1, name: "AirPods Pro 2nd Gen", price: 249, rating: 4.8, reviews: 2341, category: "Electronics", image: "https://images.unsplash.com/photo-1609692814858-f7cd2f0afa4f?w=300&q=80" },
  { id: 2, name: "Merino Wool Sweater", price: 89, rating: 4.6, reviews: 412, category: "Clothing", image: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=300&q=80" },
  { id: 3, name: "Atomic Habits", price: 18, rating: 4.9, reviews: 8921, category: "Books", image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=300&q=80" },
  { id: 4, name: "Mechanical Keyboard", price: 149, rating: 4.7, reviews: 1204, category: "Electronics", image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=300&q=80" },
  { id: 5, name: "Yoga Mat Premium", price: 64, rating: 4.5, reviews: 867, category: "Sports", image: "https://images.unsplash.com/photo-1601925228009-b6abe7b4e42a?w=300&q=80" },
  { id: 6, name: "Ceramic Mug Set", price: 42, rating: 4.4, reviews: 543, category: "Home", image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=300&q=80" },
]

interface CartItem { id: number; name: string; price: number; qty: number; image: string }

export function EcommerceStore() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [cartOpen, setCartOpen] = useState(false)
  const [cart, setCart] = useState<CartItem[]>([])
  const [liked, setLiked] = useState<Set<number>>(new Set())

  const filtered = activeCategory === "All" ? products : products.filter(p => p.category === activeCategory)
  const cartCount = cart.reduce((s, i) => s + i.qty, 0)
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0)

  const addToCart = (p: typeof products[0]) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === p.id)
      if (existing) return prev.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { id: p.id, name: p.name, price: p.price, qty: 1, image: p.image }]
    })
  }

  const updateQty = (id: number, delta: number) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i).filter(i => i.qty > 0))
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
          <span className="font-extrabold text-xl tracking-tight text-gray-900">SHOP<span className="text-indigo-600">HAUS</span></span>
          <div className="hidden md:flex flex-1 max-w-sm mx-8">
            <div className="flex items-center gap-2 w-full bg-gray-100 rounded-full px-4 py-2">
              <SearchIcon className="h-4 w-4 text-gray-400" />
              <input className="bg-transparent text-sm outline-none w-full text-gray-700 placeholder:text-gray-400" placeholder="Search products..." />
            </div>
          </div>
          <button onClick={() => setCartOpen(true)} className="relative flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">
            <ShoppingCartIcon className="h-4 w-4" />
            Cart
            {cartCount > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">{cartCount}</span>}
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8 flex gap-8">
        {/* Sidebar */}
        <aside className="hidden lg:block w-48 shrink-0">
          <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3">Categories</h3>
          <ul className="flex flex-col gap-1">
            {categories.map(c => (
              <li key={c}>
                <button
                  onClick={() => setActiveCategory(c)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeCategory === c ? "bg-indigo-50 text-indigo-700" : "text-gray-600 hover:bg-gray-100"}`}
                >
                  {c}
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3">Price Range</h3>
            <div className="flex flex-col gap-2">
              {["Under $25", "$25 – $100", "$100 – $250", "$250+"].map(r => (
                <label key={r} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input type="checkbox" className="rounded accent-indigo-600" />
                  {r}
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Products */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-gray-500">{filtered.length} products</p>
            <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700 outline-none">
              <option>Sort: Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Best Rated</option>
            </select>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {filtered.map(p => (
              <div key={p.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group">
                <div className="relative overflow-hidden">
                  <img src={p.image} alt={p.name} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500" />
                  <button
                    onClick={() => setLiked(prev => { const n = new Set(prev); n.has(p.id) ? n.delete(p.id) : n.add(p.id); return n })}
                    className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow"
                  >
                    <HeartIcon className={`h-4 w-4 ${liked.has(p.id) ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
                  </button>
                </div>
                <div className="p-4">
                  <p className="text-[10px] uppercase tracking-wider text-indigo-500 font-semibold mb-1">{p.category}</p>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1 leading-tight">{p.name}</h3>
                  <div className="flex items-center gap-1 mb-3">
                    <StarIcon className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-gray-600">{p.rating}</span>
                    <span className="text-xs text-gray-400">({p.reviews.toLocaleString()})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900">${p.price}</span>
                    <button
                      onClick={() => addToCart(p)}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-3 py-1.5 rounded-lg transition-colors font-medium"
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cart drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setCartOpen(false)} />
          <div className="relative w-full max-w-sm bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h2 className="font-bold text-base">Your Cart ({cartCount})</h2>
              <button onClick={() => setCartOpen(false)}><XIcon className="h-5 w-5 text-gray-500" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
              {cart.length === 0 ? (
                <p className="text-gray-400 text-sm text-center mt-8">Your cart is empty</p>
              ) : cart.map(item => (
                <div key={item.id} className="flex gap-3">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 leading-tight">{item.name}</p>
                    <p className="text-sm text-gray-500 mt-0.5">${item.price}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 border rounded flex items-center justify-center"><MinusIcon className="h-3 w-3" /></button>
                      <span className="text-sm font-medium w-4 text-center">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 border rounded flex items-center justify-center"><PlusIcon className="h-3 w-3" /></button>
                    </div>
                  </div>
                  <span className="font-semibold text-sm">${item.price * item.qty}</span>
                </div>
              ))}
            </div>
            {cart.length > 0 && (
              <div className="p-5 border-t">
                <div className="flex justify-between text-sm mb-1"><span className="text-gray-500">Subtotal</span><span className="font-semibold">${cartTotal}</span></div>
                <div className="flex justify-between text-sm mb-4"><span className="text-gray-500">Shipping</span><span className="text-emerald-600">Free</span></div>
                <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-semibold text-sm transition-colors">
                  Checkout · ${cartTotal}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
