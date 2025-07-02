import { PrismaClient } from '../lib/generated/prisma'
import { faker } from '@faker-js/faker'

const prisma = new PrismaClient()

// Configuration
const CATEGORIES_COUNT = 20
const PRODUCTS_COUNT = 2000
const MIN_VARIANTS_PER_PRODUCT = 1
const MAX_VARIANTS_PER_PRODUCT = 4

// Base categories with realistic names and descriptions
const baseCategoryNames = [
    'Furniture', 'Home Decor', 'Kitchen', 'Textiles', 'Lighting', 'Storage',
    'Bathroom', 'Bedroom', 'Living Room', 'Dining Room', 'Office', 'Outdoor',
    'Art & Prints', 'Rugs & Carpets', 'Curtains & Blinds', 'Plants & Planters',
    'Mirrors', 'Clocks', 'Candles & Scents', 'Electronics'
]

// Product name components for realistic generation
const productAdjectives = [
    'Modern', 'Vintage', 'Minimalist', 'Rustic', 'Contemporary', 'Classic',
    'Elegant', 'Stylish', 'Luxury', 'Premium', 'Handcrafted', 'Designer',
    'Scandinavian', 'Industrial', 'Bohemian', 'Traditional', 'Sleek', 'Chic'
]

const productNouns = [
    'Sofa', 'Chair', 'Table', 'Lamp', 'Vase', 'Mirror', 'Cushion', 'Throw',
    'Rug', 'Bookshelf', 'Cabinet', 'Stool', 'Bench', 'Desk', 'Bed', 'Dresser',
    'Nightstand', 'Wardrobe', 'Armchair', 'Ottoman', 'Sideboard', 'Console',
    'Chandelier', 'Pendant', 'Sconce', 'Floor Lamp', 'Table Lamp', 'Candle',
    'Picture Frame', 'Wall Art', 'Plant Pot', 'Basket', 'Tray', 'Bowl',
    'Plate', 'Cup', 'Mug', 'Cutting Board', 'Storage Box', 'Organizer'
]

const materials = ['Wood', 'Metal', 'Glass', 'Ceramic', 'Fabric', 'Leather', 'Plastic', 'Stone', 'Marble', 'Bamboo']
const colors = ['White', 'Black', 'Gray', 'Brown', 'Blue', 'Green', 'Red', 'Yellow', 'Pink', 'Purple', 'Beige', 'Navy']
const sizes = ['Small', 'Medium', 'Large', 'Extra Large', 'Compact', 'Standard', 'Oversized']

