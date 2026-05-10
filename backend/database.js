const sqlite3 = require('sqlite3').verbose();
const path    = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'carzy.db'));

const GARAGES = [
  { id:1,  name:'AutoCare Pro',       area:'Bhopal',   address:'MP Nagar, Zone II',                phone:'+91 90123 45678', rating:4.9, review_count:312, description:"AutoCare Pro is Bhopal's premier detailing and wash center.", services_offered:['Car Washing','Detailing','Maintenance'], available_slots:['9:00 AM','11:00 AM','2:00 PM','4:00 PM'] },
  { id:2,  name:'SpeedWrench Garage', area:'Indore',   address:'Vijay Nagar, AB Road',             phone:'+91 98765 12345', rating:4.7, review_count:198, description:'SpeedWrench specializes in fast, reliable repairs and maintenance.', services_offered:['Maintenance','Repairing','Emission Testing'], available_slots:['8:30 AM','10:00 AM','1:00 PM','3:30 PM'] },
  { id:3,  name:'Elite Motors',       area:'Gwalior',  address:'City Centre, Lashkar',             phone:'+91 91234 56789', rating:4.8, review_count:245, description:'Elite Motors offers premium modification services and performance upgrades.', services_offered:['Modification','Detailing','Car Washing'], available_slots:['10:00 AM','12:00 PM','3:00 PM','5:00 PM'] },
  { id:4,  name:'GreenDrive Auto',    area:'Jabalpur', address:'Napier Town, Civic Centre',        phone:'+91 88654 32109', rating:4.6, review_count:167, description:'GreenDrive Auto focuses on eco-friendly car services.', services_offered:['Emission Testing','Maintenance','Car Washing'], available_slots:['9:30 AM','11:30 AM','2:30 PM'] },
  { id:5,  name:'QuickFix Workshop',  area:'Ujjain',   address:'Freeganj, Near Mahakal Temple',    phone:'+91 97654 32100', rating:4.5, review_count:134, description:'QuickFix delivers fast turnaround repairs without compromising quality.', services_offered:['Repairing','Maintenance'], available_slots:['8:00 AM','10:30 AM','1:30 PM','4:30 PM'] },
  { id:6,  name:'Shine & Drive',      area:'Bhopal',   address:'Arera Colony, E-7',                phone:'+91 96321 87650', rating:4.8, review_count:289, description:'Shine & Drive brings the ultimate car washing and detailing experience.', services_offered:['Car Washing','Detailing'], available_slots:['9:00 AM','11:00 AM','1:00 PM','3:00 PM','5:00 PM'] },
  { id:7,  name:'TurboTech Garage',   area:'Indore',   address:'Palasia Square, MG Road',          phone:'+91 99887 76655', rating:4.7, review_count:211, description:"TurboTech is Indore's leading performance and modification garage.", services_offered:['Modification','Repairing','Maintenance'], available_slots:['10:00 AM','12:30 PM','3:30 PM'] },
  { id:8,  name:'EcoCheck Centre',    area:'Sagar',    address:'Civil Lines, Near Collectorate',   phone:'+91 94456 78901', rating:4.4, review_count:98,  description:"EcoCheck is Sagar's certified emission testing center.", services_offered:['Emission Testing','Maintenance'], available_slots:['9:00 AM','11:00 AM','2:00 PM'] },
  { id:9,  name:'Royal Auto Spa',     area:'Bhopal',   address:'Shyamla Hills, VIP Road',          phone:'+91 80001 23456', rating:4.9, review_count:356, description:'Royal Auto Spa offers luxury car care with premium ceramics.', services_offered:['Detailing','Car Washing','Modification'], available_slots:['10:00 AM','1:00 PM','4:00 PM'] },
  { id:10, name:'Precision Motors',   area:'Gwalior',  address:'Morar, Industrial Area',           phone:'+91 73456 89012', rating:4.6, review_count:176, description:'Precision Motors specializes in diesel engines and hybrid vehicles.', services_offered:['Repairing','Maintenance','Emission Testing'], available_slots:['8:30 AM','11:00 AM','2:00 PM','4:30 PM'] },
  { id:11, name:'Flash Clean Auto',   area:'Rewa',     address:'Civil Lines, Station Road',        phone:'+91 62345 67890', rating:4.3, review_count:87,  description:'Flash Clean Auto brings quick and affordable car washing to Rewa.', services_offered:['Car Washing','Maintenance'], available_slots:['9:00 AM','10:30 AM','12:00 PM','2:00 PM','3:30 PM'] },
  { id:12, name:'Motovibe Workshop',  area:'Indore',   address:'Scheme 54, Near Bombay Hospital',  phone:'+91 85678 90123', rating:4.7, review_count:203, description:'Motovibe is a one-stop shop for all things automotive in Indore.', services_offered:['Maintenance','Repairing','Detailing','Car Washing'], available_slots:['9:30 AM','11:30 AM','1:30 PM','3:30 PM'] },
  { id:13, name:'Swift Service Hub',  area:'Jabalpur', address:'Wright Town, Main Road',           phone:'+91 77654 32109', rating:4.5, review_count:145, description:'Swift Service Hub offers express maintenance for busy professionals.', services_offered:['Maintenance','Car Washing','Emission Testing'], available_slots:['8:00 AM','10:00 AM','12:00 PM','2:00 PM'] },
  { id:14, name:'Chrome & Steel',     area:'Bhopal',   address:'Kolar Road, Sector C',             phone:'+91 99100 20030', rating:4.8, review_count:267, description:"Chrome & Steel is Bhopal's top modification and custom body shop.", services_offered:['Modification','Detailing','Repairing'], available_slots:['11:00 AM','1:00 PM','4:00 PM'] },
  { id:15, name:'AutoGuard Services', area:'Satna',    address:'Birsinghpur Road, Near Bus Stand',  phone:'+91 75432 10987', rating:4.4, review_count:119, description:'AutoGuard provides comprehensive vehicle care in Satna.', services_offered:['Maintenance','Repairing','Car Washing'], available_slots:['9:00 AM','11:00 AM','2:30 PM','4:00 PM'] },
  { id:16, name:'Gloss Masters',      area:'Ujjain',   address:'Dewas Road, Opposite Mall',        phone:'+91 88100 45678', rating:4.6, review_count:188, description:'Gloss Masters delivers premium detailing with ceramic coatings.', services_offered:['Detailing','Car Washing'], available_slots:['10:00 AM','12:00 PM','3:00 PM','5:00 PM'] },
  { id:17, name:'DriveRight Garage',  area:'Gwalior',  address:'Kampoo, Tansen Road',              phone:'+91 96789 01234', rating:4.7, review_count:231, description:"DriveRight Garage combines old-school expertise with modern diagnostics.", services_offered:['Repairing','Maintenance','Emission Testing'], available_slots:['8:30 AM','10:30 AM','1:00 PM','3:30 PM'] },
  { id:18, name:'TopSpeed Auto',      area:'Indore',   address:'Rau, Bypass Road',                 phone:'+91 78901 23456', rating:4.5, review_count:156, description:'TopSpeed Auto is your performance partner in Indore.', services_offered:['Modification','Repairing','Maintenance'], available_slots:['9:00 AM','12:00 PM','3:00 PM'] },
  { id:19, name:'CleanRide Express',  area:'Sagar',    address:'Makroniya, Main Market',           phone:'+91 65432 10987', rating:4.3, review_count:72,  description:'CleanRide Express offers affordable car washing and maintenance.', services_offered:['Car Washing','Maintenance'], available_slots:['8:00 AM','10:00 AM','12:00 PM','2:00 PM','4:00 PM'] },
  { id:20, name:'Summit Auto Care',   area:'Jabalpur', address:'Adhartal, Katanga',                phone:'+91 84567 89012', rating:4.8, review_count:295, description:'Summit Auto Care is the most trusted name in Jabalpur.', services_offered:['Maintenance','Repairing','Detailing','Emission Testing','Car Washing'], available_slots:['8:00 AM','9:30 AM','11:00 AM','12:30 PM','2:00 PM','3:30 PM','5:00 PM'] },
];

