// Data Menu - GANTI NAMA FILE SESUAI FOTOMU
const menuData = {
  bestSeller: [
    { id: 1, name: "Ayam Penyet", price: 20000, desc: "Ayam goreng tepung dipenyet di sambal bawang pedas. Gurih, renyah, mantap!", image: "ayam penyet.jpeg" },
    { id: 2, name: "Boci Hot", price: 15000, desc: "Pentol aci kenyal kuah pedas gurih. Mirip cilok tapi beda bumbu. Topping cuanki & siomay. Maknyus!", image: "boci.jpeg" },
    { id: 3, name: "Matcha Latte", price: 28000, desc: "Teh hijau Jepang + susu. Pahit ringan, creamy, warna hijau cantik.", image: "matcha latte.jpeg" },
    { id: 4, name: "Smoothies Mangga", price: 25000, desc: "Mangga + es + yogurt/susu, diblender. Manis, asam, segar.", image: "smoothies mangga.jpeg" }
  ],
  specials: [
    { id: 5, name: "Tteokbokki Pedas", price: 18000, desc: " Camilan tepung beras kenyal dari Korea, saus merah pedas manis.", image: "tteokbokki pedas.jpeg" },
    { id: 6, name: "Lemon Tea", price: 15000, desc: "Teh lemon dingin dengan irisan lemon segar", image: "Lemon Tea.jpeg" },
    { id: 7, name: "Nasi Goreng Hot", price: 20000, desc: "Nasi goreng + cabai rawit. Pedas merata, pakai telur & kerupuk.", image: "nasi goreng hot.jpeg" },
    { id: 8, name: "Es Dawet", price: 10000, desc: "Cendol + santan + gula aren + es. Manis legit, gurih, segar.", image: "Es Dawet.jpeg" }
  ]
};

let cart = [];

function renderBestSellers() {
  const container = document.getElementById('bestSellerGrid');
  if (!container) return;
  container.innerHTML = '';
  menuData.bestSeller.forEach(item => {
    const card = createCard(item);
    container.appendChild(card);
  });
}

function renderSpecials() {
  const container = document.getElementById('specialGrid');
  if (!container) return;
  container.innerHTML = '';
  menuData.specials.forEach(item => {
    const card = createCard(item);
    container.appendChild(card);
  });
}

function createCard(item) {
  const div = document.createElement('div');
  div.className = 'card';
  
  // Buat elemen img terpisah untuk mengecek error
  const img = document.createElement('img');
  img.className = 'card-img';
  img.src = item.image;
  img.alt = item.name;
  img.loading = 'lazy';
  img.onerror = function() {
    this.src = 'https://placehold.co/300x200?text=' + encodeURIComponent(item.name);
    this.onerror = null;
  };
  
  div.innerHTML = `
    <div class="card-content">
      <div class="card-title">${item.name}</div>
      <div class="card-desc">${item.desc}</div>
      <div class="price">Rp ${item.price.toLocaleString()}</div>
      <button class="order-btn" data-id="${item.id}" data-name="${item.name}" data-price="${item.price}">
        <i class="fas fa-plus-circle"></i> Tambah ke Pesanan
      </button>
    </div>
  `;
  
  // Masukkan gambar ke awal card
  div.insertBefore(img, div.firstChild);
  
  const btn = div.querySelector('.order-btn');
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const id = parseInt(btn.dataset.id);
    const name = btn.dataset.name;
    const price = parseInt(btn.dataset.price);
    addToCart(id, name, price);
  });
  return div;
}

function addToCart(id, name, price) {
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id, name, price, quantity: 1 });
  }
  updateCartUI();
  showTemporaryNotification(`${name} ditambahkan ke keranjang!`);
}

function updateCartUI() {
  const cartCountSpan = document.getElementById('cartCount');
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartCountSpan) cartCountSpan.innerText = totalItems;
  if (document.getElementById('cartModal').style.display === 'flex') {
    renderCartModal();
  }
}

