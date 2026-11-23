// ===== MA'LUMOTLAR =====
const dishes = [
  { id: 1, name: "Mega Osh", price: 85000, img: "images/mega-osh.jpg", emoji: "🍚",
    desc: "Imzo taomimiz: qo‘y go‘shti, no‘xat, sariq va ziravorlar bilan.", badge: "Imzo taom" },
  { id: 2, name: "Toshkent oshi", price: 75000, img: "images/toshkent-oshi.jpg", emoji: "🍚",
    desc: "Klassik Toshkent uslubidagi, ziravorli va xushbo‘y osh.", badge: "Klassika" },
  { id: 3, name: "Samarqand oshi", price: 80000, img: "images/samarqand-oshi.jpg", emoji: "🍚",
    desc: "Samarqand retsepti bo‘yicha, mol go‘shti va yalpiz bilan.", badge: "" },
  { id: 4, name: "Choyxona oshi", price: 70000, img: "images/choyxona-oshi.jpg", emoji: "🍛",
    desc: "An’anaviy choyxona oshi, yumshoq go‘sht va sabzi bilan.", badge: "" },
  { id: 5, name: "Qozon kabob", price: 95000, img: "images/qozon-kabob.jpg", emoji: "🍖",
    desc: "Qozonda pishirilgan, sharbatli go‘sht va sabzavotlar.", badge: "Mashhur" },
  { id: 6, name: "Manti", price: 60000, img: "images/manti.jpg", emoji: "🥟",
    desc: "Qo‘lda yopilgan xamirda, mol go‘shti va piyoz bilan (6 dona).", badge: "" },
  { id: 7, name: "Norin", price: 65000, img: "images/norin.jpg", emoji: "🍜",
    desc: "Yupqa xamir va qazi bilan tayyorlangan milliy norin.", badge: "" },
  { id: 8, name: "Shashlik", price: 15000, img: "images/shashlik.jpg", emoji: "🍢",
    desc: "Mangalda pishirilgan, sho‘rva bilan xushbo‘y shashlik (1 dona).", badge: "" },
  { id: 9, name: "Lag‘mon", price: 55000, img: "images/lagmon.jpg", emoji: "🍝",
    desc: "Qo‘lda cho‘zilgan lag‘mon, sabzavotli sousda.", badge: "" },
  { id: 10, name: "Somsa", price: 12000, img: "images/somsa.jpg", emoji: "🥐",
    desc: "Tandirda pishirilgan, qatlamli xamir va go‘shtli somsa (1 dona).", badge: "" }
];

let cart = [];

// ===== YORDAMCHI =====
const $ = (id) => document.getElementById(id);
const fmt = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " so‘m";

