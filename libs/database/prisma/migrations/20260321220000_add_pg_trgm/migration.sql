-- Enable pg_trgm extension for fuzzy/trigram search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- GIN trigram indexes on product name columns for fast ILIKE and similarity queries
CREATE INDEX IF NOT EXISTS idx_products_name_fr_trgm
  ON "products" USING GIN ("nameFr" gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_products_name_ar_trgm
  ON "products" USING GIN ("nameAr" gin_trgm_ops);
