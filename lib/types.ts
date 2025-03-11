export interface Product {
  id: string
  name: string
  description: string
  price: number
  salePrice?: number
  image: string
  category: string
  featured?: boolean
  newArrival?: boolean
  sale?: boolean
  stock?: number
  details?: {
    material?: string
    dimensions?: string
    care?: string
  }
}

export interface Category {
  id: string
  name: string
  description?: string
  image: string
}

