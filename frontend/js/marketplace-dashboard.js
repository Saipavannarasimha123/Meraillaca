/* marketplace-dashboard.js – Mera Ilaka */

/* ── Sample Data ── */
var listings = [
  {id:1, name:"Samsung 32\" LED TV",       price:8500,  category:"electronics", condition:"Like New", desc:"Barely used, 2 years old. Comes with remote and box.", phone:"98765 43210", location:"Block A", icon:"📺", status:"active",  views:38},
  {id:2, name:"Wooden Study Table",         price:2200,  category:"furniture",   condition:"Good",     desc:"Solid wood with 2 drawers. Minor scratches but sturdy.",phone:"98765 43210", location:"Block A", icon:"🪑", status:"active",  views:22},
  {id:3, name:"Kids School Books – Grade 5",price:350,   category:"books",       condition:"Good",     desc:"Full NCERT Grade 5 set. Lightly used, no torn pages.",  phone:"98765 43210", location:"Block A", icon:"📚", status:"active",  views:14},
  {id:4, name:"Men's Formal Shirts (3 pcs)",price:600,   category:"clothing",    condition:"Like New", desc:"3 shirts size M. Worn once or twice.",                  phone:"98765 43210", location:"Block A", icon:"👔", status:"active",  views:19},
  {id:5, name:"Bicycle – Hero Ranger",      price:3000,  category:"other",       condition:"Good",     desc:"21 speed mountain bike. New tyres, recently serviced.", phone:"98765 43210", location:"Block A", icon:"🚲", status:"sold",    views:31},
  {id:6, name:"iPhone 11 – 64GB",           price:22000, category:"electronics", condition:"Good",     desc:"Battery 84%. Comes with charger. No screen scratches.", phone:"98765 43210", location:"Block A", icon:"📱", status:"active",  views:0}
];

var orders = [
  {id:"ORD-001", item:"Samsung 32\" LED TV",     buyer:"Suresh Yadav",  price:8500,  date:"10 Oct 2026", status:"pending"},
  {id:"ORD-002", item:"Bicycle – Hero Ranger",   buyer:"Priya Mehta",   price:3000,  date:"08 Oct 2026", status:"completed"},
  {id:"ORD-003", item:"Wooden Study Table",       buyer:"Anita Singh",   price:2200,  date:"07 Oct 2026", status:"confirmed"},
  {id:"ORD-004", item:"iPhone 11 – 64GB",         buyer:"Vikram Kapoor", price:22000, date:"05 Oct 2026", status:"cancelled"}
];

var messages = [
  {id:1, buyer:"Suresh Yadav",  item:"Samsung 32\" LED TV",    date:"10 Oct", text:"Is this still available? Can you do 8000?",          reply:"",                        read:false},
  {id:2, buyer:"Priya Mehta",   item:"Bicycle – Hero Ranger",  date:"08 Oct", text:"I'll take it. When can I pick it up?",                reply:"Come anytime after 5 PM.", read:true},
  {id:3, buyer:"Deepa Nair",    item:"Kids School Books",       date:"07 Oct", text:"Are there any marks or writing inside the books?",    reply:"",                        read:false},
  {id:4, buyer:"Rahul Sharma",  item:"Men's Formal Shirts",     date:"06 Oct", text:"What brand are the shirts?",                          reply:"Arrow and Van Heusen.",    read:true}
];

var wishlist = [
  {id:1, name:"Air Fryer – Philips",   price:3500, category:"electronics", condition:"Like New", desc:"Used 3 times. All accessories included.", icon:"🍟", seller:"Kavya Nair",  phone:"90001 23456"},
  {id:2, name:"Baby Stroller",          price:1800, category:"furniture",   condition:"Good",     desc:"Comfortable, foldable. Good for 0–3 yrs.", icon:"🍼", seller:"Neha Gupta",  phone:"77665 44332"},
  {id:3, name:"Guitar – Acoustic",      price:2500, category:"other",       condition:"Like New", desc:"6-string acoustic, barely played.",         icon:"🎸", seller:"Arjun Reddy", phone:"88776 65544"}
];

var editingListingId = null;

/* ── Init ── */
window.onload = function () {
  if(!sessionStorage.getItem("loggedUser")){ window.location.href="login.html"; return; }
  var u = JSON.parse(sessionStorage.getItem("loggedUser"));
  setText("navUser","👤 "+u.name+" ("+u.role+")");
  setText("mpSellerName", u.name+"'s Shop 🛒");
  startClock();
  renderOverview();
  renderListings(listings);
  renderOrders(orders);
  renderMessages();
  renderWishlist();
};

