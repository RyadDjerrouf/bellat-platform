-- CreateTable: recipes
CREATE TABLE "recipes" (
    "id" VARCHAR(100) NOT NULL,
    "nameFr" VARCHAR(255) NOT NULL,
    "nameAr" VARCHAR(255) NOT NULL,
    "descriptionFr" TEXT,
    "descriptionAr" TEXT,
    "category" VARCHAR(50) NOT NULL,
    "imageUrl" VARCHAR(255),
    "prepTime" INTEGER NOT NULL DEFAULT 0,
    "cookTime" INTEGER NOT NULL DEFAULT 0,
    "servings" INTEGER NOT NULL DEFAULT 4,
    "difficulty" VARCHAR(20) NOT NULL,
    "stepsFr" JSONB NOT NULL DEFAULT '[]',
    "stepsAr" JSONB NOT NULL DEFAULT '[]',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recipes_pkey" PRIMARY KEY ("id")
);

-- CreateTable: recipe_ingredients
CREATE TABLE "recipe_ingredients" (
    "id" UUID NOT NULL,
    "recipeId" VARCHAR(100) NOT NULL,
    "productId" VARCHAR(50),
    "nameFr" VARCHAR(255) NOT NULL,
    "nameAr" VARCHAR(255) NOT NULL,
    "quantity" VARCHAR(50) NOT NULL,
    "unit" VARCHAR(50) NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "recipe_ingredients_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "recipes_category_idx" ON "recipes"("category");

-- CreateIndex
CREATE INDEX "recipe_ingredients_recipeId_idx" ON "recipe_ingredients"("recipeId");

-- AddForeignKey
ALTER TABLE "recipe_ingredients" ADD CONSTRAINT "recipe_ingredients_recipeId_fkey"
    FOREIGN KEY ("recipeId") REFERENCES "recipes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_ingredients" ADD CONSTRAINT "recipe_ingredients_productId_fkey"
    FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;