function initDB() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(`CREATE TABLE IF NOT EXISTS garages (id INTEGER PRIMARY KEY, name TEXT NOT NULL, description TEXT NOT NULL, address TEXT NOT NULL, area TEXT NOT NULL, phone TEXT NOT NULL, rating REAL NOT NULL, review_count INTEGER NOT NULL, services_offered TEXT NOT NULL, available_slots TEXT NOT NULL, image_url TEXT NOT NULL DEFAULT '')`);
      db.run(`CREATE TABLE IF NOT EXISTS bookings (id INTEGER PRIMARY KEY AUTOINCREMENT, garage_id INTEGER NOT NULL, garage_name TEXT NOT NULL, service_category TEXT NOT NULL, slot_time TEXT NOT NULL, customer_name TEXT NOT NULL, customer_phone TEXT NOT NULL, customer_email TEXT NOT NULL, area TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'confirmed', created_at INTEGER NOT NULL)`);
      db.run(`CREATE TABLE IF NOT EXISTS customers (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE, password TEXT NOT NULL, created_at INTEGER NOT NULL)`);
      db.run(`CREATE TABLE IF NOT EXISTS vendors (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE, password TEXT NOT NULL, garage_id INTEGER NOT NULL UNIQUE, created_at INTEGER NOT NULL)`);
      db.get('SELECT COUNT(*) as n FROM garages', (err, row) => {
        if (err) return reject(err);
        if (row.n > 0) { console.log('DB ready.'); return resolve(); }
        console.log('Seeding garages...');
        const stmt = db.prepare(`INSERT INTO garages (id,name,description,address,area,phone,rating,review_count,services_offered,available_slots) VALUES (?,?,?,?,?,?,?,?,?,?)`);
        GARAGES.forEach(g => stmt.run(g.id,g.name,g.description,g.address,g.area,g.phone,g.rating,g.review_count,JSON.stringify(g.services_offered),JSON.stringify(g.available_slots)));
        stmt.finalize(() => { console.log('Seeded 20 garages.'); resolve(); });
      });
    });
  });
}