// Unsplash image collections for different categories
const imageCollections = {
    furniture: [
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    decor: [
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    kitchen: [
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1600585152220-90363fe7e115?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    textiles: [
        'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    default: [
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ]
}

function getRandomImage(categoryName: string): string {
    const categoryKey = categoryName.toLowerCase().includes('furniture') ? 'furniture' :
        categoryName.toLowerCase().includes('decor') ? 'decor' :
            categoryName.toLowerCase().includes('kitchen') ? 'kitchen' :
                categoryName.toLowerCase().includes('textile') ? 'textiles' : 'default'

    const images = imageCollections[categoryKey]
    return images[Math.floor(Math.random() * images.length)]
}

function generateProductName(): string {
    const adjective = productAdjectives[Math.floor(Math.random() * productAdjectives.length)]
    const noun = productNouns[Math.floor(Math.random() * productNouns.length)]
    return `${adjective} ${noun}`
}

function generateProductDescription(name: string): string {
    const templates = [
        `This ${name.toLowerCase()} brings style and functionality to your space.`,
        `Crafted with attention to detail, this ${name.toLowerCase()} is perfect for modern homes.`,
        `Add a touch of elegance to your room with this beautiful ${name.toLowerCase()}.`,
        `High-quality ${name.toLowerCase()} designed for comfort and durability.`,
        `Transform your space with this stunning ${name.toLowerCase()}.`,
        `Premium ${name.toLowerCase()} that combines form and function seamlessly.`,
        `Elevate your interior design with this exceptional ${name.toLowerCase()}.`,
        `Handpicked ${name.toLowerCase()} that reflects contemporary style.`
    ]

    return templates[Math.floor(Math.random() * templates.length)]
}

function generateTags(categoryName: string, productName: string): string[] {
    const baseTags = [categoryName.toLowerCase().replace(/\s+/g, '-')]
    const productWords = productName.toLowerCase().split(' ')
    const additionalTags = [
        'modern', 'stylish', 'contemporary', 'elegant', 'premium', 'quality',
        'home', 'interior', 'design', 'decor', 'furniture', 'lifestyle'
    ]

    const tags = [...baseTags, ...productWords]

    // Add 2-3 random additional tags
    for (let i = 0; i < Math.floor(Math.random() * 3) + 2; i++) {
        const tag = additionalTags[Math.floor(Math.random() * additionalTags.length)]
        if (!tags.includes(tag)) {
            tags.push(tag)
        }
    }

    return tags
}

function generateVariant(productName: string, categoryName: string): any {
    const basePrice = Math.floor(Math.random() * 500) + 20 // $20-$520
    const hasDiscount = Math.random() < 0.3 // 30% chance of discount
    const salePrice = hasDiscount ? Math.floor(basePrice * 0.7) : undefined

    const variantCount = Math.floor(Math.random() * 3) + 1 // 1-3 images
    const images = Array.from({ length: variantCount }, () => getRandomImage(categoryName))

    return {
        price: basePrice,
        salePrice,
        stock: Math.floor(Math.random() * 100) + 1,
        images,
        options: {
            color: colors[Math.floor(Math.random() * colors.length)],
            size: sizes[Math.floor(Math.random() * sizes.length)],
            material: materials[Math.floor(Math.random() * materials.length)]
        }
    }
}

async function main() {
    console.log('🌱 Starting procedural database seeding...')
    console.log(`📊 Generating ${CATEGORIES_COUNT} categories and ${PRODUCTS_COUNT} products`)

    // Clear existing data
    console.log('🧹 Clearing existing data...')
    await prisma.product.deleteMany()
    await prisma.category.deleteMany()

    // Generate categories
    console.log('🏷️ Generating categories...')
    const categories = []

    for (let i = 0; i < CATEGORIES_COUNT; i++) {
        const baseName = baseCategoryNames[i % baseCategoryNames.length]
        const variation = i >= baseCategoryNames.length ? ` ${Math.floor(i / baseCategoryNames.length) + 1}` : ''
        const name = `${baseName}${variation}`

        const category = await prisma.category.create({
            data: {
                slug: name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
                name,
                description: faker.commerce.productDescription(),
                image: getRandomImage(name)
            }
        })

        categories.push(category)

        if ((i + 1) % 5 === 0) {
            console.log(`  ✅ Created ${i + 1}/${CATEGORIES_COUNT} categories`)
        }
    }

    console.log(`✅ Created ${categories.length} categories`)

    // Generate products in batches
    console.log('🛍️ Generating products...')
    const batchSize = 100

    for (let batch = 0; batch < Math.ceil(PRODUCTS_COUNT / batchSize); batch++) {
        const batchStart = batch * batchSize
        const batchEnd = Math.min(batchStart + batchSize, PRODUCTS_COUNT)

        const productsData = []

        for (let i = batchStart; i < batchEnd; i++) {
            const name = generateProductName()
            const category = categories[Math.floor(Math.random() * categories.length)]
            const variantCount = Math.floor(Math.random() * (MAX_VARIANTS_PER_PRODUCT - MIN_VARIANTS_PER_PRODUCT + 1)) + MIN_VARIANTS_PER_PRODUCT

            const variants = Array.from({ length: variantCount }, () => generateVariant(name, category.name))

            // Ensure unique slug
            const baseSlug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
            const slug = `${baseSlug}-${i}`

            productsData.push({
                slug,
                name,
                description: generateProductDescription(name),
                categoryId: category.id,
                status: 'PUBLISHED',
                featured: Math.random() < 0.15, // 15% chance of being featured
                newArrival: Math.random() < 0.20, // 20% chance of being new arrival
                sale: Math.random() < 0.25, // 25% chance of being on sale
                tags: generateTags(category.name, name),
                variants: {
                    create: variants
                }
            })
        }

        // Create products in batch
        await Promise.all(
            productsData.map(productData =>
                prisma.product.create({
                    data: productData
                })
            )
        )

        console.log(`  ✅ Created batch ${batch + 1}/${Math.ceil(PRODUCTS_COUNT / batchSize)} (${batchEnd}/${PRODUCTS_COUNT} products)`)
    }

    // Generate some statistics
    const stats = await prisma.product.groupBy({
        by: ['featured', 'newArrival', 'sale'],
        _count: true
    })

    console.log('\n📈 Generation Statistics:')
    console.log(`  📦 Total Products: ${PRODUCTS_COUNT}`)
    console.log(`  🏷️ Total Categories: ${CATEGORIES_COUNT}`)
    console.log(`  ⭐ Featured Products: ${stats.find(s => s.featured)?._count || 0}`)
    console.log(`  🆕 New Arrivals: ${stats.find(s => s.newArrival)?._count || 0}`)
    console.log(`  💰 Sale Products: ${stats.find(s => s.sale)?._count || 0}`)

    console.log('\n🎉 Procedural database seeding completed successfully!')
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    }) 