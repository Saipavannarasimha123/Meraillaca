/* services-dashboard.js – Mera Ilaka */

/* ── Sample Data ── */
var provider = {
  name:"Ravi Kumar", category:"Plumbing", icon:"🚿",
  phone:"98765 43210", whatsapp:"98765 43210",
  price:"₹300/visit", avail:"Mon–Sat, 9 AM – 7 PM",
  desc:"Expert in pipe fitting, leakage repair, bathroom fittings & drainage. 8+ years experience.",
  isAvailable:true, verified:true
};

var bookings = [
  {id:"BK-001", customer:"Rahul Sharma",  service:"Pipe Leakage Fix",    date:"12 Oct 2026", address:"Block A, Flat 203", status:"pending",   amount:300},
  {id:"BK-002", customer:"Priya Mehta",   service:"Bathroom Fitting",    date:"11 Oct 2026", address:"Block B, Flat 105", status:"confirmed",  amount:800},
  {id:"BK-003", customer:"Suresh Yadav",  service:"Drainage Cleaning",   date:"09 Oct 2026", address:"Block C, Flat 401", status:"completed",  amount:500},
  {id:"BK-004", customer:"Anita Singh",   service:"Kitchen Tap Repair",  date:"08 Oct 2026", address:"Block A, Flat 312", status:"completed",  amount:250},
  {id:"BK-005", customer:"Vikram Kapoor", service:"Water Tank Repair",   date:"07 Oct 2026", address:"Block D, Flat 201", status:"cancelled",  amount:600},
  {id:"BK-006", customer:"Deepa Nair",    service:"Pipe Leakage Fix",    date:"06 Oct 2026", address:"Block B, Flat 302", status:"pending",    amount:300},
  {id:"BK-007", customer:"Kiran Patel",   service:"Full Plumbing Check", date:"05 Oct 2026", address:"Block C, Flat 104", status:"completed",  amount:1200},
  {id:"BK-008", customer:"Mohan Das",     service:"Motor Repair",        date:"03 Oct 2026", address:"Block A, Flat 501", status:"completed",  amount:700}
];

var reviews = [
  {id:1, name:"Rahul S.",  date:"9 Oct 2026",  stars:5, text:"Ravi fixed our pipe leakage in 20 minutes. Very professional and clean work. Highly recommend!",  reply:"Thank you Rahul! 😊"},
  {id:2, name:"Priya M.",  date:"7 Oct 2026",  stars:5, text:"Excellent work on the bathroom fitting. On time and very reasonable price.",                        reply:""},
  {id:3, name:"Suresh Y.", date:"4 Oct 2026",  stars:4, text:"Good service. Drainage cleaned properly. Took a little longer than expected but result was great.",  reply:"Thanks Suresh, will be quicker next time!"},
  {id:4, name:"Anita S.",  date:"1 Oct 2026",  stars:5, text:"Quick and efficient. Fixed the tap in 10 minutes. Very polite as well.",                             reply:""}
];

var selectedBookingId = null;

