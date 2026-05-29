// ==========================================
// PENGATURAN STATUS TOKO (BUKA / TUTUP)
// ==========================================
const storeConfig = {
  isManualClosed: false, // Ubah tulisan 'false' menjadi 'true' jika kamu mau tutup toko mendadak.
  manualClosedMessage: "Maaf, saat ini toko sedang tutup sementara. Silakan kembali lagi nanti.",
  
  // Fitur Tutup Otomatis setiap Jumat (Jam 12:00 - 12:59)
  autoJumatan: true 
};

function checkStoreStatus() {
  // MENGUNCI WAKTU KE WIB (JAKARTA)
  // Jadi walaupun jam HP pelanggan error, toko tetap ikut waktu WIB yang asli
  const waktuJakarta = new Date().toLocaleString("en-US", {timeZone: "Asia/Jakarta"});
  const now = new Date(waktuJakarta);

  const day = now.getDay(); // 0 = Minggu, 5 = Jumat
  const hour = now.getHours(); // Format 24 jam
  
  // Link WA otomatis jika pelanggan butuh chat mendadak
  const waLink = "https://wa.me/6281281400462?text=Halo%20admin%20kopi.fachrindah,%20saya%20mau%20tanya-tanya%20dulu%20dong.";
  const waButtonHtml = `<br><br><a href="${waLink}" target="_blank" class="wa-direct-btn">Chat WhatsApp Admin</a>`;

  // 1. Cek apakah admin menutup manual
  if (storeConfig.isManualClosed) {
    return { closed: true, message: "Maaf, saat ini toko sedang tutup sementara. Jika ada kebutuhan mendesak, silakan langsung hubungi kami via WhatsApp ya." + waButtonHtml };
  }

  // 2. Cek apakah sedang jam Sholat Jumat (Hari 5, Jam 12)
  if (storeConfig.autoJumatan && day === 5 && hour === 12) {
    return { closed: true, message: "Maaf, toko sedang istirahat untuk ibadah Sholat Jumat dan akan buka kembali otomatis pukul 13:00 WIB.<br><br>Punya pertanyaan atau mau titip pesanan? Langsung chat admin aja ya." + waButtonHtml };
  }

  return { closed: false };
}

const categories = [
  { id: "promo-50k", title: "Promo 50K" },
  { id: "promo-60k", title: "Promo 60K" },
  { id: "promo-70k", title: "Promo 70K" },
  { id: "baru", title: "Baru!" },
  { id: "coffee", title: "Coffee" },
  { id: "non-coffee", title: "Non Coffee" },
  { id: "kenangan-frappe", title: "Kenangan Frappe" },
  { id: "chef-martin", title: "Chef Martin Praja's Bake" },
  { id: "kenangan-toast", title: "Kenangan Toast" },
  { id: "food", title: "Food" },
];

