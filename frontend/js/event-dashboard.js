/* event-dashboard.js – Mera Ilaka */

/* ── Sample Data ── */
var events = [
  {id:1, title:"Blood Donation Camp",         day:"12",month:"OCT",date:"2026-10-12",time:"9 AM – 3 PM",  location:"Community Hall",     category:"health",   desc:"Give the gift of life! Free blood donation drive by the RWA.", joining:18, status:"upcoming"},
  {id:2, title:"Resident Meeting – Block A",  day:"15",month:"OCT",date:"2026-10-15",time:"7 PM – 9 PM",  location:"Block A Terrace",    category:"meeting",  desc:"Monthly resident meeting for maintenance and security updates.", joining:12, status:"upcoming"},
  {id:3, title:"Diwali Celebration",          day:"20",month:"OCT",date:"2026-10-20",time:"6 PM Onwards", location:"Main Park",           category:"festival", desc:"Grand Diwali with lights, music, food stalls and prizes.",      joining:65, status:"upcoming"},
  {id:4, title:"Health Awareness Camp",       day:"22",month:"OCT",date:"2026-10-22",time:"10 AM – 1 PM", location:"Clinic Gate",         category:"health",   desc:"Free check-ups: BP, sugar, BMI for all residents.",             joining:30, status:"upcoming"},
  {id:5, title:"Neighbourhood Clean-Up Drive",day:"05",month:"OCT",date:"2026-10-05",time:"7 AM – 10 AM", location:"Main Park",           category:"social",   desc:"Come together to keep our colony clean.",                       joining:22, status:"completed"},
  {id:6, title:"Kids Sports Day",             day:"03",month:"OCT",date:"2026-10-03",time:"9 AM – 12 PM", location:"Playground, Block C", category:"social",   desc:"Fun sports for children aged 5–15. Prizes for all!",            joining:35, status:"completed"}
];

var attendees = [
  {name:"Rahul Sharma",  event:"Blood Donation Camp",        date:"10 Oct", status:"confirmed"},
  {name:"Priya Mehta",   event:"Diwali Celebration",         date:"09 Oct", status:"confirmed"},
  {name:"Suresh Yadav",  event:"Kids Sports Day",            date:"03 Oct", status:"attended"},
  {name:"Anita Singh",   event:"Health Awareness Camp",      date:"08 Oct", status:"confirmed"},
  {name:"Vikram Kapoor", event:"Resident Meeting – Block A", date:"07 Oct", status:"confirmed"},
  {name:"Deepa Nair",    event:"Neighbourhood Clean-Up",     date:"05 Oct", status:"attended"}
];

var gallery = [
  {id:1, event:"Clean-Up Drive 2026",    caption:"Residents working together 🌿", emoji:"🧹"},
  {id:2, event:"Kids Sports Day 2026",   caption:"Winners receiving prizes 🏅",    emoji:"🏅"},
  {id:3, event:"Diwali 2025",            caption:"Beautiful diyas lighting up 🪔", emoji:"🎆"},
  {id:4, event:"Health Camp 2026",       caption:"Doctor checking BP of resident", emoji:"🏥"},
  {id:5, event:"Blood Donation 2026",    caption:"Volunteers donating blood ❤️",   emoji:"💉"},
  {id:6, event:"Resident Meeting 2026",  caption:"Community discussing plans 📋",  emoji:"🤝"}
];

var calYear = 2026, calMonth = 9; /* 0-indexed: 9 = October */
var editingEventId = null;

/* ── Init ── */
window.onload = function () {
  if (!sessionStorage.getItem("loggedUser")) { window.location.href = "login.html"; return; }
  var u = JSON.parse(sessionStorage.getItem("loggedUser"));
  setText("navUser","👤 " + u.name + " (" + u.role + ")");
  startClock();
  renderOverview();
  renderManageList(events);
  renderRsvpTable(events);
  renderCalendar();
  renderGallery(gallery);
};

/* ── Auth ── */
function logout() { if(confirm("Logout?")){ sessionStorage.removeItem("loggedUser"); window.location.href="login.html"; } }

