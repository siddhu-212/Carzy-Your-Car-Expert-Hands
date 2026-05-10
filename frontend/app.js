// ── API CONFIG ────────────────────────────────────────────────────────
// Change this URL if you deploy the backend to a server
const API_BASE = 'http://localhost:3000/api';

// ── STATIC DATA (used only for categories + packages, not from DB) ────
const CATEGORIES = [
  {name:"Car Washing",      icon:'<path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>'},
  {name:"Detailing",        icon:'<path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>'},
  {name:"Maintenance",      icon:'<path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>'},
  {name:"Repairing",        icon:'<path stroke-linecap="round" stroke-linejoin="round" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"/>'},
  {name:"Modification",     icon:'<path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>'},
  {name:"Emission Testing", icon:'<path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>'},
];

const PACKAGES = [
  {title:"Premium Detail Package", description:"Full interior + exterior detailing. Includes paint decontamination, wax, and deep vacuum.",                              price:"₹9,999", tag:"Most Popular"},
  {title:"Oil Change & Checkup",   description:"Synthetic oil change + 20-point inspection. Includes filter replacement and fluid top-off.",                           price:"₹3,999", tag:"Quick Service"},
  {title:"Full Car Wash",          description:"Hand wash + vacuum + tire shine + window clean. Fresh and spotless in 45 minutes.",                                   price:"₹2,499", tag:"Best Value"},
  {title:"Emission Test + Tune",   description:"Certified emission test + minor tune-up. Includes spark plug check and air filter replacement.",                       price:"₹6,499", tag:"Compliance"},
];

const GRADIENTS = [
  "linear-gradient(135deg,#1a3a5c,#2d6a8e)",
  "linear-gradient(135deg,#1a5c3a,#2d8e6a)",
  "linear-gradient(135deg,#5c2d1a,#8e5a2d)",
  "linear-gradient(135deg,#3a1a5c,#6a2d8e)",
  "linear-gradient(135deg,#1a4c5c,#2d7a8e)",
  "linear-gradient(135deg,#5c1a3a,#8e2d6a)",
];

let currentGarageId = null;

// ── API HELPERS ───────────────────────────────────────────────────────

