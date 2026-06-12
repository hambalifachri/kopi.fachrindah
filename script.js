// ==========================================
// PENGATURAN STATUS TOKO (BUKA / TUTUP)
// ==========================================
const storeConfig = STORE_CONFIG_DATA;

function checkStoreStatus() {
  // MENGUNCI WAKTU KE WIB (JAKARTA)
  // Jadi walaupun jam HP pelanggan error, toko tetap ikut waktu WIB yang asli
  const now = getJakartaDate();

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

  return { closed: true };
}

function getJakartaDate() {
  const waktuJakarta = new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" });
  return new Date(waktuJakarta);
}

function timeToMinutes(time) {
  const [hour, minute] = String(time).split(":").map(Number);
  return hour * 60 + minute;
}

function isScheduleActive(schedule, now = getJakartaDate()) {
  const day = now.getDay();
  if (schedule.days && !schedule.days.includes(day)) return false;

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const startMinutes = timeToMinutes(schedule.start);
  const endMinutes = timeToMinutes(schedule.end);

  if (startMinutes <= endMinutes) {
    return currentMinutes >= startMinutes && currentMinutes < endMinutes;
  }

  return currentMinutes >= startMinutes || currentMinutes < endMinutes;
}

function getActiveSizeBlock(item, size, now = getJakartaDate()) {
  if (!item.sizeBlocks) return null;
  return item.sizeBlocks.find((block) => block.size === size && isScheduleActive(block, now)) || null;
}

function getActiveSizeBlockNotes(item, now = getJakartaDate()) {
  if (!item.sizeBlocks) return [];
  return item.sizeBlocks
    .filter((block) => isScheduleActive(block, now))
    .map((block) => `${block.size} tidak tersedia ${block.label || ""}`.trim());
}

const BRANDS = BRANDS_DATA;
const menuItems = MENU_ITEMS_DATA;
const productImages = PRODUCT_IMAGES_DATA;
let activeBrandId = BRANDS[0]?.id || "kopi-kenangan";

function slugifyAssetName(value) {
  return String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getAutoImageFileName(item) {
  return `${item.brand}-${slugifyAssetName(item.name)}.jpg`;
}

function resolveMenuImage(item) {
  if (item.image) return item.image;
  const imageFile = item.imageFile || productImages[item.id] || getAutoImageFileName(item);
  return imageFile ? `assets/menu/${imageFile}` : "";
}

menuItems.forEach((item) => {
  item.brand = item.brand || "kopi-kenangan";
  item.image = resolveMenuImage(item);
});

const cart = new Map();
let pendingItemId = "";
let proofPreviewUrl = "";
let supabaseClient = null;

let selectedOptions = {};

const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

const brandTabs = document.querySelector("#brandTabs");
const categoryNav = document.querySelector("#categoryNav");
const catalogContainer = document.querySelector("#catalogContainer");
const menuSearch = document.querySelector("#menuSearch");
const clearSearch = document.querySelector("#clearSearch");
const searchStatus = document.querySelector("#searchStatus");
const mainCartItems = document.querySelector("#cartItems");
const modalCartItems = document.querySelector("#modalCartItems");
const subtotalEl = document.querySelector("#modalSubtotal");
const grandTotalEl = document.querySelector("#modalGrandTotal");
const checkoutSummary = document.querySelector("#checkoutSummary");
const clearCartButton = document.querySelector("#modalClearCart");
const orderForm = document.querySelector("#modalOrderForm");
const reviewForm = document.querySelector("#reviewForm");
const brandTitle = document.querySelector("#brandTitle");
const brandSubtitle = document.querySelector("#brandSubtitle");
const brandSummary = document.querySelector("#brandSummary");
const reviewsGrid = document.querySelector("#reviewsGrid");
const testimonialGallery = document.querySelector("#testimonialGallery");
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
const selectedDrink = document.querySelector("#selectedDrink");
const addConfiguredItemButton = document.querySelector("#addConfiguredItem");

const fallbackTestimonialImages = Array.from({ length: 52 }, (_, index) => `assets/ss-wa-${index + 2}.jpg`);

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }[char]));
}

function getBrandById(brandId) {
  return BRANDS.find((brand) => brand.id === brandId) || BRANDS[0];
}

function getActiveBrand() {
  return getBrandById(activeBrandId);
}

function getActiveCategories() {
  return getActiveBrand().categories || [];
}