const menuItems = [

// ==========================================
  // KATEGORI PROMO 50K (Total 8 Paket)
  // ==========================================
  { 
    id: "bundle-50k-1", group: "promo-50k", name: "Paket 50K 1 (Vanilla Latte + Choco Chip Cookies + Sugar Donut)", 
    oldPrice: 36000, price: 33000, kind: "food", color: "#bd6427",
    bundleImages: ["menu_34.jpg", "menu_119.jpg", "menu_116.jpg"] 
  },
  { 
    id: "bundle-50k-2", group: "promo-50k", name: "Paket 50K 2 (Kenangan Milk Tea + Americano + Strawberry Choux Puff)", 
    oldPrice: 35000, price: 32000, kind: "food", color: "#bf8a56",
    bundleImages: ["menu_68.jpg", "menu_40.jpg", "menu_96.jpg"] 
  },
  { 
    id: "bundle-50k-3", group: "promo-50k", name: "Paket 50K 3 (Kopi Kenangan Mantan + Babyccino + Chocolate Choux Puff)", 
    oldPrice: 34500, price: 31500, kind: "food", color: "#8d4a27",
    bundleImages: ["menu_20.jpg", "menu_65.jpg", "menu_103.jpg"] 
  },
  { 
    id: "bundle-50k-4", group: "promo-50k", name: "Paket 50K 4 (Tiramisu Frappe + Donut Almond + Roti Coklat Klasik)", 
    oldPrice: 35000, price: 32000, kind: "food", color: "#6d3b2a",
    bundleImages: ["menu_79.jpg", "menu_108.jpg", "menu_117.jpg"] 
  },
  { 
    id: "bundle-50k-5", group: "promo-50k", name: "Paket 50K 5 (Avocado Milk + Roti Gulung Abon + Roti Coklat Klasik)", 
    oldPrice: 36000, price: 33000, kind: "food", color: "#b4cf49",
    bundleImages: ["menu_57.jpg", "menu_99.jpg", "menu_117.jpg"] 
  },
  { 
    id: "bundle-50k-6", group: "promo-50k", name: "Paket 50K 6 (Raspberry Hibiscus + Tiramisu Latte + Sugar Donut)", 
    oldPrice: 35500, price: 32500, kind: "food", color: "#df253c",
    bundleImages: ["menu_71.jpg", "menu_25.jpg", "menu_116.jpg"] 
  },
  { 
    id: "bundle-50k-7", group: "promo-50k", name: "Paket 50K 7 (Matcha Latte + Canele Aren + Sugar Donut)", 
    oldPrice: 36000, price: 33000, kind: "food", color: "#4f9c3c",
    bundleImages: ["menu_73.jpg", "menu_93.jpg", "menu_116.jpg"] 
  },

  // ==========================================
  // KATEGORI PROMO 60K (Total 8 Paket)
  // ==========================================
  { 
    id: "bundle-60k-1", group: "promo-60k", name: "Paket 60K 1 (Caramel Macchiato + Cappuccino + Sugar Donut)", 
    oldPrice: 39000, price: 36000, kind: "food", color: "#bd6a2d",
    bundleImages: ["menu_23.jpg", "menu_41.jpg", "menu_116.jpg"] 
  },
  { 
    id: "bundle-60k-2", group: "promo-60k", name: "Paket 60K 2 (Matcha Kenangan Frappe + Kopi Kenangan Mantan + Roti Coklat Klasik)", 
    oldPrice: 40000, price: 37000, kind: "food", color: "#69a63b",
    bundleImages: ["menu_81.jpg", "menu_20.jpg", "menu_117.jpg"] 
  },
  { 
    id: "bundle-60k-3", group: "promo-60k", name: "Paket 60K 3 (Vanilla Kenangan Frappe + Hazelnut Choco Milk Tea + Roti Keju Manis)", 
    oldPrice: 42500, price: 40000, kind: "food", color: "#f5f0e7",
    bundleImages: ["menu_83.jpg", "menu_55.jpg", "menu_118.jpg"] 
  },
  { 
    id: "bundle-60k-4", group: "promo-60k", name: "Paket 60K 4 (Oreo Shake + Kopi Susu Black Aren + Canele Original)", 
    oldPrice: 40000, price: 37000, kind: "food", color: "#f1eee7",
    bundleImages: ["menu_70.jpg", "menu_31.jpg", "menu_106.jpg"] 
  },
  { 
    id: "bundle-60k-5", group: "promo-60k", name: "Paket 60K 5 (Butterscotch Kenangan Frappe + Blueberry Muffin + Canele Aren)", 
    oldPrice: 41000, price: 38000, kind: "food", color: "#d59a32",
    bundleImages: ["menu_80.jpg", "menu_95.jpg", "menu_93.jpg"] 
  },
  { 
    id: "bundle-60k-6", group: "promo-60k", name: "Paket 60K 6 (Thai Tea Aren + Susu Grass Jelly + Chocolate Choux Puff)", 
    oldPrice: 40000, price: 37000, kind: "food", color: "#bd5b1d",
    bundleImages: ["menu_3.jpg", "menu_72.jpg", "menu_103.jpg"] 
  },
  { 
    id: "bundle-60k-7", group: "promo-60k", name: "Paket 60K 7 (Kopi Kenangan Mantan Frappe + Butterscotch Aren Latte + Donut Almond)", 
    oldPrice: 42000, price: 40000, kind: "food", color: "#9f5a2f",
    bundleImages: ["menu_82.jpg", "menu_38.jpg", "menu_108.jpg"] 
  },

  { 
    id: "bundle-60k-large", group: "promo-60k", name: "Paket 60k (Tiramisu Latte LARGE + Cafe Malt Latte + Sugar Donut)", 
    oldPrice: 44000, price: 41000, kind: "food", color: "#a16643",
    bundleImages: ["menu_25.jpg", "menu_19.jpg", "menu_116.jpg"] 
  },

  // ==========================================
  // KATEGORI PROMO 70K (Total 8 Paket)
  // ==========================================
  { 
    id: "bundle-70k-1", group: "promo-70k", name: "Paket Sultan 70K 1 (Avocado Caramel + Mocha Latte + Choco Chip Cookies)", 
    oldPrice: 47000, price: 44000, kind: "food", color: "#afc94f",
    bundleImages: ["menu_56.jpg", "menu_33.jpg", "menu_119.jpg"] 
  },
  { 
    id: "bundle-70k-2", group: "promo-70k", name: "Paket Sultan 70K 2 (Matcha Kenangan Frappe + Caramel Dutch Choco + Sugar Donut)", 
    oldPrice: 46000, price: 43000, kind: "food", color: "#69a63b",
    bundleImages: ["menu_81.jpg", "menu_58.jpg", "menu_116.jpg"] 
  },
  { 
    id: "bundle-70k-3", group: "promo-70k", name: "Paket Sultan 70K 3 (Caramel Dutch Choco + Thai Tea Coffee + Danish Tiramisu)", 
    oldPrice: 46500, price: 45000, kind: "food", color: "#6b3326",
    bundleImages: ["menu_59.jpg", "menu_4.jpg", "menu_104.jpg"] 
  },
  { 
    id: "bundle-70k-4", group: "promo-70k", name: "Paket Sultan 70K 4 (Butterscotch Kenangan Frappe + Milo Dino + Bambang Choco Cheese)", 
    oldPrice: 49000, price: 46000, kind: "food", color: "#d59a32",
    bundleImages: ["menu_80.jpg", "menu_69.jpg", "menu_109.jpg"] 
  },
  { 
    id: "bundle-70k-5", group: "promo-70k", name: "Paket Sultan 70K 5 (Dutch Choco Kenangan Frappe + Toffee Nut Oat Latte + Chocolate Croissant)", 
    oldPrice: 47500, price: 45000, kind: "food", color: "#5a2d25",
    bundleImages: ["menu_84.jpg", "menu_29.jpg", "menu_115.jpg"] 
  },
  { 
    id: "bundle-70k-6", group: "promo-70k", name: "Paket Sultan 70K 6 (Thai Tea Loaded + Milk Oreo Crumble + Aren Apple Pie)", 
    oldPrice: 45000, price: 43000, kind: "food", color: "#cf6b20",
    bundleImages: ["menu_50.jpg", "menu_64.jpg", "menu_94.jpg"] 
  },
  { 
    id: "bundle-70k-7", group: "promo-70k", name: "Paket Sultan 70K 7 (Caramel Macchiato + Avocado Coffee + Choco Chip Cookies)", 
    oldPrice: 46000, price: 43000, kind: "food", color: "#bd6a2d",
    bundleImages: ["menu_23.jpg", "menu_35.jpg", "menu_119.jpg"] 
  },

  // Kategori: Baru!
  { id: "og-thai-tea", group: "baru", name: "OG Thai Tea", oldPrice: 19000, price: 12500, largePrice: 16500, jumboPrice: 23500, allowOatside: false, noSugar: true, color: "#e56d17", foam: "#fff1df", drizzle: "#d35c19", isNew: true, noHot: false },
  { id: "thai-tea-loaded", group: "baru", name: "Thai Tea Loaded", oldPrice: 27000, price: 16000, largePrice: 16500, allowBeans: false, allowOatside: false, noSugar: true, color: "#cf6b20", foam: "#fff4e5", drizzle: "#5b2f1b", isNew: true, noRegular: true, noHot: true },
  { id: "thai-tea-aren", group: "baru", name: "Thai Tea Aren", oldPrice: 24000, price: 15000, largePrice: 15000, jumboPrice: 22000, allowBeans: false, allowOatside: false, color: "#bd5b1d", foam: "#f4d09c", drizzle: "#7c3f1f", isNew: true, noSugar: true, noRegular: true },
  { id: "thai-tea-coffee", group: "baru", name: "Thai Tea Coffee", oldPrice: 25000, price: 15500, largePrice: 15500, jumboPrice: 22500, allowBeans: true, allowOatside: false, color: "#7d3d1d", foam: "#f6d6ab", drizzle: "#e27521", isNew: true, noRegular: true, noSugar: true },

  // Kategori: Coffee
  { id: "thai-tea-coffee-coffee", group: "coffee", name: "Thai Tea Coffee", oldPrice: 25000, price: 15500, largePrice: 15500, jumboPrice: 22500, allowBeans: true, allowOatside: true, color: "#7d3d1d", foam: "#f6d6ab", drizzle: "#e27521", isNew: true, noRegular: true, noSugar: true },
  { id: "og-aren-speculoos-latte", group: "coffee", name: "OG Aren Speculoos Latte", oldPrice: 21000, price: 14500, largePrice: 21500, allowBeans: true, allowOatside: true, color: "#d2a06b", foam: "#fff2dc", drizzle: "#9a5a28" },
  { id: "dua-shot-og-aren", group: "coffee", name: "Dua Shot OG Aren", oldPrice: 25000, price: 16500, largePrice: 23500, allowBeans: true, allowOatside: true, noSugar: true, color: "#d7a36c", foam: "#fff2dc", drizzle: "#76401f" },
  { id: "mocha-caramel", group: "coffee", name: "Mocha Caramel", oldPrice: 26000, price: 17000, largePrice: 24000, jumboPrice: 34000, allowBeans: true, allowOatside: true, noSugar: true, color: "#70402c", foam: "#f4dcc4", drizzle: "#3b1c12" },
  { id: "cafe-malt-latte", group: "coffee", name: "Cafe Malt Latte", oldPrice: 23000, price: 15500, largePrice: 22500, color: "#2f2922", foam: "#e2c696", drizzle: "#b17a37" },
  { id: "kopi-kenangan-mantan", group: "coffee", name: "Kopi Kenangan Mantan", soldOutUntil: "2026-05-28T17:00", isBestSeller: true, oldPrice: 19000, price: 12500, largePrice: 18500, jumboPrice: 28500, allowBeans: true, allowOatside: true, color: "#8d4a27", foam: "#f3d3b1", drizzle: "#5d2d19" },
  { id: "caramel-latte", group: "coffee", name: "Caramel Latte", oldPrice: 26000, price: 16000, largePrice: 24000, jumboPrice: 33000, allowBeans: true, allowOatside: true, color: "#b45b23", foam: "#fff0dc", drizzle: "#a04b19" },
  { id: "dua-shot-iced-shaken", group: "coffee", name: "Dua Shot Iced Shaken", oldPrice: 28000, price: 17000, largePrice: 27000, jumboPrice: 36000, allowBeans: true, allowOatside: true, noHot: true, color: "#d56419", foam: "#ffe4c6", drizzle: "#ee8d24" },
  { id: "caramel-macchiato", group: "coffee", name: "Caramel Macchiato", oldPrice: 28000, price: 17000, largePrice: 27000, jumboPrice: 36000, allowBeans: true, allowOatside: true, color: "#bd6a2d", foam: "#fff2dc", drizzle: "#a75a20" },
  { id: "hazelnut-latte", group: "coffee", name: "Hazelnut Latte", oldPrice: 26000, price: 16000, largePrice: 24000, jumboPrice: 33000, allowBeans: true, allowOatside: true, color: "#9f562a", foam: "#f4dfc8", drizzle: "#7a3b1e" },
  { id: "tiramisu-latte", group: "coffee", name: "Tiramisu Latte", oldPrice: 20000, price: 13500, largePrice: 17500, jumboPrice: 21500, allowBeans: true, allowOatside: true, color: "#a16643", foam: "#f7efe6", drizzle: "#6d3b24" },
  { id: "tiramisu-mocha-latte", group: "coffee", name: "Tiramisu Mocha Latte", oldPrice: 25000, price: 16500, largePrice: 21000, jumboPrice: 25500, allowBeans: true, allowOatside: true, color: "#6e3a2b", foam: "#f7efe6", drizzle: "#3a1c13" },
  { id: "toffee-nut-latte", group: "coffee", name: "Toffee Nut Latte", oldPrice: 19000, price: 13000, largePrice: 20000, jumboPrice: 30000, allowBeans: true, allowOatside: false, noSugar: true, color: "#b36e3a", foam: "#f3d7b9", drizzle: "#815029" },
  { id: "toffee-nut-aren-latte", group: "coffee", name: "Toffee Nut Aren Latte", oldPrice: 21000, price: 14500, largePrice: 21500, jumboPrice: 31500, allowBeans: true, allowOatside: false, color: "#9f5127", foam: "#f0cda9", drizzle: "#5f2d17" },
  { id: "toffee-nut-oat-latte", group: "coffee", name: "Toffee Nut Oat Latte", oldPrice: 22000, price: 15000, largePrice: 22000, jumboPrice: 32000, allowBeans: true, allowOatside: false, noSugar: true, color: "#b98351", foam: "#f1dcc4", drizzle: "#775032" },
  { id: "pistachio-aren-latte", group: "coffee", name: "Pistachio Aren Latte", oldPrice: 19000, price: 13000, largePrice: 20000, jumboPrice: 30000, allowBeans: true, allowOatside: true, noSugar: true, color: "#95bb49", foam: "#d9efae", drizzle: "#4e6128" },
  { id: "kopi-susu-black-aren", group: "coffee", name: "Kopi Susu Black Aren", oldPrice: 21000, price: 13500, largePrice: 22500, jumboPrice: 31500, allowBeans: true, allowOatside: true, color: "#57301e", foam: "#ddb689", drizzle: "#1f0f09" },
  { id: "matcha-espresso", group: "coffee", name: "Matcha Espresso", oldPrice: 26000, price: 16000, largePrice: 25000, jumboPrice: 35000, allowBeans: true, allowOatside: true, color: "#6a7a38", foam: "#d7e5a1", drizzle: "#35451b" },
  { id: "mocha-latte", group: "coffee", name: "Mocha Latte", oldPrice: 28000, price: 17000, largePrice: 27000, jumboPrice: 36000, allowBeans: true, allowOatside: true, color: "#89502c", foam: "#f4dcc4", drizzle: "#4f2718" },
  { id: "vanilla-latte", group: "coffee", name: "Vanilla Latte", oldPrice: 26000, price: 16000, largePrice: 24000, jumboPrice: 33000, allowBeans: true, allowOatside: true, color: "#bd6427", foam: "#fff3de", drizzle: "#edc77e" },
  { id: "avocado-coffee", group: "coffee", name: "Avocado Coffee", oldPrice: 28000, price: 17000, largePrice: 27000, jumboPrice: 36000, allowBeans: true, allowOatside: true, color: "#6d7d3d", foam: "#c8df88", drizzle: "#3f5528" },
  { id: "spanish-latte", group: "coffee", name: "Spanish Latte", oldPrice: 19000, price: 12500, largePrice: 20500, jumboPrice: 29500, allowBeans: true, allowOatside: false, noSugar: true, color: "#a25a2a", foam: "#f8efe4", drizzle: "#d7a16b" },
  { id: "creamy-aren-latte", group: "coffee", name: "Creamy Aren Latte", oldPrice: 22000, price: 14000, largePrice: 23000, jumboPrice: 32000, allowBeans: true, allowOatside: false, noSugar: true, color: "#8f4a24", foam: "#f1dbc5", drizzle: "#6c341b" },
  { id: "butterscotch-aren-latte", group: "coffee", name: "Butterscotch Aren Latte", oldPrice: 20000, price: 14000, largePrice: 21000, jumboPrice: 30000, allowBeans: true, allowOatside: true, noSugar: true, color: "#b46b2d", foam: "#f3d2a7", drizzle: "#81501e" },
  { id: "butterscotch-sea-salt-latte", group: "coffee", name: "Butterscotch Sea Salt Latte", isBestSeller: true, oldPrice: 25000, price: 15500, largePrice: 23500, jumboPrice: 32500, allowBeans: true, allowOatside: true, noSugar: true, color: "#bd6426", foam: "#fff1d9", drizzle: "#c68a47" },
  { id: "americano", group: "coffee", name: "Americano", oldPrice: 17000, price: 11500, largePrice: 16500, jumboPrice: 23500, allowBeans: true, allowOatside: false, color: "#3f2016", foam: "#5a3020", drizzle: "#2a120c" },
  { id: "cappuccino", group: "coffee", name: "Cappuccino", oldPrice: 22000, price: 14000, largePrice: 21000, jumboPrice: 30000, allowBeans: true, allowOatside: true, color: "#b4612c", foam: "#fff3e5", drizzle: "#c98c52" },
  { id: "latte", group: "coffee", name: "Latte", oldPrice: 22000, price: 14000, largePrice: 21000, jumboPrice: 30000, allowBeans: true, allowOatside: true, color: "#c06a31", foam: "#fff0df", drizzle: "#dfb07e" },

  // Kategori: Non-Coffee
  { id: "nc-og-thai-tea", group: "non-coffee", name: "OG Thai Tea", oldPrice: 19000, price: 12500, largePrice: 16500, jumboPrice: 23500, allowOatside: false, noSugar: true, color: "#e56d17", foam: "#fff1df", drizzle: "#d35c19", isNew: true, noHot: false },
  { id: "nc-thai-tea-loaded", group: "non-coffee", name: "Thai Tea Loaded", isBestSeller: true, oldPrice: 27000, price: 16000, largePrice: 16500, allowBeans: false, allowOatside: false, noSugar: true, color: "#cf6b20", foam: "#fff4e5", drizzle: "#5b2f1b", isNew: true, noRegular: true, noHot: true },
  { id: "nc-thai-tea-aren", group: "non-coffee", name: "Thai Tea Aren", oldPrice: 24000, price: 15000, largePrice: 15000, jumboPrice: 22000, allowBeans: false, allowOatside: false, color: "#bd5b1d", foam: "#f4d09c", drizzle: "#7c3f1f", isNew: true, noSugar: true, noRegular: true },
  { id: "og-aren-milky-speculoos", group: "non-coffee", name: "OG Aren Milky Speculoos", oldPrice: 23000, price: 16000, largePrice: 16000, jumboPrice: 23000, allowBeans: false, allowOatside: false, color: "#d7a36c", foam: "#fff2dc", drizzle: "#76401f", noSugar: true, noRegular: true },
  { id: "choco-caramel", group: "non-coffee", name: "Choco Caramel", oldPrice: 19000, price: 13000, largePrice: 20000, jumboPrice: 30000, allowOatside: true, color: "#71402c", foam: "#f5d4bd", drizzle: "#3b1c12", noSugar: true },
  { id: "toffee-nut-choco-macchiato", group: "non-coffee", name: "Toffee Nut Choco Macchiato", oldPrice: 22000, price: 15000, allowBeans: false, allowOatside: true, color: "#7a4027", foam: "#f0d1a6", drizzle: "#b17428", noSugar: true },
  { id: "butterscotch-sea-salt-macchiato", group: "non-coffee", name: "Butterscotch Sea Salt Macchiato", isBestSeller: true, oldPrice: 22000, price: 15000, allowBeans: false, allowOatside: true, color: "#e3bd82", foam: "#fff3db", drizzle: "#bd7b32" },
  { id: "milk-oreo-crumble", group: "non-coffee", name: "Milk Oreo Crumble", oldPrice: 26000, price: 17000, allowBeans: false, allowOatside: true, color: "#f6f2e9", foam: "#ffffff", drizzle: "#111111", noHot: true },
  { id: "babyccino", group: "non-coffee", name: "Babyccino", oldPrice: 19000, price: 13000, allowBeans: false, allowOatside: true, color: "#f0dfc2", foam: "#fff8ef", drizzle: "#bc7b28" },
  { id: "fresh-lemonade", group: "non-coffee", name: "Fresh Lemonade", oldPrice: 17000, price: 11500, largePrice: 11500, jumboPrice: 21500, allowOatside: false, color: "#f4d23c", foam: "#fff2a5", drizzle: "#e6aa18", noHot: true, noRegular: true },
  { id: "lemon-black-tea", group: "non-coffee", name: "Lemon Black Tea", oldPrice: 17000, price: 11500, largePrice: 18500, jumboPrice: 25500, allowBeans: false, allowOatside: false, color: "#ba3b2f", foam: "#f4d66b", drizzle: "#6a1f18" },
  { id: "kenangan-milk-tea", group: "non-coffee", name: "Kenangan Milk Tea", oldPrice: 21000, price: 14500, largePrice: 20500, jumboPrice: 27500, allowBeans: false, allowOatside: false, color: "#bf8a56", foam: "#f3d9bd", drizzle: "#875022" },
  { id: "milo-dinosaurus", group: "non-coffee", name: "Milo Dinosaurus", oldPrice: 23000, price: 15500, largePrice: 22500, jumboPrice: 30500, allowBeans: false, allowOatside: false, color: "#6c3e2f", foam: "#e5c6ad", drizzle: "#3a2017" },
  { id: "oreo-shake", group: "non-coffee", name: "Oreo Shake", oldPrice: 26000, price: 17000, largePrice: 25000, jumboPrice: 35000, allowBeans: false, allowOatside: true, color: "#f1eee7", foam: "#ffffff", drizzle: "#111111", noHot: true },
  { id: "raspberry-hibiscus", group: "non-coffee", name: "Raspberry Hibiscus", oldPrice: 20000, price: 14000, largePrice: 21000, jumboPrice: 28000, allowBeans: false, allowOatside: false, color: "#df253c", foam: "#f48ba0", drizzle: "#b91529" },
  { id: "susu-grass-jelly", group: "non-coffee", name: "Susu Grass Jelly", oldPrice: 24000, price: 16000, largePrice: 24000, jumboPrice: 33000, allowBeans: false, allowOatside: true, color: "#d3aa73", foam: "#f3dfbd", drizzle: "#111111", noHot: true },
  { id: "matcha-latte", group: "non-coffee", name: "Matcha Latte", oldPrice: 25000, price: 17500, largePrice: 24500, jumboPrice: 34500, allowOatside: true, color: "#4f9c3c", foam: "#d7efb1", drizzle: "#2f5f24" },
  { id: "hazelnut-choco-milk-tea", group: "non-coffee", name: "Hazelnut Choco Milk Tea", oldPrice: 22000, price: 15000, largePrice: 22000, jumboPrice: 29000, allowBeans: false, allowOatside: false, color: "#8b4a32", foam: "#e8c3a2", drizzle: "#5a2b1e" },
  { id: "avocado-caramel", group: "non-coffee", name: "Avocado Caramel", oldPrice: 28000, price: 18000, largePrice: 28000, jumboPrice: 37000, allowBeans: false, allowOatside: true, color: "#afc94f", foam: "#edf5b1", drizzle: "#d79327", noHot: true },
  { id: "avocado-milk", group: "non-coffee", name: "Avocado Milk", oldPrice: 24000, price: 16000, largePrice: 26000, jumboPrice: 35000, allowBeans: false, allowOatside: true, color: "#b4cf49", foam: "#eff6bd", drizzle: "#7f9c2d", noHot: true },
  { id: "caramel-dutch-choco", group: "non-coffee", name: "Caramel Dutch Choco", oldPrice: 28000, price: 18000, largePrice: 28000, jumboPrice: 37000, allowBeans: false, allowOatside: true, color: "#603225", foam: "#f0c9a8", drizzle: "#b66a20" },
  { id: "dutch-chocolate", group: "non-coffee", name: "Dutch Chocolate", oldPrice: 26000, price: 17000, largePrice: 27000, jumboPrice: 36000, allowBeans: false, allowOatside: true, color: "#6b3326", foam: "#e7c2a8", drizzle: "#39180f" },
  { id: "hazelnut-dutch-choco", group: "non-coffee", name: "Hazelnut Dutch Choco", oldPrice: 28000, price: 18000, largePrice: 28000, jumboPrice: 37000, allowBeans: false, allowOatside: true, color: "#78422b", foam: "#e8c6a9", drizzle: "#4c2217" },

  // Kategori Frappe
  { id: "tiramisu-frappe", group: "kenangan-frappe", name: "Tiramisu Frappe", oldPrice: 28000, price: 18000, largePrice: 18000, jumboPrice: 22000, allowBeans: true, allowOatside: true, color: "#6d3b2a", foam: "#f6efe7", drizzle: "#3a1c12", kind: "frappe", noHot: true },
  { id: "butterscotch-kenangan-frappe", group: "kenangan-frappe", name: "Butterscotch Kenangan Frappe", oldPrice: 30000, price: 20000, largePrice: 30000, allowBeans: true, allowOatside: true, color: "#d59a32", foam: "#fff3df", drizzle: "#b36a1f", kind: "frappe", noHot: true },
  { id: "matcha-kenangan-frappe", group: "kenangan-frappe", name: "Matcha Kenangan Frappe", oldPrice: 32000, price: 20000, largePrice: 30000, allowBeans: false, allowOatside: true, color: "#69a63b", foam: "#dcf0b3", drizzle: "#2f5d22", kind: "frappe", noHot: true },
  { id: "kopi-kenangan-mantan-frappe", group: "kenangan-frappe", name: "Kopi Kenangan Mantan Frappe", oldPrice: 27000, price: 18500, largePrice: 25500, allowBeans: true, allowOatside: true, color: "#9f5a2f", foam: "#f2dfcf", drizzle: "#5e2d17", kind: "frappe", noHot: true },
  { id: "vanilla-kenangan-frappe", group: "kenangan-frappe", name: "Vanilla Kenangan Frappe", oldPrice: 25000, price: 17500, largePrice: 24500, allowBeans: false, allowOatside: true, color: "#f5f0e7", foam: "#ffffff", drizzle: "#e5d4bb", kind: "frappe", noHot: true },
  { id: "dutch-choco-kenangan-frappe", group: "kenangan-frappe", name: "Dutch Choco Kenangan Frappe", oldPrice: 29000, price: 19500, largePrice: 26500, allowBeans: false, allowOatside: true, color: "#5a2d25", foam: "#e9c4ad", drizzle: "#28110c", kind: "frappe", noHot: true },

  // Kategori: Makanan
  { id: "canele-aren", group: "chef-martin", name: "Canele Aren", oldPrice: 15000, price: 10500, kind: "food", color: "#6b3a24" },
  { id: "aren-apple-pie", group: "chef-martin", name: "Aren Apple Pie", oldPrice: 17000, price: 11500, kind: "food", color: "#d59441" },
  { id: "blueberry-muffin", group: "chef-martin", name: "Blueberry Muffin", oldPrice: 15000, price: 10500, kind: "food", color: "#d7a85b" },
  { id: "strawberry-choux-puff", group: "chef-martin", name: "Strawberry Choux Puff", oldPrice: 12000, price: 9000, kind: "food", color: "#e6a06c" },
  { id: "chocolate-choux-puff", group: "chef-martin", name: "Chocolate Choux Puff", oldPrice: 12000, price: 9000, kind: "food", color: "#6b3726" },
  { id: "danish-tiramisu", group: "chef-martin", name: "Danish Tiramisu", oldPrice: 19000, price: 13000, kind: "food", color: "#7b4a2f" },
  { id: "salt-bread-original", group: "chef-martin", name: "Salt Bread Original", oldPrice: 11000, price: 9000, kind: "food", color: "#d9913c" },
  { id: "canele-original", group: "chef-martin", name: "Canele Original", oldPrice: 13000, price: 9500, kind: "food", color: "#7a432b" },
  { id: "canele-toffee-nut-crumble", group: "chef-martin", name: "Canele Toffee Nut Crumble", oldPrice: 15000, price: 10500, kind: "food", color: "#8b4a32" },
  { id: "donut-almond", group: "chef-martin", name: "Donut Almond", oldPrice: 13000, price: 9500, kind: "food", color: "#d7a15b" },
  { id: "roti-gulung-abon", group: "chef-martin", name: "Roti Gulung Abon", oldPrice: 17000, price: 12500, kind: "food", color: "#c0702e" },
  
  { id: "bambang-choco-cheese", group: "kenangan-toast", name: "Bambang Choco Cheese", oldPrice: 17000, price: 13500, kind: "toast", color: "#d58a35" },
 
  { id: "chocolate-croissant", group: "food", name: "Chocolate Croissant", oldPrice: 19000, price: 14500, kind: "food", color: "#c6782d" },
  { id: "sugar-donut", group: "food", name: "Sugar Donut", oldPrice: 10000, price: 8000, kind: "food", color: "#e4b56c" },
  { id: "roti-coklat-klasik", group: "food", name: "Roti Coklat Klasik", oldPrice: 9000, price: 7500, kind: "food", color: "#8a4328" },
  { id: "roti-keju-manis", group: "food", name: "Roti Keju Manis", oldPrice: 13000, price: 10000, kind: "food", color: "#ead7aa" },
  { id: "choco-chip-cookies", group: "food", name: "Choco Chip Cookies", oldPrice: 14000, price: 12000, kind: "cookie", color: "#bb7a37" },
  { id: "join-the-dark-side-cookie", group: "food", name: "Join the Dark Side Cookie", oldPrice: 21000, price: 15500, kind: "cookie", color: "#3d2119" },
  { id: "friend-chip-cookie", group: "food", name: "Friend Chip Cookie", oldPrice: 17000, price: 13500, kind: "cookie", color: "#c99050" },
];

