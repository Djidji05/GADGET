import type { Banner, Promotion } from './promotions'
import type { Product, Category } from './products'

// Données de fallback pour les bannières
export const fallbackBanners: Banner[] = [
  {
    id: 1,
    title: 'Bienvenue sur HTFasil',
    subtitle: 'Découvrez nos derniers produits technologiques',
    image: '/images/Flyer_Gadget_Zone_High_Tech.png',
    link: '/products',
    isActive: true,
    startDate: '2024-01-01',
    endDate: '2025-12-31',
    textAlign: 'text-center',
    verticalAlign: 'items-center',
    buttonText: 'Découvrir'
  },
  {
    id: 2,
    title: 'Imprimante High Tech',
    subtitle: 'Solutions professionnelles pour votre bureau',
    image: '/images/Imprimante.png',
    link: '/products',
    isActive: true,
    startDate: '2024-01-01',
    endDate: '2025-12-31',
    textAlign: 'text-left',
    verticalAlign: 'items-center',
    buttonText: 'Acheter'
  },
  {
    id: 3,
    title: 'Volcan Tech Innovation',
    subtitle: 'La technologie de pointe',
    image: '/images/Volcan.png',
    link: '/products',
    isActive: true,
    startDate: '2024-01-01',
    endDate: '2025-12-31',
    textAlign: 'text-right',
    verticalAlign: 'items-center',
    buttonText: 'Explorer'
  },
]

// Données de fallback pour les promotions
export const fallbackPromotions: Promotion[] = [
  {
    id: 1,
    title: 'Été 2024',
    description: "Profitez de nos offres spéciales pour l'été",
    code: 'ETE2024',
    discount: 15,
    discountType: 'percentage',
    startDate: '2024-01-01',
    endDate: '2025-12-31',
    isActive: true,
    image: 'https://placehold.co/400x300/F59E0B/FFFFFF?text=Été+2024',
    applicableProducts: [1, 2, 3, 4, 5],
  },
  {
    id: 2,
    title: 'Black Friday',
    description: "Les meilleures offres de l'année",
    code: 'BLACK2024',
    discount: 30,
    discountType: 'percentage',
    startDate: '2024-01-01',
    endDate: '2025-12-31',
    isActive: true,
    image: 'https://placehold.co/400x300/EF4444/FFFFFF?text=Black+Friday',
    applicableProducts: [1, 3, 5, 7, 8],
  },
]

// Données de fallback pour les catégories
export const fallbackCategories: Category[] = [
  { id: 1, name: 'Smartphones', description: 'Téléphones intelligents et accessoires' },
  { id: 2, name: 'Ordinateurs', description: 'Ordinateurs portables et de bureau' },
  { id: 3, name: 'Tablettes', description: 'Tablettes et e-readers' },
  { id: 4, name: 'Accessoires', description: 'Accessoires électroniques et gadgets' },
  { id: 5, name: 'Audio', description: 'Écouteurs, haut-parleurs et équipements audio' },
  { id: 6, name: 'Gaming', description: 'Consoles de jeux et accessoires gaming' },
  { id: 7, name: 'High-Tech', description: 'Produits technologiques et informatique' },
  { id: 8, name: 'Maison', description: 'Articles pour la maison et bricolage' },
  { id: 9, name: 'Mode', description: 'Vêtements, chaussures et accessoires de mode' },
  { id: 10, name: 'Culture', description: 'Livres, musique et produits culturels' },
  { id: 11, name: 'Autres', description: 'Produits divers et supermarché' },
]

