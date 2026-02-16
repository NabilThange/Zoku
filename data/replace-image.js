#!/usr/bin/env node

/**
 * replace-image.js  (v4 - indentation based, not depth based)
 * Usage: node replace-image.js data/mock-menu-items.ts
 *
 * KEY INSIGHT from debug output:
 * - Top-level item fields (name, image) have exactly 4 spaces indent
 * - Nested fields (inside customizations) have 6+ spaces indent
 * - So we just check: does the line start with exactly 4 spaces?
 */

const fs = require("fs");

const IMAGE_MAP = {
  "pav bhaji": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Pav_bhaji.jpg/400px-Pav_bhaji.jpg",
  "chole bhature": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Chole_bhature.jpg/400px-Chole_bhature.jpg",
  "aloo tikki burger": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Aloo_tikki.jpg/400px-Aloo_tikki.jpg",
  "vada pav": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Vada_Pav-Indian_street_food.JPG/400px-Vada_Pav-Indian_street_food.JPG",
  "paneer kathi roll": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Kathi_roll.jpg/400px-Kathi_roll.jpg",
  "masala dosa": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/MTR_Masala_Dosa.JPG/400px-MTR_Masala_Dosa.JPG",
  "samosa (2 pcs)": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Samosa-2.jpg/400px-Samosa-2.jpg",
  "pani puri": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Pani_puri.jpg/400px-Pani_puri.jpg",
  "bhel puri": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Bhelpuri.jpg/400px-Bhelpuri.jpg",
  "sev puri": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Sev_puri.jpg/400px-Sev_puri.jpg",
  "dahi papdi chaat": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Dahi_papdi_chaat.jpg/400px-Dahi_papdi_chaat.jpg",
  "paneer tikka wrap": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Paneer_tikka.jpg/400px-Paneer_tikka.jpg",
  "cheese corn sandwich": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Grilled_sandwich.jpg/400px-Grilled_sandwich.jpg",
  "grilled veg sandwich": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Grilled_sandwich.jpg/400px-Grilled_sandwich.jpg",
  "loaded fries (masala)": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Nachos_and_cheese.jpg/400px-Nachos_and_cheese.jpg",
  "misal pav": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Misal_Pav.jpg/400px-Misal_Pav.jpg",
  "uttapam": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Uttapam.jpg/400px-Uttapam.jpg",
  "rajma chawal": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Rajma-chawal.jpg/400px-Rajma-chawal.jpg",
  "veg puff": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Puff_pastry_spiral.jpg/400px-Puff_pastry_spiral.jpg",
  "cheese veg puff": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Puff_pastry_spiral.jpg/400px-Puff_pastry_spiral.jpg",
  "garlic bread": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Garlic_bread.jpg/400px-Garlic_bread.jpg",
  "maggi noodles": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Maggi_noodles.jpg/400px-Maggi_noodles.jpg",
  "chicken tikka roll": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Kathi_roll.jpg/400px-Kathi_roll.jpg",
  "butter chicken": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Butter_Chicken.jpg/400px-Butter_Chicken.jpg",
  "chicken biryani": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Chicken_biryani_(edited).jpg/400px-Chicken_biryani_(edited).jpg",
  "egg bhurji pav": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Egg_bhurji.jpg/400px-Egg_bhurji.jpg",
  "chicken seekh kebab": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Seekh_kebab.jpg/400px-Seekh_kebab.jpg",
  "mutton keema pav": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Mutton_curry.jpg/400px-Mutton_curry.jpg",
  "tandoori chicken": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Tandoori_chicken.jpg/400px-Tandoori_chicken.jpg",
  "fish fry": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Fish_fry_India.jpg/400px-Fish_fry_India.jpg",
  "chicken burger (crispy)": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Chicken_burger.jpg/400px-Chicken_burger.jpg",
  "egg frankie": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Kathi_roll.jpg/400px-Kathi_roll.jpg",
  "chicken shawarma": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Shawarma.jpg/400px-Shawarma.jpg",
  "masala egg maggi": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Maggi_noodles.jpg/400px-Maggi_noodles.jpg",
  "chicken puff": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Puff_pastry_spiral.jpg/400px-Puff_pastry_spiral.jpg",
  "keema samosa": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Samosa-2.jpg/400px-Samosa-2.jpg",
  "pepper chicken dry": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Chicken_65.jpg/400px-Chicken_65.jpg",
  "chicken wings (buffalo)": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Buffalo_chicken_wings.jpg/400px-Buffalo_chicken_wings.jpg",
  "prawn masala": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Chemmeen_curry.jpg/400px-Chemmeen_curry.jpg",
  "egg fried rice": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Egg_fried_rice.jpg/400px-Egg_fried_rice.jpg",
  "chicken club sandwich": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Chicken_burger.jpg/400px-Chicken_burger.jpg",
  "omelette pav": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Omelette.jpg/400px-Omelette.jpg",
  "chicken hot dog": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Hotdog_with_mustard.jpg/400px-Hotdog_with_mustard.jpg",
  "fish tacos": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Fish_tacos.jpg/400px-Fish_tacos.jpg",
  "quinoa salad bowl": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Quinoa_salad.jpg/400px-Quinoa_salad.jpg",
  "grilled chicken salad": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Grilled_chicken_salad.jpg/400px-Grilled_chicken_salad.jpg",
  "fruit chaat": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Fruit_chaat.jpg/400px-Fruit_chaat.jpg",
  "sprouts salad": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Sprouts_salad.jpg/400px-Sprouts_salad.jpg",
  "oats idli": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Idly.jpg/400px-Idly.jpg",
  "multigrain dosa": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/MTR_Masala_Dosa.JPG/400px-MTR_Masala_Dosa.JPG",
  "fresh orange juice": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Orange_juice.jpg/400px-Orange_juice.jpg",
  "smoothie bowl": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Smoothie_bowl.jpg/400px-Smoothie_bowl.jpg",
  "masala chai": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Masala_chai.jpg/400px-Masala_chai.jpg",
  "peanut butter banana smoothie": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Smoothie.jpg/400px-Smoothie.jpg",
  "avocado toast": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Avocado_toast.jpg/400px-Avocado_toast.jpg",
  "millet khichdi": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Khichdi.jpg/400px-Khichdi.jpg",
  "grilled paneer bowl": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Paneer_salad.jpg/400px-Paneer_salad.jpg",
  "hummus with veggie sticks": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Hummus_from_The_Nile.jpg/400px-Hummus_from_The_Nile.jpg",
  "greek yogurt parfait": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Parfait.jpg/400px-Parfait.jpg",
  "brown rice veggie bowl": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Veg_fried_rice.jpg/400px-Veg_fried_rice.jpg",
  "protein granola bar": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Granola_bar.jpg/400px-Granola_bar.jpg",
  "chia pudding": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Chia_pudding.jpg/400px-Chia_pudding.jpg",
  "detox green juice": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Green_smoothie.jpg/400px-Green_smoothie.jpg",
  "ragi pancakes": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Pancakes.jpg/400px-Pancakes.jpg",
  "egg white omelette": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Omelette.jpg/400px-Omelette.jpg",
  "lemon honey ginger shot": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Ginger_shot.jpg/400px-Ginger_shot.jpg",
  "gulab jamun (2 pcs)": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Gulab_jamun_(1).jpg/400px-Gulab_jamun_(1).jpg",
  "jalebi": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Jalebi.jpg/400px-Jalebi.jpg",
  "kulfi (malai)": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Kulfi.jpg/400px-Kulfi.jpg",
  "rabri falooda": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Falooda.jpg/400px-Falooda.jpg",
  "gajar halwa": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Gajar_ka_halwa.jpg/400px-Gajar_ka_halwa.jpg",
  "ras malai": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Ras_malai.jpg/400px-Ras_malai.jpg",
  "ice cream roll": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Ice_cream_rolls.jpg/400px-Ice_cream_rolls.jpg",
  "shahi tukda": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Shahi_tukda.jpg/400px-Shahi_tukda.jpg",
  "chocolate brownie": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Chocolate_brownie.jpg/400px-Chocolate_brownie.jpg",
  "croissant (plain)": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Croissant.jpg/400px-Croissant.jpg",
  "blueberry muffin": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Banana_Chocolate_Chip_Muffins.jpg/400px-Banana_Chocolate_Chip_Muffins.jpg",
  "cinnamon roll": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Cinnamon_roll.jpg/400px-Cinnamon_roll.jpg",
  "cheesecake slice": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Cheesecake.jpg/400px-Cheesecake.jpg",
  "waffle with ice cream": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Waffles_with_ice_cream.jpg/400px-Waffles_with_ice_cream.jpg",
  "nutella crepe": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Crepe_with_Nutella.jpg/400px-Crepe_with_Nutella.jpg",
  "churros with dipping sauce": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Churros.jpg/400px-Churros.jpg",
  "glazed doughnut": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Glazed-Donut.jpg/400px-Glazed-Donut.jpg",
  "tiramisu cup": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Tiramisu_5.jpg/400px-Tiramisu_5.jpg",
  "paan ice cream": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Kulfi.jpg/400px-Kulfi.jpg",
  "thandai": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Thandai.jpg/400px-Thandai.jpg",
  "hot chocolate": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Hot_chocolate_5.jpg/400px-Hot_chocolate_5.jpg",
  "chocolate chip cookie": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Chocolate-chip-cookies-flickr.jpg/400px-Chocolate-chip-cookies-flickr.jpg",
};