const productImages = {
  "og-thai-tea": "menu_1.jpg",
  "thai-tea-loaded": "menu_2.jpg",
  "thai-tea-aren": "menu_3.jpg",
  "thai-tea-coffee": "menu_4.jpg",
  "thai-tea-coffee-coffee": "menu_4.jpg",
  "og-aren-speculoos-latte": "menu_14.jpg",
  "dua-shot-og-aren": "menu_15.jpg",
  "mocha-caramel": "menu_16.jpg",
  "cafe-malt-latte": "menu_19.jpg",
  "kopi-kenangan-mantan": "menu_20.jpg",
  "caramel-latte": "menu_21.jpg",
  "dua-shot-iced-shaken": "menu_22.jpg",
  "caramel-macchiato": "menu_23.jpg",
  "hazelnut-latte": "menu_24.jpg",
  "tiramisu-latte": "menu_25.jpg",
  "tiramisu-mocha-latte": "menu_26.jpg",
  "toffee-nut-latte": "menu_27.jpg",
  "toffee-nut-aren-latte": "menu_28.jpg",
  "toffee-nut-oat-latte": "menu_29.jpg",
  "pistachio-aren-latte": "menu_30.jpg",
  "kopi-susu-black-aren": "menu_31.jpg",
  "matcha-espresso": "menu_32.jpg",
  "mocha-latte": "menu_33.jpg",
  "vanilla-latte": "menu_34.jpg",
  "avocado-coffee": "menu_35.jpg",
  "spanish-latte": "menu_36.jpg",
  "creamy-aren-latte": "menu_37.jpg",
  "butterscotch-aren-latte": "menu_38.jpg",
  "butterscotch-sea-salt-latte": "menu_39.jpg",
  "americano": "menu_40.jpg",
  "cappuccino": "menu_41.jpg",
  "latte": "menu_42.jpg",
  "nc-og-thai-tea": "menu_49.jpg",
  "nc-thai-tea-loaded": "menu_50.jpg",
  "nc-thai-tea-aren": "menu_51.jpg",
  "og-aren-milky-speculoos": "menu_52.jpg",
  "choco-caramel": "menu_61.jpg",
  "toffee-nut-choco-macchiato": "menu_62.jpg",
  "butterscotch-sea-salt-macchiato": "menu_63.jpg",
  "milk-oreo-crumble": "menu_64.jpg",
  "babyccino": "menu_65.jpg",
  "fresh-lemonade": "menu_66.jpg",
  "lemon-black-tea": "menu_67.jpg",
  "kenangan-milk-tea": "menu_68.jpg",
  "milo-dinosaurus": "menu_69.jpg",
  "oreo-shake": "menu_70.jpg",
  "raspberry-hibiscus": "menu_71.jpg",
  "susu-grass-jelly": "menu_72.jpg",
  "matcha-latte": "menu_73.jpg",
  "hazelnut-choco-milk-tea": "menu_55.jpg",
  "avocado-caramel": "menu_56.jpg",
  "avocado-milk": "menu_57.jpg",
  "caramel-dutch-choco": "menu_58.jpg",
  "dutch-chocolate": "menu_59.jpg",
  "hazelnut-dutch-choco": "menu_60.jpg",
  "tiramisu-frappe": "menu_79.jpg",
  "butterscotch-kenangan-frappe": "menu_80.jpg",
  "matcha-kenangan-frappe": "menu_81.jpg",
  "kopi-kenangan-mantan-frappe": "menu_82.jpg",
  "vanilla-kenangan-frappe": "menu_83.jpg",
  "dutch-choco-kenangan-frappe": "menu_84.jpg",
  "canele-aren": "menu_93.jpg",
  "aren-apple-pie": "menu_94.jpg",
  "blueberry-muffin": "menu_95.jpg",
  "strawberry-choux-puff": "menu_96.jpg",
  "chocolate-choux-puff": "menu_103.jpg",
  "danish-tiramisu": "menu_104.jpg",
  "salt-bread-original": "menu_105.jpg",
  "canele-original": "menu_106.jpg",
  "canele-toffee-nut-crumble": "menu_107.jpg",
  "donut-almond": "menu_108.jpg",
  "roti-gulung-abon": "menu_99.jpg",
  "bambang-choco-cheese": "menu_109.jpg",
  "chocolate-croissant": "menu_115.jpg",
  "sugar-donut": "menu_116.jpg",
  "roti-coklat-klasik": "menu_117.jpg",
  "roti-keju-manis": "menu_118.jpg",
  "choco-chip-cookies": "menu_119.jpg",
  "join-the-dark-side-cookie": "menu_120.jpg",
  "friend-chip-cookie": "menu_119.jpg",
};

