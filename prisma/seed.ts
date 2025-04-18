import { PrismaClient } from '../src/generated/prisma'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create sample users
  const adminPassword = await hash('admin123', 12)
  const userPassword = await hash('user123', 12)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  })

  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'Regular User',
      password: userPassword,
      role: 'USER',
      emailVerified: new Date(),
    },
  })

  // Create categories
  const tshirtCategory = await prisma.category.create({
    data: {
      name: 'T-Shirts',
    },
  })

  const jeansCategory = await prisma.category.create({
    data: {
      name: 'Jeans',
    },
  })

  const shoesCategory = await prisma.category.create({
    data: {
      name: 'Shoes',
    },
  })

  // Create products for T-Shirts category
  await prisma.product.createMany({
    data: [
      {
        name: 'Classic White T-Shirt',
        description: 'A comfortable and versatile white t-shirt made from 100% cotton.',
        price: 29.99,
        images: ['/images/p11-1.jpg', '/images/p11-2.jpg'],
        stock: 100,
        categoryId: tshirtCategory.id,
        isFeatured: true,
      },
      {
        name: 'Black Graphic T-Shirt',
        description: 'Stylish black t-shirt with a unique graphic design.',
        price: 34.99,
        images: ['/images/p12-1.jpg', '/images/p12-2.jpg'],
        stock: 75,
        categoryId: tshirtCategory.id,
      },
    ],
  })

  // Create products for Jeans category
  await prisma.product.createMany({
    data: [
      {
        name: 'Slim Fit Blue Jeans',
        description: 'Modern slim fit jeans in classic blue wash.',
        price: 59.99,
        images: ['/images/p21-1.jpg', '/images/p21-2.jpg'],
        stock: 50,
        categoryId: jeansCategory.id,
        isFeatured: true,
      },
      {
        name: 'Black Skinny Jeans',
        description: 'Versatile black skinny jeans perfect for any occasion.',
        price: 49.99,
        images: ['/images/p22-1.jpg', '/images/p22-2.jpg'],
        stock: 60,
        categoryId: jeansCategory.id,
      },
    ],
  })

  // Create products for Shoes category
  await prisma.product.createMany({
    data: [
      {
        name: 'Classic White Sneakers',
        description: 'Timeless white sneakers with comfortable cushioning.',
        price: 79.99,
        images: ['/images/p31-1.jpg', '/images/p31-2.jpg'],
        stock: 40,
        categoryId: shoesCategory.id,
        isFeatured: true,
      },
      {
        name: 'Black Leather Boots',
        description: 'Stylish black leather boots for any season.',
        price: 89.99,
        images: ['/images/p32-1.jpg', '/images/p32-2.jpg'],
        stock: 30,
        categoryId: shoesCategory.id,
      },
    ],
  })

  console.log('Database has been seeded. 🌱')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 