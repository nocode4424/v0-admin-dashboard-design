"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { getCategories, createCategory, updateCategory, deleteCategory } from "@/actions/menu-actions"
import { Plus, Edit, Trash, MoreHorizontal, ImageIcon } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"

export default function MenuPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [categories, setCategories] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false)
  const [isEditCategoryDialogOpen, setIsEditCategoryDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<any>(null)

  // Form states
  const [categoryName, setCategoryName] = useState("")
  const [categoryDescription, setCategoryDescription] = useState("")
  const [categoryImageUrl, setCategoryImageUrl] = useState("")
  const [categoryDisplayOrder, setCategoryDisplayOrder] = useState("0")
  const [categoryIsActive, setCategoryIsActive] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true)
      try {
        const result = await getCategories()
        if (result.success) {
          setCategories(result.categories)
        } else {
          toast({
            title: "Error",
            description: result.message || "Failed to fetch categories",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error fetching categories:", error)
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchCategories()
    }
  }, [user, toast])

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!categoryName) {
      toast({
        title: "Validation Error",
        description: "Category name is required",
        variant: "destructive",
      })
      return
    }

    try {
      const formData = new FormData()
      formData.append("name", categoryName)
      formData.append("description", categoryDescription)
      formData.append("imageUrl", categoryImageUrl)
      formData.append("displayOrder", categoryDisplayOrder)
      formData.append("isActive", categoryIsActive.toString())

      const result = await createCategory(formData)

      if (result.success) {
        toast({
          title: "Success",
          description: "Category created successfully",
        })

        // Refresh categories
        const refreshResult = await getCategories()
        if (refreshResult.success) {
          setCategories(refreshResult.categories)
        }

        // Reset form and close dialog
        resetCategoryForm()
        setIsAddCategoryDialogOpen(false)
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to create category",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating category:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedCategory || !categoryName) {
      toast({
        title: "Validation Error",
        description: "Category name is required",
        variant: "destructive",
      })
      return
    }

    try {
      const formData = new FormData()
      formData.append("name", categoryName)
      formData.append("description", categoryDescription)
      formData.append("imageUrl", categoryImageUrl)
      formData.append("displayOrder", categoryDisplayOrder)
      formData.append("isActive", categoryIsActive.toString())

      const result = await updateCategory(selectedCategory.id, formData)

      if (result.success) {
        toast({
          title: "Success",
          description: "Category updated successfully",
        })

        // Refresh categories
        const refreshResult = await getCategories()
        if (refreshResult.success) {
          setCategories(refreshResult.categories)
        }

        // Reset form and close dialog
        resetCategoryForm()
        setIsEditCategoryDialogOpen(false)
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to update category",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating category:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  const handleDeleteCategory = async (id: number) => {
    if (!confirm("Are you sure you want to delete this category? This action cannot be undone.")) {
      return
    }

    try {
      const result = await deleteCategory(id)

      if (result.success) {
        toast({
          title: "Success",
          description: "Category deleted successfully",
        })

        // Update local state
        setCategories(categories.filter((c) => c.id !== id))
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to delete category",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting category:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  const resetCategoryForm = () => {
    setCategoryName("")
    setCategoryDescription("")
    setCategoryImageUrl("")
    setCategoryDisplayOrder("0")
    setCategoryIsActive(true)
    setSelectedCategory(null)
  }

  const openEditCategoryDialog = (category: any) => {
    setSelectedCategory(category)
    setCategoryName(category.name)
    setCategoryDescription(category.description || "")
    setCategoryImageUrl(category.image_url || "")
    setCategoryDisplayOrder(category.display_order?.toString() || "0")
    setCategoryIsActive(category.is_active)
    setIsEditCategoryDialogOpen(true)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Menu Management</h1>
      </div>

      <Tabs defaultValue="categories" className="space-y-4">
        <TabsList>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="items">Menu Items</TabsTrigger>
          <TabsTrigger value="addons">Add-ons</TabsTrigger>
          <TabsTrigger value="tags">Tags</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-4">
          <div className="flex justify-between">
            <h2 className="text-xl font-semibold">Menu Categories</h2>
            <Dialog open={isAddCategoryDialogOpen} onOpenChange={setIsAddCategoryDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Category
                </Button>
              </DialogTrigger>
              <DialogContent>
                <form onSubmit={handleCreateCategory}>
                  <DialogHeader>
                    <DialogTitle>Add New Category</DialogTitle>
                    <DialogDescription>Create a new menu category.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Category Name</Label>
                      <Input
                        id="name"
                        placeholder="Enter category name"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Enter category description"
                        value={categoryDescription}
                        onChange={(e) => setCategoryDescription(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="image-url">Image URL</Label>
                      <Input
                        id="image-url"
                        placeholder="Enter image URL"
                        value={categoryImageUrl}
                        onChange={(e) => setCategoryImageUrl(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="display-order">Display Order</Label>
                      <Input
                        id="display-order"
                        type="number"
                        placeholder="Enter display order"
                        value={categoryDisplayOrder}
                        onChange={(e) => setCategoryDisplayOrder(e.target.value)}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch id="is-active" checked={categoryIsActive} onCheckedChange={setCategoryIsActive} />
                      <Label htmlFor="is-active">Active</Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" type="button" onClick={() => setIsAddCategoryDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Create Category</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Menu Categories</CardTitle>
              <CardDescription>Manage your menu categories.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <Skeleton className="h-12 w-12 rounded-md" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {categories.length === 0 ? (
                    <div className="col-span-full py-8 text-center text-muted-foreground">
                      No categories found. Create your first category to get started.
                    </div>
                  ) : (
                    categories.map((category) => (
                      <Card key={category.id} className="overflow-hidden">
                        <div className="relative h-40 bg-muted">
                          {category.image_url ? (
                            <img
                              src={category.image_url || "/placeholder.svg"}
                              alt={category.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <ImageIcon className="h-16 w-16 text-muted-foreground/50" />
                            </div>
                          )}
                          <div className="absolute right-2 top-2">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 bg-background/80">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => openEditCategoryDialog(category)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  <span>Edit Category</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => handleDeleteCategory(category.id)}
                                >
                                  <Trash className="mr-2 h-4 w-4" />
                                  <span>Delete</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold">{category.name}</h3>
                            {!category.is_active && (
                              <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                                Inactive
                              </span>
                            )}
                          </div>
                          {category.description && (
                            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{category.description}</p>
                          )}
                          <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
                            <span>Order: {category.display_order}</span>
                            <span>{category.item_count || 0} items</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="items" className="space-y-4">
          <div className="flex justify-between">
            <h2 className="text-xl font-semibold">Menu Items</h2>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Menu Item
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Menu Items</CardTitle>
              <CardDescription>Manage your menu items.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="py-8 text-center text-muted-foreground">
                Select a category to view and manage menu items.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Category Dialog */}
      <Dialog open={isEditCategoryDialogOpen} onOpenChange={setIsEditCategoryDialogOpen}>
        <DialogContent>
          <form onSubmit={handleUpdateCategory}>
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
              <DialogDescription>
                {selectedCategory ? `Update ${selectedCategory.name} category` : "Update category details"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Category Name</Label>
                <Input
                  id="edit-name"
                  placeholder="Enter category name"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  placeholder="Enter category description"
                  value={categoryDescription}
                  onChange={(e) => setCategoryDescription(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-image-url">Image URL</Label>
                <Input
                  id="edit-image-url"
                  placeholder="Enter image URL"
                  value={categoryImageUrl}
                  onChange={(e) => setCategoryImageUrl(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-display-order">Display Order</Label>
                <Input
                  id="edit-display-order"
                  type="number"
                  placeholder="Enter display order"
                  value={categoryDisplayOrder}
                  onChange={(e) => setCategoryDisplayOrder(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch id="edit-is-active" checked={categoryIsActive} onCheckedChange={setCategoryIsActive} />
                <Label htmlFor="edit-is-active">Active</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setIsEditCategoryDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Update Category</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