menuItems.forEach((item) => {
  if (productImages[item.id]) {
    item.image = `assets/menu/${productImages[item.id]}`;
  }
});

const cart = new Map();
let pendingItemId = "";
let proofPreviewUrl = "";
let supabaseClient = null;

const selectedOptions = {
  temperature: "Ice",
  size: "Regular",
  beans: "Kenangan Blend",
  milk: "Milk",
  sugar: "Normal Sugar",
  ice: "Normal Ice",
};

const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

const categoryNav = document.querySelector("#categoryNav");
const catalogContainer = document.querySelector("#catalogContainer");
const menuSearch = document.querySelector("#menuSearch");
const clearSearch = document.querySelector("#clearSearch");
const searchStatus = document.querySelector("#searchStatus");
const cartItems = document.querySelector("#modalCartItems");
const subtotalEl = document.querySelector("#modalSubtotal");
const grandTotalEl = document.querySelector("#modalGrandTotal");
const checkoutSummary = document.querySelector("#checkoutSummary");
const clearCartButton = document.querySelector("#modalClearCart");
const orderForm = document.querySelector("#modalOrderForm");
const reviewForm = document.querySelector("#modalReviewForm");
const reviewsGrid = document.querySelector("#reviewsGrid");
const backToTop = document.querySelector("#backToTop");
const openCartButton = document.querySelector("#openCartButton");
const openCartCount = document.querySelector("#openCartCount");
const openCartTotal = document.querySelector("#openCartTotal");
const orderModal = document.querySelector("#orderModal");
const modalTitle = document.querySelector("#modalItemName");
const modalCustomize = document.querySelector("#modalCustomize");
const modalCartStage = document.querySelector("#modalCartStage");
const modalCheckoutStage = document.querySelector("#modalCheckoutStage");
const modalOptions = document.querySelector("#modalOptions");
const closeOrderModalButton = document.querySelector("#closeOrderModal");
const continueShoppingButton = document.querySelector("#continueShopping");
const goCheckoutButton = document.querySelector("#goCheckout");
const backToCartButton = document.querySelector("#backToCart");
const paymentProofInput = document.querySelector("#modalPaymentProof");
const proofPreview = document.querySelector("#proofPreview");
const shareProofButton = document.querySelector("#shareProofButton");
const optionGroups = document.querySelectorAll("[data-option-group]");
const selectedDrink = document.querySelector("#selectedDrink");
const addConfiguredItemButton = document.querySelector("#addConfiguredItem");

