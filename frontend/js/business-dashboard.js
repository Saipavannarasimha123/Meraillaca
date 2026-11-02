/* business-dashboard.js – Mera Ilaka */

/* ── Sample Data ── */
var biz = {
  name:"Green Leaf Restaurant", type:"Multi-Cuisine Restaurant", category:"food",
  icon:"🍽️", phone:"91234 56789", whatsapp:"91234 56789", email:"greenleaf@email.com",
  address:"Block B, Ground Floor", hours:"11 AM – 11 PM", days:"Mon – Sun",
  desc:"Authentic multi-cuisine dining. Family-friendly with a kids menu.",
  website:"", social:"", isOpen:true
};

var products = [
  {id:1, name:"Butter Chicken",   price:280,  category:"Main Course", desc:"Creamy tomato curry, served with naan.",       availability:"available"},
  {id:2, name:"Veg Biryani",      price:180,  category:"Rice",        desc:"Aromatic basmati with seasonal vegetables.",   availability:"available"},
  {id:3, name:"Paneer Tikka",     price:220,  category:"Starters",    desc:"Tandoor-grilled cottage cheese.",              availability:"available"},
  {id:4, name:"Masala Chai",      price:40,   category:"Beverages",   desc:"Classic spiced tea.",                          availability:"available"},
  {id:5, name:"Gulab Jamun",      price:80,   category:"Desserts",    desc:"Soft milk dumplings in rose syrup.",           availability:"out_of_stock"},
  {id:6, name:"Catering Package", price:4500, category:"Catering",   desc:"Full catering setup for 50 people.",           availability:"preorder"}
];

var orders = [
  {id:"ORD-001", customer:"Rahul Sharma",  item:"Butter Chicken x2",  date:"10 Oct 2026", status:"pending"},
  {id:"ORD-002", customer:"Priya Mehta",   item:"Catering Package",   date:"09 Oct 2026", status:"confirmed"},
  {id:"ORD-003", customer:"Suresh Yadav",  item:"Veg Biryani x3",     date:"08 Oct 2026", status:"completed"},
  {id:"ORD-004", customer:"Anita Singh",   item:"Masala Chai x4",     date:"07 Oct 2026", status:"completed"},
  {id:"ORD-005", customer:"Vikram Kapoor", item:"Paneer Tikka x1",    date:"06 Oct 2026", status:"cancelled"},
  {id:"ORD-006", customer:"Deepa Nair",    item:"Catering Package",   date:"05 Oct 2026", status:"pending"}
];

var reviews = [
  {id:1, name:"Rahul S.",  date:"9 Oct 2026",  stars:5, text:"Amazing food! Butter Chicken was perfect. Highly recommend.",                reply:"Thank you Rahul! Visit again 😊"},
  {id:2, name:"Priya M.",  date:"7 Oct 2026",  stars:4, text:"Good food but delivery was a bit late. Biryani was great.",                  reply:""},
  {id:3, name:"Suresh Y.", date:"4 Oct 2026",  stars:5, text:"Best in the colony! Catering for our anniversary was a huge hit.",           reply:"So happy to be part of your day! 🎉"},
  {id:4, name:"Kiran P.",  date:"1 Oct 2026",  stars:3, text:"Decent food. Portion sizes could be larger for the price.",                  reply:""}
];

var promotions = [
  {id:1, title:"Eid Special – 20% Off",   desc:"20% off all main courses. Dine-in and takeaway.",      discount:"20% off",    type:"discount",  expiry:"15 Oct 2026", views:142},
  {id:2, title:"Weekend Family Combo",    desc:"Order for 4, get a complimentary dessert plate.",       discount:"Free dessert",type:"buy1get1",   expiry:"31 Oct 2026", views:89}
];

var editingProductId = null;

/* ── Init ── */
window.onload = function () {
  if (!sessionStorage.getItem("loggedUser")) { window.location.href = "login.html"; return; }
  var user = JSON.parse(sessionStorage.getItem("loggedUser"));
  setText("navUser", "👤 " + user.name + " (" + user.role + ")");
  startClock();
  loadBizData();
  renderProducts(products);
  renderOrders(orders);
  renderReviews();
  renderPromos();
  renderRecentInquiries();
  renderRecentReviews();
  renderChart();
  document.getElementById("bizStatusToggle").addEventListener("change", function () { updateToggleText(this.checked); });
};

/* ── Auth ── */
function logout() { if (confirm("Logout?")) { sessionStorage.removeItem("loggedUser"); window.location.href = "login.html"; } }

