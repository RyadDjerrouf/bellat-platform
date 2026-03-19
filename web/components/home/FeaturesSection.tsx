import { Truck, Shield, Clock, Heart } from 'lucide-react';

interface FeaturesSectionProps {
  locale: string;
}

export function FeaturesSection({ locale }: FeaturesSectionProps) {
  const features = [
    {
      icon: Truck,
      title_fr: "Livraison Rapide",
      title_ar: "توصيل سريع",
      description_fr: "Livraison gratuite dans toute l'Algérie en moins de 24h",
      description_ar: "توصيل مجاني في جميع أنحاء الجزائر في أقل من 24 ساعة",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Shield,
      title_fr: "Qualité Garantie",
      title_ar: "جودة مضمونة",
      description_fr: "Produits frais et authentiques, sélectionnés avec soin",
      description_ar: "منتجات طازجة وأصيلة، مختارة بعناية",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Clock,
      title_fr: "Service 24/7",
      title_ar: "خدمة 24/7",
      description_fr: "Support client disponible à tout moment pour vous",
      description_ar: "دعم العملاء متاح في أي وقت من أجلكم",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Heart,
      title_fr: "Fait Avec Amour",
      title_ar: "صنع بحب",
      description_fr: "Chaque produit est préparé avec passion et tradition",
      description_ar: "كل منتج محضر بشغف وتقليد",
      color: "from-red-500 to-red-600"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-10 left-10 w-20 h-20 bg-green-200 rounded-full opacity-20 animate-float"></div>
        <div className="absolute bottom-10 right-10 w-16 h-16 bg-red-200 rounded-full opacity-20 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-blue-200 rounded-full opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-100 to-red-100 rounded-full text-gray-800 font-medium text-sm mb-4">
            {locale === 'ar' ? '✨ لماذا نحن؟' : '✨ Pourquoi Nous Choisir?'}
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            {locale === 'ar' ? 'خدماتنا المميزة' : 'Nos Services Exceptionnels'}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {locale === 'ar' 
              ? 'نحن ملتزمون بتقديم أفضل تجربة تسوق للمنتجات الجزائرية التقليدية'
              : 'Nous nous engageons à offrir la meilleure expérience d\'achat pour les produits traditionnels algériens'
            }
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="group relative"
                style={{ 
                  animationDelay: `${index * 150}ms`,
                  animation: 'slideInUp 0.8s ease-out forwards'
                }}
              >
                {/* Card */}
                <div className="bg-white rounded-3xl p-8 shadow-soft hover:shadow-large transition-all duration-500 group-hover:transform group-hover:-translate-y-2 relative overflow-hidden">
                  {/* Background gradient on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                  
                  {/* Icon */}
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors">
                    {locale === 'ar' ? feature.title_ar : feature.title_fr}
                  </h3>
                  <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                    {locale === 'ar' ? feature.description_ar : feature.description_fr}
                  </p>

                  {/* Decorative element */}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent group-hover:via-gray-300 transition-colors duration-300"></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="inline-flex flex-col sm:flex-row gap-4">
            <button className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
              {locale === 'ar' ? 'ابدأ التسوق الآن' : 'Commencer mes Achats'}
            </button>
            <button className="px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200">
              {locale === 'ar' ? 'تعرف على خدماتنا' : 'En Savoir Plus'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}