function menuVisual(item) {
  // KHUSUS UNTUK MENU BUNDLE (KOLASE FOTO)
  if (item.bundleImages && item.bundleImages.length > 0) {
    const collageClass = `items-${item.bundleImages.length}`;
    return `<div class="photo-frame bundle-collage ${collageClass}">
      ${item.bundleImages.map(img => `<img src="assets/menu/${img}" alt="Bundle Item" loading="lazy" />`).join('')}
    </div>`;
  }
  
  // UNTUK MENU SATUAN BIASA
  if (item.image) {
    return `<div class="photo-frame ${item.kind || "drink"}"><img src="${item.image}" alt="${item.name}" loading="lazy" /></div>`;
  }
  
  // UNTUK MENU YANG TIDAK ADA FOTONYA (MENGGUNAKAN GAMBAR CSS)
  const style = `--cup-color: ${item.color || "#a84e1e"}; --foam-color: ${item.foam || "#fff2df"}; --drizzle-color: ${item.drizzle || "#ffffff"}`;
  const kind = item.kind || "drink";
  return `<div class="menu-visual ${kind}" style="${style}" aria-hidden="true"><i></i><i></i><i></i><b></b><span class="foam"></span><span class="drizzle"></span><span class="heart"></span></div>`;
}

// Ganti fungsi menuCard lama dengan ini:
function menuCard(item) {
  const store = checkStoreStatus();
  
  // Kalau toko tutup, paksa semua menu jadi statusnya habis/mati
  let currentlySoldOut = item.isSoldOut === true || store.closed;
  let unlockMessage = "";

  // Tampilkan pesan di atas gambar
  if (store.closed) {
    unlockMessage = `<span class="unlock-time">TOKO TUTUP</span>`;
  } else if (item.soldOutUntil) {
    const unlockTime = new Date(item.soldOutUntil).getTime();
    const now = new Date().getTime();
    if (now < unlockTime) {
      currentlySoldOut = true;
      const timeObj = new Date(unlockTime);
      const jam = timeObj.getHours().toString().padStart(2, '0');
      const menit = timeObj.getMinutes().toString().padStart(2, '0');
      unlockMessage = `<span class="unlock-time">Buka jam ${jam}:${menit}</span>`;
    }
  }

  const soldOutClass = currentlySoldOut ? "sold-out" : "";
  const bestSellerClass = item.isBestSeller ? "best-seller" : "";
  
  // Ganti teks tombol jika sedang tutup
  const buttonText = store.closed ? "Tutup" : (currentlySoldOut ? "Habis" : "Tambah");
  const buttonHtml = currentlySoldOut 
    ? `<button class="add-button" type="button" disabled>${buttonText}</button>`
    : `<button class="add-button" type="button" data-id="${item.id}">Tambah</button>`;

  return `<article class="menu-card ${item.isNew ? "new" : ""} ${bestSellerClass} ${soldOutClass}">
    ${menuVisual(item)}
    ${unlockMessage}
    <h3>${item.name}</h3>
    ${item.oldPrice ? `<span class="old-price">${rupiah.format(item.oldPrice)}</span>` : ""}
    <span class="price">${rupiah.format(item.price)}</span>
    ${buttonHtml}
  </article>`;
}