function parseGarage(row) {
  if (!row) return null;
  return { id:row.id, name:row.name, description:row.description, address:row.address, area:row.area, phone:row.phone, rating:row.rating, reviewCount:row.review_count, servicesOffered:JSON.parse(row.services_offered), availableSlots:JSON.parse(row.available_slots), imageUrl:row.image_url };
}

function parseBooking(row) {
  if (!row) return null;
  return { id:row.id, garageId:row.garage_id, garageName:row.garage_name, serviceCategory:row.service_category, slotTime:row.slot_time, customerName:row.customer_name, customerPhone:row.customer_phone, customerEmail:row.customer_email, area:row.area, status:row.status, createdAt:row.created_at };
}

const Garages = {
  getAll(area, service, callback) {
    db.all('SELECT * FROM garages ORDER BY rating DESC', (err, rows) => {
      if (err) return callback(err);
      let result = rows.map(parseGarage);
      if (area)    result = result.filter(g => g.area.toLowerCase() === area.toLowerCase());
      if (service) result = result.filter(g => g.servicesOffered.includes(service));
      callback(null, result);
    });
  },
  getById(id, callback) {
    db.get('SELECT * FROM garages WHERE id = ?', [id], (err, row) => {
      if (err) return callback(err);
      callback(null, parseGarage(row));
    });
  },
};

