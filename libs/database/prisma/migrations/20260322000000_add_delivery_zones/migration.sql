-- CreateTable: delivery_zones — per-wilaya delivery fee configuration
CREATE TABLE "delivery_zones" (
    "id"          SERIAL NOT NULL,
    "wilaya"      VARCHAR(100) NOT NULL,
    "deliveryFee" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "isActive"    BOOLEAN NOT NULL DEFAULT true,
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "delivery_zones_pkey" PRIMARY KEY ("id")
);

-- Unique constraint: one row per wilaya
CREATE UNIQUE INDEX "delivery_zones_wilaya_key" ON "delivery_zones"("wilaya");

-- Seed all 48 Algerian wilayas with 0 fee (free delivery — current default)
-- Admins can update fees via the admin dashboard
INSERT INTO "delivery_zones" ("wilaya", "deliveryFee", "updatedAt") VALUES
  ('Adrar', 0, NOW()),
  ('Chlef', 0, NOW()),
  ('Laghouat', 0, NOW()),
  ('Oum El Bouaghi', 0, NOW()),
  ('Batna', 0, NOW()),
  ('Béjaïa', 0, NOW()),
  ('Biskra', 0, NOW()),
  ('Béchar', 0, NOW()),
  ('Blida', 0, NOW()),
  ('Bouira', 0, NOW()),
  ('Tamanrasset', 0, NOW()),
  ('Tébessa', 0, NOW()),
  ('Tlemcen', 0, NOW()),
  ('Tiaret', 0, NOW()),
  ('Tizi Ouzou', 0, NOW()),
  ('Alger', 0, NOW()),
  ('Djelfa', 0, NOW()),
  ('Jijel', 0, NOW()),
  ('Sétif', 0, NOW()),
  ('Saïda', 0, NOW()),
  ('Skikda', 0, NOW()),
  ('Sidi Bel Abbès', 0, NOW()),
  ('Annaba', 0, NOW()),
  ('Guelma', 0, NOW()),
  ('Constantine', 0, NOW()),
  ('Médéa', 0, NOW()),
  ('Mostaganem', 0, NOW()),
  ('M''Sila', 0, NOW()),
  ('Mascara', 0, NOW()),
  ('Ouargla', 0, NOW()),
  ('Oran', 0, NOW()),
  ('El Bayadh', 0, NOW()),
  ('Illizi', 0, NOW()),
  ('Bordj Bou Arréridj', 0, NOW()),
  ('Boumerdès', 0, NOW()),
  ('El Tarf', 0, NOW()),
  ('Tindouf', 0, NOW()),
  ('Tissemsilt', 0, NOW()),
  ('El Oued', 0, NOW()),
  ('Khenchela', 0, NOW()),
  ('Souk Ahras', 0, NOW()),
  ('Tipaza', 0, NOW()),
  ('Mila', 0, NOW()),
  ('Aïn Defla', 0, NOW()),
  ('Naâma', 0, NOW()),
  ('Aïn Témouchent', 0, NOW()),
  ('Ghardaïa', 0, NOW()),
  ('Relizane', 0, NOW());