/* ── Auth ── */
function logout(){ if(confirm("Logout?")){ sessionStorage.removeItem("loggedUser"); window.location.href="login.html"; } }

/* ── Tab Switch ── */
function showTab(id){
  document.querySelectorAll(".tab-content").forEach(function(t){ t.classList.remove("active"); });
  document.querySelectorAll(".sidebar a").forEach(function(a){ a.classList.remove("active"); });
  var t=document.getElementById("tab-"+id); if(t) t.classList.add("active");
  document.querySelectorAll(".sidebar a").forEach(function(a){ if(a.getAttribute("onclick")==="showTab('"+id+"')") a.classList.add("active"); });
}

/* ── Overview ── */
function renderOverview(){
  var active   = listings.filter(function(l){ return l.status==="active"; });
  var sold     = listings.filter(function(l){ return l.status==="sold"; });
  var totalViews = listings.reduce(function(s,l){ return s+l.views; },0);
  var unread   = messages.filter(function(m){ return !m.read; }).length;
  var pending  = orders.filter(function(o){ return o.status==="pending"; }).length;
  setText("statListings", active.length);
  setText("statViews",    totalViews);
  setText("statContacts", messages.length);
  setText("statOrders",   orders.length);
  setText("statSold",     sold.length);
  setText("statMessages", messages.length);

  /* Recent listings */
  var rl = document.getElementById("recentListings"); if(!rl) return;
  rl.innerHTML = listings.slice(0,4).map(function(l){
    return '<div class="ov-row"><div class="ov-left"><div class="ov-icon '+l.category+'">'+l.icon+'</div>' +
      '<div><div class="ov-title">'+l.name+'</div><div class="ov-sub">'+cap(l.condition)+' • 👁️ '+l.views+' views</div></div></div>' +
      '<span class="price-tag">₹'+l.price.toLocaleString("en-IN")+'</span></div>';
  }).join("");

  /* Recent orders */
  var ro = document.getElementById("recentOrders"); if(!ro) return;
  ro.innerHTML = orders.slice(0,4).map(function(o){
    return '<div class="ov-row"><div class="ov-left">' +
      '<div><div class="ov-title">'+o.item+'</div><div class="ov-sub">'+o.buyer+' • '+o.date+'</div></div></div>' +
      '<span class="ord-status '+o.status+'">'+cap(o.status)+'</span></div>';
  }).join("");

  renderChart();
}

function renderChart(){
  var wrap = document.getElementById("chartWrap"); if(!wrap) return;
  var cats=["Electronics","Furniture","Clothing","Books","Other"];
  var vals = listings.reduce(function(acc,l){ var k=cap(l.category); acc[k]=(acc[k]||0)+l.views; return acc; },{});
  var data = cats.map(function(c){ return {label:c,val:vals[c]||0}; });
  var max  = Math.max.apply(null,data.map(function(d){ return d.val; }))||1;
  wrap.innerHTML = data.map(function(d){
    return '<div class="chart-bar-col"><div class="chart-bar-val">'+d.val+'</div>' +
      '<div class="chart-bar" style="height:'+Math.round(d.val/max*100)+'%"></div>' +
      '<div class="chart-bar-day">'+d.label+'</div></div>';
  }).join("");
}

/* ── Listings ── */
var icons = {electronics:"📱",furniture:"🪑",clothing:"👗",books:"📚",other:"📦"};

function renderListings(list){
  var g = document.getElementById("listingsGrid"); if(!g) return;
  if(!list.length){ g.innerHTML='<div style="grid-column:1/-1;text-align:center;padding:50px;color:#aaa;">No listings found.</div>'; return; }
  g.innerHTML = list.map(function(l){
    return '<div class="lst-card">' +
      '<div class="lst-thumb '+l.category+'">'+l.icon+'</div>' +
      '<div class="lst-body">' +
        '<div class="lst-name">'+l.name+'</div>' +
        '<div class="lst-desc">'+l.desc+'</div>' +
        '<div class="lst-price">₹'+l.price.toLocaleString("en-IN")+'</div>' +
        '<div class="lst-meta">' +
          '<span class="cond-badge '+l.condition+'">'+l.condition+'</span>' +
          '<span class="lst-status '+l.status+'">'+cap(l.status)+'</span>' +
        '</div>' +
      '</div>' +
      '<div class="lst-actions">' +
        '<button class="btn-edit-lst" onclick="editListing('+l.id+')">✏️ Edit</button>' +
        (l.status!=="sold"?'<button class="btn-sold-lst" onclick="markSold('+l.id+')">✅ Sold</button>':'')+
        '<button class="btn-del-lst"  onclick="deleteListing('+l.id+')">🗑️</button>' +
      '</div></div>';
  }).join("");
}