/* ── Tab Switch ── */
function showTab(id) {
  document.querySelectorAll(".tab-content").forEach(function(t){ t.classList.remove("active"); });
  document.querySelectorAll(".sidebar a").forEach(function(a){ a.classList.remove("active"); });
  var tab = document.getElementById("tab-"+id); if(tab) tab.classList.add("active");
  document.querySelectorAll(".sidebar a").forEach(function(a){
    if(a.getAttribute("onclick")==="showTab('"+id+"')") a.classList.add("active");
  });
}

/* ── Overview ── */
function renderOverview() {
  var upcoming  = events.filter(function(e){ return e.status==="upcoming"; });
  var completed = events.filter(function(e){ return e.status==="completed"; });
  var totalJoining = events.reduce(function(s,e){ return s+e.joining; },0);
  setText("statTotal",     events.length);
  setText("statRsvps",     totalJoining);
  setText("statUpcoming",  upcoming.length);
  setText("statCompleted", completed.length);
  setText("statHealth",    events.filter(function(e){ return e.category==="health"; }).length);
  setText("statFestival",  events.filter(function(e){ return e.category==="festival"; }).length);

  /* Upcoming list */
  var ul = document.getElementById("upcomingList"); if(!ul) return;
  ul.innerHTML = upcoming.slice(0,4).map(function(e){
    return '<div class="ov-row"><div class="ov-left">' +
      '<div class="ov-date-box">'+e.day+'<br>'+e.month+'</div>' +
      '<div><div class="ov-title">'+e.title+'</div><div class="ov-sub">'+e.time+' • '+e.location+'</div></div>' +
      '<span class="rsvp-pill">👥 '+e.joining+' Joining</span></div>';
  }).join("");

  /* Recently Joining */
  var rr = document.getElementById("recentRsvpList"); if(!rr) return;
  rr.innerHTML = attendees.slice(0,4).map(function(r){
    return '<div class="ov-row"><div class="ov-left"><div class="ov-title">'+r.name+'</div><div class="ov-sub">'+r.event+' • '+r.date+'</div></div>' +
      '<span class="status-badge '+(r.status==="attended"?"completed":"upcoming")+'">'+cap(r.status)+'</span></div>';
  }).join("");

  renderChart();
}

function renderChart() {
  var wrap = document.getElementById("chartWrap"); if(!wrap) return;
  var cats = ["Health","Social","Meeting","Festival","Sports","Cultural"];
  var vals = events.reduce(function(acc,e){
    var k = cap(e.category); acc[k] = (acc[k]||0) + e.joining; return acc;
  },{});
  var data = cats.map(function(c){ return {label:c, val:vals[c]||0}; });
  var max  = Math.max.apply(null, data.map(function(d){ return d.val; })) || 1;
  wrap.innerHTML = data.map(function(d){
    return '<div class="chart-bar-col"><div class="chart-bar-val">'+d.val+'</div>' +
      '<div class="chart-bar" style="height:'+Math.round(d.val/max*100)+'%"></div>' +
      '<div class="chart-bar-day">'+d.label+'</div></div>';
  }).join("");
}

/* ── Manage Events ── */
var badgeLabels = {health:"🏥 Health",social:"🤝 Social",meeting:"📋 Meeting",festival:"🎉 Festival",sports:"🏅 Sports",cultural:"🎭 Cultural"};

function renderManageList(list) {
  var el = document.getElementById("manageEventsList"); if(!el) return;
  if(!list.length){ el.innerHTML='<div style="text-align:center;padding:40px;color:#aaa;">No events found.</div>'; return; }
  el.innerHTML = list.map(function(e){
    return '<div class="manage-ev-card">' +
      '<div class="mev-date"><span class="day">'+e.day+'</span><span class="mon">'+e.month+'</span></div>' +
      '<div class="mev-info"><div class="mev-title">'+e.title+'</div>' +
        '<div class="mev-meta">🕐 '+e.time+' • 📍 '+e.location+' &nbsp;<span class="ev-badge-sm '+e.category+'">'+(badgeLabels[e.category]||e.category)+'</span></div>' +
      '</div>' +
      '<span class="rsvp-pill">👥 '+e.joining+'</span>' +
      '<div class="mev-actions">' +
        '<button class="btn-edit-ev" onclick="editEvent('+e.id+')">✏️ Edit</button>' +
        '<button class="btn-del-ev"  onclick="deleteEvent('+e.id+')">🗑️</button>' +
      '</div></div>';
  }).join("");
}