function updateBrandHero() {
  const activeBrand = getActiveBrand();
  if (brandTitle) brandTitle.textContent = activeBrand.label;
  if (brandSubtitle) brandSubtitle.textContent = activeBrand.description;
  if (brandSummary) {
    brandSummary.innerHTML = `<strong>${escapeHtml(activeBrand.label)}</strong> · ${escapeHtml(activeBrand.description)}`;
  }

  // --- LOGIKA BARU UNTUK BADGE MINIMAL ORDER ---
  const minBadge = document.querySelector(".min-badge");
  if (minBadge) {
    if (activeBrand.id === "fore") {
      // Tampilan jika tab Fore dipilih (Bisa diganti teksnya sesuai selera)
      minBadge.innerHTML = `
        <span>Tanpa</span>
        <strong>Minimal</strong>
        <span>Order</span>
      `;
      // Opsi lain jika ingin teks "TANPA MIN ORDER":
      // minBadge.innerHTML = `<span>TANPA</span><strong style="font-size: 1.8rem; margin: 4px 0;">MIN</strong><span>ORDER</span>`;
    } else {
      // Tampilan default untuk Kopi Kenangan & Tomoro
      minBadge.innerHTML = `
        <span>MINIMAL</span>
        <strong>2</strong>
        <span>MENU</span>
      `;
    }
  }
}

function getActiveMenuItems() {
  return menuItems.filter((item) => item.brand === activeBrandId);
}

function renderBrandTabs() {
  if (!brandTabs) return;
  const visibleBrands = BRANDS.filter((brand) => !brand.hidden);
  if (visibleBrands.length === 0) {
    brandTabs.innerHTML = "";
    return;
  }
  if (!visibleBrands.some((brand) => brand.id === activeBrandId)) {
    activeBrandId = visibleBrands[0].id;
  }
  brandTabs.innerHTML = visibleBrands.map((brand) => {
    const isActive = brand.id === activeBrandId;
    return `<button class="brand-tab ${isActive ? "active" : ""}" type="button" data-brand="${brand.id}" style="--brand-accent: ${brand.accent}">
      <strong>${escapeHtml(brand.shortLabel)}</strong>
      <span>${escapeHtml(brand.description)}</span>
    </button>`;
  }).join("");
}

function getCartBrandId() {
  const firstItem = cart.values().next().value;
  return firstItem ? firstItem.brand : "";
}

function getCartBrandName() {
  const brandId = getCartBrandId();
  return brandId ? getBrandById(brandId).label : "";
}

function canAddBrandToCart(item, shouldAlert = true) {
  const cartBrandId = getCartBrandId();
  if (!cartBrandId || cartBrandId === item.brand) return true;
  if (shouldAlert) {
    alert("Maaf, pesanan dari brand berbeda tidak bisa digabung. Selesaikan pesanan sebelumnya atau kosongkan keranjang terlebih dahulu.");
  }
  return false;
}

function getKenanganOptionGroups(item) {
  const activeLargeBlock = getActiveSizeBlock(item, "Large");
  const activeJumboBlock = getActiveSizeBlock(item, "Jumbo");
  const sizeOptions = [];

  if (!item.noRegular) {
    sizeOptions.push({ value: "Regular", label: "Regular", price: item.price });
  }
  if (item.largePrice && !activeLargeBlock) {
    sizeOptions.push({ value: "Large", label: "Large", price: item.largePrice });
  }
  if (item.jumboPrice && !activeJumboBlock) {
    sizeOptions.push({ value: "Jumbo", label: "Jumbo", price: item.jumboPrice });
  }

  const groups = [
    {
      key: "temperature",
      label: "Temperature",
      options: item.noHot
        ? [{ value: "Ice", label: "Ice", icon: "ice" }]
        : [
            { value: "Ice", label: "Ice", icon: "ice" },
            { value: "Hot", label: "Hot", icon: "hot" },
          ],
    },
  ];

  if (sizeOptions.length > 1) {
    groups.push({ key: "size", label: "Size", options: sizeOptions });
  }

  if (item.allowBeans) {
    groups.push({
      key: "beans",
      label: "Biji Kopi (Beans)",
      options: [
        { value: "Kenangan Blend", label: "Kenangan Blend" },
        { value: "Juwara Beans", label: "Juwara Beans", priceDelta: 3000 },
      ],
    });
  }

  if (item.allowOatside) {
    groups.push({
      key: "milk",
      label: "Pilihan Susu (Milk)",
      options: [
        { value: "Milk", label: "Fresh Milk" },
        { value: "Oatside", label: "Oatside", priceDelta: 3000 },
      ],
    });
  }

  groups.push({
    key: "sugar",
    label: "Sugar Level",
    options: item.noSugar
      ? [
          { value: "Normal Sugar", label: "Normal Sugar" },
          { value: "Less Sugar", label: "Less Sugar" },
        ]
      : [
          { value: "Normal Sugar", label: "Normal Sugar" },
          { value: "Less Sugar", label: "Less Sugar" },
          { value: "No Sugar", label: "No Sugar" },
        ],
  });

  groups.push({
    key: "ice",
    label: "Ice Level",
    hiddenValue: "No Ice",
    dependsOn: { key: "temperature", value: "Ice" },
    options: [
      { value: "Normal Ice", label: "Normal Ice" },
      { value: "Less Ice", label: "Less Ice" },
      { value: "No Ice", label: "No Ice" },
    ],
  });

  return groups;
}