function filterListings(){
  var q = document.getElementById("listingSearch").value.toLowerCase();
  renderListings(listings.filter(function(l){ return l.name.toLowerCase().includes(q)||l.desc.toLowerCase().includes(q); }));
}

function filterListingCat(cat,btn){
  document.querySelectorAll(".filter-btn").forEach(function(b){ b.classList.remove("active"); });
  btn.classList.add("active");
  renderListings(cat==="all"?listings:listings.filter(function(l){ return l.category===cat; }));
}

function openListingModal(pre){
  editingListingId=null;
  setText("listingModalTitle","🏷️ List an Item for Sale");
  ["lstName","lstPrice","lstPhone","lstLocation","lstDesc"].forEach(function(id){ setVal(id,""); });
  document.getElementById("lstCategory").value="electronics";
  document.getElementById("lstCondition").value="Like New";
  if(pre){
    setVal("lstName",pre.name); setVal("lstPrice",pre.price); setVal("lstPhone",pre.phone);
    setVal("lstLocation",pre.location); setVal("lstDesc",pre.desc);
    document.getElementById("lstCategory").value=pre.category;
    document.getElementById("lstCondition").value=pre.condition;
    editingListingId=pre.id;
    setText("listingModalTitle","✏️ Edit Listing");
  }
  document.getElementById("listingModal").classList.add("open");
}

function closeListingModal(){ document.getElementById("listingModal").classList.remove("open"); }

function editListing(id){ var l=listings.find(function(x){ return x.id===id; }); if(l) openListingModal(l); }

function markSold(id){
  var l=listings.find(function(x){ return x.id===id; }); if(!l) return;
  l.status="sold"; renderListings(listings); renderOverview(); toast("✅ Marked as sold!");
}

function deleteListing(id){
  if(!confirm("Remove this listing?")) return;
  listings=listings.filter(function(l){ return l.id!==id; });
  renderListings(listings); renderOverview(); toast("🗑️ Listing removed.");
}

function submitListing(){
  var name=getVal("lstName").trim(), price=getVal("lstPrice"), phone=getVal("lstPhone").trim(), desc=getVal("lstDesc").trim();
  if(!name||!price||!phone||!desc){ toast("⚠️ All required fields must be filled."); return; }
  var cat=document.getElementById("lstCategory").value;
  var item={
    id:editingListingId||Date.now(), name:name, price:parseInt(price)||0,
    category:cat, condition:document.getElementById("lstCondition").value,
    desc:desc, phone:phone, location:getVal("lstLocation")||"",
    icon:icons[cat]||"📦", status:"active", views:0
  };
  if(editingListingId){ var i=listings.findIndex(function(l){ return l.id===editingListingId; }); if(i>-1){ item.views=listings[i].views; item.status=listings[i].status; listings[i]=item; } toast("✅ Listing updated!"); }
  else { listings.unshift(item); toast("✅ Item listed for sale!"); }
  closeListingModal(); renderListings(listings); renderOverview();
}

/* ── Orders ── */
function renderOrders(list){
  var b=document.getElementById("ordersBody"); if(!b) return;
  if(!list.length){ b.innerHTML='<tr><td colspan="7" style="text-align:center;padding:24px;color:#aaa;">No orders yet.</td></tr>'; return; }
  b.innerHTML=list.map(function(o,i){
    return '<tr><td>'+(i+1)+'</td><td><strong>'+o.item+'</strong></td><td>'+o.buyer+'</td>' +
      '<td>₹'+o.price.toLocaleString("en-IN")+'</td><td>'+o.date+'</td>' +
      '<td><span class="ord-status '+o.status+'">'+cap(o.status)+'</span></td>' +
      '<td><button class="btn-upd-ord" onclick="updateOrder(\''+o.id+'\')">Update</button></td></tr>';
  }).join("");
}

function filterOrders(status,btn){
  document.querySelectorAll(".filter-btn").forEach(function(b){ b.classList.remove("active"); });
  btn.classList.add("active");
  renderOrders(status==="all"?orders:orders.filter(function(o){ return o.status===status; }));
}

function updateOrder(id){
  var o=orders.find(function(x){ return x.id===id; }); if(!o) return;
  if(o.status==="completed"||o.status==="cancelled"){ toast("ℹ️ Already "+o.status+"."); return; }
  o.status={pending:"confirmed",confirmed:"completed"}[o.status];
  renderOrders(orders); renderOverview(); toast("✅ Order marked as "+cap(o.status)+".");
}

