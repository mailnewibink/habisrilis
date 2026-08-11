export const pricingConfig = {
  managerPro: {
    monthly: {
      price: 69000,
      currency: 'IDR'
    },
    yearly: {
      price: 699000,
      currency: 'IDR'
    }
  },
  launchPromotion: {
    enabled: true,
    name: 'launch_free_2026',
    expiresAt: '2026-12-31T23:59:59Z'
  }
};

export const isLaunchPromotionActive = () => {
  return pricingConfig.launchPromotion.enabled && new Date() < new Date(pricingConfig.launchPromotion.expiresAt);
};

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};