async function apiFetch(path, options = {}) {
  const res = await fetch(API_BASE + path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

// ── RENDER FUNCTIONS ──────────────────────────────────────────────────

function garageCardHTML(g, idx) {
  const gr = GRADIENTS[idx % GRADIENTS.length];
  const svcTags = g.servicesOffered.slice(0, 3).map(s => `<span class="tag">${s}</span>`).join('');
  const extra = g.servicesOffered.length > 3
    ? `<span class="tag tag-more">+${g.servicesOffered.length - 3}</span>` : '';
  return `<div class="garage-card" onclick="showDetail(${g.id})">
    <div class="garage-thumb" style="background:${gr}">
      <span class="garage-thumb-letter">${g.name[0]}</span>
      <span class="garage-area-badge">${g.area}</span>
    </div>
    <div class="garage-body">
      <div class="garage-name-row">
        <div class="garage-name">${g.name}</div>
        <div class="rating">
          <span class="star">★</span>
          <span class="rating-num">${g.rating.toFixed(1)}</span>
          <span class="rating-count">(${g.reviewCount})</span>
        </div>
      </div>
      <div class="garage-addr">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
        ${g.address}
      </div>
      <div class="tags">${svcTags}${extra}</div>
      <div class="slots">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        ${g.availableSlots.length} slots available
      </div>
      <button class="btn-view" onclick="event.stopPropagation();showDetail(${g.id})">View Garage</button>
    </div>
  </div>`;
}

function setLoading(elId, msg = 'Loading...') {
  document.getElementById(elId).innerHTML =
    `<div style="grid-column:1/-1;text-align:center;padding:48px;color:var(--muted)">${msg}</div>`;
}

async function renderHome() {
  // Categories (static)
  document.getElementById('catGrid').innerHTML = CATEGORIES.map(c => `
    <div class="cat-card" onclick="showGaragesWithFilter('${c.name}','')">
      <div class="cat-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">${c.icon}</svg>
      </div>
      <span>${c.name}</span>
      <button class="btn-outline-sm" onclick="event.stopPropagation();showGaragesWithFilter('${c.name}','')">
        Explore Services
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>
      </button>
    </div>`).join('');

  // Top garages from API
  setLoading('featuredGarages', 'Loading top garages...');
  try {
    const garages = await apiFetch('/garages');
    const top4 = garages.slice(0, 4); // already sorted by rating desc from server
    document.getElementById('featuredGarages').innerHTML =
      top4.map((g, i) => garageCardHTML(g, i)).join('');
  } catch (err) {
    document.getElementById('featuredGarages').innerHTML =
      `<div style="grid-column:1/-1;text-align:center;color:var(--muted);padding:32px">
        Could not load garages. Make sure the backend server is running.<br>
        <code style="font-size:0.8rem">cd carzy-backend && npm start</code>
      </div>`;
  }

  // Packages (static)
  document.getElementById('packagesGrid').innerHTML = PACKAGES.map(p => `
    <div class="pkg-card">
      <span class="pkg-tag">${p.tag}</span>
      <div class="pkg-title">${p.title}</div>
      <div class="pkg-desc">${p.description}</div>
      <div class="pkg-footer">
        <span class="pkg-price">${p.price}</span>
        <button class="btn-book" onclick="showPage('garages')">Book Now</button>
      </div>
    </div>`).join('');
}

async function renderGarages(svc, area) {
  setLoading('garagesList', 'Searching garages...');

  const title = (svc || area)
    ? `${svc || 'All Services'} in ${area || 'All Cities'}` : 'All Garages';
  document.getElementById('resultsTitle').textContent = title;
  document.getElementById('resultsCount').textContent = 'Searching...';

  try {
    const params = new URLSearchParams();
    if (area) params.set('area', area);
    if (svc)  params.set('service', svc);
    const query = params.toString() ? '?' + params.toString() : '';

    const garages = await apiFetch('/garages' + query);
    document.getElementById('resultsCount').textContent =
      `${garages.length} garage${garages.length !== 1 ? 's' : ''} found`;

    if (garages.length === 0) {
      document.getElementById('garagesList').innerHTML = `
        <div class="empty-state" style="grid-column:1/-1">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <h3>No garages found</h3>
          <p>Try changing your filters or city to find available garages.</p>
          <button class="btn-outline" onclick="clearFilters()">Clear Filters</button>
        </div>`;
    } else {
      document.getElementById('garagesList').innerHTML =
        garages.map((g, i) => garageCardHTML(g, i)).join('');
    }
  } catch (err) {
    document.getElementById('garagesList').innerHTML =
      `<div class="empty-state" style="grid-column:1/-1">
        <h3>Could not connect to server</h3>
        <p>Make sure the backend is running: <code>npm start</code> in the carzy-backend folder.</p>
      </div>`;
  }
}

async function renderDetail(id) {
  currentGarageId = id;

  document.getElementById('detailInfo').innerHTML =
    '<div style="padding:40px;text-align:center;color:var(--muted)">Loading garage...</div>';
  document.getElementById('detailBooking').innerHTML = '';

  try {
    const g = await apiFetch(`/garages/${id}`);

    const gi = (id - 1) % GRADIENTS.length;
    document.getElementById('detailBanner').style.background = GRADIENTS[gi];
    document.getElementById('detailLetter').textContent = g.name[0];

    const svcBadges = g.servicesOffered.map(s => `<span class="svc-badge">${s}</span>`).join('');
    const slotBtns  = g.availableSlots.map(s =>
      `<button class="slot-btn" onclick="selectSlot(this,'${s}')">${s}</button>`).join('');

    document.getElementById('detailInfo').innerHTML = `
      <div class="garage-title-row">
        <div class="garage-detail-name">${g.name}</div>
        <div class="rating-box">
          <span class="star">★</span>
          <span class="num">${g.rating.toFixed(1)}</span>
          <span class="cnt">(${g.reviewCount} reviews)</span>
        </div>
      </div>
      <div class="garage-addr" style="margin-bottom:12px;font-size:0.9rem">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:15px;height:15px"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
        ${g.address}, ${g.area}
      </div>
      <p class="detail-desc">${g.description}</p>
      <div class="detail-phone">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.82 12 19.79 19.79 0 011.73 3.47 2 2 0 013.7 1.27h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.91 8.92a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
        ${g.phone}
      </div>
      <div class="detail-section-title">Services Offered</div>
      <div class="services-tags">${svcBadges}</div>
      <div class="detail-section-title">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px;display:inline;margin-right:6px;vertical-align:-3px"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        Available Time Slots
      </div>
      <div class="slots-row" id="slotsRow">${slotBtns}</div>
    `;

    renderBookingForm(g);
  } catch (err) {
    document.getElementById('detailInfo').innerHTML =
      `<div style="padding:40px;text-align:center">
        <h2>Garage not found</h2>
        <button class="btn-outline" onclick="showPage('garages')" style="margin-top:16px">Browse Garages</button>
      </div>`;
  }
}

function renderBookingForm(g) {
  const svcOpts  = g.servicesOffered.map(s => `<option value="${s}">${s}</option>`).join('');
  const slotOpts = g.availableSlots.map(s => `<option value="${s}">${s}</option>`).join('');
  document.getElementById('detailBooking').innerHTML = `
    <div class="booking-card">
      <h2>Book a Service</h2>
      <div class="form-group">
        <label>Service *</label>
        <select id="bkService"><option value="">Select service</option>${svcOpts}</select>
      </div>
      <div class="form-group">
        <label>Time Slot *</label>
        <select id="bkSlot"><option value="">Choose a slot</option>${slotOpts}</select>
      </div>
      <div class="form-group">
        <label>Full Name *</label>
        <input type="text" id="bkName" placeholder="John Doe"/>
      </div>
      <div class="form-group">
        <label>Phone *</label>
        <input type="tel" id="bkPhone" placeholder="+91 98765 43210"/>
      </div>
      <div class="form-group">
        <label>Email *</label>
        <input type="email" id="bkEmail" placeholder="you@example.com"/>
      </div>
      <button class="btn-confirm" id="confirmBtn" onclick="confirmBooking()">Confirm Booking</button>
    </div>
  `;
}

function selectSlot(btn, slot) {
  document.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  const sel = document.getElementById('bkSlot');
  if (sel) sel.value = slot;
}

async function confirmBooking() {
  const svc   = document.getElementById('bkService').value;
  const slot  = document.getElementById('bkSlot').value;
  const name  = document.getElementById('bkName').value.trim();
  const phone = document.getElementById('bkPhone').value.trim();
  const email = document.getElementById('bkEmail').value.trim();

  if (!svc || !slot || !name || !phone || !email) {
    alert('Please fill in all fields.');
    return;
  }

  const btn = document.getElementById('confirmBtn');
  btn.textContent = 'Booking...';
  btn.disabled = true;

  try {
    const garage = await apiFetch(`/garages/${currentGarageId}`);
    await apiFetch('/bookings', {
      method: 'POST',
      body: JSON.stringify({
        garageId:        currentGarageId,
        garageName:      garage.name,
        serviceCategory: svc,
        slotTime:        slot,
        customerName:    name,
        customerPhone:   phone,
        customerEmail:   email,
        area:            garage.area,
      }),
    });

    document.getElementById('detailBooking').innerHTML = `
      <div class="booking-card">
        <div class="booking-success">
          <div class="check">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color:#059669"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h3>Booking Confirmed!</h3>
          <p>We'll send details to ${email}</p>
          <button class="btn-view-bookings" onclick="showPage('bookings')">View My Bookings</button>
        </div>
      </div>
    `;
  } catch (err) {
    btn.textContent = 'Confirm Booking';
    btn.disabled = false;
    alert('Failed to create booking. Please try again.');
  }
}

async function lookupBookings() {
  const email = document.getElementById('lookupEmail').value.trim();
  if (!email) { alert('Please enter your email.'); return; }

  const el = document.getElementById('bookingsResults');
  el.innerHTML = '<div style="text-align:center;padding:32px;color:var(--muted)">Looking up bookings...</div>';

  try {
    const bookings = await apiFetch(`/bookings?email=${encodeURIComponent(email)}`);

    if (bookings.length === 0) {
      el.innerHTML = `
        <div class="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          <h3>No bookings found</h3>
          <p>No bookings associated with ${email}</p>
        </div>`;
      return;
    }

    el.innerHTML = `<p style="color:var(--muted);font-size:0.875rem;margin-bottom:12px">${bookings.length} booking${bookings.length !== 1 ? 's' : ''} found</p>` +
      bookings.map(b => {
        const statusClass = b.status === 'confirmed' || b.status === 'active'
          ? 'status-confirmed' : b.status === 'cancelled' ? 'status-cancelled' : 'status-pending';
        const date = new Date(b.createdAt).toLocaleDateString();
        const cancelBtn = b.status !== 'cancelled'
          ? `<button class="btn-cancel" onclick="cancelBooking(${b.id},'${email}')">✕ Cancel</button>` : '';
        return `
          <div class="booking-item">
            <div class="booking-item-header">
              <div>
                <div class="booking-garage-name">${b.garageName}</div>
                <div class="booking-service">${b.serviceCategory}</div>
              </div>
              <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px">
                <span class="status-badge ${statusClass}">${b.status}</span>
                ${cancelBtn}
              </div>
            </div>
            <div class="booking-meta">
              <div class="booking-meta-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                ${b.slotTime}
              </div>
              <div class="booking-meta-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                ${b.area}
              </div>
              <div class="booking-meta-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                ${date}
              </div>
            </div>
          </div>`;
      }).join('');
  } catch (err) {
    el.innerHTML = '<div style="text-align:center;padding:32px;color:var(--muted)">Failed to fetch bookings. Is the server running?</div>';
  }
}

async function cancelBooking(id, email) {
  if (!confirm('Are you sure you want to cancel this booking?')) return;
  try {
    await apiFetch(`/bookings/${id}/cancel`, { method: 'PATCH' });
    lookupBookings();
  } catch (err) {
    alert('Failed to cancel booking.');
  }
}

// ── NAVIGATION ────────────────────────────────────────────────────────

function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  window.scrollTo(0, 0);
  if (name === 'garages') {
    const svc  = document.getElementById('filterService').value;
    const area = document.getElementById('filterArea').value;
    renderGarages(svc, area);
  }
  if (name === 'bookings' && currentUser) {
    document.getElementById('lookupEmail').value = currentUser.email;
    lookupBookings();
  }
}
function showDetail(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-detail').classList.add('active');
  renderDetail(id);
  window.scrollTo(0, 0);
}

function showGaragesWithFilter(svc, area) {
  document.getElementById('filterService').value = svc;
  document.getElementById('filterArea').value = area;
  showPage('garages');
  renderGarages(svc, area);
}

function heroSearch() {
  const svc  = document.getElementById('heroService').value;
  const area = document.getElementById('heroArea').value;
  showGaragesWithFilter(svc, area);
}

function navSearch() {
  const q = document.getElementById('navSearchInput').value.trim();
  const match = CATEGORIES.find(c => c.name.toLowerCase().includes(q.toLowerCase()));
  if (match) showGaragesWithFilter(match.name, '');
  else showGaragesWithFilter('', q);
}

function applyFilters() {
  const svc  = document.getElementById('filterService').value;
  const area = document.getElementById('filterArea').value;
  renderGarages(svc, area);
}

function clearFilters() {
  document.getElementById('filterService').value = '';
  document.getElementById('filterArea').value = '';
  renderGarages('', '');
}

function toggleMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
}