function cloneOptionGroups(groups) {
  return (groups || []).map((group) => ({
    ...group,
    options: (group.options || []).map((option) => ({ ...option })),
  }));
}

function getItemOptionGroups(item) {
  if (isFoodItem(item)) return [];
  const itemOptions = Array.isArray(item.options) ? cloneOptionGroups(item.options) : null;
  const baseOptions = itemOptions || (item.brand === "kopi-kenangan"
    ? getKenanganOptionGroups(item)
    : cloneOptionGroups(getBrandById(item.brand).defaultOptions));
  const addOns = Array.isArray(item.addOns) ? cloneOptionGroups(item.addOns) : [];
  return [...baseOptions, ...addOns].filter((group) => group.options && group.options.length);
}

function shouldShowOptionGroup(group) {
  if (!group.dependsOn) return true;
  return selectedOptions[group.dependsOn.key] === group.dependsOn.value;
}

function ensureSelectedOptions(item) {
  const groups = getItemOptionGroups(item);
  groups.forEach((group) => {
    const hasSelectedOption = group.options.some((option) => option.value === selectedOptions[group.key]);
    if (!hasSelectedOption && group.options[0]) {
      selectedOptions[group.key] = group.options[0].value;
    }
  });
  groups.forEach((group) => {
    if (!shouldShowOptionGroup(group)) {
      if (group.hiddenValue) selectedOptions[group.key] = group.hiddenValue;
      else delete selectedOptions[group.key];
    }
  });
}

function getVisibleOptionGroups(item) {
  ensureSelectedOptions(item);
  return getItemOptionGroups(item).filter(shouldShowOptionGroup);
}

function getOptionPriceText(option, item) {
  if (option.priceDelta) return `+${rupiah.format(option.priceDelta)}`;
  if (option.price && option.price !== item.price) return rupiah.format(option.price);
  return "";
}

function optionIconHtml(option) {
  if (option.icon === "ice") return '<span class="option-cup ice-cup"></span>';
  if (option.icon === "hot") return '<span class="option-cup hot-cup"></span>';
  return "";
}

function renderDynamicOptions(item) {
  const groups = getVisibleOptionGroups(item);
  modalOptions.hidden = groups.length === 0;
  if (!groups.length) {
    modalOptions.innerHTML = "";
    return;
  }

  modalOptions.innerHTML = groups.map((group) => {
    const gridClass = group.options.length <= 1 ? "one" : group.options.length === 2 ? "two" : "three";
    return `<div class="option-group" data-option-group="${escapeHtml(group.key)}">
      <div class="option-heading">
        <strong>${escapeHtml(group.label)}</strong>
        <span>Select 1</span>
      </div>
      <div class="option-grid ${gridClass}">
        ${group.options.map((option) => {
          const isSelected = selectedOptions[group.key] === option.value;
          const priceText = getOptionPriceText(option, item);
          return `<button class="option-card ${isSelected ? "selected" : ""}" type="button" data-option-group="${escapeHtml(group.key)}" data-option-value="${escapeHtml(option.value)}">
            ${optionIconHtml(option)}
            <strong>${escapeHtml(option.label || option.value)}</strong>
            ${priceText ? `<span class="option-price">${escapeHtml(priceText)}</span>` : ""}
          </button>`;
        }).join("")}
      </div>
    </div>`;
  }).join("");

  syncIceOptions();
}

