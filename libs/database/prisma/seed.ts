import { PrismaClient, StockStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // ── Categories ────────────────────────────────────────────────────────────
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { id: 'kachir' },
      update: {},
      create: { id: 'kachir', nameFr: 'Kachir', nameAr: 'كشير', icon: '🥩', imageUrl: '/images/categories/kachir.jpg' },
    }),
    prisma.category.upsert({
      where: { id: 'rotis' },
      update: {},
      create: { id: 'rotis', nameFr: 'Rôtis', nameAr: 'روتي', icon: '🍖', imageUrl: '/images/categories/rotis.jpg' },
    }),
    prisma.category.upsert({
      where: { id: 'conserves' },
      update: {},
      create: { id: 'conserves', nameFr: 'Conserves', nameAr: 'معلبات', icon: '🥫', imageUrl: '/images/categories/conserves.jpg' },
    }),
    prisma.category.upsert({
      where: { id: 'hot-dog' },
      update: {},
      create: { id: 'hot-dog', nameFr: 'Hot Dog', nameAr: 'هوت دوج', icon: '🌭', imageUrl: '/images/categories/hot-dog.jpg' },
    }),
    prisma.category.upsert({
      where: { id: 'luncheon' },
      update: {},
      create: { id: 'luncheon', nameFr: 'Luncheon', nameAr: 'لانشون', icon: '🍽️', imageUrl: '/images/categories/luncheon.jpg' },
    }),
  ]);

  console.log(`✓ ${categories.length} categories seeded`);

  // ── Products ──────────────────────────────────────────────────────────────
  const products = await Promise.all([
    prisma.product.upsert({
      where: { id: 'prod_001' },
      update: {},
      create: {
        id: 'prod_001', categoryId: 'kachir',
        nameFr: 'Kachir Bœuf Premium', nameAr: 'كشير بقري فاخر',
        descriptionFr: 'Kachir de viande de bœuf de haute qualité, préparé selon les méthodes traditionnelles de Bellat.',
        descriptionAr: 'كشير من لحم البقر عالي الجودة، محضر وفق الطرق التقليدية لبلاط.',
        price: 450, unit: '500g', stockStatus: StockStatus.in_stock, imageUrl: '/images/products/kachir.jpg',
      },
    }),
    prisma.product.upsert({
      where: { id: 'prod_002' },
      update: {},
      create: {
        id: 'prod_002', categoryId: 'luncheon',
        nameFr: 'Luncheon Poulet', nameAr: 'لانشون دجاج',
        descriptionFr: 'Luncheon de poulet savoureux, idéal pour les sandwichs.',
        descriptionAr: 'لانشون دجاج لذيذ، مثالي للساندويتش.',
        price: 380, unit: '400g', stockStatus: StockStatus.in_stock, imageUrl: '/images/products/jambon.jpg',
      },
    }),
    prisma.product.upsert({
      where: { id: 'prod_003' },
      update: {},
      create: {
        id: 'prod_003', categoryId: 'rotis',
        nameFr: 'Rôti de Dinde', nameAr: 'روتي الديك الرومي',
        descriptionFr: 'Un délicieux rôti de dinde, parfait pour les repas de famille.',
        descriptionAr: 'روتي الديك الرومي اللذيذ، مثالي للوجبات العائلية.',
        price: 1200, unit: '1kg', stockStatus: StockStatus.in_stock, imageUrl: '/images/products/rotis.jpg',
      },
    }),
    prisma.product.upsert({
      where: { id: 'prod_004' },
      update: {},
      create: {
        id: 'prod_004', categoryId: 'hot-dog',
        nameFr: 'Saucisses Hot Dog', nameAr: 'نقانق هوت دوج',
        descriptionFr: 'Les saucisses parfaites pour vos soirées hot dog.',
        descriptionAr: 'النقانق المثالية لأمسيات الهوت دوج الخاصة بك.',
        price: 320, unit: 'Paquet de 10', stockStatus: StockStatus.low_stock, imageUrl: '/images/products/hot dog.jpg',
      },
    }),
    prisma.product.upsert({
      where: { id: 'prod_005' },
      update: {},
      create: {
        id: 'prod_005', categoryId: 'conserves',
        nameFr: 'Pâté de Volaille en Conserve', nameAr: 'باتي دجاج معلب',
        descriptionFr: 'Pâté de volaille en conserve, pratique et savoureux.',
        descriptionAr: 'باتي دجاج معلب، عملي ولذيذ.',
        price: 250, unit: '200g', stockStatus: StockStatus.in_stock, imageUrl: '/images/products/pâtés.jpg',
      },
    }),
    prisma.product.upsert({
      where: { id: 'prod_006' },
      update: {},
      create: {
        id: 'prod_006', categoryId: 'luncheon',
        nameFr: 'Mortadella', nameAr: 'مرتديلا',
        descriptionFr: 'Mortadella de qualité supérieure, goût authentique italien.',
        descriptionAr: 'مرتديلا عالية الجودة، بطعم إيطالي أصيل.',
        price: 470, unit: '500g', stockStatus: StockStatus.in_stock, imageUrl: '/images/products/mortadella.jpg',
      },
    }),
    prisma.product.upsert({
      where: { id: 'prod_007' },
      update: {},
      create: {
        id: 'prod_007', categoryId: 'conserves',
        nameFr: 'Galantine de Poulet', nameAr: 'جالنتين دجاج',
        descriptionFr: 'Galantine de poulet délicate, préparée avec soin.',
        descriptionAr: 'جالنتين دجاج رقيق، محضر بعناية.',
        price: 380, unit: '300g', stockStatus: StockStatus.in_stock, imageUrl: '/images/products/galantine.jpg',
      },
    }),
    prisma.product.upsert({
      where: { id: 'prod_008' },
      update: {},
      create: {
        id: 'prod_008', categoryId: 'luncheon',
        nameFr: 'Salami Premium', nameAr: 'سلامي فاخر',
        descriptionFr: 'Salami de première qualité, saveur riche et authentique.',
        descriptionAr: 'سلامي من الدرجة الأولى، نكهة غنية وأصيلة.',
        price: 520, unit: '400g', stockStatus: StockStatus.in_stock, imageUrl: '/images/products/salami.jpg',
      },
    }),
    prisma.product.upsert({
      where: { id: 'prod_009' },
      update: {},
      create: {
        id: 'prod_009', categoryId: 'kachir',
        nameFr: 'Chawarma Épicée', nameAr: 'شاورما حارة',
        descriptionFr: 'Chawarma épicée, parfaite pour vos plateaux orientaux.',
        descriptionAr: 'شاورما حارة، مثالية للأطباق الشرقية.',
        price: 460, unit: '500g', stockStatus: StockStatus.in_stock, imageUrl: '/images/products/chawarma.jpg',
      },
    }),
  ]);

  console.log(`✓ ${products.length} products seeded`);
  console.log('Done.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
