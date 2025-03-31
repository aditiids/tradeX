"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  BarChart,
  Bar,
  Legend,
} from "recharts"
import {
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  DollarSign,
  Users,
  Menu,
  Bell,
  User,
  LogOut,
  Settings,
  Sun,
  Moon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Dummy data for stocks
const stockData = {
  AAPL: [
    { name: "Jan", value: 145.32, volume: 12500000 },
    { name: "Feb", value: 152.87, volume: 14200000 },
    { name: "Mar", value: 159.45, volume: 15800000 },
    { name: "Apr", value: 157.65, volume: 13700000 },
    { name: "May", value: 165.23, volume: 16500000 },
    { name: "Jun", value: 172.56, volume: 18200000 },
    { name: "Jul", value: 178.92, volume: 17500000 },
    { name: "Aug", value: 175.34, volume: 16300000 },
    { name: "Sep", value: 182.67, volume: 19200000 },
    { name: "Oct", value: 189.45, volume: 21500000 },
    { name: "Nov", value: 193.21, volume: 20300000 },
    { name: "Dec", value: 197.58, volume: 22800000 },
  ],
  MSFT: [
    { name: "Jan", value: 222.45, volume: 18500000 },
    { name: "Feb", value: 231.78, volume: 19200000 },
    { name: "Mar", value: 238.92, volume: 20500000 },
    { name: "Apr", value: 245.34, volume: 21700000 },
    { name: "May", value: 252.67, volume: 22500000 },
    { name: "Jun", value: 247.89, volume: 20800000 },
    { name: "Jul", value: 258.45, volume: 23500000 },
    { name: "Aug", value: 265.23, volume: 24700000 },
    { name: "Sep", value: 272.56, volume: 25800000 },
    { name: "Oct", value: 267.34, volume: 24300000 },
    { name: "Nov", value: 278.92, volume: 26500000 },
    { name: "Dec", value: 285.67, volume: 27800000 },
  ],
  GOOGL: [
    { name: "Jan", value: 2732.45, volume: 8500000 },
    { name: "Feb", value: 2689.78, volume: 8200000 },
    { name: "Mar", value: 2745.92, volume: 8700000 },
    { name: "Apr", value: 2798.34, volume: 9100000 },
    { name: "May", value: 2845.67, volume: 9500000 },
    { name: "Jun", value: 2789.89, volume: 9200000 },
    { name: "Jul", value: 2856.45, volume: 9600000 },
    { name: "Aug", value: 2912.23, volume: 9800000 },
    { name: "Sep", value: 2867.56, volume: 9400000 },
    { name: "Oct", value: 2934.34, volume: 9700000 },
    { name: "Nov", value: 2978.92, volume: 10100000 },
    { name: "Dec", value: 3012.67, volume: 10500000 },
  ],
  AMZN: [
    { name: "Jan", value: 3245.32, volume: 7500000 },
    { name: "Feb", value: 3189.87, volume: 7200000 },
    { name: "Mar", value: 3267.45, volume: 7700000 },
    { name: "Apr", value: 3312.65, volume: 8100000 },
    { name: "May", value: 3278.23, volume: 7900000 },
    { name: "Jun", value: 3345.56, volume: 8300000 },
    { name: "Jul", value: 3398.92, volume: 8500000 },
    { name: "Aug", value: 3432.34, volume: 8700000 },
    { name: "Sep", value: 3387.67, volume: 8400000 },
    { name: "Oct", value: 3456.45, volume: 8800000 },
    { name: "Nov", value: 3512.21, volume: 9100000 },
    { name: "Dec", value: 3567.58, volume: 9400000 },
  ],
}

// Stock performance data
const stockPerformance = {
  AAPL: { change: "+2.34%", value: 197.58, status: "up" },
  MSFT: { change: "+1.87%", value: 285.67, status: "up" },
  GOOGL: { change: "-0.45%", value: 3012.67, status: "down" },
  AMZN: { change: "+3.21%", value: 3567.58, status: "up" },
}

// Mock notifications
const initialNotifications = [
  {
    id: 1,
    title: "TESLA up by 5%",
    description: "TESLA stock increased by 5% in the last hour",
    time: "10 mins ago",
    read: false,
  },
  {
    id: 2,
    title: "Market opening bell",
    description: "Markets have opened for the day",
    time: "2 hours ago",
    read: false,
  },
  {
    id: 3,
    title: "Your order executed",
    description: "Buy order for 10 shares of APPLE executed",
    time: "Yesterday",
    read: true,
  },
  {
    id: 4,
    title: "Dividend payment",
    description: "Dividend of $1.25 per share credited to your account",
    time: "3 days ago",
    read: true,
  },
]

// Time period options
const timePeriods = [
  { id: "1D", label: "1D", days: 1 },
  { id: "5D", label: "5D", days: 5 },
  { id: "1M", label: "1M", days: 30 },
  { id: "3M", label: "3M", days: 90 },
  { id: "6M", label: "6M", days: 180 },
  { id: "1Y", label: "1Y", days: 365 },
  { id: "5Y", label: "5Y", days: 1825 },
]

// Custom tooltip for charts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border p-3 rounded-md shadow-lg">
        <p className="font-medium text-foreground">{label}</p>
        <p className="text-blue-500">Price: ${payload[0].value.toFixed(2)}</p>
        {payload[1] && <p className="text-green-500">Volume: {(payload[1].value / 1000000).toFixed(2)}M</p>}
      </div>
    )
  }

  return null
}

