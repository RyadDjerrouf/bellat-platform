-- CreateTable
CREATE TABLE "settings" (
    "key" VARCHAR(100) NOT NULL,
    "value" TEXT NOT NULL DEFAULT '',
    "label" VARCHAR(200) NOT NULL,
    "description" VARCHAR(500),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("key")
);

-- Seed default platform settings
INSERT INTO "settings" ("key", "value", "label", "description", "updatedAt") VALUES
('app.contact_email',  'contact@bellat.dz',  'Email de contact',              'Adresse email affichée aux clients sur le site',               NOW()),
('app.contact_phone',  '+213 XXX XXX XXX',   'Téléphone de contact',          'Numéro de téléphone affiché aux clients',                      NOW()),
('app.facebook_url',   '',                   'Page Facebook',                 'URL complète de la page Facebook Bellat',                      NOW()),
('app.instagram_url',  '',                   'Compte Instagram',              'URL complète du compte Instagram Bellat',                      NOW()),
('features.welcome_email',            'true', 'Email de bienvenue',           'Envoyer un email de bienvenue aux nouveaux inscrits',          NOW()),
('features.order_confirmation_email', 'true', 'Email de confirmation commande','Envoyer un email de confirmation au client après chaque commande', NOW()),
('features.sms_notifications',        'false','Notifications SMS',            'Envoyer des SMS de suivi de commande (requiert un opérateur)', NOW());