const Bookings = {
  create({ garageId, garageName, serviceCategory, slotTime, customerName, customerPhone, customerEmail, area }, callback) {
    db.run(`INSERT INTO bookings (garage_id,garage_name,service_category,slot_time,customer_name,customer_phone,customer_email,area,status,created_at) VALUES (?,?,?,?,?,?,?,?,'confirmed',?)`,
      [garageId,garageName,serviceCategory,slotTime,customerName,customerPhone,customerEmail,area,Date.now()],
      function(err) { if (err) return callback(err); callback(null, this.lastID); }
    );
  },
  getByEmail(email, callback) {
    db.all('SELECT * FROM bookings WHERE LOWER(customer_email)=LOWER(?) ORDER BY created_at DESC', [email], (err, rows) => {
      if (err) return callback(err);
      callback(null, rows.map(parseBooking));
    });
  },
  getByGarageId(garageId, callback) {
    db.all('SELECT * FROM bookings WHERE garage_id=? ORDER BY created_at DESC', [garageId], (err, rows) => {
      if (err) return callback(err);
      callback(null, rows.map(parseBooking));
    });
  },
  cancel(id, callback) {
    db.run("UPDATE bookings SET status='cancelled' WHERE id=?", [id], function(err) {
      if (err) return callback(err);
      callback(null, this.changes > 0);
    });
  },
  getAll(status, garage, callback) {
    db.all('SELECT * FROM bookings ORDER BY created_at DESC', (err, rows) => {
      if (err) return callback(err);
      let result = rows.map(parseBooking);
      if (status) result = result.filter(b => b.status === status);
      if (garage) result = result.filter(b => b.garageName.toLowerCase().includes(garage.toLowerCase()));
      callback(null, result);
    });
  },
};

const Customers = {
  signup(name, email, password, callback) {
    db.run('INSERT INTO customers (name,email,password,created_at) VALUES (?,?,?,?)',
      [name, email, password, Date.now()],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE')) return callback(null, { error: 'Email already registered' });
          return callback(err);
        }
        callback(null, { id: this.lastID, name, email });
      }
    );
  },
  login(email, password, callback) {
    db.get('SELECT * FROM customers WHERE LOWER(email)=LOWER(?) AND password=?', [email, password], (err, row) => {
      if (err) return callback(err);
      if (!row) return callback(null, null);
      callback(null, { id: row.id, name: row.name, email: row.email });
    });
  },
};

const Vendors = {
  signup(name, email, password, garageId, callback) {
    db.get('SELECT * FROM garages WHERE id=?', [garageId], (err, garage) => {
      if (err) return callback(err);
      if (!garage) return callback(null, { error: 'Invalid Garage ID' });
      db.run('INSERT INTO vendors (name,email,password,garage_id,created_at) VALUES (?,?,?,?,?)',
        [name, email, password, garageId, Date.now()],
        function(err2) {
          if (err2) {
            if (err2.message.includes('UNIQUE')) return callback(null, { error: 'Email or Garage ID already registered' });
            return callback(err2);
          }
          callback(null, { id: this.lastID, name, email, garageId, garageName: garage.name });
        }
      );
    });
  },
  login(email, password, callback) {
    db.get('SELECT v.*, g.name as garage_name FROM vendors v JOIN garages g ON g.id=v.garage_id WHERE LOWER(v.email)=LOWER(?) AND v.password=?',
      [email, password], (err, row) => {
        if (err) return callback(err);
        if (!row) return callback(null, null);
        callback(null, { id: row.id, name: row.name, email: row.email, garageId: row.garage_id, garageName: row.garage_name });
      }
    );
  },
  getAllWithGarages(callback) {
    db.all('SELECT v.id, v.name, v.email, v.garage_id, g.name as garage_name FROM vendors v JOIN garages g ON g.id=v.garage_id ORDER BY v.id', (err, rows) => {
      if (err) return callback(err);
      callback(null, rows);
    });
  },
};

module.exports = { initDB, Garages, Bookings, Customers, Vendors };