// ── INIT ──────────────────────────────────────────────────────────────
document.getElementById('footerYear').textContent = new Date().getFullYear();
renderHome();
renderGarages('', '');

// ── AUTH STATE ────────────────────────────────────────────────────────
let currentUser = JSON.parse(localStorage.getItem('carzy_user') || 'null');

function saveUser(user) {
  currentUser = user;
  localStorage.setItem('carzy_user', JSON.stringify(user));
  updateNavAuth();
}

function logoutUser() {
  currentUser = null;
  localStorage.removeItem('carzy_user');
  updateNavAuth();
  closeAuthModal();
}

function updateNavAuth() {
  const btnLogin  = document.getElementById('navLoginBtn');
  const btnSignup = document.getElementById('navSignupBtn');
  const btnUser   = document.getElementById('navUserBtn');
  if (!btnLogin) return;
  if (currentUser) {
    btnLogin.style.display  = 'none';
    btnSignup.style.display = 'none';
    btnUser.style.display   = 'flex';
    btnUser.innerHTML = 'Hi, ' + currentUser.name.split(' ')[0] + ' &nbsp;▾';
    btnUser.onclick = function() {
      const existing = document.getElementById('userDropdown');
      if (existing) { existing.remove(); return; }
      const drop = document.createElement('div');
      drop.id = 'userDropdown';
      drop.style.cssText = 'position:fixed;top:64px;right:24px;background:white;border:1.5px solid #e2e8f0;border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,0.12);z-index:200;min-width:180px;overflow:hidden';
      drop.innerHTML = '<div style="padding:12px 16px;font-size:0.8rem;color:#64748b;border-bottom:1px solid #f1f5f9">'+currentUser.email+'</div><button onclick="showPage(\'bookings\');document.getElementById(\'userDropdown\')?.remove()" style="width:100%;padding:12px 16px;text-align:left;background:none;border:none;cursor:pointer;font-size:0.9rem;font-weight:600">My Bookings</button><button onclick="logoutUser()" style="width:100%;padding:12px 16px;text-align:left;background:none;border:none;cursor:pointer;font-size:0.9rem;font-weight:600;color:#dc2626">Logout</button>';
      document.body.appendChild(drop);
      setTimeout(() => document.addEventListener('click', function handler(e) {
        if (!drop.contains(e.target) && e.target !== btnUser) { drop.remove(); document.removeEventListener('click', handler); }
      }), 100);
    };
  } else {
    btnLogin.style.display  = 'inline-flex';
    btnSignup.style.display = 'inline-flex';
    btnUser.style.display   = 'none';
  }
}