function normalizeText(value) { return String(value).toLowerCase().trim(); }
  const store = checkStoreStatus();
  const bannerHtml = store.closed ? `<div class="store-closed-banner"><strong>⚠️ TOKO SEDANG TUTUP</strong><p>${store.message}</p></div>` : "";
function renderMenu(query = "") {
  const normalizedQuery = normalizeText(query);
  
  // 1. Tambahkan menu "Best Seller" di awal navigasi kategori
  categoryNav.innerHTML = `<a href="#best-seller">🔥 Best Seller</a>` + 
                          categories.map((category) => `<a href="#${category.id}">${category.title}</a>`).join("");

  let htmlOutput = "";
  let foundItems = new Set(); // Pakai Set agar menu yang muncul 2 kali tidak dihitung dobel saat dicari

  // 2. Buat bagian khusus Best Seller di paling atas
  const bestSellers = menuItems.filter((item) => {
    if (!item.isBestSeller) return false;
    if (!normalizedQuery) return true;
    return normalizeText(item.name).includes(normalizedQuery);
  });

  if (bestSellers.length > 0) {
    bestSellers.forEach(item => foundItems.add(item.id));
    htmlOutput += `
    <section class="catalog-section" id="best-seller">
      <h2>🔥 Best Seller</h2>
      <div class="menu-grid">${bestSellers.map(menuCard).join("")}</div>
    </section>`;
  }

  // 3. Render kategori lain di bawahnya
  htmlOutput += categories.map((category) => {
    const categoryMatches = normalizeText(category.title).includes(normalizedQuery);
    const items = menuItems.filter((item) => {
      if (item.group !== category.id) return false;
      if (!normalizedQuery) return true;
      return categoryMatches || normalizeText(item.name).includes(normalizedQuery);
    });

    // Urutkan item: yang Best Seller ditaruh di posisi terdepan pada masing-masing kategori
    items.sort((a, b) => (b.isBestSeller === true ? 1 : 0) - (a.isBestSeller === true ? 1 : 0));

    if (items.length === 0) return "";
    items.forEach(item => foundItems.add(item.id));
    
    return `<section class="catalog-section" id="${category.id}">
      <h2>${category.title}</h2>
      <div class="menu-grid">${items.map(menuCard).join("")}</div>
    </section>`;
  }).join("");

  catalogContainer.innerHTML = htmlOutput;

  // 4. Update status teks pencarian
  if (normalizedQuery && foundItems.size === 0) {
    catalogContainer.innerHTML = '<p class="no-results">Menu tidak ditemukan. Coba kata lain.</p>';
  }
  
  searchStatus.textContent = normalizedQuery ? 
    `${foundItems.size} menu ditemukan untuk "${query}".` : 
    `${menuItems.length} menu tersedia.`;
}

function renderCart() {
  const entries = [...cart.values()];
  const subtotal = entries.reduce((total, item) => total + item.price * item.qty, 0);

  if (entries.length === 0) {
    cartItems.innerHTML = '<p class="empty">Pilih menu dari price list untuk mulai order.</p>';
  } else {
    cartItems.innerHTML = entries.map((item) => {
      const optionsText = formatOptions(item.options);
      return `<div class="cart-line"><div><h3>${item.name}</h3><span>${rupiah.format(item.price)} x ${item.qty}</span>${optionsText ? `<small class="cart-options">${optionsText}</small>` : ""}</div><div class="quantity"><button class="qty-button" type="button" data-action="decrease" data-id="${item.cartKey}">-</button><strong>${item.qty}</strong><button class="qty-button" type="button" data-action="increase" data-id="${item.cartKey}">+</button></div></div>`;
    }).join("");
  }

  subtotalEl.textContent = rupiah.format(subtotal);
  grandTotalEl.textContent = rupiah.format(subtotal);
  const totalQty = entries.reduce((total, item) => total + item.qty, 0);
  openCartButton.hidden = totalQty === 0;
  openCartCount.textContent = `${totalQty} menu`;
  openCartTotal.textContent = rupiah.format(subtotal);
  renderCheckoutSummary(entries, subtotal);
}

function renderCheckoutSummary(entries, subtotal) {
  if (!checkoutSummary) return;
  if (entries.length === 0) {
    checkoutSummary.innerHTML = '<p class="empty">Keranjang masih kosong.</p>';
    return;
  }
  checkoutSummary.innerHTML = `<div class="checkout-lines">${entries.map((item) => {
    const optionsText = formatOptions(item.options);
    return `<div><span>${item.name} x${item.qty}</span><strong>${rupiah.format(item.price * item.qty)}</strong>${optionsText ? `<small>${optionsText}</small>` : ""}</div>`;
  }).join("")}</div><div class="checkout-total"><span>Total bayar</span><strong>${rupiah.format(subtotal)}</strong></div>`;
}

function formatOptions(options) {
  if (!options || Object.keys(options).length === 0) return "";
  if (options.temperature === "Hot") {
    return [options.temperature, options.size, options.beans, options.milk, options.sugar].filter(Boolean).join(" / ");
  }
  return [options.temperature, options.size, options.beans, options.milk, options.sugar, options.ice].filter(Boolean).join(" / ");
}

function getSupabaseConfig() { return window.KOPI_SUPABASE_CONFIG || {}; }
function isSupabaseConfigured() {
  const config = getSupabaseConfig();
  return Boolean(window.supabase && config.url && config.anonKey && !config.url.includes("ISI_SUPABASE"));
}
function getSupabaseClient() {
  if (!isSupabaseConfigured()) throw new Error("Supabase belum dikonfigurasi.");
  if (!supabaseClient) {
    const config = getSupabaseConfig();
    supabaseClient = window.supabase.createClient(config.url, config.anonKey);
  }
  return supabaseClient;
}

function makeOrderId() { return `ORD-${new Date().toISOString().slice(0, 19).replace(/\D/g, "")}`; }
function normalizeFileName(fileName) {
  const ext = fileName.includes(".") ? fileName.split(".").pop().toLowerCase() : "jpg";
  return `bukti-transfer.${ext}`;
}

async function uploadPaymentProof(file, orderId) {
  const client = getSupabaseClient();
  const config = getSupabaseConfig();
  const filePath = `${orderId}/${Date.now()}-${normalizeFileName(file.name)}`;
  const { data, error } = await client.storage.from(config.paymentProofBucket).upload(filePath, file, { cacheControl: "3600", contentType: file.type || "image/jpeg" });
  if (error) throw error;
  return client.storage.from(config.paymentProofBucket).getPublicUrl(data.path).data.publicUrl;
}

async function createOrderRecord(formData) {
  const entries = [...cart.values()];
  const subtotal = entries.reduce((total, item) => total + item.price * item.qty, 0);
  const proofFile = getPaymentProofFile();
  const orderId = makeOrderId();
  const proofUrl = await uploadPaymentProof(proofFile, orderId);

  return {
    id: orderId,
    customer: { name: String(formData.get("customerName")).trim(), phone: String(formData.get("customerPhone")).trim(), address: String(formData.get("customerAddress")).trim() },
    note: String(formData.get("orderNote")).trim(),
    items: entries.map(item => ({ name: item.name, price: item.price, qty: item.qty, options: item.options })),
    subtotal,
    proof: { url: proofUrl, name: proofFile.name, type: proofFile.type, size: proofFile.size }
  };
}

