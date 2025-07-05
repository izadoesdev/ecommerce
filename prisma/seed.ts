import { PrismaClient, ProductStatus } from '../lib/generated/prisma'
import { faker } from '@faker-js/faker'

const prisma = new PrismaClient()

// Configuration
const CATEGORIES_COUNT = 15
const PRODUCTS_COUNT = 1500
const MIN_VARIANTS_PER_PRODUCT = 1
const MAX_VARIANTS_PER_PRODUCT = 5

// Clothing categories with realistic names and descriptions
const baseCategoryNames = [
    'T-Shirts & Tops', 'Shirts & Blouses', 'Hoodies & Sweatshirts', 'Jackets & Coats',
    'Jeans & Denim', 'Pants & Trousers', 'Shorts', 'Skirts & Dresses',
    'Activewear', 'Underwear & Intimates', 'Shoes & Footwear', 'Accessories',
    'Swimwear', 'Formal Wear', 'Outerwear'
]

// Clothing-specific product components
const clothingAdjectives = [
    'Classic', 'Vintage', 'Modern', 'Casual', 'Formal', 'Trendy', 'Stylish', 'Comfortable',
    'Premium', 'Designer', 'Slim-Fit', 'Oversized', 'Fitted', 'Relaxed', 'Stretch',
    'Breathable', 'Lightweight', 'Warm', 'Waterproof', 'Wrinkle-Free', 'Eco-Friendly'
]

const clothingItems = [
    // Tops
    'T-Shirt', 'Tank Top', 'Polo Shirt', 'Button-Down Shirt', 'Blouse', 'Sweater', 'Cardigan',
    'Hoodie', 'Sweatshirt', 'Crop Top', 'Tunic', 'Henley', 'Jersey', 'Vest',

    // Bottoms
    'Jeans', 'Chinos', 'Cargo Pants', 'Leggings', 'Joggers', 'Shorts', 'Skirt', 'Dress',
    'Sweatpants', 'Trousers', 'Capris', 'Palazzo Pants', 'Culottes',

    // Outerwear
    'Jacket', 'Blazer', 'Coat', 'Parka', 'Bomber Jacket', 'Denim Jacket', 'Leather Jacket',
    'Windbreaker', 'Raincoat', 'Peacoat', 'Trench Coat', 'Puffer Jacket',

    // Footwear
    'Sneakers', 'Boots', 'Sandals', 'Loafers', 'Heels', 'Flats', 'Oxfords', 'Ankle Boots',
    'Running Shoes', 'Dress Shoes', 'Slip-Ons', 'Wedges', 'Pumps',

    // Accessories
    'Belt', 'Scarf', 'Hat', 'Cap', 'Sunglasses', 'Watch', 'Bag', 'Backpack', 'Wallet',
    'Necklace', 'Bracelet', 'Earrings', 'Ring', 'Tie', 'Bow Tie'
]

const materials = [
    'Cotton', 'Polyester', 'Wool', 'Silk', 'Linen', 'Denim', 'Leather', 'Cashmere',
    'Bamboo', 'Modal', 'Spandex', 'Nylon', 'Viscose', 'Acrylic', 'Fleece'
]

const colors = [
    'Black', 'White', 'Navy', 'Gray', 'Charcoal', 'Beige', 'Khaki', 'Brown', 'Burgundy',
    'Red', 'Pink', 'Purple', 'Blue', 'Royal Blue', 'Green', 'Olive', 'Yellow', 'Orange',
    'Coral', 'Teal', 'Mint', 'Cream', 'Ivory', 'Taupe', 'Maroon', 'Sage', 'Dusty Rose'
]

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', '38', '40', '42']