// ── AUTH MODAL ────────────────────────────────────────────────────────
function openAuthModal(mode, role) {
  // mode = 'login' or 'signup', role = 'customer' or 'vendor'
  const modal = document.getElementById('authModal');
  modal.style.display = 'flex';
  renderAuthModal(mode, role);
}

function closeAuthModal() {
  document.getElementById('authModal').style.display = 'none';
}

function renderAuthModal(mode, role) {
  const modal = document.getElementById('authModalInner');
  const isLogin = mode === 'login';
  const isVendor = role === 'vendor';

  modal.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px">
      <h2 style="font-size:1.3rem;font-weight:800;color:#0d2137">${isLogin ? 'Login' : 'Sign Up'} as ${isVendor ? 'Vendor' : 'Customer'}</h2>
      <button onclick="closeAuthModal()" style="background:none;border:none;font-size:1.4rem;cursor:pointer;color:#64748b;line-height:1">✕</button>
    </div>

    <div style="display:flex;gap:0;margin-bottom:20px;border:1.5px solid #e2e8f0;border-radius:10px;overflow:hidden">
      <button onclick="renderAuthModal('login','${role}')" style="flex:1;padding:10px;font-weight:700;font-size:0.875rem;cursor:pointer;border:none;background:${isLogin?'#0d2137':'white'};color:${isLogin?'white':'#64748b'}">Login</button>
      <button onclick="renderAuthModal('signup','${role}')" style="flex:1;padding:10px;font-weight:700;font-size:0.875rem;cursor:pointer;border:none;background:${!isLogin?'#0d2137':'white'};color:${!isLogin?'white':'#64748b'}">Sign Up</button>
    </div>

    <div style="display:flex;gap:0;margin-bottom:20px;border:1.5px solid #e2e8f0;border-radius:10px;overflow:hidden">
      <button onclick="renderAuthModal('${mode}','customer')" style="flex:1;padding:10px;font-weight:700;font-size:0.875rem;cursor:pointer;border:none;background:${!isVendor?'#f4b400':'white'};color:${!isVendor?'#0d2137':'#64748b'}">Customer</button>
      <button onclick="renderAuthModal('${mode}','vendor')" style="flex:1;padding:10px;font-weight:700;font-size:0.875rem;cursor:pointer;border:none;background:${isVendor?'#f4b400':'white'};color:${isVendor?'#0d2137':'#64748b'}">Vendor</button>
    </div>

    ${!isLogin ? `<div style="margin-bottom:12px">
      <label style="font-size:0.75rem;font-weight:700;text-transform:uppercase;color:#64748b;display:block;margin-bottom:5px">Full Name</label>
      <input id="authName" type="text" placeholder="John Doe" style="width:100%;padding:11px 14px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:0.95rem;outline:none;font-family:inherit"/>
    </div>` : ''}

    <div style="margin-bottom:12px">
      <label style="font-size:0.75rem;font-weight:700;text-transform:uppercase;color:#64748b;display:block;margin-bottom:5px">Email</label>
      <input id="authEmail" type="email" placeholder="you@example.com" style="width:100%;padding:11px 14px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:0.95rem;outline:none;font-family:inherit"/>
    </div>

    <div style="margin-bottom:${isVendor && !isLogin ? '12px' : '16px'}">
      <label style="font-size:0.75rem;font-weight:700;text-transform:uppercase;color:#64748b;display:block;margin-bottom:5px">Password</label>
      <input id="authPassword" type="password" placeholder="${isLogin ? 'Your password' : 'Min 6 characters'}" style="width:100%;padding:11px 14px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:0.95rem;outline:none;font-family:inherit"/>
    </div>

    ${isVendor && !isLogin ? `<div style="margin-bottom:16px">
      <label style="font-size:0.75rem;font-weight:700;text-transform:uppercase;color:#64748b;display:block;margin-bottom:5px">Select Your Garage</label>
      <select id="authGarage" style="width:100%;padding:11px 14px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:0.95rem;outline:none;font-family:inherit;background:white">
        <option value="">Loading garages...</option>
      </select>
    </div>` : ''}

    <div id="authErr" style="color:#dc2626;font-size:0.85rem;margin-bottom:10px"></div>
    <div id="authSuc" style="color:#059669;font-size:0.85rem;margin-bottom:10px"></div>

    <button onclick="submitAuth('${mode}','${role}')" style="width:100%;padding:13px;background:#0d2137;color:white;border:none;border-radius:10px;font-size:1rem;font-weight:800;cursor:pointer">
      ${isLogin ? 'Login' : 'Create Account'}
    </button>
  `;

  // Load garages for vendor signup dropdown
  if (isVendor && !isLogin) {
    apiFetch('/garages/list').then(garages => {
      const sel = document.getElementById('authGarage');
      if (sel) sel.innerHTML = '<option value="">-- Select your garage --</option>' +
        garages.map(g => `<option value="${g.id}">${g.name} (${g.area})</option>`).join('');
    });
  }
}

async function submitAuth(mode, role) {
  const email    = document.getElementById('authEmail')?.value.trim();
  const password = document.getElementById('authPassword')?.value;
  const name     = document.getElementById('authName')?.value.trim();
  const garageId = document.getElementById('authGarage')?.value;
  const errEl    = document.getElementById('authErr');
  const sucEl    = document.getElementById('authSuc');

  errEl.textContent = '';
  sucEl.textContent = '';

  if (!email || !password) { errEl.textContent = 'Please fill all fields.'; return; }

  try {
    if (mode === 'login') {
      const endpoint = role === 'customer' ? '/customer/login' : '/vendor/login';
      const data = await apiFetch(endpoint, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      if (data.success) {
        const user = data.user || data.vendor;
        user.role = role;
        saveUser(user);
        closeAuthModal();
        if (role === 'vendor') {
          window.open('http://localhost:3000/vendor', '_blank');
        }
      }
    } else {
      if (!name) { errEl.textContent = 'Please enter your name.'; return; }
      if (role === 'vendor' && !garageId) { errEl.textContent = 'Please select your garage.'; return; }
      const endpoint = role === 'customer' ? '/customer/signup' : '/vendor/signup';
      const body = role === 'customer'
        ? { name, email, password }
        : { name, email, password, garageId: parseInt(garageId) };
      const data = await apiFetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(body),
      });
      if (data.success) {
        sucEl.textContent = 'Account created! You can now login.';
        setTimeout(() => renderAuthModal('login', role), 1500);
      } else {
        errEl.textContent = data.error || 'Signup failed.';
      }
    }
  } catch (err) {
    errEl.textContent = 'Server error. Is the backend running?';
  }
}
