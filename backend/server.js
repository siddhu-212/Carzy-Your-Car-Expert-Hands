const path = require("path");
const express  = require('express');
const cors     = require('cors');
const { initDB, Garages, Bookings, Customers, Vendors } = require('./database');

const app  = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = 'carzy2026';

app.use(cors({ origin: '*' }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "../")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../index.html"));
});

// ── GARAGES ───────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.get('/api/garages', (req, res) => {
  const { area = '', service = '' } = req.query;
  Garages.getAll(area, service, (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed' });
    res.json(data);
  });
});

app.get('/api/garages/list', (req, res) => {
  Garages.getAll('', '', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed' });
    res.json(data.map(g => ({ id: g.id, name: g.name, area: g.area })));
  });
});

app.get('/api/garages/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid id' });
  Garages.getById(id, (err, garage) => {
    if (err) return res.status(500).json({ error: 'Failed' });
    if (!garage) return res.status(404).json({ error: 'Not found' });
    res.json(garage);
  });
});

// ── BOOKINGS ──────────────────────────────────────────────────────────
app.post('/api/bookings', (req, res) => {
  const { garageId, garageName, serviceCategory, slotTime, customerName, customerPhone, customerEmail, area } = req.body;
  if (!garageId || !garageName || !serviceCategory || !slotTime || !customerName || !customerPhone || !customerEmail || !area)
    return res.status(400).json({ error: 'All fields required' });
  Bookings.create({ garageId, garageName, serviceCategory, slotTime, customerName, customerPhone, customerEmail, area }, (err, id) => {
    if (err) return res.status(500).json({ error: 'Failed' });
    res.status(201).json({ id, message: 'Booking confirmed' });
  });
});

app.get('/api/bookings', (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'email required' });
  Bookings.getByEmail(email, (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed' });
    res.json(data);
  });
});

app.patch('/api/bookings/:id/cancel', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid id' });
  Bookings.cancel(id, (err, ok) => {
    if (err) return res.status(500).json({ error: 'Failed' });
    if (!ok) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Cancelled' });
  });
});

// ── CUSTOMER AUTH ─────────────────────────────────────────────────────
app.post('/api/customer/signup', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });
  if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });
  Customers.signup(name, email, password, (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed' });
    if (result.error) return res.status(400).json({ error: result.error });
    res.status(201).json({ success: true, user: result });
  });
});

app.post('/api/customer/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'All fields required' });
  Customers.login(email, password, (err, user) => {
    if (err) return res.status(500).json({ error: 'Failed' });
    if (!user) return res.status(401).json({ error: 'Wrong email or password' });
    res.json({ success: true, user });
  });
});

// ── VENDOR AUTH ───────────────────────────────────────────────────────
app.post('/api/vendor/signup', (req, res) => {
  const { name, email, password, garageId } = req.body;
  if (!name || !email || !password || !garageId) return res.status(400).json({ error: 'All fields required' });
  if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });
  Vendors.signup(name, email, password, parseInt(garageId), (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed' });
    if (result.error) return res.status(400).json({ error: result.error });
    res.status(201).json({ success: true, vendor: result });
  });
});

app.post('/api/vendor/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'All fields required' });
  Vendors.login(email, password, (err, vendor) => {
    if (err) return res.status(500).json({ error: 'Failed' });
    if (!vendor) return res.status(401).json({ error: 'Wrong email or password' });
    res.json({ success: true, vendor });
  });
});

app.get('/api/vendor/bookings', (req, res) => {
  const { garageId } = req.query;
  if (!garageId) return res.status(400).json({ error: 'garageId required' });
  Bookings.getByGarageId(parseInt(garageId), (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed' });
    res.json(data);
  });
});

// ── ADMIN API ─────────────────────────────────────────────────────────
app.post('/api/admin/login', (req, res) => {
  req.body.password === ADMIN_PASSWORD
    ? res.json({ success: true })
    : res.status(401).json({ success: false, error: 'Wrong password' });
});

