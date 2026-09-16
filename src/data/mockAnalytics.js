// Mock analytics series. A future analyticsService will fetch this
// shape from GET /api/analytics/vendor or /api/analytics/platform.
export const vendorSalesSeries = [
  { month: "Feb", revenue: 42000, orders: 61 },
  { month: "Mar", revenue: 51000, orders: 74 },
  { month: "Apr", revenue: 47500, orders: 68 },
  { month: "May", revenue: 61200, orders: 89 },
  { month: "Jun", revenue: 58900, orders: 82 },
  { month: "Jul", revenue: 73400, orders: 101 },
  { month: "Aug", revenue: 41200, orders: 57 },
];

export const platformSeries = [
  { month: "Feb", revenue: 612000, vendors: 118 },
  { month: "Mar", revenue: 698000, vendors: 124 },
  { month: "Apr", revenue: 743000, vendors: 131 },
  { month: "May", revenue: 812000, vendors: 139 },
  { month: "Jun", revenue: 795000, vendors: 145 },
  { month: "Jul", revenue: 901000, vendors: 152 },
  { month: "Aug", revenue: 534000, vendors: 158 },
];

export const topProducts = [
  { name: "Aria Wireless Headphones", unitsSold: 214, revenue: 1390000 },
  { name: "Fiddle Leaf Fig (Potted)", unitsSold: 178, revenue: 337900 },
  { name: "Trailhead 38L Travel Pack", unitsSold: 96, revenue: 527900 },
  { name: "Handwoven Wool Throw", unitsSold: 61, revenue: 201200 },
];