/* ── Init ── */
window.onload = function () {
  if(!sessionStorage.getItem("loggedUser")){ window.location.href="login.html"; return; }
  var u = JSON.parse(sessionStorage.getItem("loggedUser"));
  setText("navUser","👤 "+u.name+" ("+u.role+")");
  startClock();
  loadProviderData();
  renderOverview();
  renderBookings(bookings);
  renderReviews();
  renderEarnings();
  document.getElementById("profAvailToggle").addEventListener("change", function(){ updateToggleText(this.checked); });
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

/* ── Load Provider Data ── */
function loadProviderData(){
  setText("ovName",    provider.name);
  setText("ovCat",     provider.category+" • "+provider.avail);
  setText("ovLogo",    provider.icon);
  setText("ovVerified",provider.verified ? "✅ Verified Provider" : "⏳ Unverified");
  setVal("profName",    provider.name);     setVal("profPhone",    provider.phone);
  setVal("profWhatsapp",provider.whatsapp); setVal("profPrice",    provider.price);
  setVal("profAvail",   provider.avail);    setVal("profDesc",     provider.desc);
  document.getElementById("profCategory").value    = provider.category;
  document.getElementById("profAvailToggle").checked = provider.isAvailable;
  updateToggleText(provider.isAvailable);
}

function updateToggleText(on){
  var el=document.getElementById("availToggleText"); if(!el) return;
  el.textContent = on ? "🟢 Available" : "🔴 Not Available";
  el.style.color  = on ? "#00695c" : "#c62828";
}

/* ── Profile Save ── */
function saveProfile(){
  var name=getVal("profName").trim(); if(!name){ toast("⚠️ Name required."); return; }
  provider.name       = name;
  provider.category   = document.getElementById("profCategory").value;
  provider.phone      = getVal("profPhone");
  provider.whatsapp   = getVal("profWhatsapp");
  provider.price      = getVal("profPrice");
  provider.avail      = getVal("profAvail");
  provider.desc       = getVal("profDesc");
  provider.isAvailable= document.getElementById("profAvailToggle").checked;
  setText("ovName", provider.name);
  setText("ovCat",  provider.category+" • "+provider.avail);
  toast("✅ Profile saved!");
}

function resetProfile(){ loadProviderData(); toast("↩️ Reset to saved values."); }

/* ── Overview ── */
function renderOverview(){
  var pending   = bookings.filter(function(b){ return b.status==="pending"; }).length;
  var completed = bookings.filter(function(b){ return b.status==="completed"; }).length;
  var totalViews= 186;
  var monthEarn = bookings.filter(function(b){ return b.status==="completed"; }).reduce(function(s,b){ return s+b.amount; },0);
  setText("statBookings",  bookings.length);
  setText("statPending",   pending);
  setText("statCompleted", completed);
  setText("statViews",     totalViews);
  setText("statEarnings",  "₹"+monthEarn.toLocaleString("en-IN"));

  /* Recent bookings */
  var rb=document.getElementById("recentBookings"); if(!rb) return;
  rb.innerHTML = bookings.slice(0,4).map(function(b){
    return '<div class="ov-row"><div class="ov-left"><div class="ov-title">'+b.customer+'</div>' +
      '<div class="ov-sub">'+b.service+' • '+b.date+'</div></div>' +
      '<span class="bk-status '+b.status+'">'+cap(b.status)+'</span></div>';
  }).join("");

  /* Recent reviews */
  var rr=document.getElementById("recentReviews"); if(!rr) return;
  rr.innerHTML = reviews.slice(0,3).map(function(r){
    return '<div class="ov-row"><div class="ov-left"><div class="ov-title">'+r.name+' '+'⭐'.repeat(r.stars)+'</div>' +
      '<div class="ov-sub" style="max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">'+r.text+'</div></div>' +
      '<span style="font-size:12px;color:#aaa;">'+r.date+'</span></div>';
  }).join("");

  renderWeeklyChart();
}

function renderWeeklyChart(){
  var wrap=document.getElementById("chartWrap"); if(!wrap) return;
  var days=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"], vals=[1,2,1,3,2,2,1];
  var max=Math.max.apply(null,vals);
  wrap.innerHTML=days.map(function(d,i){
    return '<div class="chart-bar-col"><div class="chart-bar-val">'+vals[i]+'</div>' +
      '<div class="chart-bar" style="height:'+Math.round(vals[i]/max*100)+'%"></div>' +
      '<div class="chart-bar-day">'+d+'</div></div>';
  }).join("");
}

/* ── Bookings ── */
function renderBookings(list){
  var b=document.getElementById("bookingsBody"); if(!b) return;
  if(!list.length){ b.innerHTML='<tr><td colspan="7" style="text-align:center;padding:24px;color:#aaa;">No bookings found.</td></tr>'; return; }
  b.innerHTML=list.map(function(bk,i){
    return '<tr><td>'+(i+1)+'</td>' +
      '<td><strong>'+bk.customer+'</strong></td>' +
      '<td>'+bk.service+'</td>' +
      '<td>'+bk.date+'</td>' +
      '<td>'+bk.address+'</td>' +
      '<td><span class="bk-status '+bk.status+'">'+cap(bk.status)+'</span></td>' +
      '<td><button class="btn-view-bk" onclick="viewBooking(\''+bk.id+'\')">View</button></td></tr>';
  }).join("");
}

function filterBookings(status,btn){
  document.querySelectorAll(".filter-btn").forEach(function(b){ b.classList.remove("active"); });
  btn.classList.add("active");
  renderBookings(status==="all" ? bookings : bookings.filter(function(b){ return b.status===status; }));
}

function viewBooking(id){
  var bk=bookings.find(function(x){ return x.id===id; }); if(!bk) return;
  selectedBookingId=id;
  document.getElementById("bookingDetail").innerHTML =
    '📋 <strong>ID:</strong> '+bk.id+'<br>'+
    '👤 <strong>Customer:</strong> '+bk.customer+'<br>'+
    '🔧 <strong>Service:</strong> '+bk.service+'<br>'+
    '📅 <strong>Date:</strong> '+bk.date+'<br>'+
    '📍 <strong>Address:</strong> '+bk.address+'<br>'+
    '💰 <strong>Amount:</strong> ₹'+bk.amount+'<br>'+
    '📌 <strong>Status:</strong> '+cap(bk.status);
  setVal("bookingNote","");
  document.getElementById("bookingModal").classList.add("open");
}

function closeBookingModal(){ document.getElementById("bookingModal").classList.remove("open"); }

function confirmBooking(){
  var bk=bookings.find(function(x){ return x.id===selectedBookingId; }); if(!bk) return;
  if(bk.status==="completed"||bk.status==="cancelled"){ toast("ℹ️ Already "+bk.status+"."); closeBookingModal(); return; }
  bk.status = {pending:"confirmed", confirmed:"completed"}[bk.status] || bk.status;
  closeBookingModal(); renderBookings(bookings); renderOverview(); renderEarnings();
  toast("✅ Booking marked as "+cap(bk.status)+".");
}

/* ── Reviews ── */
function renderReviews(){
  var el=document.getElementById("reviewsList"); if(!el) return;
  el.innerHTML=reviews.map(function(r){
    var stars="⭐".repeat(r.stars)+"☆".repeat(5-r.stars);
    var replySection=r.reply
      ?'<div class="review-reply">💬 <strong>Your reply:</strong> '+r.reply+'</div>'
      :'<button class="btn-reply-review" onclick="replyReview('+r.id+')">💬 Reply</button>';
    return '<div class="review-card">' +
      '<div class="review-card-top">' +
        '<div class="reviewer-info"><div class="reviewer-avatar">'+r.name.charAt(0)+'</div>' +
        '<div><div class="reviewer-name">'+r.name+'</div><div class="reviewer-date">'+r.date+'</div></div></div>' +
        '<div class="review-stars">'+stars+'</div>' +
      '</div>' +
      '<div class="review-text">'+r.text+'</div>'+replySection+'</div>';
  }).join("");
}

function replyReview(id){
  var txt=prompt("Write your reply:"); if(!txt||!txt.trim()) return;
  var r=reviews.find(function(x){ return x.id===id; });
  if(r){ r.reply=txt.trim(); renderReviews(); toast("✅ Reply posted!"); }
}

/* ── Earnings ── */
function renderEarnings(){
  var completedBks = bookings.filter(function(b){ return b.status==="completed"; });
  var pendingBks   = bookings.filter(function(b){ return b.status==="pending"||b.status==="confirmed"; });
  var total   = completedBks.reduce(function(s,b){ return s+b.amount; },0);
  var pending = pendingBks.reduce(function(s,b){ return s+b.amount; },0);
  setText("earnTotal",   "₹"+total.toLocaleString("en-IN"));
  setText("earnMonth",   "₹"+total.toLocaleString("en-IN"));
  setText("earnPending", "₹"+pending.toLocaleString("en-IN"));
  setText("statEarnings","₹"+total.toLocaleString("en-IN"));

  /* Earnings table */
  var tb=document.getElementById("earningsBody"); if(!tb) return;
  tb.innerHTML=completedBks.map(function(b,i){
    return '<tr><td>'+(i+1)+'</td><td><strong>'+b.service+'</strong></td>' +
      '<td>'+b.customer+'</td><td>'+b.date+'</td>' +
      '<td style="font-weight:800;color:#00695c;">₹'+b.amount+'</td>' +
      '<td><span class="bk-status completed">Paid</span></td></tr>';
  }).join("");

  /* Monthly chart */
  renderEarnChart();
}

function renderEarnChart(){
  var wrap=document.getElementById("earnChartWrap"); if(!wrap) return;
  var months=["May","Jun","Jul","Aug","Sep","Oct"], vals=[3200,4100,2800,5600,4900,6400];
  var max=Math.max.apply(null,vals);
  wrap.innerHTML=months.map(function(m,i){
    return '<div class="chart-bar-col"><div class="chart-bar-val">₹'+vals[i].toLocaleString("en-IN")+'</div>' +
      '<div class="chart-bar" style="height:'+Math.round(vals[i]/max*100)+'%"></div>' +
      '<div class="chart-bar-day">'+m+'</div></div>';
  }).join("");
}

/* ── Clock ── */
function startClock(){
  var el=document.getElementById("navClock"); if(!el) return;
  function tick(){ var n=new Date(); el.textContent="🕐 "+String(n.getHours()).padStart(2,"0")+":"+String(n.getMinutes()).padStart(2,"0"); }
  tick(); setInterval(tick,60000);
}

/* ── Modal close on overlay ── */
document.addEventListener("click",function(e){
  var m=document.getElementById("bookingModal"); if(m&&e.target===m) m.classList.remove("open");
});

/* ── Toast ── */
function toast(msg){ var t=document.getElementById("toast"); if(!t) return; t.textContent=msg; t.classList.add("show"); setTimeout(function(){ t.classList.remove("show"); },3000); }

/* ── Helpers ── */
function cap(s)        { return s?s.charAt(0).toUpperCase()+s.slice(1):""; }
function setText(id,v) { var e=document.getElementById(id); if(e) e.textContent=v; }
function setVal(id,v)  { var e=document.getElementById(id); if(e) e.value=v||""; }
function getVal(id)    { var e=document.getElementById(id); return e?e.value:""; }
