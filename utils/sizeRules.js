const CATEGORY_MAIN = {
  APPAREL: "의류",
  SHOES: "신발",
  ACCESSORY: "액세서리",
};

const APPAREL_SIZES = ["S", "M", "L", "XL", "XXL"];
const ACCESSORY_SIZES = ["S", "M", "L"];
const SHOE_SIZES = [
  "235",
  "240",
  "245",
  "250",
  "255",
  "260",
  "265",
  "270",
  "275",
  "280",
  "285",
];

const SIZE_ALIAS = {
  "90": "S",
  "95": "M",
  "100": "L",
  "105": "XL",
  "110": "XXL",
};

const normalizeSize = (size) => {
  if (size === undefined || size === null) return "";
  const raw = String(size).trim().toUpperCase();
  return SIZE_ALIAS[raw] || raw;
};

const getAllowedSizes = (categoryMain) => {
  switch (categoryMain) {
    case CATEGORY_MAIN.SHOES:
      return SHOE_SIZES;
    case CATEGORY_MAIN.ACCESSORY:
      return ACCESSORY_SIZES;
    case CATEGORY_MAIN.APPAREL:
    default:
      return APPAREL_SIZES;
  }
};

const isSizeAllowed = (categoryMain, size) => {
  const normalized = normalizeSize(size);
  return getAllowedSizes(categoryMain).includes(normalized);
};

module.exports = {
  CATEGORY_MAIN,
  APPAREL_SIZES,
  ACCESSORY_SIZES,
  SHOE_SIZES,
  normalizeSize,
  getAllowedSizes,
  isSizeAllowed,
};
