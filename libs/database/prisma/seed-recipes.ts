/**
 * One-time script: seeds the 6 static recipes from web/lib/data/recipes.ts
 * into the new `recipes` and `recipe_ingredients` tables.
 * Run: npx ts-node prisma/seed-recipes.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const RECIPES = [
  {
    id: 'chawarma-maison',
    nameFr: 'Chawarma maison façon Bellat',
    nameAr: 'شاورما بيتية على طريقة بيلات',
    descriptionFr: "Une recette rapide et savoureuse de chawarma avec la chawarma épicée Bellat, servie en pain pita avec une sauce blanche à l'ail.",
    descriptionAr: 'وصفة سريعة ولذيذة للشاورما مع شاورما بيلات الحارة، تُقدَّم في خبز البيتا مع صلصة الثوم البيضاء.',
    imageUrl: '/images/recipes/chawarma.jpg',
    prepTime: 10, cookTime: 15, servings: 4, difficulty: 'easy', category: 'quick',
    stepsFr: [
      "Préparer la sauce blanche : mélanger le yaourt, l'ail écrasé, le jus de citron, du sel et du poivre. Réserver au frais.",
      'Émincer l\'oignon en fines rondelles. Couper les tomates en dés. Ciseler le persil.',
      'Faire chauffer une poêle à feu vif avec un filet d\'huile. Faire revenir la chawarma Bellat 5 à 7 minutes en remuant régulièrement jusqu\'à légère coloration.',
      'Réchauffer les pains pita 1 minute dans une poêle sèche ou au four.',
      'Garnir chaque pain de chawarma, oignon, tomate, persil et napper généreusement de sauce blanche.',
      'Rouler et servir immédiatement.',
    ],
    stepsAr: [
      'تحضير صلصة الثوم البيضاء: اخلط اللبن مع الثوم المهروس وعصير الليمون والملح والفلفل. ضعها في الثلاجة.',
      'قطّع البصل إلى حلقات رفيعة. قطّع الطماطم إلى مكعبات. قطّع البقدونس.',
      'سخّن مقلاة على نار عالية مع قليل من الزيت. أضف شاورما بيلات واتركها تُحمَّر 5-7 دقائق مع التحريك.',
      'سخّن خبز البيتا دقيقة واحدة في مقلاة جافة أو في الفرن.',
      'ضع الشاورما في الخبز مع البصل والطماطم والبقدونس، ثم أضف الصلصة البيضاء بسخاء.',
      'لفّ واخدمه فوراً.',
    ],
    ingredients: [
      { productId: 'prod_009', nameFr: 'Chawarma Épicée Bellat', nameAr: 'شاورما حارة بيلات', quantity: '400', unit: 'g', sortOrder: 0 },
      { nameFr: 'Pain pita', nameAr: 'خبز البيتا', quantity: '4', unit: 'pièces', sortOrder: 1 },
      { nameFr: 'Tomate', nameAr: 'طماطم', quantity: '2', unit: 'pièces', sortOrder: 2 },
      { nameFr: 'Oignon', nameAr: 'بصل', quantity: '1', unit: 'pièce', sortOrder: 3 },
      { nameFr: 'Persil frais', nameAr: 'بقدونس طازج', quantity: '1', unit: 'bouquet', sortOrder: 4 },
      { nameFr: 'Yaourt nature', nameAr: 'لبن طبيعي', quantity: '200', unit: 'g', sortOrder: 5 },
      { nameFr: 'Ail', nameAr: 'ثوم', quantity: '2', unit: 'gousses', sortOrder: 6 },
      { nameFr: 'Jus de citron', nameAr: 'عصير ليمون', quantity: '1', unit: 'c. à soupe', sortOrder: 7 },
    ],
  },
  {
    id: 'sandwich-kachir-grille',
    nameFr: 'Sandwich kachir grillé au fromage',
    nameAr: 'ساندويش كشير مشوي بالجبن',
    descriptionFr: 'Un sandwich croustillant et fondant avec le kachir bœuf premium Bellat, parfait pour un déjeuner rapide.',
    descriptionAr: 'ساندويش مقرمش ومتماسك مع كشير البقر الفاخر من بيلات، مثالي لغداء سريع.',
    imageUrl: '/images/recipes/sandwich-kachir.jpg',
    prepTime: 5, cookTime: 10, servings: 2, difficulty: 'easy', category: 'quick',
    stepsFr: [
      "Trancher le kachir en rondelles de 5 mm d'épaisseur.",
      "Faire dorer les tranches de kachir dans une poêle avec un filet d'huile, 2 minutes de chaque côté.",
      'Beurrer légèrement les tranches de pain de mie côté extérieur.',
      'Assembler : pain, moutarde, kachir grillé, fromage fondu, tomate, pain.',
      'Faire cuire le sandwich dans la même poêle à feu moyen, 2 min de chaque côté, jusqu\'à ce que le pain soit doré et le fromage fondu.',
      'Servir chaud coupé en diagonale.',
    ],
    stepsAr: [
      'قطّع الكشير إلى شرائح بسماكة 5 مم.',
      'احمرّ شرائح الكشير في مقلاة مع قليل من الزيت، دقيقتان من كل جانب.',
      'ادهن خبز التوست بالزبدة من الخارج.',
      'اجمع المكونات: خبز، خردل، كشير مشوي، جبن مذاب، طماطم، خبز.',
      'اطبخ الساندويش في نفس المقلاة على نار متوسطة، دقيقتان من كل جانب حتى يصبح الخبز ذهبياً والجبن ذائباً.',
      'قدّمه ساخناً مقطوعاً قطرياً.',
    ],
    ingredients: [
      { productId: 'prod_001', nameFr: 'Kachir Bœuf Premium Bellat', nameAr: 'كشير بقري فاخر بيلات', quantity: '200', unit: 'g', sortOrder: 0 },
      { nameFr: 'Pain de mie', nameAr: 'خبز التوست', quantity: '4', unit: 'tranches', sortOrder: 1 },
      { nameFr: 'Fromage fondu (tranches)', nameAr: 'جبن مذاب (شرائح)', quantity: '4', unit: 'tranches', sortOrder: 2 },
      { nameFr: 'Tomate', nameAr: 'طماطم', quantity: '1', unit: 'pièce', sortOrder: 3 },
      { nameFr: 'Moutarde douce', nameAr: 'خردل حلو', quantity: '1', unit: 'c. à soupe', sortOrder: 4 },
      { nameFr: 'Beurre', nameAr: 'زبدة', quantity: '20', unit: 'g', sortOrder: 5 },
    ],
  },
  {
    id: 'pizza-charcuterie',
    nameFr: 'Pizza charcuterie Bellat',
    nameAr: 'بيتزا لحوم بيلات',
    descriptionFr: 'Une pizza généreuse garnie de mortadella, salami et saucisses Bellat sur une sauce tomate maison.',
    descriptionAr: 'بيتزا سخية مع مرتديلا وسلامي ونقانق بيلات على صلصة طماطم منزلية.',
    imageUrl: '/images/recipes/pizza.jpg',
    prepTime: 20, cookTime: 25, servings: 4, difficulty: 'medium', category: 'main',
    stepsFr: [
      'Préchauffer le four à 220 °C (chaleur tournante).',
      "Étaler la pâte à pizza sur une plaque farinée. Mélanger le concentré de tomates avec 2 cuillères d'eau, du sel, du poivre et de l'origan. Étaler sur la pâte.",
      'Parsemer la moitié de la mozzarella sur la sauce.',
      'Couper le salami, la mortadella et les saucisses en rondelles. Répartir uniformément sur la pizza avec le poivron et les champignons.',
      "Recouvrir avec le reste de mozzarella. Saupoudrer d'origan.",
      "Enfourner 20 à 25 minutes jusqu'à ce que la pâte soit dorée et le fromage bouillonnant.",
      'Servir immédiatement, coupée en parts.',
    ],
    stepsAr: [
      'سخّن الفرن على 220 درجة مئوية (حرارة متداورة).',
      'افرد عجينة البيتزا على صينية مطحنة. اخلط معجون الطماطم مع ملعقتين من الماء والملح والفلفل والزعتر. افرده على العجينة.',
      'وزّع نصف كمية الموزاريلا على الصلصة.',
      'قطّع السلامي والمرتديلا والنقانق إلى شرائح. وزّعها على البيتزا مع الفلفل والفطر.',
      'غطّها بباقي الموزاريلا ورش الزعتر.',
      'أدخلها الفرن 20-25 دقيقة حتى تصبح العجينة ذهبية والجبن يفور.',
      'قدّمها فوراً مقطوعة إلى شرائح.',
    ],
    ingredients: [
      { productId: 'prod_006', nameFr: 'Mortadella Bellat', nameAr: 'مرتديلا بيلات', quantity: '150', unit: 'g', sortOrder: 0 },
      { productId: 'prod_008', nameFr: 'Salami Premium Bellat', nameAr: 'سلامي فاخر بيلات', quantity: '100', unit: 'g', sortOrder: 1 },
      { productId: 'prod_004', nameFr: 'Saucisses Hot Dog Bellat', nameAr: 'نقانق هوت دوج بيلات', quantity: '3', unit: 'pièces', sortOrder: 2 },
      { nameFr: 'Pâte à pizza (ronde, 30 cm)', nameAr: 'عجينة بيتزا (دائرية، 30 سم)', quantity: '1', unit: 'pièce', sortOrder: 3 },
      { nameFr: 'Concentré de tomates', nameAr: 'معجون الطماطم', quantity: '3', unit: 'c. à soupe', sortOrder: 4 },
      { nameFr: 'Mozzarella râpée', nameAr: 'موزاريلا مبشورة', quantity: '200', unit: 'g', sortOrder: 5 },
      { nameFr: 'Poivron rouge', nameAr: 'فلفل أحمر', quantity: '1', unit: 'pièce', sortOrder: 6 },
      { nameFr: 'Champignons en boîte', nameAr: 'فطر معلب', quantity: '100', unit: 'g', sortOrder: 7 },
      { nameFr: 'Origan séché', nameAr: 'زعتر مجفف', quantity: '1', unit: 'c. à café', sortOrder: 8 },
    ],
  },
  {
    id: 'salade-composee-luncheon',
    nameFr: 'Salade composée au luncheon poulet',
    nameAr: 'سلطة مركبة مع لانشون الدجاج',
    descriptionFr: 'Une salade fraîche et rassasiante avec le luncheon poulet Bellat, idéale en entrée ou en plat léger.',
    descriptionAr: 'سلطة طازجة ومشبعة مع لانشون دجاج بيلات، مثالية كمقبّلة أو طبق خفيف.',
    imageUrl: '/images/recipes/salade.jpg',
    prepTime: 15, cookTime: 0, servings: 2, difficulty: 'easy', category: 'starter',
    stepsFr: [
      'Couper le luncheon Bellat en cubes de 1 cm.',
      'Laver et essorer la laitue. Couper les feuilles en morceaux. Couper le concombre en demi-rondelles.',
      'Dans un grand saladier, combiner laitue, tomates cerises coupées en deux, concombre, maïs et olives.',
      'Ajouter les cubes de luncheon.',
      "Préparer la vinaigrette : fouetter huile d'olive, vinaigre balsamique, moutarde, sel et poivre.",
      'Arroser la salade de vinaigrette, mélanger délicatement et servir immédiatement.',
    ],
    stepsAr: [
      'قطّع لانشون بيلات إلى مكعبات بحجم 1 سم.',
      'اغسل الخس وصففه. قطّع الأوراق إلى قطع. قطّع الخيار إلى نصف دوائر.',
      'في وعاء سلطة كبير، اجمع الخس وطماطم الكرزية المقطوعة بالنصف والخيار والذرة والزيتون.',
      'أضف مكعبات اللانشون.',
      'تحضير التتبيلة: اخفق زيت الزيتون والخل البلسمي والخردل والملح والفلفل.',
      'ارش السلطة بالتتبيلة، قلّب بلطف وقدّمها فوراً.',
    ],
    ingredients: [
      { productId: 'prod_002', nameFr: 'Luncheon Poulet Bellat', nameAr: 'لانشون دجاج بيلات', quantity: '200', unit: 'g', sortOrder: 0 },
      { nameFr: 'Laitue', nameAr: 'خس', quantity: '1', unit: 'tête', sortOrder: 1 },
      { nameFr: 'Tomates cerises', nameAr: 'طماطم كرزية', quantity: '100', unit: 'g', sortOrder: 2 },
      { nameFr: 'Maïs en boîte', nameAr: 'ذرة معلبة', quantity: '80', unit: 'g', sortOrder: 3 },
      { nameFr: 'Concombre', nameAr: 'خيار', quantity: '1', unit: 'pièce', sortOrder: 4 },
      { nameFr: 'Olives noires', nameAr: 'زيتون أسود', quantity: '50', unit: 'g', sortOrder: 5 },
      { nameFr: "Huile d'olive", nameAr: 'زيت زيتون', quantity: '3', unit: 'c. à soupe', sortOrder: 6 },
      { nameFr: 'Vinaigre balsamique', nameAr: 'خل بلسمي', quantity: '1', unit: 'c. à soupe', sortOrder: 7 },
      { nameFr: 'Moutarde', nameAr: 'خردل', quantity: '1', unit: 'c. à café', sortOrder: 8 },
    ],
  },
  {
    id: 'roti-dinde-farci',
    nameFr: 'Rôti de dinde farci aux légumes',
    nameAr: 'روتي ديك رومي محشو بالخضروات',
    descriptionFr: "Une recette festive et élaborée avec le rôti de dinde Bellat, farci d'un mélange de légumes et cuit au four.",
    descriptionAr: 'وصفة احتفالية ومتقنة مع روتي الديك الرومي من بيلات، محشو بمزيج من الخضروات ومطبوخ في الفرن.',
    imageUrl: '/images/recipes/roti-dinde.jpg',
    prepTime: 20, cookTime: 45, servings: 6, difficulty: 'medium', category: 'main',
    stepsFr: [
      "Préchauffer le four à 180 °C. Éplucher et couper carottes, poivron et oignon en brunoise fine. Écraser l'ail.",
      'Faire revenir les légumes à la poêle avec 2 c. à soupe d\'huile, 5 minutes. Saler, poivrer. Laisser refroidir.',
      "Inciser le rôti en son centre dans le sens de la longueur sans le couper. Farcir avec les légumes sautés. Ficeler le rôti.",
      "Badigeonner le rôti d'huile d'olive, saler, poivrer et déposer dans un plat à four.",
      'Éplucher les pommes de terre, les couper en quartiers et les disposer autour du rôti. Verser le bouillon. Ajouter le bouquet garni.',
      'Cuire 40 à 45 minutes en arrosant à mi-cuisson. Vérifier la température à cœur (75 °C).',
      'Laisser reposer 10 minutes avant de trancher. Servir avec les pommes de terre et le jus de cuisson.',
    ],
    stepsAr: [
      'سخّن الفرن على 180 درجة. قشّر وقطّع الجزر والفلفل والبصل إلى قطع صغيرة. هرّس الثوم.',
      'حمّر الخضروات في مقلاة مع ملعقتين من الزيت لمدة 5 دقائق. أضف الملح والفلفل. اتركها تبرد.',
      'شقّ الروتي في المنتصف بالطول دون قطعه كاملاً. احشه بالخضروات المحمّرة. اربطه بخيط.',
      'ادهن الروتي بزيت الزيتون والملح والفلفل وضعه في صينية الفرن.',
      'قشّر البطاطس وقطّعها إلى أرباع وضعها حول الروتي. صبّ المرق. أضف باقة الأعشاب.',
      'اطهِ 40-45 دقيقة مع التبليل في منتصف الطهي. تأكد من درجة الحرارة الداخلية (75 درجة).',
      'اتركه يرتاح 10 دقائق قبل التقطيع. قدّمه مع البطاطس وعصير الطهي.',
    ],
    ingredients: [
      { productId: 'prod_003', nameFr: 'Rôti de Dinde Bellat', nameAr: 'روتي الديك الرومي بيلات', quantity: '1', unit: 'pièce (800 g)', sortOrder: 0 },
      { nameFr: 'Carottes', nameAr: 'جزر', quantity: '2', unit: 'pièces', sortOrder: 1 },
      { nameFr: 'Poivron vert', nameAr: 'فلفل أخضر', quantity: '1', unit: 'pièce', sortOrder: 2 },
      { nameFr: 'Oignon', nameAr: 'بصل', quantity: '1', unit: 'pièce', sortOrder: 3 },
      { nameFr: 'Ail', nameAr: 'ثوم', quantity: '3', unit: 'gousses', sortOrder: 4 },
      { nameFr: 'Bouillon de volaille', nameAr: 'مرق دجاج', quantity: '200', unit: 'ml', sortOrder: 5 },
      { nameFr: "Huile d'olive", nameAr: 'زيت زيتون', quantity: '4', unit: 'c. à soupe', sortOrder: 6 },
      { nameFr: 'Thym, laurier', nameAr: 'زعتر وورق الغار', quantity: '1', unit: 'bouquet garni', sortOrder: 7 },
      { nameFr: 'Pommes de terre', nameAr: 'بطاطس', quantity: '4', unit: 'pièces', sortOrder: 8 },
    ],
  },
  {
    id: 'bruschetta-pate-volaille',
    nameFr: 'Bruschetta au pâté de volaille',
    nameAr: 'بروسكيتا مع باتي الدجاج',
    descriptionFr: 'Des toasts croustillants garnis de pâté de volaille Bellat et de garnitures fraîches, prêts en 10 minutes.',
    descriptionAr: 'توست مقرمش مع باتي الدجاج من بيلات وإضافات طازجة، جاهز في 10 دقائق.',
    imageUrl: '/images/recipes/bruschetta.jpg',
    prepTime: 10, cookTime: 5, servings: 4, difficulty: 'easy', category: 'starter',
    stepsFr: [
      "Couper la baguette en tranches diagonales d'1 cm. Les faire griller sous le gril du four ou dans un grille-pain jusqu'à ce qu'elles soient dorées.",
      'Frotter chaque tranche chaude avec la gousse d\'ail coupée en deux.',
      'Tartiner généreusement de pâté de volaille Bellat.',
      'Couper les tomates cerises en deux. Les déposer sur le pâté. Ajouter quelques feuilles de basilic frais.',
      "Arroser d'un filet d'huile d'olive, parsemer de fleur de sel.",
      'Servir immédiatement en apéritif ou en entrée.',
    ],
    stepsAr: [
      'قطّع الباجيت إلى شرائح قطرية بسماكة 1 سم. حمّرها تحت شواية الفرن أو في المحمصة حتى تصبح ذهبية.',
      'افرك كل شريحة ساخنة بنصف فصّة ثوم.',
      'ادهن بسخاء باتي دجاج بيلات.',
      'قطّع طماطم الكرزية بالنصف وضعها على الباتي. أضف بعض أوراق الريحان الطازج.',
      'ارش بزيت زيتون ورش الملح الخشن.',
      'قدّمها فوراً كمقبّلة أو كبداية.',
    ],
    ingredients: [
      { productId: 'prod_005', nameFr: 'Pâté de Volaille Bellat', nameAr: 'باتي دجاج بيلات', quantity: '1', unit: 'boîte (200 g)', sortOrder: 0 },
      { nameFr: 'Baguette', nameAr: 'خبز الباجيت', quantity: '1', unit: 'pièce', sortOrder: 1 },
      { nameFr: 'Tomates cerises', nameAr: 'طماطم كرزية', quantity: '12', unit: 'pièces', sortOrder: 2 },
      { nameFr: 'Basilic frais', nameAr: 'ريحان طازج', quantity: '1', unit: 'bouquet', sortOrder: 3 },
      { nameFr: 'Ail', nameAr: 'ثوم', quantity: '1', unit: 'gousse', sortOrder: 4 },
      { nameFr: "Huile d'olive", nameAr: 'زيت زيتون', quantity: '2', unit: 'c. à soupe', sortOrder: 5 },
      { nameFr: 'Fleur de sel', nameAr: 'ملح خشن', quantity: '1', unit: 'pincée', sortOrder: 6 },
    ],
  },
] as const;

async function main() {
  console.log('Seeding recipes...');
  for (const recipe of RECIPES) {
    const { ingredients, ...recipeData } = recipe;
    await prisma.recipe.upsert({
      where: { id: recipeData.id },
      update: {},
      create: {
        ...recipeData,
        stepsFr: [...recipeData.stepsFr],
        stepsAr: [...recipeData.stepsAr],
        ingredients: {
          create: ingredients.map((ing) => ({
            productId: 'productId' in ing ? ing.productId : undefined,
            nameFr: ing.nameFr,
            nameAr: ing.nameAr,
            quantity: ing.quantity,
            unit: ing.unit,
            sortOrder: ing.sortOrder,
          })),
        },
      },
    });
    console.log(`✓ ${recipeData.nameFr}`);
  }
  console.log('Done.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