export default function Home() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [selectedStock, setSelectedStock] = useState("AAPL")
  const [selectedTimePeriod, setSelectedTimePeriod] = useState(timePeriods[5]) // Default to 1Y
  const [chartType, setChartType] = useState("line")
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState(initialNotifications)
  const [unreadNotifications, setUnreadNotifications] = useState(notifications.filter((n) => !n.read).length)
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const [filterOptions, setFilterOptions] = useState({
    trending: "all",
    priceRange: [0, 4000],
  })
  const [showBuyDialog, setShowBuyDialog] = useState(false)
  const [showSellDialog, setShowSellDialog] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [orderType, setOrderType] = useState("market")
  const [limitPrice, setLimitPrice] = useState(stockPerformance[selectedStock].value)
  const [portfolio, setPortfolio] = useState({
    cash: 10000,
    holdings: [],
  })
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Check if user is logged in
  useState(() => {
    const loggedIn = localStorage.getItem("tradex-logged-in")
    if (loggedIn === "true") {
      setIsLoggedIn(true)
    }
  })

  const currentStockData = stockData[selectedStock]
  const performance = stockPerformance[selectedStock]

  // Handle notification click
  const handleNotificationClick = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    )

    setUnreadNotifications((prevCount) => (prevCount > 0 ? prevCount - 1 : 0))
  }

  // Handle mark all as read
  const handleMarkAllAsRead = () => {
    setNotifications((prevNotifications) => prevNotifications.map((notification) => ({ ...notification, read: true })))
    setUnreadNotifications(0)
  }

  // Handle buy order
  const handleBuy = () => {
    const totalCost = quantity * (orderType === "market" ? performance.value : limitPrice)

    if (totalCost > portfolio.cash) {
      setSuccessMessage("Insufficient funds to complete this purchase")
    } else {
      // Update portfolio
      setPortfolio((prev) => {
        const existingHolding = prev.holdings.find((h) => h.stockId === selectedStock)

        let updatedHoldings
        if (existingHolding) {
          updatedHoldings = prev.holdings.map((h) =>
            h.stockId === selectedStock
              ? {
                  ...h,
                  quantity: h.quantity + quantity,
                  avgPrice: (h.avgPrice * h.quantity + totalCost) / (h.quantity + quantity),
                }
              : h,
          )
        } else {
          updatedHoldings = [
            ...prev.holdings,
            {
              stockId: selectedStock,
              ticker: selectedStock,
              name: selectedStock,
              quantity,
              avgPrice: orderType === "market" ? performance.value : limitPrice,
            },
          ]
        }

        return {
          cash: prev.cash - totalCost,
          holdings: updatedHoldings,
        }
      })

      setSuccessMessage(`Successfully purchased ${quantity} shares of ${selectedStock}`)
    }

    setShowBuyDialog(false)
    setShowSuccessMessage(true)

    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccessMessage(false)
    }, 3000)
  }

  // Handle sell order
  const handleSell = () => {
    const holding = portfolio.holdings.find((h) => h.stockId === selectedStock)

    if (!holding || holding.quantity < quantity) {
      setSuccessMessage(`You don't have enough ${selectedStock} shares to sell`)
    } else {
      // Update portfolio
      setPortfolio((prev) => {
        let updatedHoldings

        if (holding.quantity === quantity) {
          // Remove the holding completely
          updatedHoldings = prev.holdings.filter((h) => h.stockId !== selectedStock)
        } else {
          // Reduce the quantity
          updatedHoldings = prev.holdings.map((h) =>
            h.stockId === selectedStock ? { ...h, quantity: h.quantity - quantity } : h,
          )
        }

        const saleValue = quantity * (orderType === "market" ? performance.value : limitPrice)

        return {
          cash: prev.cash + saleValue,
          holdings: updatedHoldings,
        }
      })

      setSuccessMessage(`Successfully sold ${quantity} shares of ${selectedStock}`)
    }

    setShowSellDialog(false)
    setShowSuccessMessage(true)

    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccessMessage(false)
    }, 3000)
  }

  // Reset order form
  const resetOrderForm = () => {
    setQuantity(1)
    setOrderType("market")
    setLimitPrice(performance.value)
  }

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("tradex-logged-in")
    setIsLoggedIn(false)
    router.push("/login")
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <BarChart3 className="h-6 w-6 text-blue-500" />
              <span className="font-bold">TradeX</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
              <Link href="/" className="transition-colors hover:text-foreground/80 text-foreground">
                Dashboard
              </Link>
              <Link href="#" className="transition-colors hover:text-foreground/80 text-muted-foreground">
                Portfolio
              </Link>
              <Link href="#" className="transition-colors hover:text-foreground/80 text-muted-foreground">
                Market
              </Link>
              <Link href="#" className="transition-colors hover:text-foreground/80 text-muted-foreground">
                News
              </Link>
            </nav>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {/* Notifications */}
            <div className="relative">
              <button
                className="relative"
                onClick={() => setShowNotifications(!showNotifications)}
                aria-label="Notifications"
              >
                <Bell className="w-6 h-6" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-card rounded-md shadow-lg z-10 overflow-hidden border border-border">
                  <div className="p-3 border-b border-border flex justify-between items-center">
                    <h3 className="font-medium">Notifications</h3>
                    <button className="text-xs text-primary hover:text-primary/80" onClick={handleMarkAllAsRead}>
                      Mark all as read
                    </button>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-muted-foreground">No notifications</div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-3 border-b border-border hover:bg-accent cursor-pointer ${!notification.read ? "bg-accent/50" : ""}`}
                          onClick={() => handleNotificationClick(notification.id)}
                        >
                          <div className="flex justify-between">
                            <h4 className="font-medium">{notification.title}</h4>
                            {!notification.read && <span className="w-2 h-2 bg-primary rounded-full"></span>}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{notification.description}</p>
                          <p className="text-xs text-muted-foreground/70 mt-1">{notification.time}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                    CG
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start p-2">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold mr-2">
                      CG
                    </div>
                    <div>
                      <p className="font-medium">Chris Gardner</p>
                      <p className="text-xs text-muted-foreground">chris@example.com</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-primary hover:text-primary/80">
                  Log in
                </Link>
                <Link href="/signup">
                  <Button size="sm">Sign up</Button>
                </Link>
              </>
            )}
          </div>
          <Button variant="ghost" size="icon" className="ml-2 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-6 md:py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">Monitor your investments and market trends.</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-4">
              <Select value={selectedStock} onValueChange={setSelectedStock}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select stock" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AAPL">Apple (AAPL)</SelectItem>
                  <SelectItem value="MSFT">Microsoft (MSFT)</SelectItem>
                  <SelectItem value="GOOGL">Google (GOOGL)</SelectItem>
                  <SelectItem value="AMZN">Amazon (AMZN)</SelectItem>
                </SelectContent>
              </Select>
              <Select value={chartType} onValueChange={setChartType}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Chart type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="line">Line</SelectItem>
                  <SelectItem value="area">Area</SelectItem>
                  <SelectItem value="bar">Bar</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Price</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${performance.value.toFixed(2)}</div>
                <div className="flex items-center space-x-2">
                  {performance.status === "up" ? (
                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-500" />
                  )}
                  <p className={`text-xs ${performance.status === "up" ? "text-green-500" : "text-red-500"}`}>
                    {performance.change}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Volume</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.4M</div>
                <p className="text-xs text-muted-foreground">+12.5% from yesterday</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Market Cap</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$2.4T</div>
                <p className="text-xs text-muted-foreground">+2.1% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Traders</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">573K</div>
                <p className="text-xs text-muted-foreground">+19% from last hour</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-7">
            <Card className="md:col-span-5">
              <CardHeader>
                <CardTitle>{selectedStock} Stock Performance</CardTitle>
                <CardDescription className="text-gray-400">
                  Stock price movement over the past {selectedTimePeriod.label}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <div className="flex gap-2 mb-4">
                    {timePeriods.map((period) => (
                      <button
                        key={period.id}
                        className={`px-3 py-1 text-white text-sm rounded ${selectedTimePeriod.id === period.id ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"}`}
                        onClick={() => setSelectedTimePeriod(period)}
                      >
                        {period.label}
                      </button>
                    ))}
                  </div>
                  <ResponsiveContainer width="100%" height="100%">
                    {chartType === "line" && (
                      <LineChart data={currentStockData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                        <XAxis dataKey="name" stroke="var(--muted-foreground)" />
                        <YAxis stroke="var(--muted-foreground)" />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="var(--primary)"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                          animationDuration={1000}
                        />
                      </LineChart>
                    )}
                    {chartType === "area" && (
                      <AreaChart data={currentStockData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="name" stroke="#888" />
                        <YAxis stroke="#888" />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="#3b82f6"
                          fill="#3b82f6"
                          fillOpacity={0.3}
                          animationDuration={1000}
                        />
                      </AreaChart>
                    )}
                    {chartType === "bar" && (
                      <BarChart data={currentStockData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="name" stroke="#888" />
                        <YAxis stroke="#888" />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar dataKey="value" fill="#3b82f6" animationDuration={1000} name="Price" />
                        <Bar dataKey="volume" fill="#10b981" animationDuration={1000} name="Volume" />
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Market Overview</CardTitle>
                <CardDescription className="text-gray-400">Top performing stocks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">AAPL</p>
                      <p className="text-xs text-muted-foreground">Apple Inc.</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium">${stockPerformance.AAPL.value}</p>
                      <div
                        className={`flex items-center ${stockPerformance.AAPL.status === "up" ? "text-green-500" : "text-red-500"}`}
                      >
                        {stockPerformance.AAPL.status === "up" ? (
                          <ArrowUpRight className="h-4 w-4" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4" />
                        )}
                        <span className="text-xs">{stockPerformance.AAPL.change}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">MSFT</p>
                      <p className="text-xs text-muted-foreground">Microsoft Corp.</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium">${stockPerformance.MSFT.value}</p>
                      <div
                        className={`flex items-center ${stockPerformance.MSFT.status === "up" ? "text-green-500" : "text-red-500"}`}
                      >
                        {stockPerformance.MSFT.status === "up" ? (
                          <ArrowUpRight className="h-4 w-4" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4" />
                        )}
                        <span className="text-xs">{stockPerformance.MSFT.change}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">GOOGL</p>
                      <p className="text-xs text-muted-foreground">Alphabet Inc.</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium">${stockPerformance.GOOGL.value}</p>
                      <div
                        className={`flex items-center ${stockPerformance.GOOGL.status === "up" ? "text-green-500" : "text-red-500"}`}
                      >
                        {stockPerformance.GOOGL.status === "up" ? (
                          <ArrowUpRight className="h-4 w-4" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4" />
                        )}
                        <span className="text-xs">{stockPerformance.GOOGL.change}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">AMZN</p>
                      <p className="text-xs text-muted-foreground">Amazon.com Inc.</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium">${stockPerformance.AMZN.value}</p>
                      <div
                        className={`flex items-center ${stockPerformance.AMZN.status === "up" ? "text-green-500" : "text-red-500"}`}
                      >
                        {stockPerformance.AMZN.status === "up" ? (
                          <ArrowUpRight className="h-4 w-4" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4" />
                        )}
                        <span className="text-xs">{stockPerformance.AMZN.change}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <div className="flex justify-between mb-2">
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700 mr-2"
                      onClick={() => {
                        resetOrderForm()
                        setShowBuyDialog(true)
                      }}
                    >
                      Buy
                    </Button>
                    <Button
                      className="w-full bg-red-600 hover:bg-red-700"
                      onClick={() => {
                        resetOrderForm()
                        setShowSellDialog(true)
                      }}
                    >
                      Sell
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Buy Dialog */}
      <Dialog open={showBuyDialog} onOpenChange={setShowBuyDialog}>
        <DialogContent className="bg-background border-border">
          <DialogHeader>
            <DialogTitle>Buy {selectedStock}</DialogTitle>
            <DialogDescription className="text-gray-400">
              Current Price: ${performance.value.toFixed(2)}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
                className="bg-gray-700 border-gray-600"
              />
            </div>

            <div className="space-y-2">
              <Label>Order Type</Label>
              <div className="flex gap-2">
                <button
                  className={`px-3 py-1 rounded ${orderType === "market" ? "bg-blue-600" : "bg-gray-700"}`}
                  onClick={() => setOrderType("market")}
                >
                  Market
                </button>
                <button
                  className={`px-3 py-1 rounded ${orderType === "limit" ? "bg-blue-600" : "bg-gray-700"}`}
                  onClick={() => setOrderType("limit")}
                >
                  Limit
                </button>
              </div>
            </div>

            {orderType === "limit" && (
              <div className="space-y-2">
                <Label htmlFor="limitPrice">Limit Price</Label>
                <Input
                  id="limitPrice"
                  type="number"
                  step="0.01"
                  value={limitPrice}
                  onChange={(e) => setLimitPrice(Number.parseFloat(e.target.value) || performance.value)}
                  className="bg-gray-700 border-gray-600"
                />
              </div>
            )}

            <div className="pt-2">
              <div className="flex justify-between mb-1">
                <span>Estimated Cost:</span>
                <span>${(quantity * (orderType === "market" ? performance.value : limitPrice)).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-400">
                <span>Available Cash:</span>
                <span>${portfolio.cash.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBuyDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleBuy}
              className="bg-green-500 hover:bg-green-600"
              disabled={quantity <= 0 || (orderType === "limit" && limitPrice <= 0)}
            >
              Buy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sell Dialog */}
      <Dialog open={showSellDialog} onOpenChange={setShowSellDialog}>
        <DialogContent className="bg-background border-border">
          <DialogHeader>
            <DialogTitle>Sell {selectedStock}</DialogTitle>
            <DialogDescription className="text-gray-400">
              Current Price: ${performance.value.toFixed(2)}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
                className="bg-gray-700 border-gray-600"
              />
            </div>

            <div className="space-y-2">
              <Label>Order Type</Label>
              <div className="flex gap-2">
                <button
                  className={`px-3 py-1 rounded ${orderType === "market" ? "bg-blue-600" : "bg-gray-700"}`}
                  onClick={() => setOrderType("market")}
                >
                  Market
                </button>
                <button
                  className={`px-3 py-1 rounded ${orderType === "limit" ? "bg-blue-600" : "bg-gray-700"}`}
                  onClick={() => setOrderType("limit")}
                >
                  Limit
                </button>
              </div>
            </div>

            {orderType === "limit" && (
              <div className="space-y-2">
                <Label htmlFor="limitPrice">Limit Price</Label>
                <Input
                  id="limitPrice"
                  type="number"
                  step="0.01"
                  value={limitPrice}
                  onChange={(e) => setLimitPrice(Number.parseFloat(e.target.value) || performance.value)}
                  className="bg-gray-700 border-gray-600"
                />
              </div>
            )}

            <div className="pt-2">
              <div className="flex justify-between mb-1">
                <span>Estimated Value:</span>
                <span>${(quantity * (orderType === "market" ? performance.value : limitPrice)).toFixed(2)}</span>
              </div>

              {/* Show current holdings */}
              {portfolio.holdings.find((h) => h.stockId === selectedStock) ? (
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Current Holdings:</span>
                  <span>{portfolio.holdings.find((h) => h.stockId === selectedStock)?.quantity || 0} shares</span>
                </div>
              ) : (
                <div className="text-sm text-red-400">You don't own any shares of {selectedStock}</div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSellDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSell}
              className="bg-red-500 hover:bg-red-600"
              disabled={
                quantity <= 0 ||
                (orderType === "limit" && limitPrice <= 0) ||
                !portfolio.holdings.find((h) => h.stockId === selectedStock) ||
                (portfolio.holdings.find((h) => h.stockId === selectedStock)?.quantity || 0) < quantity
              }
            >
              Sell
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg">
          {successMessage}
        </div>
      )}
    </div>
  )
}