function filterManage(cat, btn) {
  document.querySelectorAll(".filter-btn").forEach(function(b){ b.classList.remove("active"); });
  btn.classList.add("active");
  renderManageList(cat==="all" ? events : events.filter(function(e){ return e.category===cat; }));
}

function editEvent(id) {
  var ev = events.find(function(e){ return e.id===id; }); if(!ev) return;
  editingEventId = id;
  setText("eventModalTitle","✏️ Edit Event");
  setVal("evTitle",ev.title); setVal("evDate",ev.date); setVal("evTime",ev.time);
  setVal("evLocation",ev.location); setVal("evDesc",ev.desc);
  document.getElementById("evCategory").value = ev.category;
  document.getElementById("eventModal").classList.add("open");
}

function deleteEvent(id) {
  if(!confirm("Delete this event?")) return;
  events = events.filter(function(e){ return e.id!==id; });
  renderManageList(events); renderOverview(); renderRsvpTable(events); renderCalendar();
  toast("🗑️ Event deleted.");
}

/* ── Create / Edit Event Modal ── */
function openEventModal() {
  editingEventId = null;
  setText("eventModalTitle","📅 Create New Event");
  ["evTitle","evDate","evTime","evLocation","evDesc","evMax"].forEach(function(id){ setVal(id,""); });
  document.getElementById("evCategory").value="health";
  document.getElementById("eventModal").classList.add("open");
}

function closeEventModal() { document.getElementById("eventModal").classList.remove("open"); }