function getCleanSelectedOptions(item) {
  const visibleGroups = getVisibleOptionGroups(item);
  return visibleGroups.reduce((result, group) => {
    if (selectedOptions[group.key]) result[group.key] = selectedOptions[group.key];
    return result;
  }, {});
}

function formatOptionKey(key) {
  return String(key).replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase());
}

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
    return `<div class="photo-frame ${item.kind || "drink"}" data-fallback="Foto belum tersedia"><img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" loading="lazy" onerror="this.parentElement.classList.add('no-image'); this.remove();" /></div>`;
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
  const brandClass = item.brand ? `brand-${item.brand}` : "";
  const itemBrand = getBrandById(item.brand);
  const sizeBlockNotes = getActiveSizeBlockNotes(item);
  const sizeBlockHtml = sizeBlockNotes.length ? `<span class="sale-note">${sizeBlockNotes.join(" · ")}</span>` : "";
  
  // Ganti teks tombol jika sedang tutup
  const buttonText = store.closed ? "Tutup" : (currentlySoldOut ? "Habis" : "Tambah");
  const buttonHtml = currentlySoldOut 
    ? `<button class="add-button" type="button" disabled>${buttonText}</button>`
    : `<button class="add-button" type="button" data-id="${item.id}">Tambah</button>`;

  return `<article class="menu-card ${item.isNew ? "new" : ""} ${bestSellerClass} ${soldOutClass} ${brandClass}">
    ${menuVisual(item)}
    ${unlockMessage}
    <span class="menu-brand" style="--brand-accent: ${itemBrand.accent}">${escapeHtml(itemBrand.shortLabel)}</span>
    <h3>${escapeHtml(item.name)}</h3>
    ${item.oldPrice ? `<span class="old-price">${rupiah.format(item.oldPrice)}</span>` : ""}
    <span class="price">${rupiah.format(item.price)}</span>
    ${sizeBlockHtml}
    ${buttonHtml}
  </article>`;
}

function normalizeText(value) { return String(value).toLowerCase().trim(); }