/* ── Tab Switch ── */
function showTab(id) {
  document.querySelectorAll(".tab-content").forEach(function(t){ t.classList.remove("active"); });
  document.querySelectorAll(".sidebar a").forEach(function(a){ a.classList.remove("active"); });
  var tab = document.getElementById("tab-" + id);
  if (tab) tab.classList.add("active");
  document.querySelectorAll(".sidebar a").forEach(function(a){
    if (a.getAttribute("onclick") === "showTab('" + id + "')") a.classList.add("active");
  });
}

/* ── Load Business Data ── */
function loadBizData() {
  setText("bizWelcomeName",  biz.name);
  setText("bizWelcomeType",  cap(biz.category) + " • " + biz.hours);
  setText("bizLogoOverview", biz.icon);
  var pill = document.getElementById("bizStatusPill");
  if (pill) { pill.textContent = biz.isOpen ? "🟢 Open Now" : "🔴 Closed"; pill.className = "status-pill " + (biz.isOpen ? "open" : "closed"); }
  ["profileName","profileType","profilePhone","profileWhatsapp","profileEmail",
   "profileAddress","profileHours","profileDays","profileDesc","profileWebsite","profileSocial"]
    .forEach(function(f){ setVal(f, biz[f.replace("profile","").toLowerCase()]); });
  setVal("profileName", biz.name); setVal("profileType", biz.type);
  setVal("profilePhone", biz.phone); setVal("profileWhatsapp", biz.whatsapp);
  setVal("profileEmail", biz.email); setVal("profileAddress", biz.address);
  setVal("profileHours", biz.hours); setVal("profileDays", biz.days);
  setVal("profileDesc", biz.desc); setVal("profileWebsite", biz.website); setVal("profileSocial", biz.social);
  document.getElementById("profileCategory").value = biz.category;
  document.getElementById("bizStatusToggle").checked = biz.isOpen;
  updateToggleText(biz.isOpen);
}

function updateToggleText(open) {
  var el = document.getElementById("statusToggleText");
  if (!el) return;
  el.textContent = open ? "🟢 Open" : "🔴 Closed";
  el.style.color  = open ? "#2e7d32" : "#c62828";
}

/* ── Profile Save ── */
function saveProfile() {
  var name = getVal("profileName").trim();
  if (!name) { toast("⚠️ Business name required."); return; }
  biz.name = name; biz.type = getVal("profileType"); biz.phone = getVal("profilePhone");
  biz.whatsapp = getVal("profileWhatsapp"); biz.email = getVal("profileEmail");
  biz.address = getVal("profileAddress"); biz.hours = getVal("profileHours");
  biz.days = getVal("profileDays"); biz.desc = getVal("profileDesc");
  biz.website = getVal("profileWebsite"); biz.social = getVal("profileSocial");
  biz.category = document.getElementById("profileCategory").value;
  biz.isOpen   = document.getElementById("bizStatusToggle").checked;
  setText("bizWelcomeName", biz.name); setText("bizWelcomeType", cap(biz.category) + " • " + biz.hours);
  var pill = document.getElementById("bizStatusPill");
  if (pill) { pill.textContent = biz.isOpen ? "🟢 Open Now" : "🔴 Closed"; pill.className = "status-pill " + (biz.isOpen ? "open":"closed"); }
  toast("✅ Profile saved!");
}

function resetProfileForm() { loadBizData(); toast("↩️ Reset to saved values."); }

/* ── Products ── */
var avlLabel = { available:"✅ Available", out_of_stock:"❌ Out of Stock", preorder:"📋 Pre-order" };

function renderProducts(list) {
  var g = document.getElementById("productsGrid"); if (!g) return;
  if (!list.length) { g.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:50px;color:#aaa;">😕 No products.</div>'; return; }
  g.innerHTML = list.map(function(p){
    return '<div class="product-card">' +
      '<div class="product-card-top"><div class="product-name">'+p.name+'</div><span class="product-avail '+p.availability+'">'+avlLabel[p.availability]+'</span></div>' +
      '<div class="product-cat">📁 '+p.category+'</div>' +
      '<div class="product-desc">'+p.desc+'</div>' +
      '<div class="product-price">₹'+p.price.toLocaleString()+' <span>per unit</span></div>' +
      '<div class="product-actions">' +
        '<button class="btn-edit-prod" onclick="editProduct('+p.id+')">✏️ Edit</button>' +
        '<button class="btn-del-prod"  onclick="deleteProduct('+p.id+')">🗑️</button>' +
      '</div></div>';
  }).join("");
}

function filterProducts() {
  var q = document.getElementById("productSearch").value.toLowerCase();
  renderProducts(products.filter(function(p){ return p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q); }));
}

