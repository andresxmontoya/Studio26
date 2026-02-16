const checkoutUrlByPackageId: Record<string, string | undefined> = {
  'intro-single': import.meta.env.VITE_CHECKOUT_URL_INTRO_SINGLE,
  'intro-3pack': import.meta.env.VITE_CHECKOUT_URL_INTRO_3PACK,
  'monthly-4': import.meta.env.VITE_CHECKOUT_URL_MONTHLY_4,
  'monthly-8': import.meta.env.VITE_CHECKOUT_URL_MONTHLY_8,
  'monthly-12': import.meta.env.VITE_CHECKOUT_URL_MONTHLY_12,
  'monthly-unlimited': import.meta.env.VITE_CHECKOUT_URL_MONTHLY_UNLIMITED,
  'pack-single': import.meta.env.VITE_CHECKOUT_URL_PACK_SINGLE,
  'pack-5': import.meta.env.VITE_CHECKOUT_URL_PACK_5,
  'pack-10': import.meta.env.VITE_CHECKOUT_URL_PACK_10,
  'pack-20': import.meta.env.VITE_CHECKOUT_URL_PACK_20,
};

export function getCheckoutUrlForPackage(packageId: string): string | null {
  const packageCheckoutUrl = checkoutUrlByPackageId[packageId];
  const fallbackCheckoutUrl = import.meta.env.VITE_CHECKOUT_URL_DEFAULT as string | undefined;
  const checkoutUrl = packageCheckoutUrl || fallbackCheckoutUrl;

  if (!checkoutUrl) {
    return null;
  }

  return checkoutUrl;
}
