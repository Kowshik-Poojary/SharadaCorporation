// src/constants/categoryImages.js
// Map category names to local image paths in /public/assets/
// ⚠️ CRITICAL: Keys MUST match EXACTLY with API response (case-sensitive)

const CATEGORY_IMAGES = {
  // Exact matches from API
  'chip cones': '/assets/chipcones.png',
  'kitchen textile': '/assets/kitchentextile.png',
  'new arrival': '/assets/newarrival.png',
  'pizza equipments': '/assets/pizzaequipments.png',
  'tongs': '/assets/tongs.png',
  'disposables': '/assets/disposables.png',
  'sugarcane baggasse': '/assets/sugarcanebaggasse.png',
  'rice husk': '/assets/ricehusk.png',
  'cookware': '/assets/cookware.png',
  'wooden item': '/assets/woodenitem.png',
  'baskets': '/assets/baskets.png',
  'cake stand and disp items': '/assets/cakestands.png',
  'table top': '/assets/tabletop.png',
  'mini presentation items': '/assets/minipresentationitems.png',
  'presentation serverware': '/assets/presentationserverware.png',
  'salt pepper shakers': '/assets/saltpeppershaker.png',
  'bar accessories': '/assets/baraccessories.png',
  'ice wine buckets': '/assets/icewinebucket.png',
  'wine buckets holder': '/assets/winebucketholder.png',
  'boston and cocktail shaker': '/assets/bostonandcocktailshaker.png',
  'trays': '/assets/trays.png',
  'kitchen equipments': '/assets/kitchenequipments.png',
  'kitchen cutlery': '/assets/kitchencutlery.png',
  'range of bowls': '/assets/bowls.png',
  'preparation utensils': '/assets/preparationutensils.png',
  'food rings': '/assets/foodrings.png',
  'whisks': '/assets/whisks.png',
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