async function saveOrderToSupabase(order) {
  const client = getSupabaseClient();
  const config = getSupabaseConfig();
  const payload = {
    id: order.id, customer_name: order.customer.name, customer_phone: order.customer.phone, customer_address: order.customer.address,
    note: order.note || null, items: order.items, subtotal: order.subtotal, payment_proof_name: order.proof.name,
    payment_proof_type: order.proof.type, payment_proof_size: order.proof.size, payment_proof_path: order.id, payment_proof_url: order.proof.url
  };
  const { error } = await client.from(config.ordersTable).insert(payload);
  if (error) throw error;
}

function isFoodItem(item) { 
  // Menu akan langsung masuk keranjang (tanpa popup opsi) jika grupnya adalah makanan ATAU mengandung kata "promo"
  return ["food", "chef-martin", "kenangan-toast"].includes(item.group) || 
         (item.group && item.group.includes("promo")); 
}

function resetSelectedOptions() {
  selectedOptions.temperature = "Ice";
  selectedOptions.size = "Regular";
  selectedOptions.beans = "Kenangan Blend";
  selectedOptions.milk = "Milk";
  selectedOptions.sugar = "Normal Sugar";
  selectedOptions.ice = "Normal Ice";

  optionGroups.forEach((group) => {
    const groupName = group.dataset.optionGroup;
    group.querySelectorAll("[data-option-value]").forEach((button) => {
      button.disabled = false;
      button.classList.toggle("selected", button.dataset.optionValue === selectedOptions[groupName]);
    });
  });
  syncIceOptions();
}

function openOrderModal() {
  orderModal.classList.add("open");
  document.body.classList.add("modal-open");
}

function closeOrderModal() {
  orderModal.classList.remove("open");
  document.body.classList.remove("modal-open");
  pendingItemId = "";
}

function setModalStage(stage) {
  modalCustomize.hidden = stage !== "customize";
  modalCartStage.hidden = stage !== "cart";
  modalCheckoutStage.hidden = stage !== "checkout";
}

function calculateItemPrice(item, options) {
  let price = item.price;
  if (!isFoodItem(item)) {
    if (options.size === "Large" && item.largePrice) {
      price = item.largePrice;
    } else if (options.size === "Jumbo" && item.jumboPrice) {
      price = item.jumboPrice;
    } else if (options.size === "Regular" && item.price) {
      price = item.price;
    }

    if (options.beans === "Juwara Beans" && item.allowBeans) {
      price += 3000;
    }
    if (options.milk === "Oatside" && item.allowOatside) {
      price += 3000;
    }
  }
  return price;
}

function updateModalLivePrice(item) {
  const calculatedPrice = calculateItemPrice(item, selectedOptions);
  const priceEl = document.getElementById("modalItemPrice");
  if (priceEl) {
    priceEl.textContent = rupiah.format(calculatedPrice);
  }
}

function syncIceOptions() {
  const iceGroup = document.querySelector('[data-option-group="ice"]');
  if (!iceGroup) return;
  const iceButtons = iceGroup.querySelectorAll("[data-option-value]");
  
  if (selectedOptions.temperature === "Hot") {
    selectedOptions.ice = "No Ice";
    iceGroup.style.display = "none"; 
    iceButtons.forEach(btn => {
      btn.classList.toggle("selected", btn.dataset.optionValue === "No Ice");
    });
  } else {
    iceGroup.style.display = "block"; 
    iceButtons.forEach(btn => btn.disabled = false);
  }
}

function selectItemForOptions(id) {
  const item = menuItems.find((menuItem) => menuItem.id === id);
  if (!item) return;

  pendingItemId = id;
  resetSelectedOptions(); 

  const isFood = isFoodItem(item);
  modalOptions.hidden = isFood;
  addConfiguredItemButton.disabled = false;

  const optRegularBtn = document.querySelector("#optRegularBtn");
  const optLargeBtn = document.querySelector("#optLargeBtn");
  const optJumboBtn = document.querySelector("#optJumboBtn");
  const optNoSugarBtn = document.querySelector("#optNoSugarBtn");
  const sugarGrid = document.querySelector("#sugarGrid");
  
  const optHotBtn = document.querySelector('[data-option-group="temperature"] [data-option-value="Hot"]');
  const tempGrid = document.querySelector('[data-option-group="temperature"] .option-grid');

  if (!isFood) {
    if (item.noHot && optHotBtn && tempGrid) {
      optHotBtn.style.display = "none";
      tempGrid.className = "option-grid one"; 
      selectedOptions.temperature = "Ice";
    } else if (optHotBtn && tempGrid) {
      optHotBtn.style.display = "block";
      tempGrid.className = "option-grid two"; 
    }

    if (item.noRegular) {
      if (optRegularBtn) optRegularBtn.style.display = "none";
      selectedOptions.size = "Large"; 
      document.querySelectorAll('[data-option-group="size"] .option-card').forEach(btn => btn.classList.remove('selected'));
      if (optLargeBtn) optLargeBtn.classList.add('selected');
    } else {
      if (optRegularBtn) optRegularBtn.style.display = "block";
    }

    if (item.largePrice) { optLargeBtn.style.display = "block"; } else { optLargeBtn.style.display = "none"; }
    if (item.jumboPrice) { optJumboBtn.style.display = "block"; } else { optJumboBtn.style.display = "none"; }

    if (!item.largePrice && !item.jumboPrice) {
      document.querySelector("#groupSize").style.display = "none";
    } else {
      document.querySelector("#groupSize").style.display = "block";
    }

    if (item.allowBeans) {
      document.querySelector("#groupBeans").style.display = "block";
    } else {
      document.querySelector("#groupBeans").style.display = "none";
    }

    if (item.allowOatside) {
      document.querySelector("#groupMilk").style.display = "block";
    } else {
      document.querySelector("#groupMilk").style.display = "none";
    }

    if (item.noSugar && optNoSugarBtn && sugarGrid) {
      optNoSugarBtn.style.display = "none";
      sugarGrid.className = "option-grid two"; 
    } else if (optNoSugarBtn && sugarGrid) {
      optNoSugarBtn.style.display = "block";
      sugarGrid.className = "option-grid three"; 
    }
    
    syncIceOptions();
  }

const isBundle = item.group && item.group.includes("promo");

  selectedDrink.innerHTML = `
    <span>MENU DIPILIH</span>
    <strong id="modalProductTitleName">${item.name}</strong>
    <span id="modalItemPrice" style="font-size: 1.1rem; color: #d35c19; font-weight: 800; display: block; margin-top: 4px;">Rp0</span>
    <small>${isBundle ? "Tulis request Ice/Sugar untuk paket ini di kolom Catatan saat Checkout." : (isFood ? "Menu makanan langsung masuk keranjang." : "Sesuaikan rasa minuman kamu di bawah ini.")}</small>
  `;

  updateModalLivePrice(item);

  openOrderModal();
  setModalStage("customize");
}

function addItem(id) {
  const item = menuItems.find((menuItem) => menuItem.id === id);
  if (!item) return;

  const options = isFoodItem(item) ? {} : { ...selectedOptions };
  
  // PERBAIKAN: Bersihkan memori opsi jika menu tidak mendukung fitur tersebut
  if (!isFoodItem(item)) {
    if (!item.allowBeans) delete options.beans;
    if (!item.allowOatside) delete options.milk;
    
    // Opsional: Hapus teks "Regular" jika menu tidak punya pilihan Large/Jumbo
    if (!item.largePrice && !item.jumboPrice) delete options.size;
  }

  const calculatedPrice = calculateItemPrice(item, options);
  // cartKey akan men-generate ID unik berdasarkan opsi yang tersisa
  const cartKey = `${id}|${Object.values(options).join("|")}`;
  const current = cart.get(cartKey);

  cart.set(cartKey, {
    ...item,
    price: calculatedPrice,
    cartKey,
    options,
    qty: current ? current.qty + 1 : 1
  });
  renderCart();
}

function updateQuantity(cartKey, direction) {
  const current = cart.get(cartKey);
  if (!current) return;
  const nextQty = direction === "increase" ? current.qty + 1 : current.qty - 1;
  if (nextQty <= 0) cart.delete(cartKey);
  else cart.set(cartKey, { ...current, qty: nextQty });
  renderCart();
}

