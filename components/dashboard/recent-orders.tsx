"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/lib/auth-context"

const orders = [
  {
    id: "ORD-001",
    customer: "John Doe",
    status: "completed",
    total: "$45.50",
    restaurant: "Burger Palace",
    date: "2023-05-15T14:30:00",
  },
  {
    id: "ORD-002",
    customer: "Jane Smith",
    status: "processing",
    total: "$32.75",
    restaurant: "Burger Palace",
    date: "2023-05-15T15:45:00",
  },
  {
    id: "ORD-003",
    customer: "Robert Johnson",
    status: "completed",
    total: "$78.20",
    restaurant: "Pizza Heaven",
    date: "2023-05-15T12:15:00",
  },
  {
    id: "ORD-004",
    customer: "Emily Davis",
    status: "pending",
    total: "$24.99",
    restaurant: "Burger Palace",
    date: "2023-05-15T16:30:00",
  },
  {
    id: "ORD-005",
    customer: "Michael Wilson",
    status: "completed",
    total: "$56.80",
    restaurant: "Taco Time",
    date: "2023-05-15T11:45:00",
  },
]

export function RecentOrders() {
  const { user } = useAuth()
  const isSuperUser = user?.role === "superuser"

  // Filter orders for restaurant owners
  const filteredOrders = isSuperUser ? orders : orders.filter((order) => order.restaurant === "Burger Palace")

  return (
    <div className="space-y-8">
      {filteredOrders.map((order) => (
        <div key={order.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarFallback>
              {order.customer
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{order.customer}</p>
            <p className="text-sm text-muted-foreground">{new Date(order.date).toLocaleString()}</p>
          </div>
          <div className="ml-auto font-medium">
            {isSuperUser && <span className="mr-2 text-xs text-muted-foreground">{order.restaurant}</span>}
            <span>{order.total}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
