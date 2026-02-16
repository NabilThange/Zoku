"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Edit, Save, X, Plus, Trash2, Star, Flame, TrendingUp, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface MenuItem {
  id: string
  name: string
  price: number
  description?: string
  image_url?: string
  category: string
  is_veg: boolean
  available: boolean
  prep_time: number
  calories?: number
  is_spicy?: boolean
  is_bestseller?: boolean
  is_popular?: boolean
  nutritional_info?: Record<string, any>
  tags?: string[]
  ingredients?: string[]
}

interface MenuManagementProps {
  menuItems: MenuItem[]
  onUpdateItem: (id: string, updates: Partial<MenuItem>) => Promise<void>
  onDeleteItem: (id: string) => Promise<void>
  onAddItem: (item: Omit<MenuItem, "id">) => Promise<void>
  onToggleAvailability: (id: string, available: boolean) => Promise<void>
}

export function MenuManagement({
  menuItems,
  onUpdateItem,
  onDeleteItem,
  onAddItem,
  onToggleAvailability,
}: MenuManagementProps) {
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<MenuItem>>({})
  const [isAddingItem, setIsAddingItem] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; itemId: string; itemName: string }>({
    isOpen: false,
    itemId: "",
    itemName: "",
  })
  const [newItemForm, setNewItemForm] = useState<Omit<MenuItem, "id">>({
    name: "",
    price: 0,
    description: "",
    image_url: "",
    category: "lunch",
    is_veg: true,
    available: true,
    prep_time: 15,
    calories: 0,
    is_spicy: false,
    is_bestseller: false,
    is_popular: false,
    nutritional_info: {},
    tags: [],
    ingredients: [],
  })
  const [loading, setLoading] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const categories = ["breakfast", "lunch", "snacks", "beverages"]

  const validateForm = (form: Omit<MenuItem, "id">) => {
    const errors: Record<string, string> = {}

    if (!form.name.trim()) errors.name = "Item name is required"
    if (form.price <= 0) errors.price = "Price must be greater than 0"
    if (form.prep_time <= 0) errors.prep_time = "Prep time must be greater than 0"
    if (form.calories && form.calories < 0) errors.calories = "Calories cannot be negative"

    return errors
  }

  const startEditing = (item: MenuItem) => {
    setEditingItem(item.id)
    setEditForm(item)
  }

  const saveEdit = async () => {
    if (editingItem && editForm) {
      try {
        setLoading(editingItem)
        await onUpdateItem(editingItem, editForm)
        setEditingItem(null)
        setEditForm({})
      } catch (error) {
        console.error("Error updating item:", error)
      } finally {
        setLoading(null)
      }
    }
  }

  const cancelEdit = () => {
    setEditingItem(null)
    setEditForm({})
  }

  const handleAddItem = async () => {
    const errors = validateForm(newItemForm)
    setValidationErrors(errors)

    if (Object.keys(errors).length > 0) {
      return
    }

    try {
      setLoading("adding")
      await onAddItem(newItemForm)
      setNewItemForm({
        name: "",
        price: 0,
        description: "",
        image_url: "",
        category: "lunch",
        is_veg: true,
        available: true,
        prep_time: 15,
        calories: 0,
        is_spicy: false,
        is_bestseller: false,
        is_popular: false,
        nutritional_info: {},
        tags: [],
        ingredients: [],
      })
      setValidationErrors({})
      setIsAddingItem(false)
    } catch (error) {
      console.error("Error adding item:", error)
    } finally {
      setLoading(null)
    }
  }

  const toggleAvailability = async (id: string, available: boolean) => {
    try {
      setLoading(id)
      await onToggleAvailability(id, available)
    } catch (error) {
      console.error("Error toggling availability:", error)
    } finally {
      setLoading(null)
    }
  }

  const { toast } = useToast()

  const handleDelete = (id: string, itemName: string) => {
    setDeleteConfirm({
      isOpen: true,
      itemId: id,
      itemName: itemName,
    })
  }

  const confirmDelete = async () => {
    const { itemId, itemName } = deleteConfirm

    try {
      setLoading(itemId)
      await onDeleteItem(itemId)
      toast({
        title: "Item Deleted",
        description: `"${itemName}" has been successfully deleted.`,
      })
    } catch (error) {
      console.error("Error deleting item:", error)
      toast({
        title: "Error",
        description: "Failed to delete the item. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(null)
      setDeleteConfirm({ isOpen: false, itemId: "", itemName: "" })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-orange-50/30">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Header with Add Button - Mobile optimized */}
        <header className="bg-white rounded-2xl shadow-sm border border-orange-100 p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                Menu Management
              </h1>
              <p className="text-gray-600 mt-2 text-base sm:text-lg">
                Control your menu items and availability in real-time
              </p>
            </div>
            <Dialog open={isAddingItem} onOpenChange={setIsAddingItem}>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  disabled={loading === "adding"}
                  className="w-full sm:w-auto h-14 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  {loading === "adding" ? "Adding..." : "Add New Item"}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-orange-50/80 to-white backdrop-blur-sm border-orange-200 shadow-2xl">
                <DialogHeader className="pb-6 border-b border-orange-200/60">
                  <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                    Add New Menu Item
                  </DialogTitle>
                  <p className="text-gray-600 mt-2">Create a new delicious item for your menu</p>
                </DialogHeader>

                <div className="space-y-8 pt-6">
                  {/* Basic Information Section */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-orange-100/60 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl flex items-center justify-center shadow-sm">
                        <div className="w-4 h-4 bg-white rounded-full"></div>
                      </div>
                      Basic Information
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-1 block">
                            Item Name *
                          </Label>
                          <Input
                            id="name"
                            value={newItemForm.name}
                            onChange={(e) => setNewItemForm((prev) => ({ ...prev, name: e.target.value }))}
                            placeholder="e.g., Chicken Biryani"
                            className={`h-12 text-base ${
                              validationErrors.name
                                ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                                : "border-gray-200 focus:border-orange-400 focus:ring-orange-400/20"
                            }`}
                          />
                          {validationErrors.name && (
                            <p className="text-sm text-red-600 mt-1">{validationErrors.name}</p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="category" className="text-sm font-medium text-gray-700 mb-1 block">
                            Category *
                          </Label>
                          <select
                            id="category"
                            value={newItemForm.category}
                            onChange={(e) => setNewItemForm((prev) => ({ ...prev, category: e.target.value }))}
                            className="w-full h-12 px-3 text-base border border-gray-200 rounded-md bg-white text-gray-900 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
                          >
                            {categories.map((cat) => (
                              <option key={cat} value={cat}>
                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="description" className="text-sm font-medium text-gray-700 mb-1 block">
                          Description
                        </Label>
                        <Textarea
                          id="description"
                          value={newItemForm.description}
                          onChange={(e) => setNewItemForm((prev) => ({ ...prev, description: e.target.value }))}
                          placeholder="Brief description of the dish..."
                          className="min-h-[90px] text-base border-gray-200 focus:border-orange-400 focus:ring-orange-400/20"
                        />
                      </div>
                      <div>
                        <Label htmlFor="image_url" className="text-sm font-medium text-gray-700 mb-1 block">
                          Image URL
                        </Label>
                        <Input
                          id="image_url"
                          value={newItemForm.image_url}
                          onChange={(e) => setNewItemForm((prev) => ({ ...prev, image_url: e.target.value }))}
                          placeholder="https://example.com/image.jpg"
                          className="h-12 text-base border-gray-200 focus:border-orange-400 focus:ring-orange-400/20"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Pricing & Time Section */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-orange-100/60 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-500 rounded-xl flex items-center justify-center shadow-sm">
                        <div className="w-4 h-4 bg-white rounded-full"></div>
                      </div>
                      Pricing & Time
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="price" className="text-sm font-medium text-gray-700 mb-1 block">
                          Price (₹) *
                        </Label>
                        <Input
                          id="price"
                          type="number"
                          value={newItemForm.price}
                          onChange={(e) => setNewItemForm((prev) => ({ ...prev, price: Number(e.target.value) }))}
                          placeholder="0"
                          className={`h-12 text-base ${
                            validationErrors.price
                              ? "border-red-400 focus:border-red-500"
                              : "border-gray-200 focus:border-orange-400 focus:ring-orange-400/20"
                          }`}
                        />
                        {validationErrors.price && (
                          <p className="text-sm text-red-600 mt-1">{validationErrors.price}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="prepTime" className="text-sm font-medium text-gray-700 mb-1 block">
                          Prep Time (mins) *
                        </Label>
                        <Input
                          id="prepTime"
                          type="number"
                          value={newItemForm.prep_time}
                          onChange={(e) => setNewItemForm((prev) => ({ ...prev, prep_time: Number(e.target.value) }))}
                          placeholder="15"
                          className={`h-12 text-base ${
                            validationErrors.prep_time
                              ? "border-red-400 focus:border-red-500"
                              : "border-gray-200 focus:border-orange-400 focus:ring-orange-400/20"
                          }`}
                        />
                        {validationErrors.prep_time && (
                          <p className="text-sm text-red-600 mt-1">{validationErrors.prep_time}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="calories" className="text-sm font-medium text-gray-700 mb-1 block">
                          Calories
                        </Label>
                        <Input
                          id="calories"
                          type="number"
                          value={newItemForm.calories}
                          onChange={(e) => setNewItemForm((prev) => ({ ...prev, calories: Number(e.target.value) }))}
                          placeholder="0"
                          className="h-12 text-base border-gray-200 focus:border-orange-400 focus:ring-orange-400/20"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Tags & Properties Section */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-orange-100/60 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl flex items-center justify-center shadow-sm">
                        <div className="w-4 h-4 bg-white rounded-full"></div>
                      </div>
                      Properties
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <label className="flex items-center space-x-3 p-4 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl border border-orange-200/60 cursor-pointer hover:from-orange-100 hover:to-orange-150 transition-all duration-200 shadow-sm">
                        <Switch
                          id="isVeg"
                          checked={newItemForm.is_veg}
                          onCheckedChange={(checked) => setNewItemForm((prev) => ({ ...prev, is_veg: checked }))}
                          className="data-[state=checked]:bg-green-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Veg</span>
                      </label>
                      <label className="flex items-center space-x-3 p-4 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl border border-orange-200/60 cursor-pointer hover:from-orange-100 hover:to-orange-150 transition-all duration-200 shadow-sm">
                        <Switch
                          id="isSpicy"
                          checked={newItemForm.is_spicy}
                          onCheckedChange={(checked) => setNewItemForm((prev) => ({ ...prev, is_spicy: checked }))}
                          className="data-[state=checked]:bg-red-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Spicy</span>
                      </label>
                      <label className="flex items-center space-x-3 p-4 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl border border-orange-200/60 cursor-pointer hover:from-orange-100 hover:to-orange-150 transition-all duration-200 shadow-sm">
                        <Switch
                          id="isBestSeller"
                          checked={newItemForm.is_bestseller}
                          onCheckedChange={(checked) => setNewItemForm((prev) => ({ ...prev, is_bestseller: checked }))}
                          className="data-[state=checked]:bg-yellow-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Best</span>
                      </label>
                      <label className="flex items-center space-x-3 p-4 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl border border-orange-200/60 cursor-pointer hover:from-orange-100 hover:to-orange-150 transition-all duration-200 shadow-sm">
                        <Switch
                          id="isPopular"
                          checked={newItemForm.is_popular}
                          onCheckedChange={(checked) => setNewItemForm((prev) => ({ ...prev, is_popular: checked }))}
                          className="data-[state=checked]:bg-purple-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Popular</span>
                      </label>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-orange-200/60">
                    <Button
                      onClick={handleAddItem}
                      disabled={loading === "adding"}
                      className="flex-1 h-14 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      {loading === "adding" ? "Adding Item..." : "Add Menu Item"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsAddingItem(false)}
                      className="h-14 font-semibold text-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 rounded-xl"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        {/* Menu Items Grid - Mobile first responsive */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {menuItems.map((item) => (
            <Card
              key={item.id}
              className={`group transition-all duration-200 hover:shadow-lg border ${
                editingItem === item.id
                  ? "bg-orange-50 border-orange-300 shadow-md"
                  : "bg-white border-orange-100 hover:border-orange-200"
              }`}
            >
              <CardContent className="p-5 sm:p-6">
                {editingItem === item.id ? (
                  // Edit Mode
                  <div className="space-y-5">
                    <div className="flex items-center gap-3 pb-3 border-b border-orange-200">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                        <Edit className="w-4 h-4 text-orange-600" />
                      </div>
                      <span className="text-sm font-semibold text-orange-700">Editing Mode</span>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-700 mb-1 block">Item Name</Label>
                          <Input
                            value={editForm.name || ""}
                            onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                            className="h-11 text-base border-gray-200 focus:border-orange-400 focus:ring-orange-400/20"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700 mb-1 block">Price (₹)</Label>
                          <Input
                            type="number"
                            value={editForm.price || 0}
                            onChange={(e) => setEditForm((prev) => ({ ...prev, price: Number(e.target.value) }))}
                            className="h-11 text-base border-gray-200 focus:border-orange-400 focus:ring-orange-400/20"
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-1 block">Description</Label>
                        <Textarea
                          value={editForm.description || ""}
                          onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))}
                          className="min-h-[90px] text-base border-gray-200 focus:border-orange-400 focus:ring-orange-400/20"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-700 mb-1 block">Prep Time (mins)</Label>
                          <Input
                            type="number"
                            value={editForm.prep_time || 0}
                            onChange={(e) => setEditForm((prev) => ({ ...prev, prep_time: Number(e.target.value) }))}
                            className="h-11 text-base border-gray-200 focus:border-orange-400 focus:ring-orange-400/20"
                          />
                        </div>
                        <div className="flex items-center space-x-3 pt-7">
                          <Switch
                            checked={editForm.is_veg || false}
                            onCheckedChange={(checked) => setEditForm((prev) => ({ ...prev, is_veg: checked }))}
                            className="data-[state=checked]:bg-green-500"
                          />
                          <Label className="text-sm font-medium text-gray-700">Vegetarian</Label>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-3 border-t border-orange-200">
                      <Button
                        onClick={saveEdit}
                        disabled={loading === item.id}
                        className="flex-1 h-11 bg-orange-500 hover:bg-orange-600 text-white font-medium shadow-sm hover:shadow transition-all"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {loading === item.id ? "Saving..." : "Save"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={cancelEdit}
                        className="h-11 font-medium border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  // View Mode - Clear hierarchy
                  <div className="space-y-4">
                    {/* Item Name - Most Dominant */}
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight flex-1">{item.name}</h3>
                      {item.is_veg && (
                        <div className="flex-shrink-0 w-7 h-7 border-2 border-green-500 rounded flex items-center justify-center bg-green-50">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        </div>
                      )}
                    </div>

                    {/* Image - Second in hierarchy */}
                    <div className="w-full h-48 sm:h-56 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                      <img
                        src={item.image_url || "/placeholder.svg?height=224&width=400&query=delicious food item"}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          console.log(`[v0] Image failed to load for ${item.name}, original URL: ${item.image_url}`)
                          // First try our custom fallback image
                          if (!target.src.includes("delicious-food-item.png")) {
                            target.src = "/delicious-food-item.png"
                          } else {
                            // If custom image also fails, use placeholder
                            target.src = "/delicious-food-item.png"
                          }
                        }}
                        onLoad={() => {
                          console.log(`[v0] Image loaded successfully for ${item.name} from URL: ${item.image_url}`)
                        }}
                      />
                    </div>

                    {/* Price and details */}
                    <div className="space-y-2">
                      <div className="flex items-baseline gap-3 flex-wrap">
                        <span className="text-2xl font-bold text-black">₹{item.price}</span>
                        <span className="text-sm text-gray-500">• {item.prep_time} mins</span>
                        {item.calories && <span className="text-sm text-gray-500">• {item.calories} cal</span>}
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-orange-100 text-orange-700 border-orange-200 text-xs px-2 py-1">
                          {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                        </Badge>
                        {item.is_spicy && (
                          <Badge className="bg-red-100 text-red-700 border-red-200 text-xs px-2 py-1">
                            <Flame className="w-3 h-3 mr-1" />
                            Spicy
                          </Badge>
                        )}
                        {item.is_bestseller && (
                          <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 text-xs px-2 py-1">
                            <Star className="w-3 h-3 mr-1" />
                            Best
                          </Badge>
                        )}
                        {item.is_popular && (
                          <Badge className="bg-purple-100 text-purple-700 border-purple-200 text-xs px-2 py-1">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            Popular
                          </Badge>
                        )}
                      </div>
                    </div>

                    {item.description && (
                      <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">{item.description}</p>
                    )}

                    {/* Availability Toggle - Clear and prominent */}
                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between gap-4">
                        <label className="flex items-center gap-3 cursor-pointer flex-1">
                          <Switch
                            checked={item.available}
                            onCheckedChange={(checked) => toggleAvailability(item.id, checked)}
                            disabled={loading === item.id}
                            className={`${
                              item.available ? "data-[state=checked]:bg-green-500" : "data-[state=unchecked]:bg-red-500"
                            } scale-125`}
                          />
                          <span className={`font-bold text-lg ${item.available ? "text-green-600" : "text-red-600"}`}>
                            {loading === item.id ? "Updating..." : item.available ? "Available" : "Unavailable"}
                          </span>
                        </label>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => startEditing(item)}
                            disabled={loading === item.id}
                            className="h-10 px-3 hover:bg-orange-100 text-gray-600 hover:text-orange-600 font-medium"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(item.id, item.name)}
                            disabled={loading === item.id}
                            className="h-10 px-3 hover:bg-red-100 text-red-600 hover:text-red-700 font-medium"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {menuItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-orange-100">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mb-6">
              <Plus className="w-12 h-12 text-orange-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No menu items yet</h3>
            <p className="text-lg text-gray-600 mb-8 max-w-md leading-relaxed">
              Start by adding your first menu item to manage your restaurant's offerings
            </p>
          </div>
        )}

        {/* Custom Delete Confirmation Modal */}
        <Dialog
          open={deleteConfirm.isOpen}
          onOpenChange={(open) => setDeleteConfirm((prev) => ({ ...prev, isOpen: open }))}
        >
          <DialogContent className="max-w-md bg-white border-red-200 shadow-2xl">
            <DialogHeader className="pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <DialogTitle className="text-xl font-bold text-gray-900">Delete Menu Item</DialogTitle>
              </div>
            </DialogHeader>

            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-gray-700 text-base leading-relaxed">
                  Are you sure you want to delete{" "}
                  <span className="font-bold text-red-700">"{deleteConfirm.itemName}"</span>?
                </p>
                <p className="text-sm text-red-600 mt-2 font-medium">This action cannot be undone.</p>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  onClick={confirmDelete}
                  disabled={loading === deleteConfirm.itemId}
                  className="flex-1 h-12 bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {loading === deleteConfirm.itemId ? "Deleting..." : "Yes, Delete"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setDeleteConfirm({ isOpen: false, itemId: "", itemName: "" })}
                  disabled={loading === deleteConfirm.itemId}
                  className="h-12 font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