// Clothing-specific Unsplash image collections
const imageCollections = {
    'tshirts': [
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1583743814966-8936f37f4ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1571945153237-4929e783af4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    'shirts': [
        'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    'hoodies': [
        'https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    'jackets': [
        'https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    'jeans': [
        'https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1475178626620-a4d074967452?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    'pants': [
        'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1506629905607-d0c8fe4f2b8d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    'dresses': [
        'https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1566479179817-c0e2e0d5e3d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    'shoes': [
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1552346154-21d32810aba3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1560769629-975ec94e6a86?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1463100099107-aa0980c362e6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    'accessories': [
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1506629905607-d0c8fe4f2b8d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1611652022419-a9419f74343d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    'activewear': [
        'https://images.unsplash.com/photo-1506629905607-d0c8fe4f2b8d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    'default': [
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ]
}

function getRandomImage(categoryName: string): string {
    const categoryKey = categoryName.toLowerCase().includes('shirt') || categoryName.toLowerCase().includes('top') ? 'tshirts' :
        categoryName.toLowerCase().includes('hoodie') || categoryName.toLowerCase().includes('sweatshirt') ? 'hoodies' :
            categoryName.toLowerCase().includes('jacket') || categoryName.toLowerCase().includes('coat') ? 'jackets' :
                categoryName.toLowerCase().includes('jean') || categoryName.toLowerCase().includes('denim') ? 'jeans' :
                    categoryName.toLowerCase().includes('pants') || categoryName.toLowerCase().includes('trousers') ? 'pants' :
                        categoryName.toLowerCase().includes('dress') || categoryName.toLowerCase().includes('skirt') ? 'dresses' :
                            categoryName.toLowerCase().includes('shoes') || categoryName.toLowerCase().includes('footwear') ? 'shoes' :
                                categoryName.toLowerCase().includes('accessories') ? 'accessories' :
                                    categoryName.toLowerCase().includes('activewear') ? 'activewear' : 'default'

    const images = imageCollections[categoryKey]
    return images[Math.floor(Math.random() * images.length)]
}

function generateProductName(): string {
    const adjective = clothingAdjectives[Math.floor(Math.random() * clothingAdjectives.length)]
    const item = clothingItems[Math.floor(Math.random() * clothingItems.length)]
    return `${adjective} ${item}`
}

function generateProductDescription(name: string): string {
    const templates = [
        `This ${name.toLowerCase()} combines style and comfort for everyday wear.`,
        `Crafted with premium materials, this ${name.toLowerCase()} is perfect for any occasion.`,
        `Add versatility to your wardrobe with this timeless ${name.toLowerCase()}.`,
        `High-quality ${name.toLowerCase()} designed for durability and style.`,
        `Elevate your look with this must-have ${name.toLowerCase()}.`,
        `Premium ${name.toLowerCase()} that offers both comfort and fashion-forward design.`,
        `Perfect for layering or wearing alone, this ${name.toLowerCase()} is a wardrobe essential.`,
        `Contemporary ${name.toLowerCase()} that reflects modern style and quality craftsmanship.`
    ]

    return templates[Math.floor(Math.random() * templates.length)]
}

function generateTags(categoryName: string, productName: string): string[] {
    const baseTags = [categoryName.toLowerCase().replace(/\s+/g, '-')]
    const productWords = productName.toLowerCase().split(' ')
    const additionalTags = [
        'fashion', 'style', 'clothing', 'apparel', 'trendy', 'comfortable', 'quality',
        'wardrobe', 'outfit', 'casual', 'formal', 'streetwear', 'designer', 'premium',
        'cotton', 'sustainable', 'versatile', 'classic', 'modern'
    ]

    const tags = [...baseTags, ...productWords]

    // Add 2-4 random additional tags
    for (let i = 0; i < Math.floor(Math.random() * 3) + 2; i++) {
        const tag = additionalTags[Math.floor(Math.random() * additionalTags.length)]
        if (!tags.includes(tag)) {
            tags.push(tag)
        }
    }

    return tags
}

function generateVariant(productName: string, categoryName: string): any {
    const basePrice = Math.floor(Math.random() * 200) + 15 // $15-$215
    const hasDiscount = Math.random() < 0.25 // 25% chance of discount
    const salePrice = hasDiscount ? Math.floor(basePrice * 0.8) : undefined

    const variantCount = Math.floor(Math.random() * 3) + 1 // 1-3 images
    const images = Array.from({ length: variantCount }, () => getRandomImage(categoryName))

    return {
        price: basePrice,
        salePrice,
        stock: Math.floor(Math.random() * 50) + 5,
        images,
        options: {
            color: colors[Math.floor(Math.random() * colors.length)],
            size: sizes[Math.floor(Math.random() * sizes.length)],
            material: materials[Math.floor(Math.random() * materials.length)]
        }
    }
}

async function main() {
    console.log('👕 Starting clothing store database seeding...')
    console.log(`📊 Generating ${CATEGORIES_COUNT} categories and ${PRODUCTS_COUNT} products`)

    // Clear existing data
    console.log('🧹 Clearing existing data...')
    await prisma.product.deleteMany()
    await prisma.category.deleteMany()

    // Generate categories
    console.log('🏷️ Generating clothing categories...')
    const categories = []

    for (let i = 0; i < CATEGORIES_COUNT; i++) {
        const name = baseCategoryNames[i]

        const category = await prisma.category.create({
            data: {
                slug: name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
                name,
                description: `Discover our collection of ${name.toLowerCase()} featuring the latest trends and timeless classics.`,
                image: getRandomImage(name)
            }
        })

        categories.push(category)

        if ((i + 1) % 5 === 0) {
            console.log(`  ✅ Created ${i + 1}/${CATEGORIES_COUNT} categories`)
        }
    }

    console.log(`✅ Created ${categories.length} clothing categories`)

    // Generate products in batches
    console.log('👔 Generating clothing products...')
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
                status: 'PUBLISHED' as ProductStatus,
                featured: Math.random() < 0.12, // 12% chance of being featured
                newArrival: Math.random() < 0.18, // 18% chance of being new arrival
                sale: Math.random() < 0.22, // 22% chance of being on sale
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

    console.log('\n📈 Clothing Store Statistics:')
    console.log(`  👕 Total Products: ${PRODUCTS_COUNT}`)
    console.log(`  🏷️ Total Categories: ${CATEGORIES_COUNT}`)
    console.log(`  ⭐ Featured Products: ${stats.find(s => s.featured)?._count || 0}`)
    console.log(`  🆕 New Arrivals: ${stats.find(s => s.newArrival)?._count || 0}`)
    console.log(`  💰 Sale Products: ${stats.find(s => s.sale)?._count || 0}`)

    console.log('\n🎉 Clothing store database seeding completed successfully!')
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    }) 