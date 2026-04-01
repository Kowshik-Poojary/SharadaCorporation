// src/constants/categoryImages.js
// Map category names to local image paths in /public/assets/categories/
// ⚠️ CRITICAL: Keys MUST match EXACTLY with API response (case-sensitive)

const CATEGORY_IMAGES = {
  // Exact matches from API
  'chip cones': '/assets/categories/chipcones.png',
  'kitchen textile': '/assets/categories/kitchentextile.png',
  'new arrival': '/assets/categories/newarrival.png',
  'pizza equipments': '/assets/categories/pizzaequipments.png',
  'tongs': '/assets/categories/tongs.png',
  'disposables': '/assets/categories/disposables.png',
  'sugarcane baggasse': '/assets/categories/sugarcanebaggasse.png',
  'rice husk': '/assets/categories/ricehusk.png',
  'cookware': '/assets/categories/cookware.png',
  'wooden item': '/assets/categories/woodenitem.png',
  'baskets': '/assets/categories/baskets.png',
  'cake stand and disp items': '/assets/categories/cakestands.png',
  'table top': '/assets/categories/tabletop.png',
  'mini presentation items': '/assets/categories/minipresentationitems.png',
  'presentation serverware': '/assets/categories/presentationserverware.png',
  'salt pepper shakers': '/assets/categories/saltpeppershaker.png',
  'bar accessories': '/assets/categories/baraccessories.png',
  'ice wine buckets': '/assets/categories/icewinebucket.png',
  'wine buckets holder': '/assets/categories/winebucketholder.png',
  'boston and cocktail shaker': '/assets/categories/bostonandcocktailshaker.png',
  'trays': '/assets/categories/trays.png',
  'kitchen equipments': '/assets/categories/kitchenequipments.png',
  'kitchen cutlery': '/assets/categories/kitchencutlery.png',
  'range of bowls': '/assets/categories/bowls.png',
  'preparation utensils': '/assets/categories/preparationutensils.png',
  'food rings': '/assets/categories/foodrings.png',
  'whisks': '/assets/categories/whisks.png',
};

/**
 * Get image URL for a category
 * @param {string} categoryName - The name of the category (from API)
 * @returns {string} - The local image path or placeholder
 */
export const getImageUrl = (categoryName) => {
  if (!categoryName) {
    console.warn('⚠️ Category name is empty');
    return '/placeholder.png';
  }

  const normalized = categoryName.toLowerCase().trim();
  const imageUrl = CATEGORY_IMAGES[normalized];

  if (!imageUrl) {
    console.warn(
      `❌ NO IMAGE MAPPING FOR: "${categoryName}" (normalized: "${normalized}")
       
       Available mappings:
       ${Object.keys(CATEGORY_IMAGES)
         .map(k => `  - "${k}"`)
         .join('\n')}`
    );
    return '/placeholder.png';
  }

  return imageUrl;
};

export const getAllCategories = () => Object.keys(CATEGORY_IMAGES);

export const hasImage = (categoryName) => {
  return Boolean(CATEGORY_IMAGES[categoryName?.toLowerCase().trim()]);
};

export default CATEGORY_IMAGES;