function renderMenu(query = "") {
  renderBrandTabs();
  updateBrandHero();
  const store = checkStoreStatus();
  const bannerHtml = store.closed ? `<div class="store-closed-banner"><strong>TOKO SEDANG TUTUP</strong><p>${store.message}</p></div>` : "";
  const normalizedQuery = normalizeText(query);
  const activeBrand = getActiveBrand();
  const activeCategories = getActiveCategories();
  const activeItems = getActiveMenuItems();
  
  // 1. Tambahkan menu "Best Seller" di awal navigasi kategori
  categoryNav.innerHTML = `<a href="#best-seller">🔥 Best Seller</a>` + 
                          activeCategories.map((category) => `<a href="#${category.id}">${escapeHtml(category.title)}</a>`).join("");

  let htmlOutput = bannerHtml;
  let foundItems = new Set(); // Pakai Set agar menu yang muncul 2 kali tidak dihitung dobel saat dicari

  // 2. Buat bagian khusus Best Seller di paling atas
  const bestSellers = activeItems.filter((item) => {
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
  htmlOutput += activeCategories.map((category) => {
    const categoryMatches = normalizeText(category.title).includes(normalizedQuery);
    const items = activeItems.filter((item) => {
      if (item.group !== category.id) return false;
      if (!normalizedQuery) return true;
      return categoryMatches || normalizeText(item.name).includes(normalizedQuery);
    });

    // Urutkan item: yang Best Seller ditaruh di posisi terdepan pada masing-masing kategori
    items.sort((a, b) => (b.isBestSeller === true ? 1 : 0) - (a.isBestSeller === true ? 1 : 0));

    if (items.length === 0) return "";
    items.forEach(item => foundItems.add(item.id));
    
    return `<section class="catalog-section" id="${category.id}">
      <h2>${escapeHtml(category.title)}</h2>
      <div class="menu-grid">${items.map(menuCard).join("")}</div>
    </section>`;
  }).join("");

  catalogContainer.innerHTML = htmlOutput;

  // 4. Update status teks pencarian
  if (normalizedQuery && foundItems.size === 0) {
    catalogContainer.innerHTML = '<p class="no-results">Menu tidak ditemukan. Coba kata lain.</p>';
  }
  
  searchStatus.textContent = normalizedQuery ? 
    `${foundItems.size} menu ${activeBrand.shortLabel} ditemukan untuk "${query}".` : 
    `${activeItems.length} menu ${activeBrand.shortLabel} tersedia.`;
}

function renderCart() {
  const entries = [...cart.values()];
  const subtotal = entries.reduce((total, item) => total + item.price * item.qty, 0);
  const targetCartHtml = entries.length === 0
    ? '<p class="empty">Pilih menu dari price list untuk mulai order.</p>'
    : entries.map((item) => {
        const optionsText = formatOptions(item.options);
        const safeCartKey = encodeURIComponent(item.cartKey);
        return `<div class="cart-line"><div><h3>${item.name}</h3><span>${rupiah.format(item.price)} x ${item.qty}</span>${optionsText ? `<small class="cart-options">${optionsText}</small>` : ""}</div><div class="quantity"><button class="qty-button" type="button" data-action="decrease" data-id="${safeCartKey}">-</button><strong>${item.qty}</strong><button class="qty-button" type="button" data-action="increase" data-id="${safeCartKey}">+</button></div></div>`;
      }).join("");

  if (modalCartItems) modalCartItems.innerHTML = targetCartHtml;
  if (mainCartItems) mainCartItems.innerHTML = targetCartHtml;

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
  return Object.entries(options)
    .filter(([, value]) => Boolean(value))
    .map(([key, value]) => `${formatOptionKey(key)}: ${value}`)
    .join(" / ");
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
    items: entries.map(item => ({ brand: getBrandById(item.brand).label, name: item.name, price: item.price, qty: item.qty, options: item.options })),
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
  return ["food", "chef-martin", "kenangan-toast", "fore-deli"].includes(item.group) || 
         (item.group && item.group.includes("promo")); 
}

function resetSelectedOptions(item) {
  selectedOptions = {};
  ensureSelectedOptions(item);
  renderDynamicOptions(item);
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
  getItemOptionGroups(item).forEach((group) => {
    const selectedValue = options[group.key];
    const selectedOption = group.options.find((option) => option.value === selectedValue);
    if (!selectedOption) return;
    if (typeof selectedOption.price === "number") price = selectedOption.price;
    if (typeof selectedOption.priceDelta === "number") price += selectedOption.priceDelta;
  });
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

  if (!canAddBrandToCart(item)) return;

  // Jika item termasuk kategori makanan langsung tambahkan ke keranjang tanpa membuka modal
  if (isFoodItem(item)) {
    addItem(id);
    renderCart();
    return;
  }

  pendingItemId = id;
  resetSelectedOptions(item);

  const isFood = isFoodItem(item);
  const isBundle = item.group && item.group.includes("promo");
  const itemBrand = getBrandById(item.brand);

  modalTitle.textContent = item.name;
  addConfiguredItemButton.disabled = false;
  selectedDrink.innerHTML = `
    <span>${escapeHtml(itemBrand.label)}</span>
    <strong id="modalProductTitleName">${escapeHtml(item.name)}</strong>
    <span id="modalItemPrice" style="font-size: 1.1rem; color: #d35c19; font-weight: 800; display: block; margin-top: 4px;">Rp0</span>
    <small>${isBundle ? "Tulis request Ice/Sugar untuk paket ini di kolom Catatan saat Checkout." : (isFood ? "Menu makanan langsung masuk keranjang." : "Sesuaikan rasa minuman kamu di bawah ini.")}</small>
  `;

  renderDynamicOptions(item);
  updateModalLivePrice(item);
  openOrderModal();
  setModalStage("customize");
}

function addItem(id) {
  const item = menuItems.find((menuItem) => menuItem.id === id);
  if (!item) return;

  if (!canAddBrandToCart(item)) return;

  const options = isFoodItem(item) ? {} : getCleanSelectedOptions(item);
  const calculatedPrice = calculateItemPrice(item, options);
  const cartKey = `${id}|${JSON.stringify(options)}`;
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
  const brandName = getCartBrandName() || getActiveBrand().label;

  return ["Halo admin kopi.fachrindah, saya mau order jasdor.", `ID Order: ${savedOrder.id}`, `Brand: ${brandName}`, `Nama: ${formData.get("customerName")}`, `WhatsApp: ${formData.get("customerPhone")}`, `Lokasi outlet: ${formData.get("customerAddress")}`, "", "Pesanan:", orderLines, "", `Total bayar sementara: ${rupiah.format(subtotal)}`, "Catatan harga: jika harga outlet berbeda, mohon konfirmasi selisihnya dulu sebelum pesanan diproses.", `Link bukti transfer: ${savedOrder.proof.url}`, `Catatan customer: ${formData.get("orderNote") || "-"}`].join("\n");
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

function renderTestimonials() {
  if (!testimonialGallery) return;
  const images = Array.isArray(window.TESTIMONIAL_IMAGES) && window.TESTIMONIAL_IMAGES.length
    ? window.TESTIMONIAL_IMAGES
    : fallbackTestimonialImages;

  testimonialGallery.dataset.source = images === fallbackTestimonialImages ? "fallback" : "manifest";
  testimonialGallery.dataset.count = String(images.length);
  testimonialGallery.innerHTML = images.map((src, index) => (
    `<img src="${src}" alt="Testimoni WhatsApp ${index + 1}" loading="lazy" />`
  )).join("");
}

modalOptions.addEventListener("click", (event) => {
  const button = event.target.closest("[data-option-value]");
  if (!button || button.disabled || !pendingItemId) return;

  const item = menuItems.find((menuItem) => menuItem.id === pendingItemId);
  if (!item) return;

  selectedOptions[button.dataset.optionGroup] = button.dataset.optionValue;
  renderDynamicOptions(item);
  updateModalLivePrice(item);
});

if (brandTabs) {
  brandTabs.addEventListener("click", (event) => {
    const button = event.target.closest("[data-brand]");
    if (!button || button.dataset.brand === activeBrandId) return;
    activeBrandId = button.dataset.brand;
    menuSearch.value = "";
    renderMenu();
  });
}

document.addEventListener("click", (event) => {
  const closeTarget = event.target.closest("[data-close-modal]");
  if (closeTarget) { closeOrderModal(); return; }

  const btnGPS = event.target.closest("#btnGPS");
  if (btnGPS) {
    const searchCityInput = document.querySelector("#searchCityInput");
    const gpsStatus = document.querySelector("#gpsStatus");
    const queryCity = searchCityInput.value.trim();
    const mapsBrandName = getCartBrandName() || getActiveBrand().label;
    
    if (queryCity.length > 0) {
      gpsStatus.textContent = "Membuka Maps...";
      window.open("https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(`${queryCity} ${mapsBrandName}`), "_blank");
    } else {
      if (!navigator.geolocation) return;
      btnGPS.disabled = true;
      navigator.geolocation.getCurrentPosition((pos) => {
        window.open("https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(mapsBrandName) + "&center=" + pos.coords.latitude + "," + pos.coords.longitude + "&zoom=15", "_blank");
        btnGPS.disabled = false;
      }, () => { btnGPS.disabled = false; }, { timeout: 6000 });
    }
    return;
  }

  const addButton = event.target.closest(".add-button[data-id]");
  if (addButton) { selectItemForOptions(addButton.dataset.id); return; }

  const quantityButton = event.target.closest("[data-action]");
  if (quantityButton) {
    const cartKey = quantityButton.dataset.id ? decodeURIComponent(quantityButton.dataset.id) : "";
    updateQuantity(cartKey, quantityButton.dataset.action);
  }
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
  
  // 4. Deteksi apakah keranjang berisi brand Fore Coffee
  const isForeCoffee = getCartBrandId() === "fore";

  // 5. Izinkan checkout JIKA: Total >= 2 ATAU ada Bundling ATAU brand-nya Fore Coffee
  if (totalQty >= 2 || hasBundling || isForeCoffee) { 
    setModalStage("checkout"); 
  } else {
    alert(`Pesanan kamu baru ${totalQty} menu. Minimal pemesanan adalah 2 menu satuan (Kecuali untuk menu Fore Coffee atau pembelian Paket Promo / Bundling).`);
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

if (reviewForm) {
  reviewForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(reviewForm);
    renderSavedReview({ name: formData.get("reviewName"), rating: formData.get("reviewRating"), text: formData.get("reviewText") });
    reviewForm.reset();
  });
}

backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

renderTestimonials();
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

// ==========================================
// FITUR POP-UP JASDOR & CARA ORDER (2 TOMBOL)
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  // Ambil kedua ID tombol yang baru
  const btnJasdor = document.getElementById('btnJasdor');
  const btnCaraOrder = document.getElementById('btnCaraOrder');
  
  const infoModal = document.getElementById('infoModal');
  const closeInfoBtn = document.getElementById('closeInfoBtn');

  // Fungsi praktis untuk membuka modal
  const openModal = () => {
    if (infoModal) infoModal.classList.remove('hidden');
  };

  // Pasang sensor klik ke kedua tombol!
  if (btnJasdor) btnJasdor.addEventListener('click', openModal);
  if (btnCaraOrder) btnCaraOrder.addEventListener('click', openModal);

  // Tombol silang untuk menutup
  if (closeInfoBtn) {
    closeInfoBtn.addEventListener('click', () => {
      infoModal.classList.add('hidden');
    });
  }

  // Menutup saat mengklik area gelap di luar kotak
  if (infoModal) {
    infoModal.addEventListener('click', (event) => {
      if (event.target === infoModal) {
        infoModal.classList.add('hidden');
      }
    });
  }
});// ==========================================
// FITUR POP-UP JASDOR & CARA ORDER (2 TOMBOL)
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  // Ambil kedua ID tombol yang baru
  const btnJasdor = document.getElementById('btnJasdor');
  const btnCaraOrder = document.getElementById('btnCaraOrder');
  
  const infoModal = document.getElementById('infoModal');
  const closeInfoBtn = document.getElementById('closeInfoBtn');

  // Fungsi praktis untuk membuka modal
  const openModal = () => {
    if (infoModal) infoModal.classList.remove('hidden');
  };

  // Pasang sensor klik ke kedua tombol!
  if (btnJasdor) btnJasdor.addEventListener('click', openModal);
  if (btnCaraOrder) btnCaraOrder.addEventListener('click', openModal);

  // Tombol silang untuk menutup
  if (closeInfoBtn) {
    closeInfoBtn.addEventListener('click', () => {
      infoModal.classList.add('hidden');
    });
  }

  // Menutup saat mengklik area gelap di luar kotak
  if (infoModal) {
    infoModal.addEventListener('click', (event) => {
      if (event.target === infoModal) {
        infoModal.classList.add('hidden');
      }
    });
  }
});

// ==========================================
// REGISTRASI SERVICE WORKER (MESIN PWA)
// ==========================================
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(registration => {
        console.log('Mesin PWA berhasil jalan!', registration.scope);
      })
      .catch(error => {
        console.log('Mesin PWA gagal:', error);
      });
  });
}