// Données de fallback pour les produits vedettes
// Données de fallback pour les produits vedettes
export const fallbackFeaturedProducts: Product[] = [
  {
    id: 1,
    name: 'Smartphone Pro',
    description: "Le Smartphone Pro redéfinit l'excellence mobile. Doté d'un écran OLED Super Retina XDR de 6,7 pouces, il offre une expérience visuelle immersive avec des couleurs éclatantes et des noirs profonds. \n\nAu cœur de cet appareil se trouve la puce A17 Pro, une merveille d'ingénierie qui propulse les performances vers de nouveaux sommets, que ce soit pour le gaming intensif, le montage vidéo 4K ou le multitâche fluide. \n\nLe système photo pro de 48 Mpx capture des détails époustouflants, même en basse lumière, et le nouveau mode Portrait offre un contrôle de la profondeur inédit. Avec son design en titane aérospatial, il est à la fois incroyablement léger et robuste. L'autonomie a été considérablement améliorée pour vous accompagner tout au long de la journée, et la connectivité USB-C ouvre un monde de possibilités pour les accessoires et le transfert de données ultra-rapide.",
    price: 899,
    original_price: 1099,
    seller_id: 1,
    stock: 25,
    category_id: 1,
    category: 'Smartphones',
    image_url: '/images/manette.png',
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    features: [
      'Écran OLED 6.7 pouces Super Retina XDR',
      'Puce A17 Pro pour des performances ultimes',
      'Système photo pro 48 Mpx',
      'Autonomie toute la journée',
      'Design en titane résistant'
    ],
    specifications: {
      'Écran': '6.7" OLED',
      'Processeur': 'A17 Pro',
      'Stockage': '256 Go',
      'Batterie': '4422 mAh',
      'OS': 'iOS 17'
    }
  },
  {
    id: 2,
    name: 'Laptop Ultra',
    description: "Le Laptop Ultra est la station de travail ultime pour les créatifs et les professionnels exigeants. Équipé de la puce M3 Max, il écrase les tâches les plus lourdes avec une facilité déconcertante. \n\nSon écran Liquid Retina XDR de 16,2 pouces est tout simplement le meilleur écran jamais vu sur un ordinateur portable, offrant une luminosité extrême de 1600 nits et un contraste de 1 000 000:1. \n\nAvec jusqu'à 22 heures d'autonomie, vous pouvez travailler toute la journée et toute la nuit sans chercher une prise. Le système audio à six haut-parleurs avec audio spatial vous plonge au cœur de l'action, tandis que la caméra FaceTime HD 1080p vous assure une présence impeccable lors de vos appels vidéo. Connectez tout ce dont vous avez besoin grâce aux trois ports Thunderbolt 4, au port HDMI et au lecteur de carte SDXC.",
    price: 1299,
    seller_id: 1,
    stock: 15,
    category_id: 2,
    category: 'Ordinateurs',
    image_url: '/images/Stand.png',
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    features: [
      'Puce M3 Max ultra-rapide',
      'Écran Liquid Retina XDR',
      'Jusqu\'à 22h d\'autonomie',
      'Caméra FaceTime HD 1080p',
      'Système audio à 6 haut-parleurs'
    ],
    specifications: {
      'Écran': '16.2" Liquid Retina XDR',
      'Processeur': 'M3 Max',
      'RAM': '32 Go',
      'Stockage': '1 To SSD',
      'Poids': '2.1 kg'
    }
  },
  {
    id: 3,
    name: 'Tablet Max',
    description: 'Écran géant pour le divertissement et le travail',
    price: 699,
    seller_id: 1,
    stock: 20,
    category_id: 3,
    category: 'Tablettes',
    image_url: '/images/support magnetique.png',
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    features: [
      'Écran tactile immersif',
      'Compatible stylet haute précision',
      'Léger et portable',
      'Connectivité 5G optionnelle'
    ],
    specifications: {
      'Écran': '12.9"',
      'Stockage': '128 Go',
      'Batterie': '10h autonomie',
      'Connectivité': 'Wi-Fi 6E'
    }
  },
  {
    id: 4,
    name: 'Watch Smart',
    description: "La Watch Smart est bien plus qu'une simple montre, c'est votre compagnon de santé et de fitness ultime au poignet. Avec son écran Retina toujours activé, vous avez accès à vos informations essentielles en un coup d'œil, sans même lever le poignet. \n\nSuivez votre activité quotidienne avec précision : pas, calories brûlées, minutes actives et bien plus encore. Le capteur de fréquence cardiaque avancé surveille votre cœur 24h/24 et 7j/7, vous alertant en cas d'anomalie. \n\nRestez connecté où que vous soyez grâce aux notifications d'appels, de messages et d'applications directement sur votre montre. La Watch Smart intègre également un GPS pour suivre vos parcours de running ou de vélo sans avoir besoin de votre téléphone. Résistante à l'eau jusqu'à 50 mètres, elle vous accompagne à la piscine comme sous la douche. Avec une autonomie de plusieurs jours, elle est prête à relever tous les défis avec vous.",
    price: 399,
    original_price: 499,
    seller_id: 1,
    stock: 50,
    category_id: 4,
    category: 'Accessoires',
    image_url: '/images/manette.png',
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    features: [
      'Écran Retina Always-On',
      'Suivi santé avancé (Cœur, SpO2, Sommeil)',
      'GPS intégré',
      'Étanche 50m',
      'Notifications smartphone'
    ],
    specifications: {
      'Écran': '1.9" OLED',
      'Boîtier': 'Aluminium 45mm',
      'Connectivité': 'Bluetooth 5.3, GPS',
      'Capteurs': 'Accéléromètre, Gyroscope, Baromètre',
      'Autonomie': 'Jusqu\'à 3 jours'
    }
  },
  {
    id: 5,
    name: 'Earbuds Pro',
    description: 'Son premium avec réduction de bruit',
    price: 199,
    seller_id: 1,
    stock: 100,
    category_id: 5,
    category: 'Audio',
    image_url: '/images/Stand.png',
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 6,
    name: 'Camera 4K',
    description: 'Photo et vidéo professionnelle',
    price: 799,
    seller_id: 1,
    stock: 10,
    category_id: 4,
    category: 'Accessoires',
    image_url: '/images/support magnetique.png',
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 7,
    name: 'Speaker Bass',
    description: 'Son puissant pour vos soirées',
    price: 89,
    seller_id: 1,
    stock: 40,
    category_id: 5,
    category: 'Audio',
    image_url: '/images/manette.png',
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 8,
    name: 'Keyboard RGB',
    description: 'Clavier mécanique avec rétroéclairage',
    price: 129,
    seller_id: 1,
    stock: 30,
    category_id: 4,
    category: 'Accessoires',
    image_url: '/images/Stand.png',
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 9,
    name: 'Mouse Gaming',
    description: 'Souris haute précision pour gamers',
    price: 79,
    seller_id: 1,
    stock: 45,
    category_id: 6,
    category: 'Gaming',
    image_url: '/images/support magnetique.png',
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 10,
    name: 'Monitor 4K',
    description: 'Écran Ultra HD pour une clarté parfaite',
    price: 599,
    seller_id: 1,
    stock: 12,
    category_id: 2,
    category: 'Ordinateurs',
    image_url: '/images/manette.png',
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  // Adding more generic products to cover up to ID 40 if needed
  ...Array.from({ length: 30 }, (_, i) => ({
    id: 11 + i,
    name: `Produit ${11 + i}`,
    description: 'Description du produit...',
    price: 99 + i * 10,
    seller_id: 1,
    stock: 20,
    category_id: 1,
    category: 'Divers',
    image_url: '/images/Stand.png',
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  }))
]

// Service de validation de code promo fallback
export const validateFallbackPromoCode = (
  code: string,
  cartTotal: number,
): {
  valid: boolean
  promotion?: Promotion
  discountAmount?: number
  newTotal?: number
} => {
  const promotion = fallbackPromotions.find(
    (promo) => promo.code === code.toUpperCase() && promo.isActive,
  )

  if (!promotion) {
    return { valid: false }
  }

  let discountAmount = 0
  if (promotion.discountType === 'percentage') {
    discountAmount = (cartTotal * promotion.discount) / 100
  } else {
    discountAmount = promotion.discount
  }

  return {
    valid: true,
    promotion,
    discountAmount,
    newTotal: cartTotal - discountAmount,
  }
}

// Fonction utilitaire pour obtenir les données de fallback
export const getFallbackData = (type: 'banners' | 'promotions' | 'categories' | 'products') => {
  switch (type) {
    case 'banners':
      return fallbackBanners
    case 'promotions':
      return fallbackPromotions
    case 'categories':
      return fallbackCategories
    case 'products':
      return fallbackFeaturedProducts
    default:
      return []
  }
}

// Fonction utilitaire pour vérifier si une réponse API est valide
export const isValidApiResponse = (response: any): boolean => {
  if (!response) return false
  if (typeof response === 'string') return false
  if (response.message && typeof response.message === 'string' && !Array.isArray(response)) {
    return false // C'est probablement un message d'erreur
  }
  return true
}