function openProductModal(pre) {
  editingProductId = null;
  setText("productModalTitle", "📦 Add Product");
  ["prodName","prodPrice","prodCategory","prodDesc"].forEach(function(id){ setVal(id,""); });
  document.getElementById("prodAvailability").value = "available";
  if (pre) {
    setVal("prodName",pre.name); setVal("prodPrice",pre.price);
    setVal("prodCategory",pre.category); setVal("prodDesc",pre.desc);
    document.getElementById("prodAvailability").value = pre.availability;
    editingProductId = pre.id;
    setText("productModalTitle","✏️ Edit Product");
  }
  document.getElementById("productModal").classList.add("open");
}

function closeProductModal() { document.getElementById("productModal").classList.remove("open"); }

function editProduct(id)   { var p = products.find(function(x){ return x.id===id; }); if(p) openProductModal(p); }
function deleteProduct(id) {
  if (!confirm("Delete product?")) return;
  products = products.filter(function(p){ return p.id!==id; });
  renderProducts(products); setText("statProducts", products.length); toast("🗑️ Deleted.");
}

function submitProduct() {
  var name = getVal("prodName").trim(); if(!name){ toast("⚠️ Name required."); return; }
  var prod = { id:editingProductId||Date.now(), name:name, price:parseFloat(getVal("prodPrice"))||0,
    category:getVal("prodCategory")||"General", desc:getVal("prodDesc"),
    availability:document.getElementById("prodAvailability").value };
  if (editingProductId) { var i = products.findIndex(function(p){ return p.id===editingProductId; }); if(i>-1) products[i]=prod; toast("✅ Updated!"); }
  else { products.unshift(prod); toast("✅ Added!"); }
  setText("statProducts", products.length); closeProductModal(); renderProducts(products);
}

/* ── Orders ── */
function renderOrders(list) {
  var b = document.getElementById("ordersBody"); if(!b) return;
  if (!list.length) { b.innerHTML='<tr><td colspan="6" style="text-align:center;padding:24px;color:#aaa;">No orders.</td></tr>'; return; }
  b.innerHTML = list.map(function(o,i){
    return '<tr><td>'+(i+1)+'</td><td><strong>'+o.customer+'</strong></td><td>'+o.item+'</td><td>'+o.date+'</td>' +
      '<td><span class="order-status '+o.status+'">'+cap(o.status)+'</span></td>' +
      '<td><button class="btn-update-order" onclick="updateOrder(\''+o.id+'\')">Update</button></td></tr>';
  }).join("");
}

function filterOrders(status, btn) {
  document.querySelectorAll(".filter-btn").forEach(function(b){ b.classList.remove("active"); });
  btn.classList.add("active");
  renderOrders(status==="all" ? orders : orders.filter(function(o){ return o.status===status; }));
}

function updateOrder(id) {
  var o = orders.find(function(x){ return x.id===id; }); if(!o) return;
  if (o.status==="completed"||o.status==="cancelled") { toast("ℹ️ Already "+o.status+"."); return; }
  o.status = {pending:"confirmed",confirmed:"completed"}[o.status];
  renderOrders(orders); toast("✅ Marked as "+cap(o.status)+".");
}

/* ── Reviews ── */
function renderReviews() {
  var el = document.getElementById("reviewsList"); if(!el) return;
  el.innerHTML = reviews.map(function(r){
    var stars = "⭐".repeat(r.stars) + "☆".repeat(5-r.stars);
    var reply = r.reply
      ? '<div class="review-reply">💬 <strong>Your reply:</strong> '+r.reply+'</div>'
      : '<button class="btn-reply-review" onclick="replyReview('+r.id+')">💬 Reply</button>';
    return '<div class="review-card">' +
      '<div class="review-card-top">' +
        '<div class="reviewer-info"><div class="reviewer-avatar">'+r.name.charAt(0)+'</div>' +
        '<div><div class="reviewer-name">'+r.name+'</div><div class="reviewer-date">'+r.date+'</div></div></div>' +
        '<div class="review-stars">'+stars+'</div>' +
      '</div><div class="review-text">'+r.text+'</div>'+reply+'</div>';
  }).join("");
}

function replyReview(id) {
  var txt = prompt("Write your reply:"); if(!txt||!txt.trim()) return;
  var r = reviews.find(function(x){ return x.id===id; }); if(r){ r.reply=txt.trim(); renderReviews(); toast("✅ Reply posted!"); }
}

/* ── Promotions ── */
var typeEmoji = {discount:"💸",buy1get1:"🎁",freedelivery:"🚀",seasonal:"🌟"};

