const firebaseConfig = {
  apiKey: "AIzaSyBButqHaJHOrEg2Zi0uddwb6XI6_iCmnBs",
  authDomain: "couddaw.firebaseapp.com",
  databaseURL: "https://couddaw-default-rtdb.firebaseio.com",
  projectId: "couddaw",
  storageBucket: "couddaw.appspot.com",
  messagingSenderId: "648914779023",
  appId: "1:648914779023:web:f192ccd782caa50a6c69fa"
};
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const domain = 'www.kn-goodcar.com';
const token = 'bb70cb008199a94b83c98df0e45ada67';
const productsPerPage = 8;
let allProducts = [];
let filteredProducts = [];
let currentPage = 1;

const query = `{
  products(first: 100, sortKey: CREATED_AT, reverse: true) {
    edges {
      node {
        title
        description
        handle
        createdAt
        images(first: 1) { edges { node { url } } }
        variants(first: 1) { edges { node { price { amount } } } }
      }
    }
  }
}`;

async function fetchViews(handle) {
  const snapshot = await database.ref('views/' + handle).get();
  return snapshot.exists() ? snapshot.val() : 0;
}
async function increaseView(handle) {
  const ref = database.ref('views/' + handle);
  const snapshot = await ref.get();
  ref.set(snapshot.exists() ? snapshot.val() + 1 : 1);
}

function applyFilters() {
  const brand = document.getElementById('filter-brand').value.toLowerCase();
  filteredProducts = brand
    ? allProducts.filter(p => p.node.title.toLowerCase().includes(brand))
    : allProducts;
  currentPage = 1;
  renderProducts();
  renderPagination();
}

async function renderProducts() {
  const container = document.getElementById('product-list');
  container.innerHTML = '';
  const list = filteredProducts.length ? filteredProducts : allProducts;
  const start = (currentPage - 1) * productsPerPage;
  const end = start + productsPerPage;
  const items = list.slice(start, end);

  for (const { node } of items) {
    const img = node.images.edges[0]?.node?.url || '';
    const title = node.title || 'ไม่ระบุชื่อสินค้า';
    const desc = node.description?.substring(0, 100) || '';
    const price = node.variants.edges[0]?.node?.price?.amount || 'ไม่ระบุ';
    const handle = node.handle;
    const views = await fetchViews(handle);

    const div = document.createElement('div');
    div.className = 'product';
    div.innerHTML = `
      <img src="${img}" alt="${title}">
      <div style="padding:12px;flex-grow:1;">
        <h2>${title}</h2>
        <p>${desc}</p>
        <div style="font-weight:bold;color:#e53935;margin-top:8px;">฿${parseFloat(price).toLocaleString()}</div>
        <div class="views">
          <span class="eye-icon">👁️</span> เข้าชม <span>${views}</span> ครั้ง
        </div>
      </div>
      <a href="https://${domain}/products/${handle}" target="_blank" onclick="increaseView('${handle}')">
        ดูรายละเอียด
      </a>
    `;
    container.appendChild(div);
  }
}

function renderPagination() {
  const pagination = document.getElementById('pagination');
  const list = filteredProducts.length ? filteredProducts : allProducts;
  const totalPages = Math.ceil(list.length / productsPerPage);

  if (totalPages <= 1) { pagination.innerHTML = ''; return; }

  let html = '';

  if (currentPage > 1) {
    html += `<button onclick="gotoPage(${currentPage - 1})" style="padding:8px 14px;border-radius:7px;">«</button>`;
  }
  for (let i = 1; i <= totalPages; i++) {
    html += `<button onclick="gotoPage(${i})" style="padding:8px 14px;border-radius:7px;${i===currentPage?'background:#2196f3;color:#fff;font-weight:bold;':''}">${i}</button>`;
  }
  if (currentPage < totalPages) {
    html += `<button onclick="gotoPage(${currentPage + 1})" style="padding:8px 14px;border-radius:7px;">»</button>`;
  }

  pagination.innerHTML = html;
}

function gotoPage(page) {
  currentPage = page;
  renderProducts();
  renderPagination();
}

async function fetchProducts() {
  try {
    const response = await fetch(`https://${domain}/api/2023-07/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': token
      },
      body: JSON.stringify({ query })
    });

    const result = await response.json();
    allProducts = result?.data?.products?.edges || [];
    filteredProducts = [];
    renderProducts();
    renderPagination();
  } catch (err) {
    console.error('โหลดข้อมูลล้มเหลว:', err);
  }
}

window.onload = fetchProducts;