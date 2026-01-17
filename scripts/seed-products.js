const mongoose = require("mongoose");
const Product = require("../Model/Product");
require("dotenv").config();

const imagePool = [
  "https://upload.wikimedia.org/wikipedia/commons/8/81/A_Pink_Bunny_with_bunny_candy_t-shirt_in_the_fashion_shop.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/9/9d/A_boy_wearing_a_t-shirt_and_shorts.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/3/32/Ambigram_Ideal%2C_polysymmetrical_logo_printed_on_a_green_T-shirt.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/a/aa/Ambigram_Zen_Yes_text_with_meditation_pictogram%2C_embroidered_on_a_blue_T-shirt.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/8/82/T-Shirt_Logo.png",
  "https://upload.wikimedia.org/wikipedia/commons/5/55/T-shirt.png",
  "https://upload.wikimedia.org/wikipedia/commons/c/c9/T-shirt_%28drawing%29.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/0/06/%22Vaccinated%22_hoodie_on_sale%2C_reference_to_COVID-19.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/2/28/Atheists_hoodie.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/3/30/Max_Giesinger_-_2021-09-12_-_Mannheim_-_Sven_Mandel_-_1D_X_MK_II_-_0229_-_B70I3683_%28re-developed%29.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/5/50/Grupo_Jeans_Reencuentro.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/5/54/High_waisted_jeans_1435042736.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/0/0e/Jeans_MET_1978.175.3_B.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/2/2c/Jeans_crater_4006_h3.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/9/99/Jeans_mexicanos.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/9/9b/Recycled_thread_made_from_old_jeans%2C_on_display_in_Hikarie.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/d/d5/Women%27s_Levi%27s_jeans_inside_out.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/b/b3/Back_side_Chino_trousers_with_welt_pocket.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/5/5f/Cotton_Trousers_of_salem.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/6/69/2023_Adidas_Yeezy_350_V2_EF2905_%281%29.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/2/2f/Avia_Shoes.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/a/a5/Black_Converse_sneakers.JPG",
  "https://upload.wikimedia.org/wikipedia/commons/7/76/FILA_FLOAT_MAXXI_and_FILA_AXILUS_ACE_in_Brazil.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/f/f0/Reebok_Royal_Glide_Ripple_Clip_shoe.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/f/f2/Vans_sneakers_and_socks.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/8/8b/Asics_Gel-Cumulus_22.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/b/b8/Mizuno_Wave_Ibuki_2.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/a/a6/Sneaker.png",
  "https://upload.wikimedia.org/wikipedia/commons/4/4a/Sneakers%2C_Cockroaches_and_Broken_Bottles_%28Tenis_Graffiti-Lalone%29.jpg"
];
const colors = [
  "bg-black",
  "bg-white",
  "bg-red-500",
  "bg-emerald-500",
  "bg-sky-500",
  "bg-amber-500",
  "bg-slate-400",
  "bg-lime-500",
];
const brands = ["\\uB098\\uC774\\uD0A4 \\uC2A4\\uD3EC\\uCE20\\uC6E8\\uC5B4", "NikeLab"];
const personTypes = ["Men", "Women", "Kid"];
const genderByPersonType = {"Men": "\\uB0A8\\uC131", "Women": "\\uC5EC\\uC131", "Kid": "\\uB0A8\\uB140\\uACF5\\uC6A9"};
const categoryMap = {"\\uC758\\uB958": ["\\uC544\\uC6B0\\uD130", "\\uC0C1\\uC758", "\\uD558\\uC758", "\\uD2B8\\uB808\\uC774\\uB2DD"], "\\uC2E0\\uBC1C": ["\\uC2A4\\uB2C8\\uCEE4\\uC988", "\\uB7EC\\uB2DD", "\\uB18D\\uAD6C", "\\uC2AC\\uB9AC\\uD37C"], "\\uC561\\uC138\\uC11C\\uB9AC": ["\\uBAA8\\uC790", "\\uAC00\\uBC29", "\\uC591\\uB9D0", "\\uC7A5\\uAC11"]};

const pickImages = () => {
  const first = imagePool[Math.floor(Math.random() * imagePool.length)];
  let second = imagePool[Math.floor(Math.random() * imagePool.length)];
  if (imagePool.length > 1) {
    while (second === first) {
      second = imagePool[Math.floor(Math.random() * imagePool.length)];
    }
  }
  return [first, second];
};

const buildProducts = () => {
  const products = [];
  let skuCounter = 1;
  for (const personType of personTypes) {
    for (const [categoryMain, subs] of Object.entries(categoryMap)) {
      for (const categorySub of subs) {
        const sku = `AUTO-${String(skuCounter).padStart(3, "0")}`;
        const brand = brands[skuCounter % brands.length];
        const color = [colors[skuCounter % colors.length]];
        products.push({
          sku,
          name: `${personType} ${categoryMain} ${categorySub}`,
          image: pickImages(),
          price: 100000 + Math.floor(Math.random() * 100001),
          sales: Math.floor(Math.random() * 500),
          description: `${categoryMain} ${categorySub} ??`,
          categoryMain,
          categorySub,
          personType,
          gender: genderByPersonType[personType],
          brand,
          color,
          status: "active",
          isDeleted: false,
        });
        skuCounter += 1;
      }
    }
  }
  return products;
};

const products = buildProducts();

const seed = async () => {
  const mongoURI = process.env.LOCAL_DB_ADDRESS;
  if (!mongoURI) {
    throw new Error("LOCAL_DB_ADDRESS is not set");
  }

  await mongoose.connect(mongoURI);

  const ops = products.map((product) => ({
    updateOne: {
      filter: { sku: product.sku },
      update: { $setOnInsert: product },
      upsert: true,
    },
  }));

  const result = await Product.bulkWrite(ops, { ordered: false });
  const upserts = result.upsertedCount || 0;
  const inserted = result.insertedCount || 0;
  console.log(`seeded products: upserted=${upserts}, inserted=${inserted}`);

  await mongoose.disconnect();
};

seed().catch((error) => {
  console.error("seed failed:", error);
  process.exit(1);
});
