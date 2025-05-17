"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Building2, Edit, MapPin, MoreHorizontal, Plus, Trash } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  getRestaurants,
  createRestaurant,
  updateRestaurantOwnerCredentials,
  deleteRestaurant,
} from "@/actions/restaurant-actions"
import { useToast } from "@/components/ui/use-toast"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"

type Restaurant = {
  id: number
  name: string
  description: string
  location_count: number
  owner_name: string
  owner_email: string
  status: string
}

export default function RestaurantsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isCredentialsDialogOpen, setIsCredentialsDialogOpen] = useState(false)
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)

  // Form states
  const [newRestaurantName, setNewRestaurantName] = useState("")
  const [newRestaurantDescription, setNewRestaurantDescription] = useState("")
  const [newOwnerName, setNewOwnerName] = useState("")
  const [newOwnerEmail, setNewOwnerEmail] = useState("")
  const [newUsername, setNewUsername] = useState("")
  const [newPassword, setNewPassword] = useState("")

  useEffect(() => {
    if (user?.role !== "superuser") {
      router.push("/dashboard")
      return
    }

    const fetchRestaurants = async () => {
      setIsLoading(true)
      try {
        const result = await getRestaurants()
        if (result.success) {
          setRestaurants(result.restaurants)
        } else {
          toast({
            title: "Error",
            description: result.message || "Failed to fetch restaurants",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error fetching restaurants:", error)
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchRestaurants()
  }, [toast, user, router])

  const handleCreateRestaurant = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newRestaurantName || !newOwnerName || !newOwnerEmail || !newUsername || !newPassword) {
      toast({
        title: "Validation Error",
        description: "All fields are required",
        variant: "destructive",
      })
      return
    }

    try {
      const formData = new FormData()
      formData.append("name", newRestaurantName)
      formData.append("description", newRestaurantDescription)
      formData.append("ownerName", newOwnerName)
      formData.append("ownerEmail", newOwnerEmail)
      formData.append("username", newUsername)
      formData.append("password", newPassword)

      const result = await createRestaurant(formData)

      if (result.success) {
        toast({
          title: "Success",
          description: "Restaurant created successfully",
        })

        // Refresh restaurants list
        const refreshResult = await getRestaurants()
        if (refreshResult.success) {
          setRestaurants(refreshResult.restaurants)
        }

        // Reset form and close dialog
        setNewRestaurantName("")
        setNewRestaurantDescription("")
        setNewOwnerName("")
        setNewOwnerEmail("")
        setNewUsername("")
        setNewPassword("")
        setIsAddDialogOpen(false)
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to create restaurant",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating restaurant:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  const handleUpdateCredentials = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedRestaurant || !newUsername || !newPassword) {
      toast({
        title: "Validation Error",
        description: "Username and password are required",
        variant: "destructive",
      })
      return
    }

    try {
      const formData = new FormData()
      formData.append("username", newUsername)
      formData.append("password", newPassword)

      const result = await updateRestaurantOwnerCredentials(selectedRestaurant.id, formData)

      if (result.success) {
        toast({
          title: "Success",
          description: "Owner credentials updated successfully",
        })

        // Reset form and close dialog
        setNewUsername("")
        setNewPassword("")
        setIsCredentialsDialogOpen(false)
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to update credentials",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating credentials:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  const handleDeleteRestaurant = async (id: number) => {
    if (!confirm("Are you sure you want to delete this restaurant? This action cannot be undone.")) {
      return
    }

    try {
      const result = await deleteRestaurant(id)

      if (result.success) {
        toast({
          title: "Success",
          description: "Restaurant deleted successfully",
        })

        // Update local state
        setRestaurants(restaurants.filter((r) => r.id !== id))
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to delete restaurant",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting restaurant:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Restaurants</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Restaurant
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleCreateRestaurant}>
              <DialogHeader>
                <DialogTitle>Add New Restaurant</DialogTitle>
                <DialogDescription>Create a new restaurant in the system.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Restaurant Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter restaurant name"
                    value={newRestaurantName}
                    onChange={(e) => setNewRestaurantName(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter restaurant description"
                    value={newRestaurantDescription}
                    onChange={(e) => setNewRestaurantDescription(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="owner-name">Owner Name</Label>
                  <Input
                    id="owner-name"
                    placeholder="Enter owner name"
                    value={newOwnerName}
                    onChange={(e) => setNewOwnerName(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="owner-email">Owner Email</Label>
                  <Input
                    id="owner-email"
                    type="email"
                    placeholder="Enter owner email"
                    value={newOwnerEmail}
                    onChange={(e) => setNewOwnerEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    placeholder="Enter username"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Restaurant</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Restaurants</CardTitle>
          <CardDescription>View and manage all restaurants in the system.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Locations</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {restaurants.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No restaurants found. Create your first restaurant to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  restaurants.map((restaurant) => (
                    <TableRow key={restaurant.id}>
                      <TableCell className="font-medium">{restaurant.name}</TableCell>
                      <TableCell>{restaurant.location_count}</TableCell>
                      <TableCell>{restaurant.owner_name || "No owner assigned"}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            restaurant.status === "active"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                          }`}
                        >
                          {restaurant.status || "active"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Edit Details</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedRestaurant(restaurant)
                                setNewUsername(restaurant.owner_name ? "jeffg" : "")
                                setNewPassword("")
                                setIsCredentialsDialogOpen(true)
                              }}
                            >
                              <Building2 className="mr-2 h-4 w-4" />
                              <span>Manage Credentials</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => router.push(`/dashboard/locations?restaurant=${restaurant.id}`)}
                            >
                              <MapPin className="mr-2 h-4 w-4" />
                              <span>Manage Locations</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDeleteRestaurant(restaurant.id)}
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Credentials Dialog */}
      <Dialog open={isCredentialsDialogOpen} onOpenChange={setIsCredentialsDialogOpen}>
        <DialogContent>
          <form onSubmit={handleUpdateCredentials}>
            <DialogHeader>
              <DialogTitle>Restaurant Owner Credentials</DialogTitle>
              <DialogDescription>
                {selectedRestaurant
                  ? `Set or update credentials for ${selectedRestaurant.name}`
                  : "Set or update restaurant owner credentials"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="Enter new password"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setIsCredentialsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Credentials</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