const filePath = process.argv[2];
if (!filePath) { console.error("Usage: node replace-image.js <file>"); process.exit(1); }
if (!fs.existsSync(filePath)) { console.error("File not found: " + filePath); process.exit(1); }

// Restore from backup first (always start clean)
const backupPath = filePath + ".bak";
if (fs.existsSync(backupPath)) {
  fs.copyFileSync(backupPath, filePath);
  console.log("\n✅  Restored from backup (clean slate)\n");
} else {
  fs.copyFileSync(filePath, backupPath);
  console.log("\n✅  Backup created\n");
}

const lines = fs.readFileSync(filePath, "utf8").split("\n");

let currentItemName = null;
let replaced = 0;
const notFound = [];

const result = lines.map((line) => {

  // TOP-LEVEL name field = exactly 4 spaces indent
  // Matches:  "    name: "Pav Bhaji","
  const topLevelName = line.match(/^    name:\s*["'](.+?)["']/);
  if (topLevelName) {
    currentItemName = topLevelName[1].trim().toLowerCase();
    return line;
  }

  // TOP-LEVEL image field = exactly 4 spaces indent
  // Matches:  "    image: "/placeholder.jpg","
  const topLevelImage = line.match(/^(    image:\s*["'])(.+?)(["'])/);
  if (topLevelImage && currentItemName) {
    const url = IMAGE_MAP[currentItemName];
    if (url) {
      replaced++;
      console.log(`  ✅  "${currentItemName}"`);
      currentItemName = null;
      return `${topLevelImage[1]}${url}${topLevelImage[3]},`;
    } else {
      notFound.push(currentItemName);
      console.log(`  ⚠️   "${currentItemName}" — not in map`);
      currentItemName = null;
      return line;
    }
  }

  return line;
});

fs.writeFileSync(filePath, result.join("\n"), "utf8");

console.log("\n─────────────────────────────────────────────");
console.log(`✅  Done! ${replaced} image(s) replaced.`);
if (notFound.length > 0) {
  console.log(`⚠️   ${notFound.length} item(s) not in map:`);
  notFound.forEach(n => console.log(`      → "${n}"`));
}
console.log("─────────────────────────────────────────────\n");