app.get('/api/admin/bookings', (req, res) => {
  const { password, status = '', garage = '' } = req.query;
  if (password !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Unauthorized' });
  Bookings.getAll(status, garage, (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed' });
    res.json(data);
  });
});

app.get('/api/admin/vendors', (req, res) => {
  const { password } = req.query;
  if (password !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Unauthorized' });
  Vendors.getAllWithGarages((err, data) => {
    if (err) return res.status(500).json({ error: 'Failed' });
    res.json(data);
  });
});

// ── ADMIN DASHBOARD ───────────────────────────────────────────────────
app.get('/admin', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>CarZy Admin</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}body{font-family:system-ui,sans-serif;background:#f1f5f9;color:#1e293b}
.wrap{min-height:100vh;display:flex;align-items:center;justify-content:center}
.box{background:white;padding:40px;border-radius:16px;box-shadow:0 4px 24px rgba(0,0,0,0.1);width:100%;max-width:380px}
.box h1{font-size:1.5rem;font-weight:800;margin-bottom:6px;color:#0d2137}.box p{color:#64748b;font-size:0.9rem;margin-bottom:24px}
input{width:100%;padding:11px 14px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:0.95rem;margin-bottom:14px;outline:none;font-family:inherit}
input:focus{border-color:#0d2137}.btn{width:100%;padding:12px;background:#0d2137;color:white;border:none;border-radius:10px;font-size:1rem;font-weight:700;cursor:pointer}.btn:hover{background:#163352}
.err{color:#dc2626;font-size:0.85rem;margin-top:4px}
header{background:#0d2137;color:white;padding:16px 32px;display:flex;align-items:center;justify-content:space-between}
header h1{font-size:1.2rem;font-weight:800}.logout{padding:8px 18px;background:#f4b400;color:#0d2137;border:none;border-radius:8px;font-weight:700;cursor:pointer}
.dash{max-width:1200px;margin:0 auto;padding:28px 24px}
.stats{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:16px;margin-bottom:28px}
.stat{background:white;padding:20px;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.06)}.stat .num{font-size:2rem;font-weight:800;color:#0d2137}.stat .lbl{color:#64748b;font-size:0.85rem;margin-top:4px}
.tabs{display:flex;gap:8px;margin-bottom:20px}.tab{padding:10px 24px;border-radius:8px;border:1.5px solid #e2e8f0;background:white;font-weight:700;font-size:0.875rem;cursor:pointer;color:#64748b}.tab.active{background:#0d2137;color:white;border-color:#0d2137}
.filters{background:white;padding:16px 20px;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.06);margin-bottom:20px;display:flex;gap:12px;flex-wrap:wrap;align-items:flex-end}
.filters label{font-size:0.75rem;font-weight:700;text-transform:uppercase;color:#64748b;display:block;margin-bottom:5px}
.filters select,.filters input[type=text]{padding:9px 12px;border:1.5px solid #e2e8f0;border-radius:8px;font-size:0.9rem;outline:none;min-width:160px;margin-bottom:0;width:auto}
.fbtn{padding:10px 20px;background:#0d2137;color:white;border:none;border-radius:8px;font-weight:700;cursor:pointer;font-size:0.875rem}
table{width:100%;background:white;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);border-collapse:collapse}
th{background:#0d2137;color:white;padding:12px 16px;text-align:left;font-size:0.78rem;font-weight:700;text-transform:uppercase}
td{padding:12px 16px;border-bottom:1px solid #f1f5f9;font-size:0.875rem}tr:last-child td{border-bottom:none}tr:hover td{background:#f8fafc}
.badge{padding:3px 10px;border-radius:999px;font-size:0.75rem;font-weight:700}.confirmed{background:#d1fae5;color:#059669}.cancelled{background:#fee2e2;color:#dc2626}
.cbtn{padding:5px 12px;border-radius:7px;border:1.5px solid #dc2626;color:#dc2626;background:transparent;font-size:0.78rem;font-weight:700;cursor:pointer}.cbtn:hover{background:#dc2626;color:white}
.empty{text-align:center;padding:48px;color:#94a3b8}
</style></head><body>
<div id="ls" class="wrap"><div class="box"><h1>CarZy Admin</h1><p>Owner dashboard</p>
<input type="password" id="pwd" placeholder="Admin password" onkeydown="if(event.key==='Enter')login()"/>
<button class="btn" onclick="login()">Login</button><div class="err" id="le"></div></div></div>
<div id="ds" style="display:none">
<header><h1>CarZy Admin Dashboard</h1><button class="logout" onclick="logout()">Logout</button></header>
<div class="dash">
<div class="stats">
<div class="stat"><div class="num" id="s1">0</div><div class="lbl">Total Bookings</div></div>
<div class="stat"><div class="num" id="s2">0</div><div class="lbl">Confirmed</div></div>
<div class="stat"><div class="num" id="s3">0</div><div class="lbl">Cancelled</div></div>
<div class="stat"><div class="num" id="s4">0</div><div class="lbl">Registered Vendors</div></div>
</div>
<div class="tabs">
<button class="tab active" onclick="switchTab('bookings',this)">All Bookings</button>
<button class="tab" onclick="switchTab('vendors',this)">Registered Vendors</button>
</div>
<div id="tab-bookings">
<div class="filters">
<div><label>Status</label><select id="fs"><option value="">All</option><option value="confirmed">Confirmed</option><option value="cancelled">Cancelled</option></select></div>
<div><label>Garage</label><input type="text" id="fg" placeholder="Garage name..."/></div>
<div style="margin-top:19px"><button class="fbtn" onclick="loadBookings()">Apply</button></div>
<div style="margin-top:19px"><button class="fbtn" style="background:#f4b400;color:#0d2137" onclick="loadBookings()">Refresh</button></div>
</div>
<table><thead><tr><th>#</th><th>Customer</th><th>Email</th><th>Phone</th><th>Garage</th><th>Service</th><th>Slot</th><th>City</th><th>Date</th><th>Status</th><th>Action</th></tr></thead>
<tbody id="bt"><tr><td colspan="11" class="empty">Loading...</td></tr></tbody></table>
</div>
<div id="tab-vendors" style="display:none">
<table><thead><tr><th>#</th><th>Vendor Name</th><th>Email</th><th>Garage</th><th>Garage ID</th></tr></thead>
<tbody id="vt"><tr><td colspan="5" class="empty">Loading...</td></tr></tbody></table>
</div>
</div></div>
<script>
let pwd='';
function login(){const p=document.getElementById('pwd').value;fetch('/api/admin/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password:p})}).then(r=>r.json()).then(d=>{if(d.success){pwd=p;document.getElementById('ls').style.display='none';document.getElementById('ds').style.display='block';loadBookings();}else document.getElementById('le').textContent='Wrong password.';})}
function logout(){pwd='';document.getElementById('ls').style.display='flex';document.getElementById('ds').style.display='none';document.getElementById('pwd').value='';}
function switchTab(name,btn){document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));btn.classList.add('active');document.getElementById('tab-bookings').style.display=name==='bookings'?'block':'none';document.getElementById('tab-vendors').style.display=name==='vendors'?'block':'none';if(name==='vendors')loadVendors();}
function loadBookings(){const st=document.getElementById('fs').value,gr=document.getElementById('fg').value;fetch('/api/admin/bookings?password='+pwd+'&status='+encodeURIComponent(st)+'&garage='+encodeURIComponent(gr)).then(r=>r.json()).then(b=>{document.getElementById('s1').textContent=b.length;document.getElementById('s2').textContent=b.filter(x=>x.status==='confirmed').length;document.getElementById('s3').textContent=b.filter(x=>x.status==='cancelled').length;const tb=document.getElementById('bt');if(!b.length){tb.innerHTML='<tr><td colspan="11" class="empty">No bookings</td></tr>';return;}tb.innerHTML=b.map(x=>'<tr><td>'+x.id+'</td><td><strong>'+x.customerName+'</strong></td><td>'+x.customerEmail+'</td><td>'+x.customerPhone+'</td><td>'+x.garageName+'</td><td>'+x.serviceCategory+'</td><td>'+x.slotTime+'</td><td>'+x.area+'</td><td>'+new Date(x.createdAt).toLocaleDateString('en-IN')+'</td><td><span class="badge '+x.status+'">'+x.status+'</span></td><td>'+(x.status!=='cancelled'?'<button class="cbtn" onclick="cancelB('+x.id+')">Cancel</button>':'-')+'</td></tr>').join('');})}
function loadVendors(){fetch('/api/admin/vendors?password='+pwd).then(r=>r.json()).then(v=>{document.getElementById('s4').textContent=v.length;document.getElementById('vt').innerHTML=v.length?v.map(x=>'<tr><td>'+x.id+'</td><td>'+x.name+'</td><td>'+x.email+'</td><td>'+x.garage_name+'</td><td>'+x.garage_id+'</td></tr>').join(''):'<tr><td colspan="5" class="empty">No vendors registered yet</td></tr>';})}
function cancelB(id){if(!confirm('Cancel this booking?'))return;fetch('/api/bookings/'+id+'/cancel',{method:'PATCH'}).then(()=>loadBookings());}
</script></body></html>`);
});

// ── VENDOR DASHBOARD ──────────────────────────────────────────────────
app.get('/vendor', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>CarZy Vendor</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}body{font-family:system-ui,sans-serif;background:#f1f5f9;color:#1e293b}
.wrap{min-height:100vh;display:flex;align-items:center;justify-content:center}
.box{background:white;padding:40px;border-radius:16px;box-shadow:0 4px 24px rgba(0,0,0,0.1);width:100%;max-width:420px}
.box h1{font-size:1.5rem;font-weight:800;margin-bottom:6px;color:#0d2137}.box p{color:#64748b;font-size:0.9rem;margin-bottom:24px}
.tabs2{display:flex;gap:0;margin-bottom:24px;border:1.5px solid #e2e8f0;border-radius:10px;overflow:hidden}
.tab2{flex:1;padding:10px;text-align:center;font-weight:700;font-size:0.875rem;cursor:pointer;background:white;color:#64748b;border:none}
.tab2.active{background:#0d2137;color:white}
input,select{width:100%;padding:11px 14px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:0.95rem;margin-bottom:14px;outline:none;font-family:inherit}
input:focus,select:focus{border-color:#0d2137}
.btn{width:100%;padding:12px;background:#0d2137;color:white;border:none;border-radius:10px;font-size:1rem;font-weight:700;cursor:pointer;margin-bottom:8px}.btn:hover{background:#163352}
.err{color:#dc2626;font-size:0.85rem;margin-top:4px;margin-bottom:8px}.suc{color:#059669;font-size:0.85rem;margin-bottom:8px}
.lbl{font-size:0.78rem;font-weight:700;text-transform:uppercase;color:#64748b;display:block;margin-bottom:5px}
header{background:#0d2137;color:white;padding:16px 32px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px}
header h1{font-size:1.1rem;font-weight:800}.logout{padding:8px 18px;background:#f4b400;color:#0d2137;border:none;border-radius:8px;font-weight:700;cursor:pointer}
.dash{max-width:1000px;margin:0 auto;padding:28px 24px}
.ginfo{background:white;padding:20px 24px;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.06);margin-bottom:24px;display:flex;align-items:center;gap:16px}
.gav{width:56px;height:56px;border-radius:12px;background:#0d2137;color:#f4b400;display:flex;align-items:center;justify-content:center;font-size:1.5rem;font-weight:800;flex-shrink:0}
.gn{font-size:1.2rem;font-weight:800;color:#0d2137}.gs{color:#64748b;font-size:0.875rem;margin-top:2px}
.stats{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:16px;margin-bottom:24px}
.stat{background:white;padding:18px;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.06)}.stat .num{font-size:1.8rem;font-weight:800;color:#0d2137}.stat .lbl2{color:#64748b;font-size:0.82rem;margin-top:4px}
table{width:100%;background:white;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);border-collapse:collapse}
th{background:#0d2137;color:white;padding:12px 16px;text-align:left;font-size:0.78rem;font-weight:700;text-transform:uppercase}
td{padding:12px 16px;border-bottom:1px solid #f1f5f9;font-size:0.875rem}tr:last-child td{border-bottom:none}tr:hover td{background:#f8fafc}
.badge{padding:3px 10px;border-radius:999px;font-size:0.75rem;font-weight:700}.confirmed{background:#d1fae5;color:#059669}.cancelled{background:#fee2e2;color:#dc2626}
.cbtn{padding:5px 12px;border-radius:7px;border:1.5px solid #dc2626;color:#dc2626;background:transparent;font-size:0.78rem;font-weight:700;cursor:pointer}.cbtn:hover{background:#dc2626;color:white}
.empty{text-align:center;padding:48px;color:#94a3b8}
</style></head><body>
<div id="ls" class="wrap"><div class="box">
<h1>Vendor Portal</h1><p>CarZy Garage Management</p>
<div class="tabs2">
<button class="tab2 active" id="tlogin" onclick="showTab('login')">Login</button>
<button class="tab2" id="tsignup" onclick="showTab('signup')">Sign Up</button>
</div>
<div id="login-form">
<label class="lbl">Email</label><input type="email" id="le" placeholder="you@garage.com"/>
<label class="lbl">Password</label><input type="password" id="lp" placeholder="Your password" onkeydown="if(event.key==='Enter')vlogin()"/>
<button class="btn" onclick="vlogin()">Login</button>
<div class="err" id="lerr"></div>
</div>
<div id="signup-form" style="display:none">
<label class="lbl">Your Name</label><input type="text" id="sn" placeholder="John Doe"/>
<label class="lbl">Email</label><input type="email" id="se" placeholder="you@garage.com"/>
<label class="lbl">Password (min 6 chars)</label><input type="password" id="sp" placeholder="Create password"/>
<label class="lbl">Select Your Garage</label>
<select id="sgid"><option value="">Loading garages...</option></select>
<button class="btn" onclick="vsignup()">Create Account</button>
<div class="err" id="serr"></div>
<div class="suc" id="ssuc"></div>
</div>
</div></div>
<div id="ds" style="display:none">
<header><h1>CarZy Vendor Dashboard</h1><button class="logout" onclick="vlogout()">Logout</button></header>
<div class="dash">
<div class="ginfo"><div class="gav" id="ga">?</div><div><div class="gn" id="gname">Loading...</div><div class="gs" id="vemail"></div></div></div>
<div class="stats">
<div class="stat"><div class="num" id="vs1">0</div><div class="lbl2">Total</div></div>
<div class="stat"><div class="num" id="vs2">0</div><div class="lbl2">Confirmed</div></div>
<div class="stat"><div class="num" id="vs3">0</div><div class="lbl2">Cancelled</div></div>
<div class="stat"><div class="num" id="vs4">0</div><div class="lbl2">Today</div></div>
</div>
<table><thead><tr><th>#</th><th>Customer</th><th>Email</th><th>Phone</th><th>Service</th><th>Slot</th><th>Date</th><th>Status</th><th>Action</th></tr></thead>
<tbody id="vbt"><tr><td colspan="9" class="empty">Loading...</td></tr></tbody></table>
</div></div>
<script>
let vdata=null;
function showTab(t){document.getElementById('login-form').style.display=t==='login'?'block':'none';document.getElementById('signup-form').style.display=t==='signup'?'block':'none';document.getElementById('tlogin').classList.toggle('active',t==='login');document.getElementById('tsignup').classList.toggle('active',t==='signup');if(t==='signup')loadGarageList();}
function loadGarageList(){fetch('http://localhost:3000/api/garages/list').then(r=>r.json()).then(g=>{const s=document.getElementById('sgid');s.innerHTML='<option value="">-- Select your garage --</option>'+g.map(x=>'<option value="'+x.id+'">'+x.name+' ('+x.area+')</option>').join('');});}
function vlogin(){const e=document.getElementById('le').value,p=document.getElementById('lp').value;if(!e||!p){document.getElementById('lerr').textContent='Please fill all fields.';return;}fetch('http://localhost:3000/api/vendor/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:e,password:p})}).then(r=>r.json()).then(d=>{if(d.success){vdata=d.vendor;showDash();}else document.getElementById('lerr').textContent=d.error||'Login failed.';});}
function vsignup(){const n=document.getElementById('sn').value,e=document.getElementById('se').value,p=document.getElementById('sp').value,g=document.getElementById('sgid').value;if(!n||!e||!p||!g){document.getElementById('serr').textContent='Please fill all fields.';return;}fetch('http://localhost:3000/api/vendor/signup',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:n,email:e,password:p,garageId:parseInt(g)})}).then(r=>r.json()).then(d=>{if(d.success){document.getElementById('serr').textContent='';document.getElementById('ssuc').textContent='Account created! You can now login.';document.getElementById('sn').value='';document.getElementById('se').value='';document.getElementById('sp').value='';showTab('login');}else{document.getElementById('ssuc').textContent='';document.getElementById('serr').textContent=d.error||'Signup failed.';}});}
function showDash(){document.getElementById('ls').style.display='none';document.getElementById('ds').style.display='block';document.getElementById('gname').textContent=vdata.garageName;document.getElementById('vemail').textContent=vdata.email;document.getElementById('ga').textContent=vdata.garageName.charAt(0);loadVBookings();}
function vlogout(){vdata=null;document.getElementById('ls').style.display='flex';document.getElementById('ds').style.display='none';}
function loadVBookings(){fetch('http://localhost:3000/api/vendor/bookings?garageId='+vdata.garageId).then(r=>r.json()).then(b=>{const today=new Date().toLocaleDateString('en-IN');document.getElementById('vs1').textContent=b.length;document.getElementById('vs2').textContent=b.filter(x=>x.status==='confirmed').length;document.getElementById('vs3').textContent=b.filter(x=>x.status==='cancelled').length;document.getElementById('vs4').textContent=b.filter(x=>new Date(x.createdAt).toLocaleDateString('en-IN')===today).length;const tb=document.getElementById('vbt');if(!b.length){tb.innerHTML='<tr><td colspan="9" class="empty">No bookings yet</td></tr>';return;}tb.innerHTML=b.map(x=>'<tr><td>'+x.id+'</td><td><strong>'+x.customerName+'</strong></td><td>'+x.customerEmail+'</td><td>'+x.customerPhone+'</td><td>'+x.serviceCategory+'</td><td>'+x.slotTime+'</td><td>'+new Date(x.createdAt).toLocaleDateString('en-IN')+'</td><td><span class="badge '+x.status+'">'+x.status+'</span></td><td>'+(x.status!=='cancelled'?'<button class="cbtn" onclick="vcancelB('+x.id+')">Cancel</button>':'-')+'</td></tr>').join('');})}
function vcancelB(id){if(!confirm('Cancel this booking?'))return;fetch('http://localhost:3000/api/bookings/'+id+'/cancel',{method:'PATCH'}).then(()=>loadVBookings());}
</script></body></html>`);
});

// ── START ─────────────────────────────────────────────────────────────
initDB().then(() => {
  app.listen(PORT, () => {
    console.log('');
    console.log('  CarZy backend is running!');
    console.log('  http://localhost:' + PORT);
    console.log('');
    console.log('  Admin Dashboard  → http://localhost:' + PORT + '/admin   (password: ' + ADMIN_PASSWORD + ')');
    console.log('  Vendor Portal    → http://localhost:' + PORT + '/vendor');
    console.log('');
  });
}).catch(err => { console.error('DB init failed:', err); process.exit(1); });