// ==========================================
// MUNCULKAN TOMBOL INSTALL APLIKASI (PWA)
// ==========================================
let deferredPrompt;
const installAppContainer = document.getElementById('installAppContainer');
const btnInstallApp = document.getElementById('btnInstallApp');
const iosInstallModal = document.getElementById('iosInstallModal');
const closeIosInstallModalButton = document.getElementById('closeIosInstallModal');

function isIosDevice() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  return /iphone|ipad|ipod/i.test(userAgent) && !window.MSStream;
}

function showIosInstallModal() {
  if (!iosInstallModal) return;
  iosInstallModal.classList.remove('hidden');
  document.body.classList.add('modal-open');
}

function closeIosInstallModal() {
  if (!iosInstallModal) return;
  iosInstallModal.classList.add('hidden');
  document.body.classList.remove('modal-open');
}

if (isIosDevice() && installAppContainer) {
  installAppContainer.classList.remove('hidden');
}

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  if (installAppContainer) {
    installAppContainer.classList.remove('hidden');
  }
});

if (btnInstallApp) {
  btnInstallApp.addEventListener('click', async () => {
    if (installAppContainer) {
      installAppContainer.classList.add('hidden');
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`Pilihan user: ${outcome}`);
      deferredPrompt = null;
      return;
    }

    if (isIosDevice()) {
      showIosInstallModal();
      return;
    }

    alert('Perangkat Anda tidak mendukung install otomatis. Silakan buka menu browser dan pilih Add to Home Screen.');
  });
}

if (closeIosInstallModalButton) {
  closeIosInstallModalButton.addEventListener('click', closeIosInstallModal);
}

if (iosInstallModal) {
  iosInstallModal.addEventListener('click', (event) => {
    if (event.target === iosInstallModal) {
      closeIosInstallModal();
    }
  });
}