function buildWhatsappMessage(formData, savedOrder) {
  const entries = [...cart.values()];
  const subtotal = entries.reduce((total, item) => total + item.price * item.qty, 0);
  const orderLines = entries.map(item => `- ${item.name} x${item.qty} (${formatOptions(item.options)}) = ${rupiah.format(item.price * item.qty)}`).join("\n");

  return ["Halo admin kopi.fachrindah, saya mau order jasdor.", `ID Order: ${savedOrder.id}`, `Nama: ${formData.get("customerName")}`, `WhatsApp: ${formData.get("customerPhone")}`, `Lokasi outlet: ${formData.get("customerAddress")}`, "", "Pesanan:", orderLines, "", `Total bayar: ${rupiah.format(subtotal)}`, `Link bukti transfer: ${savedOrder.proof.url}`, `Catatan: ${formData.get("orderNote") || "-"}`].join("\n");
}

function buildWhatsappLinks(adminPhone, encodedMessage) {
  return { waMeUrl: `https://wa.me/${adminPhone}?text=${encodedMessage}`, appUrl: `whatsapp://send?phone=${adminPhone}&text=${encodedMessage}` };
}
function isAndroidDevice() { return /Android/i.test(navigator.userAgent); }
function getCartQuantity() { return [...cart.values()].reduce((total, item) => total + item.qty, 0); }
function getPaymentProofFile() { return paymentProofInput.files && paymentProofInput.files[0] ? paymentProofInput.files[0] : null; }

function updateProofPreview() {
  const file = getPaymentProofFile();
  if (!file) { proofPreview.innerHTML = "<span>Belum ada bukti dipilih</span>"; shareProofButton.disabled = true; return; }
  shareProofButton.disabled = false;
  if (file.type.startsWith("image/")) {
    proofPreviewUrl = URL.createObjectURL(file);
    proofPreview.innerHTML = `<img src="${proofPreviewUrl}" alt="Preview" /><span>${file.name}</span>`;
  } else { proofPreview.innerHTML = `<span>${file.name}</span>`; }
}

function starsFromRating(rating) { return "★".repeat(Number(rating)) + "☆".repeat(5 - Number(rating)); }
function renderSavedReview(review) {
  const article = document.createElement("article");
  article.innerHTML = `<div class="stars">${starsFromRating(review.rating)}</div><p>"${review.text}"</p><strong>${review.name}</strong>`;
  reviewsGrid.prepend(article);
}

optionGroups.forEach((group) => {
  group.addEventListener("click", (event) => {
    const button = event.target.closest("[data-option-value]");
    if (!button || button.disabled) return;
    
    group.querySelectorAll("[data-option-value]").forEach(opt => opt.classList.remove("selected"));
    button.classList.add("selected");
    selectedOptions[group.dataset.optionGroup] = button.dataset.optionValue;
    
    if (group.dataset.optionGroup === "temperature") syncIceOptions();

    if (pendingItemId) {
      const item = menuItems.find(m => m.id === pendingItemId);
      if (item) updateModalLivePrice(item);
    }
  });
});

document.addEventListener("click", (event) => {
  const closeTarget = event.target.closest("[data-close-modal]");
  if (closeTarget) { closeOrderModal(); return; }

  const btnGPS = event.target.closest("#btnGPS");
  if (btnGPS) {
    const searchCityInput = document.querySelector("#searchCityInput");
    const gpsStatus = document.querySelector("#gpsStatus");
    const queryCity = searchCityInput.value.trim();
    
    if (queryCity.length > 0) {
      gpsStatus.textContent = "Membuka Maps...";
      window.open("https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(queryCity + " Kopi Kenangan"), "_blank");
    } else {
      if (!navigator.geolocation) return;
      btnGPS.disabled = true;
      navigator.geolocation.getCurrentPosition((pos) => {
        window.open("https://www.google.com/maps/search/?api=1&query=Kopi+Kenangan&center=" + pos.coords.latitude + "," + pos.coords.longitude + "&zoom=15", "_blank");
        btnGPS.disabled = false;
      }, () => { btnGPS.disabled = false; }, { timeout: 6000 });
    }
    return;
  }

  const addButton = event.target.closest(".add-button[data-id]");
  if (addButton) { selectItemForOptions(addButton.dataset.id); return; }

  const quantityButton = event.target.closest("[data-action]");
  if (quantityButton) { updateQuantity(quantityButton.dataset.id, quantityButton.dataset.action); }
});

addConfiguredItemButton.addEventListener("click", () => {
  if (!pendingItemId) return;
  addItem(pendingItemId);
  setModalStage("cart");
});

closeOrderModalButton.addEventListener("click", () => closeOrderModal());
continueShoppingButton.addEventListener("click", () => closeOrderModal());

// FIX: Memperbaiki aksi klik tombol "Selesai, Bayar QRIS"
// FIX: Memperbaiki aksi klik tombol "Selesai, Bayar QRIS" dengan pengecualian Bundling
// GEMBOK REAL-TIME: Memperbaiki aksi klik tombol "Selesai, Bayar QRIS" saat testing lokal
goCheckoutButton.addEventListener("click", () => { 
  // 1. Ambil status toko detik ini juga saat tombol diklik
  const store = checkStoreStatus();
  
  // 2. Jika toko terdeteksi tutup, langsung block di sini!
  if (store.closed) {
    alert("Maaf, saat ini toko sedang tutup / istirahat untuk Sholat Jumat. Silakan kembali lagi nanti atau hubungi WhatsApp admin (081281400462).");
    return; // Mencegah masuk ke tahap checkout biodata
  }

  // 3. Jika toko buka, jalankan aturan minimal order seperti biasa
  const totalQty = getCartQuantity();
  const hasBundling = [...cart.values()].some(item => item.group && item.group.includes("promo"));

  if (totalQty >= 2 || hasBundling) { 
    setModalStage("checkout"); 
  } else {
    alert(`Pesanan kamu baru ${totalQty} menu. Minimal pemesanan adalah 2 menu satuan (Kecuali untuk pembelian Paket Promo / Bundling).`);
  }
});

backToCartButton.addEventListener("click", () => setModalStage("cart"));
openCartButton.addEventListener("click", () => { if (getCartQuantity() > 0) { openOrderModal(); setModalStage("cart"); } });

clearCartButton.addEventListener("click", () => { cart.clear(); renderCart(); });
menuSearch.addEventListener("input", () => renderMenu(menuSearch.value));
clearSearch.addEventListener("click", () => { menuSearch.value = ""; renderMenu(); });
paymentProofInput.addEventListener("change", () => updateProofPreview());

orderForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(orderForm);
  const submitButton = orderForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  try {
    const savedOrder = await createOrderRecord(formData);
    await saveOrderToSupabase(savedOrder);
    const message = encodeURIComponent(buildWhatsappMessage(formData, savedOrder));
    const links = buildWhatsappLinks(String(formData.get("adminPhone")).replace(/\D/g, ""), message);
    cart.clear(); orderForm.reset(); renderCart(); closeOrderModal();
    window.location.href = isAndroidDevice() ? links.appUrl : links.waMeUrl;
  } catch (error) { 
    alert("Error menyimpan order. Pastikan Supabase Anda terkonfigurasi dengan benar."); 
  }
  finally { submitButton.disabled = false; }
});

reviewForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(reviewForm);
  renderSavedReview({ name: formData.get("reviewName"), rating: formData.get("reviewRating"), text: formData.get("reviewText") });
  reviewForm.reset();
});

backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

renderMenu();
renderCart();

// ==========================================
// SATPAM KELILING (BACKGROUND CHECKER) Cerdas
// ==========================================
// Memori ingatan satpam saat website pertama kali dibuka
let statusTokoSebelumnya = checkStoreStatus().closed; 

setInterval(() => {
  const store = checkStoreStatus();
  
  // SKENARIO 1: Toko harusnya TUTUP, tapi di ingatan satpam masih BUKA
  if (store.closed && statusTokoSebelumnya === false) {
    statusTokoSebelumnya = true; // Update ingatan satpam jadi "Tutup"
    alert("Waktu ibadah Sholat Jumat telah tiba. Toko ditutup sementara hingga pukul 13:00 WIB.");
    renderMenu(); // Tampilkan banner merah & kunci tombol
  } 
  
  // SKENARIO 2: Toko harusnya BUKA (Jam 13:00), tapi di ingatan satpam masih TUTUP
  else if (!store.closed && statusTokoSebelumnya === true) {
    statusTokoSebelumnya = false; // Update ingatan satpam jadi "Buka"
    alert("Toko sudah buka kembali! Silakan melanjutkan pesanan kamu.");
    renderMenu(); // Hilangkan banner merah & normalkan tombol
  }
}, 3000); // <-- Untuk testing biarkan 3000 (3 detik) dulu