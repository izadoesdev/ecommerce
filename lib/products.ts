import type { Product, Category } from "./types"

// Mock data for products
const products: Product[] = [
  {
    id: "p1",
    name: "Minimalist Ceramic Vase",
    description: "A beautiful handcrafted ceramic vase with a minimalist design. Perfect for any modern home.",
    price: 49.99,
    image:
      "https://images.unsplash.com/photo-1612196808214-b40b3db631b5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    category: "decor",
    featured: true,
    newArrival: true,
    stock: 15,
    details: {
      material: "Ceramic",
      dimensions: "H: 25cm, W: 12cm",
      care: "Wipe clean with a damp cloth",
    },
  },
  {
    id: "p2",
    name: "Modern Lounge Chair",
    description: "Comfortable and stylish lounge chair with wooden legs and soft fabric upholstery.",
    price: 299.99,
    image:
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    category: "furniture",
    featured: true,
    stock: 8,
    details: {
      material: "Wood, Polyester",
      dimensions: "H: 80cm, W: 65cm, D: 70cm",
      care: "Vacuum regularly, spot clean with mild detergent",
    },
  },
  {
    id: "p3",
    name: "Handwoven Wool Rug",
    description: "Soft and durable handwoven wool rug with a geometric pattern. Adds warmth to any room.",
    price: 199.99,
    salePrice: 159.99,
    image:
      "https://images.unsplash.com/photo-1600166898405-da9535204843?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    category: "textiles",
    sale: true,
    stock: 12,
    details: {
      material: "100% Wool",
      dimensions: "200cm x 150cm",
      care: "Professional cleaning recommended",
    },
  },
  {
    id: "p4",
    name: "Marble Coffee Table",
    description: "Elegant coffee table with a marble top and metal base. A statement piece for your living room.",
    price: 449.99,
    image:
      "https://images.unsplash.com/photo-1577140917170-285929fb55b7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    category: "furniture",
    featured: true,
    stock: 5,
    details: {
      material: "Marble, Stainless Steel",
      dimensions: "H: 45cm, Diameter: 90cm",
      care: "Clean with stone-safe cleaner",
    },
  },
  {
    id: "p5",
    name: "Copper Pendant Light",
    description: "Modern copper pendant light that adds a warm glow to any space. Perfect for dining areas.",
    price: 129.99,
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    category: "decor",
    newArrival: true,
    stock: 20,
    details: {
      material: "Copper, Brass",
      dimensions: "H: 35cm, Diameter: 25cm",
      care: "Dust regularly with a soft cloth",
    },
  },
  {
    id: "p6",
    name: "Linen Bed Sheets",
    description: "Luxurious 100% linen bed sheets that get softer with every wash. Available in various colors.",
    price: 89.99,
    salePrice: 69.99,
    image:
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    category: "textiles",
    sale: true,
    stock: 25,
    details: {
      material: "100% Linen",
      dimensions: "King Size",
      care: "Machine washable at 40°C",
    },
  },
  {
    id: "p7",
    name: "Wooden Dining Table",
    description: "Solid oak dining table with a natural finish. Seats up to 6 people comfortably.",
    price: 599.99,
    image:
      "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    category: "furniture",
    featured: true,
    stock: 3,
    details: {
      material: "Solid Oak",
      dimensions: "L: 180cm, W: 90cm, H: 75cm",
      care: "Wipe clean with a damp cloth, treat with wood oil twice a year",
    },
  },
  {
    id: "p8",
    name: "Ceramic Dinner Set",
    description: "Complete dinner set for 4 people. Includes plates, bowls, and mugs in a modern design.",
    price: 119.99,
    image:
      "https://images.unsplash.com/photo-1603199506016-b9a594b593c0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    category: "kitchen",
    newArrival: true,
    stock: 10,
    details: {
      material: "Ceramic",
      dimensions: "Various",
      care: "Dishwasher safe",
    },
  },
  {
    id: "p9",
    name: "Glass Terrarium",
    description: "Geometric glass terrarium for displaying small plants and creating a mini garden indoors.",
    price: 39.99,
    image:
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    category: "decor",
    featured: true,
    stock: 18,
    details: {
      material: "Glass, Brass",
      dimensions: "H: 20cm, W: 15cm, D: 15cm",
      care: "Wipe clean with a dry cloth",
    },
  },
  {
    id: "p10",
    name: "Velvet Cushion Covers",
    description: "Soft velvet cushion covers that add texture and comfort to your sofa or bed.",
    price: 24.99,
    image:
      "https://images.unsplash.com/photo-1579656381226-5fc0f0100c3b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    category: "textiles",
    newArrival: true,
    stock: 30,
    details: {
      material: "Velvet",
      dimensions: "50cm x 50cm",
      care: "Machine washable at 30°C",
    },
  },
  {
    id: "p11",
    name: "Wooden Bookshelf",
    description:
      "Versatile bookshelf with a mix of open and closed storage. Perfect for organizing your books and decor.",
    price: 349.99,
    salePrice: 299.99,
    image:
      "https://images.unsplash.com/photo-1594620302200-9a762244a156?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    category: "furniture",
    sale: true,
    stock: 7,
    details: {
      material: "Oak Veneer, MDF",
      dimensions: "H: 180cm, W: 120cm, D: 35cm",
      care: "Wipe clean with a damp cloth",
    },
  },
  {
    id: "p12",
    name: "Stainless Steel Cookware Set",
    description: "Professional-grade stainless steel cookware set including pots and pans of various sizes.",
    price: 249.99,
    image:
      "https://images.unsplash.com/photo-1584990347449-a5d9f800a783?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    category: "kitchen",
    featured: true,
    stock: 9,
    details: {
      material: "Stainless Steel",
      dimensions: "Various",
      care: "Dishwasher safe",
    },
  },
]

// Mock data for categories
const categories: Category[] = [
  {
    id: "all",
    name: "All Products",
    image:
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "decor",
    name: "Home Decor",
    description: "Beautiful accessories to enhance your home",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "furniture",
    name: "Furniture",
    description: "Stylish and functional furniture for every room",
    image:
      "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "textiles",
    name: "Textiles",
    description: "Soft fabrics to add comfort and style",
    image:
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "kitchen",
    name: "Kitchen",
    description: "Essential tools for cooking and dining",
    image:
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
  },
]

// Function to get all products or filter by category
export function getProducts(category?: string): Product[] {
  if (!category || category === "all") {
    return [...products]
  }

  return products.filter((product) => product.category === category)
}

// Function to get a product by ID
export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id)
}

// Function to get all categories
export function getCategories(): Category[] {
  return [...categories]
}