function toast(msg) {
  const t = $("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => t.classList.remove("show"), 2600);
}

// Rasm topilmasa: rasm yashiriladi, zaxira (emoji + nom) ko‘rinadi
document.addEventListener("error", (e) => {
  if (e.target.tagName === "IMG") e.target.classList.add("broken");
}, true);

// ===== MENYU RENDER =====
function renderMenu() {
  $("dishes").innerHTML = dishes.map((d, i) => `
    <article class="dish" style="animation-delay:${i * 0.08}s">
      <div class="dish-img">
        <span class="img-fallback"><span class="fb-emoji">${d.emoji}</span>${d.name}</span>
        <img src="${d.img}" alt="${d.name}" loading="lazy">
        ${d.badge ? `<span class="badge">${d.badge}</span>` : ""}
      </div>
      <div class="dish-body">
        <h3>${d.name}</h3>
        <p>${d.desc}</p>
        <div class="dish-foot">
          <span class="price">${fmt(d.price)}</span>
          <button class="add-btn" data-id="${d.id}">+ Savatga</button>
        </div>
      </div>
    </article>`).join("");

  $("oDish").innerHTML = `<option value="">Taomni tanlang</option>` +
    dishes.map(d => `<option value="${d.id}">${d.name}</option>`).join("");
}

// ===== SAVAT =====
function addToCart(id, btn) {
  const item = cart.find(c => c.id === id);
  if (item) item.qty++;
  else cart.push({ id, qty: 1 });

  if (btn) {
    btn.classList.remove("added");
    void btn.offsetWidth; // animatsiyani qayta ishga tushirish
    btn.classList.add("added");
  }
  updateCart();
  toast(`${dishes.find(d => d.id === id).name} savatga qo‘shildi`);
}

function changeQty(id, delta) {
  const item = cart.find(c => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(c => c.id !== id);
  updateCart();
}

function removeItem(id) {
  cart = cart.filter(c => c.id !== id);
  updateCart();
}

function updateCart() {
  const list = $("cartItems");

  if (cart.length === 0) {
    list.innerHTML = `<p class="empty">Savat bo‘sh.<br>Menyudan taom tanlang 🍚</p>`;
  } else {
    list.innerHTML = cart.map(c => {
      const d = dishes.find(x => x.id === c.id);
      return `
        <div class="cart-item">
          <div class="thumb">
            <span class="img-fallback"><span class="fb-emoji">${d.emoji}</span></span>
            <img src="${d.img}" alt="${d.name}">
          </div>
          <div class="ci-info">
            <h4>${d.name}</h4>
            <small>${fmt(d.price)}</small>
            <div class="qty">
              <button data-act="dec" data-id="${d.id}" aria-label="Kamaytirish">−</button>
              <span>${c.qty}</span>
              <button data-act="inc" data-id="${d.id}" aria-label="Ko‘paytirish">+</button>
            </div>
          </div>
          <div class="ci-side">
            <strong>${fmt(d.price * c.qty)}</strong><br>
            <button class="remove" data-act="rm" data-id="${d.id}" aria-label="O‘chirish">🗑</button>
          </div>
        </div>`;
    }).join("");
  }

  const total = cart.reduce((sum, c) => {
    const d = dishes.find(x => x.id === c.id);
    return sum + d.price * c.qty;
  }, 0);

  $("cartTotal").textContent = fmt(total);
  $("cartCount").textContent = cart.reduce((s, c) => s + c.qty, 0);
}

function openCart() {
  $("cart").classList.add("open");
  $("overlay").classList.add("open");
}

function closeCart() {
  $("cart").classList.remove("open");
  $("overlay").classList.remove("open");
}

// ===== HODISALAR =====
document.addEventListener("DOMContentLoaded", () => {
  renderMenu();
  updateCart();
  initReveal();
  initCounters();

  // Menyu: "Savatga" tugmalari
  $("dishes").addEventListener("click", (e) => {
    const btn = e.target.closest(".add-btn");
    if (btn) addToCart(Number(btn.dataset.id), btn);
  });

  // Savat ichidagi +, −, o‘chirish
  $("cartItems").addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const id = Number(btn.dataset.id);
    if (btn.dataset.act === "inc") changeQty(id, 1);
    if (btn.dataset.act === "dec") changeQty(id, -1);
    if (btn.dataset.act === "rm") removeItem(id);
  });

  $("cartBtn").addEventListener("click", openCart);
  $("closeCart").addEventListener("click", closeCart);
  $("overlay").addEventListener("click", closeCart);

  // Savatdan buyurtmani rasmiylashtirish
  $("checkoutForm").addEventListener("submit", (e) => {
    e.preventDefault();
    if (cart.length === 0) return toast("Savat bo‘sh!");
    const name = $("cName").value.trim();
    const total = $("cartTotal").textContent;
    toast(`Rahmat, ${name}! Buyurtmangiz qabul qilindi. Jami: ${total}`);
    cart = [];
    updateCart();
    e.target.reset();
    closeCart();
  });

  // Aloqa bo‘limidagi buyurtma formasi
  $("orderForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const dish = dishes.find(d => d.id === Number($("oDish").value));
    if (!dish) return toast("Iltimos, taomni tanlang");
    toast(`${$("oName").value}, ${$("oQty").value} ta ${dish.name} buyurtmangiz qabul qilindi!`);
    e.target.reset();
    $("oQty").value = 1;
  });

  // Galereya lightbox
  document.querySelectorAll(".gallery img").forEach(img => {
    img.addEventListener("click", () => {
      if (img.classList.contains("broken")) return;
      $("lbImg").src = img.src;
      $("lightbox").classList.add("open");
    });
  });
  const closeLb = () => $("lightbox").classList.remove("open");
  $("lbClose").addEventListener("click", closeLb);
  $("lightbox").addEventListener("click", (e) => {
    if (e.target.id === "lightbox") closeLb();
  });

  // Burger menyu
  $("burger").addEventListener("click", () => {
    $("burger").classList.toggle("open");
    $("nav").classList.toggle("open");
  });
  document.querySelectorAll(".nav a").forEach(a =>
    a.addEventListener("click", () => {
      $("burger").classList.remove("open");
      $("nav").classList.remove("open");
    }));

  // Scroll: header va faol havola
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
});

function onScroll() {
  $("header").classList.toggle("scrolled", window.scrollY > 50);

  const sections = ["home", "menu", "about", "gallery", "contact"];
  let current = "home";
  sections.forEach(id => {
    if (window.scrollY >= $(id).offsetTop - 200) current = id;
  });

  document.querySelectorAll(".nav a").forEach(a =>
    a.classList.toggle("active", a.getAttribute("href") === "#" + current));
}

// Scroll animatsiyasi
function initReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add("show");
        obs.unobserve(en.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll(".reveal").forEach(el => obs.observe(el));
}

// Statistika raqamlari animatsiyasi
function initCounters() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target;
      const target = Number(el.dataset.count);
      let n = 0;
      const step = Math.max(1, Math.ceil(target / 60));
      const timer = setInterval(() => {
        n += step;
        if (n >= target) { n = target; clearInterval(timer); }
        el.textContent = n;
      }, 25);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll("[data-count]").forEach(c => obs.observe(c));
}