function submitEvent() {
  var title = getVal("evTitle").trim(), dateVal = getVal("evDate"), time = getVal("evTime").trim(), loc = getVal("evLocation").trim(), desc = getVal("evDesc").trim();
  if(!title||!dateVal||!time||!loc||!desc){ toast("⚠️ All required fields must be filled."); return; }
  var d = new Date(dateVal);
  var months=["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
  var ev = {
    id:       editingEventId || Date.now(),
    title:    title, date: dateVal,
    day:      String(d.getDate()).padStart(2,"0"),
    month:    months[d.getMonth()],
    time:     time, location: loc,
    category: document.getElementById("evCategory").value,
    desc:     desc, joining: 0, status:"upcoming"
  };
  if(editingEventId) { var i=events.findIndex(function(e){ return e.id===editingEventId; }); if(i>-1){ ev.joining=events[i].joining; events[i]=ev; } toast("✅ Event updated!"); }
  else { events.unshift(ev); toast("✅ Event created!"); }
  closeEventModal(); renderManageList(events); renderOverview(); renderRsvpTable(events); renderCalendar();
}

/* ── Joining Table ── */
function renderRsvpTable(list) {
  var b = document.getElementById("rsvpTableBody"); if(!b) return;
  b.innerHTML = list.map(function(e,i){
    return '<tr><td>'+(i+1)+'</td><td><strong>'+e.title+'</strong></td>' +
      '<td><span class="ev-badge-sm '+e.category+'">'+(badgeLabels[e.category]||e.category)+'</span></td>' +
      '<td>'+e.day+' '+e.month+'</td>' +
      '<td><span class="rsvp-pill">👥 '+e.joining+'</span></td>' +
      '<td><span class="status-badge '+e.status+'">'+cap(e.status)+'</span></td></tr>';
  }).join("");
}

function filterRsvpTable(cat, btn) {
  document.querySelectorAll(".filter-btn").forEach(function(b){ b.classList.remove("active"); });
  btn.classList.add("active");
  renderRsvpTable(cat==="all" ? events : events.filter(function(e){ return e.category===cat; }));
}

/* ── Calendar ── */
function renderCalendar() {
  var grid = document.getElementById("calGrid"); if(!grid) return;
  setText("calTitle", ["January","February","March","April","May","June","July","August","September","October","November","December"][calMonth]+" "+calYear);
  var days=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  var firstDay = new Date(calYear,calMonth,1).getDay();
  var daysInMonth = new Date(calYear,calMonth+1,0).getDate();
  var today = new Date();
  var eventDays = {};
  events.forEach(function(e){ var d=new Date(e.date); if(d.getFullYear()===calYear&&d.getMonth()===calMonth) eventDays[d.getDate()]=e; });

  grid.innerHTML = days.map(function(d){ return '<div class="cal-day-name">'+d+'</div>'; }).join("") +
    Array(firstDay).fill('<div class="cal-day empty"></div>').join("") +
    Array.from({length:daysInMonth},function(_,i){
      var day=i+1, isToday=(day===today.getDate()&&calMonth===today.getMonth()&&calYear===today.getFullYear());
      var hasEv=eventDays[day];
      var cls="cal-day"+(isToday?" today":"")+(hasEv?" has-event":"");
      var dot=hasEv?'<div class="cal-event-dot"></div>':"";
      var click=hasEv?' onclick="toast(\'📅 '+hasEv.title+'\')"':"";
      return '<div class="'+cls+'"'+click+'>'+day+dot+'</div>';
    }).join("");

  /* Events this month list */
  var list = document.getElementById("calEventsList"); if(!list) return;
  var thisMonth = events.filter(function(e){ var d=new Date(e.date); return d.getFullYear()===calYear&&d.getMonth()===calMonth; });
  list.innerHTML = thisMonth.length
    ? thisMonth.map(function(e){ return '<div class="cal-ev-row"><div class="cal-ev-dot"></div><div><div class="cal-ev-title">'+e.title+'</div><div class="cal-ev-sub">'+e.day+' '+e.month+' • '+e.time+' • '+e.location+'</div></div></div>'; }).join("")
    : '<div style="padding:16px;color:#aaa;text-align:center;">No events this month.</div>';
}

function prevMonth() { calMonth--; if(calMonth<0){ calMonth=11; calYear--; } renderCalendar(); }
function nextMonth() { calMonth++; if(calMonth>11){ calMonth=0; calYear++; } renderCalendar(); }

/* ── Gallery ── */
function renderGallery(list) {
  var g = document.getElementById("galleryGrid"); if(!g) return;
  g.innerHTML = list.map(function(p){
    return '<div class="gallery-card">' +
      '<div class="gallery-thumb">'+p.emoji+'</div>' +
      '<div class="gallery-info"><div class="gallery-event">'+p.event+'</div><div class="gallery-caption">'+p.caption+'</div></div>' +
      '</div>';
  }).join("");
}

function openGalleryModal()  { ["galEvent","galCaption","galEmoji"].forEach(function(id){setVal(id,"");}); document.getElementById("galleryModal").classList.add("open"); }
function closeGalleryModal() { document.getElementById("galleryModal").classList.remove("open"); }

function submitGallery() {
  var ev=getVal("galEvent").trim(), cap2=getVal("galCaption").trim(), emoji=getVal("galEmoji").trim();
  if(!ev){ toast("⚠️ Event name required."); return; }
  gallery.unshift({id:Date.now(), event:ev, caption:cap2||"", emoji:emoji||"🖼️"});
  closeGalleryModal(); renderGallery(gallery); toast("✅ Photo added!");
}

/* ── Clock ── */
function startClock() {
  var el=document.getElementById("navClock"); if(!el) return;
  function tick(){ var n=new Date(); el.textContent="🕐 "+String(n.getHours()).padStart(2,"0")+":"+String(n.getMinutes()).padStart(2,"0"); }
  tick(); setInterval(tick,60000);
}

/* ── Modal overlay close ── */
document.addEventListener("click",function(e){
  ["eventModal","galleryModal"].forEach(function(id){ var m=document.getElementById(id); if(m&&e.target===m) m.classList.remove("open"); });
});

/* ── Toast ── */
function toast(msg){ var t=document.getElementById("toast"); if(!t) return; t.textContent=msg; t.classList.add("show"); setTimeout(function(){ t.classList.remove("show"); },3000); }

/* ── Helpers ── */
function cap(s)         { return s?s.charAt(0).toUpperCase()+s.slice(1):""; }
function setText(id,v)  { var e=document.getElementById(id); if(e) e.textContent=v; }
function setVal(id,v)   { var e=document.getElementById(id); if(e) e.value=v||""; }
function getVal(id)     { var e=document.getElementById(id); return e?e.value:""; }