function renderPromos() {
  var g = document.getElementById("promosGrid"); if(!g) return;
  if (!promotions.length) { g.innerHTML='<div style="text-align:center;padding:50px;color:#aaa;grid-column:1/-1;">📣 No active promotions.</div>'; setText("statPromos",0); return; }
  g.innerHTML = promotions.map(function(p){
    return '<div class="promo-card">' +
      '<div class="promo-type-badge">'+(typeEmoji[p.type]||"📣")+" "+cap(p.type)+'</div>' +
      '<div class="promo-title">'+p.title+'</div><div class="promo-desc">'+p.desc+'</div>' +
      '<div class="promo-meta"><span>🏷️ <strong>'+p.discount+'</strong></span><span>📅 <strong>'+p.expiry+'</strong></span><span>👁️ <strong>'+p.views+'</strong> views</span></div>' +
      '<div class="promo-actions"><button class="btn-end-promo" onclick="endPromo('+p.id+')">🛑 End Promo</button></div></div>';
  }).join("");
  setText("statPromos", promotions.length);
}

function openPromoModal()  { ["promoTitle","promoDesc","promoDiscount"].forEach(function(id){setVal(id,"");}); document.getElementById("promoExpiry").value=""; document.getElementById("promoType").value="discount"; document.getElementById("promoModal").classList.add("open"); }
function closePromoModal() { document.getElementById("promoModal").classList.remove("open"); }

function submitPromo() {
  var title=getVal("promoTitle").trim(), desc=getVal("promoDesc").trim();
  if(!title||!desc){ toast("⚠️ Title and description required."); return; }
  promotions.unshift({id:Date.now(),title:title,desc:desc,discount:getVal("promoDiscount")||"Special Offer",
    type:document.getElementById("promoType").value,expiry:document.getElementById("promoExpiry").value||"—",views:0});
  closePromoModal(); renderPromos(); toast("🚀 Promo launched!");
}

function endPromo(id) {
  if(!confirm("End this promotion?")) return;
  promotions = promotions.filter(function(p){ return p.id!==id; }); renderPromos(); toast("🛑 Promo ended.");
}

/* ── Overview Widgets ── */
function renderRecentInquiries() {
  var w = document.getElementById("recentInquiries"); if(!w) return;
  w.innerHTML = orders.slice(0,4).map(function(o){
    return '<div class="inquiry-row"><div class="inq-left"><div class="inq-customer">'+o.customer+'</div><div class="inq-item">'+o.item+' • '+o.date+'</div></div>' +
      '<span class="order-status '+o.status+'">'+cap(o.status)+'</span></div>';
  }).join("");
}

function renderRecentReviews() {
  var w = document.getElementById("recentReviews"); if(!w) return;
  w.innerHTML = reviews.slice(0,3).map(function(r){
    return '<div class="inquiry-row"><div class="inq-left"><div class="inq-customer">'+r.name+" "+"⭐".repeat(r.stars)+'</div>' +
      '<div class="inq-item" style="max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">'+r.text+'</div></div>' +
      '<span style="font-size:12px;color:#aaa;">'+r.date+'</span></div>';
  }).join("");
}

/* ── Bar Chart ── */
function renderChart() {
  var w = document.getElementById("chartWrap"); if(!w) return;
  var days=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"], vals=[28,35,22,48,55,72,38], max=Math.max.apply(null,vals);
  w.innerHTML = days.map(function(d,i){
    return '<div class="chart-bar-col"><div class="chart-bar-val">'+vals[i]+'</div>' +
      '<div class="chart-bar" style="height:'+Math.round(vals[i]/max*100)+'%" title="'+vals[i]+' views"></div>' +
      '<div class="chart-bar-day">'+d+'</div></div>';
  }).join("");
}

/* ── Clock ── */
function startClock() {
  var el = document.getElementById("navClock"); if(!el) return;
  function tick(){ var n=new Date(); el.textContent="🕐 "+String(n.getHours()).padStart(2,"0")+":"+String(n.getMinutes()).padStart(2,"0"); }
  tick(); setInterval(tick,60000);
}

/* ── Modal overlay close ── */
document.addEventListener("click",function(e){
  ["productModal","promoModal"].forEach(function(id){ var m=document.getElementById(id); if(m&&e.target===m) m.classList.remove("open"); });
});

/* ── Toast ── */
function toast(msg) { var t=document.getElementById("toast"); if(!t) return; t.textContent=msg; t.classList.add("show"); setTimeout(function(){ t.classList.remove("show"); },3000); }

/* ── Helpers ── */
function cap(s)         { return s ? s.charAt(0).toUpperCase()+s.slice(1) : ""; }
function setText(id, v) { var e=document.getElementById(id); if(e) e.textContent=v; }
function setVal(id, v)  { var e=document.getElementById(id); if(e) e.value=v||""; }
function getVal(id)     { var e=document.getElementById(id); return e?e.value:""; }