/* ── Messages ── */
function renderMessages(){
  var el=document.getElementById("messagesList"); if(!el) return;
  if(!messages.length){ el.innerHTML='<div style="text-align:center;padding:40px;color:#aaa;">No messages yet.</div>'; return; }
  el.innerHTML=messages.map(function(m){
    var unreadDot=!m.read?'<span class="msg-unread-dot"></span>':"";
    var replySection=m.reply
      ?'<div class="msg-reply-box">💬 <strong>Your reply:</strong> '+m.reply+'</div>'
      :'<button class="btn-reply-msg" onclick="openReply('+m.id+')">💬 Reply</button>';
    return '<div class="msg-card">' +
      '<div class="msg-card-top"><div class="msg-buyer">' +
        '<div class="msg-avatar">'+m.buyer.charAt(0)+'</div>' +
        '<div><div class="msg-name">'+m.buyer+unreadDot+'</div><div class="msg-item">Re: '+m.item+'</div></div>' +
      '</div><div class="msg-date">'+m.date+'</div></div>' +
      '<div class="msg-text">'+m.text+'</div>'+replySection+'</div>';
  }).join("");
}

var replyingMsgId=null;
function openReply(id){
  replyingMsgId=id;
  var m=messages.find(function(x){ return x.id===id; }); if(!m) return;
  document.getElementById("replyContext").textContent='👤 '+m.buyer+': "'+m.text+'"';
  setVal("replyText","");
  document.getElementById("replyModal").classList.add("open");
}
function closeReplyModal(){ document.getElementById("replyModal").classList.remove("open"); }
function sendReply(){
  var txt=getVal("replyText").trim(); if(!txt){ toast("⚠️ Write a reply first."); return; }
  var m=messages.find(function(x){ return x.id===replyingMsgId; });
  if(m){ m.reply=txt; m.read=true; }
  closeReplyModal(); renderMessages(); toast("✅ Reply sent!");
}

/* ── Wishlist ── */
function renderWishlist(){
  var g=document.getElementById("wishlistGrid"); if(!g) return;
  if(!wishlist.length){ g.innerHTML='<div style="grid-column:1/-1;text-align:center;padding:50px;color:#aaa;">❤️ Your wishlist is empty. <a href="marketplace.html" style="color:#e65100;">Browse items →</a></div>'; return; }
  g.innerHTML=wishlist.map(function(w){
    return '<div class="lst-card">' +
      '<div class="lst-thumb '+w.category+'">'+w.icon+'</div>' +
      '<div class="lst-body">' +
        '<div class="lst-name">'+w.name+'</div>' +
        '<div class="lst-desc">'+w.desc+'</div>' +
        '<div class="lst-price">₹'+w.price.toLocaleString("en-IN")+'</div>' +
        '<div class="lst-meta"><span class="cond-badge '+w.condition+'">'+w.condition+'</span><span style="font-size:12px;color:#888;">👤 '+w.seller+'</span></div>' +
      '</div>' +
      '<button class="btn-contact-wish" onclick="toast(\'📞 Contacting '+w.seller+'\')">📞 Contact Seller</button>' +
      '<button class="btn-remove-wish"  onclick="removeWish('+w.id+')">❤️ Remove</button>' +
      '</div>';
  }).join("");
}

function removeWish(id){
  wishlist=wishlist.filter(function(w){ return w.id!==id; });
  renderWishlist(); toast("Removed from wishlist.");
}

/* ── Clock ── */
function startClock(){
  var el=document.getElementById("navClock"); if(!el) return;
  function tick(){ var n=new Date(); el.textContent="🕐 "+String(n.getHours()).padStart(2,"0")+":"+String(n.getMinutes()).padStart(2,"0"); }
  tick(); setInterval(tick,60000);
}

/* ── Modal overlay close ── */
document.addEventListener("click",function(e){
  ["listingModal","replyModal"].forEach(function(id){ var m=document.getElementById(id); if(m&&e.target===m) m.classList.remove("open"); });
});

/* ── Toast ── */
function toast(msg){ var t=document.getElementById("toast"); if(!t) return; t.textContent=msg; t.classList.add("show"); setTimeout(function(){ t.classList.remove("show"); },3000); }

/* ── Helpers ── */
function cap(s)        { return s?s.charAt(0).toUpperCase()+s.slice(1):""; }
function setText(id,v) { var e=document.getElementById(id); if(e) e.textContent=v; }
function setVal(id,v)  { var e=document.getElementById(id); if(e) e.value=v||""; }
function getVal(id)    { var e=document.getElementById(id); return e?e.value:""; }