function renderCartModal() {
  const cartItemsDiv = document.getElementById('cartItemsList');
  const totalSpan = document.getElementById('cartTotalPrice');
  if (!cartItemsDiv) return;
  if (cart.length === 0) {
    cartItemsDiv.innerHTML = '<p style="padding: 16px 0;">Keranjang kosong, yuk pilih menu favoritmu ✨</p>';
    if(totalSpan) totalSpan.innerText = 'Rp 0';
    return;
  }
  let total = 0;
  let html = '';
  cart.forEach(item => {
    const subtotal = item.price * item.quantity;
    total += subtotal;
    html += `
      <div class="cart-item">
        <div><strong>${item.name}</strong> x ${item.quantity}</div>
        <div>Rp ${subtotal.toLocaleString()}</div>
      </div>
    `;
  });
  cartItemsDiv.innerHTML = html;
  if(totalSpan) totalSpan.innerText = `Rp ${total.toLocaleString()}`;
}

function clearCart() {
  cart = [];
  updateCartUI();
  renderCartModal();
  showTemporaryNotification('Keranjang dikosongkan');
}

function showTemporaryNotification(msg) {
  const notif = document.createElement('div');
  notif.innerText = msg;
  notif.style.position = 'fixed';
  notif.style.bottom = '20px';
  notif.style.left = '50%';
  notif.style.transform = 'translateX(-50%)';
  notif.style.background = '#2e241f';
  notif.style.color = 'white';
  notif.style.padding = '12px 24px';
  notif.style.borderRadius = '60px';
  notif.style.zIndex = '999';
  notif.style.fontWeight = '500';
  notif.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
  document.body.appendChild(notif);
  setTimeout(() => notif.remove(), 1700);
}

function checkoutToWhatsApp() {
  if (cart.length === 0) {
    alert('Keranjang masih kosong! Tambahkan menu dulu ya 🍔');
    return;
  }
  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);
  let subtotal = 0;
  let itemsText = '';
  cart.forEach(item => {
    const itemSub = item.price * item.quantity;
    subtotal += itemSub;
    itemsText += `- ${item.name} (${item.quantity}x) : Rp ${itemSub.toLocaleString()}\n`;
  });
  let totalBayar = subtotal;
  let diskonText = '';
  if (totalItems >= 2) {
    const diskon = Math.floor(subtotal * 0.2);
    totalBayar = subtotal - diskon;
    diskonText = `\n✨ Diskon 20% (PEDASMANIS20) : -Rp ${diskon.toLocaleString()}`;
  } else {
    diskonText = `\n⚠️ Tambah minimal 2 item untuk dapat diskon 20%!`;
  }
  const message = `Halo PedasManis! Saya ingin memesan:\n${itemsText}\nSubtotal: Rp ${subtotal.toLocaleString()}${diskonText}\nTotal yang dibayar: Rp ${totalBayar.toLocaleString()}\n\nMohon diproses, terima kasih!`;
  const encodedMsg = encodeURIComponent(message);
  const waNumber = '6285853784113';
  window.open(`https://wa.me/${waNumber}?text=${encodedMsg}`, '_blank');
}

const modal = document.getElementById('cartModal');
const cartIconBtn = document.getElementById('cartIcon');
const closeModalBtn = document.getElementById('closeModalBtn');
const checkoutWaModalBtn = document.getElementById('checkoutWaBtn');
const clearCartBtn = document.getElementById('clearCartBtn');

function openModal() {
  renderCartModal();
  modal.style.display = 'flex';
}
function closeModal() {
  modal.style.display = 'none';
}
cartIconBtn.addEventListener('click', openModal);
closeModalBtn.addEventListener('click', closeModal);
window.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});
if (checkoutWaModalBtn) checkoutWaModalBtn.addEventListener('click', () => {
  checkoutToWhatsApp();
  closeModal();
});
if (clearCartBtn) clearCartBtn.addEventListener('click', () => {
  clearCart();
  renderCartModal();
});

function init() {
  renderBestSellers();
  renderSpecials();
  updateCartUI();
}

init();