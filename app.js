import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import {
    createUserWithEmailAndPassword,
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    updateProfile
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { get, getDatabase, onValue, push, ref, runTransaction, set, update } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyCW5d9qiv1_E2RBa-g0-EV5yfQ8uE-uIn8",
    authDomain: "iot-projectict.firebaseapp.com",
    databaseURL: "https://iot-projectict-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "iot-projectict",
    storageBucket: "iot-projectict.firebasestorage.app",
    messagingSenderId: "627989546169",
    appId: "1:627989546169:web:19584f8b60fc2f81bc8768",
    measurementId: "G-CS1WEQ9K1Z"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

const LANG_KEY = "iot_lang_v1";
const THEME_KEY = "iot_dashboard_theme_v1";
const MODE_KEY = "iot_dashboard_mode_v1";
const LOG_KEY = "iot_dashboard_logs_v2";
const THRESHOLD_KEY = "iot_dashboard_threshold_v1";
const WINDOWS_KEY = "iot_dashboard_windows_v1";
const DEVICES_KEY = "iot_dashboard_devices_v1";
const TEMP_AUTH_KEY = "iot_temp_admin_auth_v1";

// Temporary fallback admin credential while Firebase auth/DB is unavailable.
const TEMP_ADMIN_EMAIL = "admin@gmail.com";
const TEMP_ADMIN_PASSWORD = "admin1234";

const i18n = {
    th: {
        "page.title.login": "เข้าสู่ระบบ - IoT Smart Light",
        "page.title.dashboard": "แดชบอร์ด IoT Smart Light",
        "page.title.devices": "ศูนย์ควบคุมอุปกรณ์",
        "page.title.unauthorized": "สิทธิ์ไม่เพียงพอ",
        "common.nav.dashboard": "หน้าแดชบอร์ด",
        "common.nav.devices": "หน้าอุปกรณ์",
        "common.nav.logout": "ออกจากระบบ",
        "common.lang.th": "TH | EN",
        "common.lang.en": "EN | TH",
        "common.userChip": "ผู้ใช้: {name} ({role})",
        "common.role.admin": "แอดมิน",
        "common.role.user": "ผู้ใช้",

        "auth.title": "เข้าสู่ระบบ IoT Control",
        "auth.subtitle": "ล็อกอินด้วยอีเมล/รหัสผ่านจริงจาก Firebase Authentication และระบบกำหนด role ในฐานข้อมูลอัตโนมัติ",
        "auth.tab.login": "เข้าสู่ระบบ",
        "auth.tab.register": "สมัครสมาชิก",
        "auth.label.email": "อีเมล",
        "auth.label.password": "รหัสผ่าน",
        "auth.label.name": "ชื่อที่แสดง",
        "auth.label.newEmail": "อีเมลใหม่",
        "auth.label.confirm": "ยืนยันรหัสผ่าน",
        "auth.placeholder.loginEmail": "อีเมลสำหรับล็อกอิน",
        "auth.placeholder.name": "ชื่อที่ต้องการแสดง",
        "auth.placeholder.registerEmail": "อีเมลสำหรับสมัคร",
        "auth.submit.login": "เข้าสู่ระบบ",
        "auth.submit.register": "สมัครสมาชิก",
        "auth.msg.loginHint": "กรอกอีเมลและรหัสผ่านเพื่อเข้าสู่ระบบ",
        "auth.msg.registerHint": "สมัครสมาชิกใหม่ด้วยอีเมล ระบบจะกำหนด role ให้อัตโนมัติ",
        "auth.msg.loginSuccess": "เข้าสู่ระบบสำเร็จ",
        "auth.msg.registerSuccess": "สมัครสมาชิกสำเร็จ",
        "auth.msg.registerAdminSuccess": "สมัครสำเร็จ (บัญชีแรกเป็นแอดมิน)",
        "auth.error.requiredEmail": "กรุณากรอกอีเมล",
        "auth.error.requiredEmailPassword": "กรุณากรอกอีเมลและรหัสผ่าน",
        "auth.error.passwordTooShort": "รหัสผ่านต้องยาวอย่างน้อย 6 ตัวอักษร",
        "auth.error.passwordMismatch": "รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน",
        "auth.error.emailInUse": "อีเมลนี้ถูกใช้งานแล้ว",
        "auth.error.invalidEmail": "รูปแบบอีเมลไม่ถูกต้อง",
        "auth.error.weakPassword": "รหัสผ่านอ่อนเกินไป",
        "auth.error.invalidCredential": "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
        "auth.error.tooManyRequests": "พยายามหลายครั้งเกินไป",
        "auth.error.generic": "เกิดข้อผิดพลาดในการยืนยันตัวตน",

        "dashboard.heroTitle": "แดชบอร์ดอัจฉริยะควบคุมแสง",
        "dashboard.heroSubtitle": "แดชบอร์ดวัดแสงแบบเรียลไทม์ พร้อมควบคุมอุปกรณ์ IoT และธีมทันสมัย",
        "dashboard.pill.live": "สด",
        "dashboard.pill.modern": "ทันสมัย",
        "dashboard.pill.stable": "เสถียร",
        "dashboard.theme.obsidian": "ออบซิเดียน",
        "dashboard.theme.carbon": "คาร์บอน",
        "dashboard.theme.neon": "นีออน",
        "dashboard.mode.dark": "โหมดมืด",
        "dashboard.mode.light": "โหมดสว่าง",
        "dashboard.mode.contrast": "คอนทราสต์สูง",
        "dashboard.rx": "อัตรารับข้อมูล",
        "dashboard.tx": "เวลาส่งคำสั่ง",
        "dashboard.cmd": "สถานะคำสั่ง",
        "dashboard.metric.temp": "อุณหภูมิ",
        "dashboard.metric.hum": "ความชื้น",
        "dashboard.metric.light": "ความสว่าง",
        "dashboard.chart.light": "กราฟแสงแบบ Real-time",
        "dashboard.chart.lightBadge": "แนวโน้มแสง",
        "dashboard.chart.env": "กราฟอุณหภูมิและความชื้น",
        "dashboard.panel.title": "แผงควบคุมอุปกรณ์",
        "dashboard.relay1.title": "หลอดไฟ (Relay 1)",
        "dashboard.relay1.subtitle": "ควบคุมไฟหลัก",
        "dashboard.relay2.title": "พัดลม (Relay 2)",
        "dashboard.relay2.subtitle": "ระบายอากาศอัตโนมัติ/แมนนวล",
        "dashboard.auto.title": "โหมดอัตโนมัติ (Auto)",
        "dashboard.auto.subtitle": "ให้ระบบตัดสินใจจากค่าหน้างาน",
        "dashboard.allOff": "ปิดอุปกรณ์ทั้งหมด",
        "dashboard.syncNow": "Sync ทันที",
        "dashboard.threshold.title": "Threshold Preset (ปรับจาก UI)",
        "dashboard.threshold.balanced": "สมดุล",
        "dashboard.threshold.strict": "เข้มงวด",
        "dashboard.threshold.relaxed": "ผ่อนคลาย",
        "dashboard.threshold.tw": "อุณหภูมิเตือน >=",
        "dashboard.threshold.td": "อุณหภูมิวิกฤต >=",
        "dashboard.threshold.hwl": "ความชื้นเตือน ต่ำกว่า",
        "dashboard.threshold.hwh": "ความชื้นเตือน สูงกว่า",
        "dashboard.threshold.hd": "ความชื้นวิกฤต >=",
        "dashboard.threshold.ld": "แสงวิกฤต <",
        "dashboard.threshold.lwl": "แสงเตือน ต่ำกว่า",
        "dashboard.threshold.lwh": "แสงเตือน สูงกว่า",
        "dashboard.threshold.apply": "ปรับ Threshold",
        "dashboard.threshold.reset": "รีเซ็ต",
        "dashboard.sticker.title": "Sticker Notes",
        "dashboard.sticker.desc": "เมื่อเปิด Auto ระบบจะล็อกการสั่งงานแบบแมนนวลทั้ง Relay 1 และ Relay 2",
        "dashboard.status.title": "สถานะล่าสุด (แยกสี)",
        "dashboard.logs.title": "Log ย้อนหลัง",
        "dashboard.logs.export": "ส่งออก CSV",
        "dashboard.logs.clear": "ล้าง Log",
        "dashboard.logs.warn": "เตือนวันนี้",
        "dashboard.logs.danger": "วิกฤตวันนี้",
        "dashboard.db": "ฐานข้อมูล",
        "dashboard.board": "บอร์ดส่งข้อมูล",
        "dashboard.wait": "รอข้อมูล",
        "dashboard.tx.ready": "พร้อม",
        "dashboard.tx.queue": "เข้าคิว",
        "dashboard.tx.sending": "กำลังส่ง",
        "dashboard.tx.delivered": "ส่งแล้ว",
        "dashboard.tx.failed": "ล้มเหลว",
        "dashboard.tx.waiting": "รอข้อมูล",
        "dashboard.tx.offline": "ออฟไลน์",
        "dashboard.light.pending": "กำลังประเมินสภาพแสง...",
        "dashboard.light.high": "สว่างมาก เหมาะกับพื้นที่ทำงาน",
        "dashboard.light.mid": "สว่างกำลังดี โหมดสบายตา",
        "dashboard.light.low": "แสงค่อนข้างต่ำ แนะนำเปิดไฟเพิ่ม",
        "dashboard.status.good": "ปกติ",
        "dashboard.status.warn": "เฝ้าระวัง",
        "dashboard.status.danger": "วิกฤต",
        "dashboard.status.info": "ข้อมูล",
        "dashboard.class.temp.hot": "ร้อนจัด {value}°C",
        "dashboard.class.temp.warm": "เริ่มร้อน {value}°C",
        "dashboard.class.temp.cool": "ค่อนข้างเย็น {value}°C",
        "dashboard.class.temp.ok": "ปกติ {value}°C",
        "dashboard.class.hum.high": "ชื้นมาก {value}%",
        "dashboard.class.hum.warn": "ต้องเฝ้าระวัง {value}%",
        "dashboard.class.hum.ok": "ปกติ {value}%",
        "dashboard.class.light.dark": "มืดมาก {value}%",
        "dashboard.class.light.warn": "ค่าผันผวน {value}%",
        "dashboard.class.light.ok": "ปกติ {value}%",
        "dashboard.conn.offline": "ยังไม่เชื่อมต่อฐานข้อมูล Firebase",
        "dashboard.conn.live": "ดาต้าเบสพร้อม บอร์ดส่งข้อมูลล่าสุด {seconds}s",
        "dashboard.conn.wait": "ดาต้าเบสพร้อม แต่บอร์ดยังไม่ส่งข้อมูล",
        "dashboard.db.connected": "เชื่อมต่อแล้ว",
        "dashboard.db.disconnected": "ไม่เชื่อมต่อ",
        "dashboard.board.wait": "รอข้อมูลจากบอร์ด",
        "dashboard.board.good": "ปกติ ({seconds}s)",
        "dashboard.board.missing": "ขาดข้อมูล ({seconds}s)",
        "dashboard.manual.lock": "Manual ถูกล็อกโดย Auto แบบ real-time",
        "dashboard.manual.unlock": "Manual พร้อมใช้งาน: ตอนนี้ควบคุม Relay 1/2 ได้ตามปกติ",
        "dashboard.toast.relayBlocked": "ไม่สามารถสั่งแมนนวลได้ขณะเปิด Auto",
        "dashboard.toast.allOff": "ปิดอุปกรณ์ทั้งหมดแล้ว",
        "dashboard.toast.sync": "กำลัง Sync ข้อมูลทันที",
        "dashboard.toast.clear": "ล้าง Log เรียบร้อย",
        "dashboard.toast.exportEmpty": "ไม่มี Log สำหรับ Export",
        "dashboard.toast.exportDone": "ส่งออก CSV สำเร็จ",
        "dashboard.toast.sendFail": "ส่งคำสั่งไม่สำเร็จ ลองใหม่อีกครั้ง",
        "dashboard.toast.boardLost": "บอร์ดอาจออฟไลน์หรือเน็ตหลุด",
        "dashboard.log.started": "ระบบเริ่มทำงานและรอข้อมูลจาก Firebase",
        "dashboard.log.nodeMissing": "เชื่อมต่อดาต้าเบสได้ แต่ยังไม่พบข้อมูลในโหนด iot_data",
        "dashboard.log.dbConnected": "เชื่อมต่อ Firebase สำเร็จ",
        "dashboard.log.dbFailed": "ไม่สามารถเชื่อมต่อ Firebase ได้",
        "dashboard.log.boardGood": "บอร์ดส่งข้อมูลปกติ",
        "dashboard.log.boardMissing": "บอร์ดไม่ส่งข้อมูลเกิน 40 วินาที",
        "dashboard.log.manualLock": "เปิด Auto แล้ว: ล็อกระบบแมนนวลทั้ง Relay 1 และ Relay 2",
        "dashboard.log.manualUnlock": "ปิด Auto แล้ว: ปลดล็อกระบบแมนนวล",
        "dashboard.log.clear": "ล้าง Log ย้อนหลังแล้ว",
        "dashboard.log.export": "ส่งออก Log เป็น CSV",
        "dashboard.log.threshold": "อัปเดต Threshold เป็น preset: {preset}",
        "dashboard.log.theme": "เปลี่ยนธีมเป็น {theme}",
        "dashboard.log.normal": "{label} กลับสู่ค่าปกติแล้ว",
        "dashboard.log.critical": "แจ้งเตือนด่วน {label} อยู่ในช่วงวิกฤต",
        "dashboard.action.r1on": "เปิดหลอดไฟ (Relay 1)",
        "dashboard.action.r1off": "ปิดหลอดไฟ (Relay 1)",
        "dashboard.action.r2on": "เปิดพัดลม (Relay 2)",
        "dashboard.action.r2off": "ปิดพัดลม (Relay 2)",
        "dashboard.action.autoOn": "เปิดโหมด Auto",
        "dashboard.action.autoOff": "ปิดโหมด Auto",
        "dashboard.action.allOffLog": "Quick Action: ปิดอุปกรณ์ทั้งหมดและปิด Auto",
        "dashboard.action.syncLog": "Quick Action: สั่ง Sync ทันที",

        "devices.title": "ศูนย์ควบคุมอุปกรณ์",
        "devices.subtitle": "หน้าควบคุมหน้าต่างสามชั้นและอุปกรณ์ที่เพิ่มเอง (เฉพาะผู้ดูแล)",
        "devices.window.title": "หน้าต่างสามชั้น (ขยายต่อได้)",
        "devices.window.label": "หน้าต่าง {index}",
        "devices.mode.auto": "อัตโนมัติ",
        "devices.mode.manual": "แมนนวล",
        "devices.custom.title": "เพิ่มอุปกรณ์ได้เอง",
        "devices.type.custom": "กำหนดเอง",
        "devices.type.light": "ไฟ",
        "devices.type.fan": "พัดลม",
        "devices.type.pump": "ปั๊ม",
        "devices.type.valve": "วาล์ว",
        "devices.add": "+ เพิ่มอุปกรณ์",
        "devices.placeholder": "ชื่ออุปกรณ์ เช่น Pump A",
        "devices.empty": "ยังไม่มีอุปกรณ์เพิ่มเอง",
        "devices.remove": "ลบ",

        "unauth.title": "สิทธิ์ไม่เพียงพอ",
        "unauth.subtitle": "บัญชีของคุณไม่มีสิทธิ์เข้าถึงหน้านี้",
        "unauth.desc": "หน้านี้สงวนไว้สำหรับผู้ดูแลระบบ (Admin) หากคิดว่าเป็นความผิดพลาด กรุณาติดต่อผู้ดูแล",
        "unauth.reason.devices": "หน้าอุปกรณ์ต้องใช้สิทธิ์แอดมิน",
        "unauth.reason.default": "คุณไม่มีสิทธิ์เพียงพอสำหรับหน้านี้",
        "unauth.back": "กลับไปหน้าแดชบอร์ด",
        "unauth.login": "เข้าสู่ระบบด้วยบัญชีอื่น"
    },
    en: {
        "page.title.login": "Login - IoT Smart Light",
        "page.title.dashboard": "IoT Smart Light Dashboard",
        "page.title.devices": "Device Control Center",
        "page.title.unauthorized": "Access Denied",
        "common.nav.dashboard": "Dashboard",
        "common.nav.devices": "Devices",
        "common.nav.logout": "Logout",
        "common.lang.th": "TH | EN",
        "common.lang.en": "EN | TH",
        "common.userChip": "User: {name} ({role})",
        "common.role.admin": "ADMIN",
        "common.role.user": "USER",

        "auth.title": "Sign In to IoT Control",
        "auth.subtitle": "Sign in with Firebase email/password authentication and database-backed role assignment.",
        "auth.tab.login": "Login",
        "auth.tab.register": "Register",
        "auth.label.email": "Email",
        "auth.label.password": "Password",
        "auth.label.name": "Display Name",
        "auth.label.newEmail": "New Email",
        "auth.label.confirm": "Confirm Password",
        "auth.placeholder.loginEmail": "Login email",
        "auth.placeholder.name": "Your display name",
        "auth.placeholder.registerEmail": "Email for registration",
        "auth.submit.login": "Login",
        "auth.submit.register": "Register",
        "auth.msg.loginHint": "Enter email and password to sign in.",
        "auth.msg.registerHint": "Create a new account. Role is assigned automatically.",
        "auth.msg.loginSuccess": "Login successful",
        "auth.msg.registerSuccess": "Registration successful",
        "auth.msg.registerAdminSuccess": "Registration successful (first account is admin)",
        "auth.error.requiredEmail": "Please enter email",
        "auth.error.requiredEmailPassword": "Please enter email and password",
        "auth.error.passwordTooShort": "Password must be at least 6 characters",
        "auth.error.passwordMismatch": "Passwords do not match",
        "auth.error.emailInUse": "Email is already in use",
        "auth.error.invalidEmail": "Invalid email format",
        "auth.error.weakPassword": "Weak password",
        "auth.error.invalidCredential": "Invalid email or password",
        "auth.error.tooManyRequests": "Too many attempts",
        "auth.error.generic": "Authentication error",

        "dashboard.heroTitle": "Light Intelligence Dashboard",
        "dashboard.heroSubtitle": "Real-time IoT dashboard with modern controls and themes.",
        "dashboard.pill.live": "LIVE",
        "dashboard.pill.modern": "MODERN",
        "dashboard.pill.stable": "STABLE",
        "dashboard.theme.obsidian": "Obsidian",
        "dashboard.theme.carbon": "Carbon",
        "dashboard.theme.neon": "Neon",
        "dashboard.mode.dark": "Dark",
        "dashboard.mode.light": "Light",
        "dashboard.mode.contrast": "High Contrast",
        "dashboard.rx": "RX Rate",
        "dashboard.tx": "TX Latency",
        "dashboard.cmd": "Command",
        "dashboard.metric.temp": "Temperature",
        "dashboard.metric.hum": "Humidity",
        "dashboard.metric.light": "Light",
        "dashboard.chart.light": "Real-time Light Chart",
        "dashboard.chart.lightBadge": "Light Trend",
        "dashboard.chart.env": "Temperature and Humidity Chart",
        "dashboard.panel.title": "Device Control Panel",
        "dashboard.relay1.title": "Light (Relay 1)",
        "dashboard.relay1.subtitle": "Main light control",
        "dashboard.relay2.title": "Fan (Relay 2)",
        "dashboard.relay2.subtitle": "Ventilation auto/manual",
        "dashboard.auto.title": "Automatic Mode (Auto)",
        "dashboard.auto.subtitle": "System decides from sensor values",
        "dashboard.allOff": "Turn Off All",
        "dashboard.syncNow": "Sync Now",
        "dashboard.threshold.title": "Threshold Preset",
        "dashboard.threshold.balanced": "Balanced",
        "dashboard.threshold.strict": "Strict",
        "dashboard.threshold.relaxed": "Relaxed",
        "dashboard.threshold.tw": "Temp Warn >=",
        "dashboard.threshold.td": "Temp Danger >=",
        "dashboard.threshold.hwl": "Humidity Warn below",
        "dashboard.threshold.hwh": "Humidity Warn above",
        "dashboard.threshold.hd": "Humidity Danger >=",
        "dashboard.threshold.ld": "Light Danger <",
        "dashboard.threshold.lwl": "Light Warn below",
        "dashboard.threshold.lwh": "Light Warn above",
        "dashboard.threshold.apply": "Apply Threshold",
        "dashboard.threshold.reset": "Reset",
        "dashboard.sticker.title": "Sticker Notes",
        "dashboard.sticker.desc": "When Auto is enabled, manual control for Relay 1 and Relay 2 is locked.",
        "dashboard.status.title": "Latest Status",
        "dashboard.logs.title": "History Logs",
        "dashboard.logs.export": "Export CSV",
        "dashboard.logs.clear": "Clear Logs",
        "dashboard.logs.warn": "Warn Today",
        "dashboard.logs.danger": "Danger Today",
        "dashboard.db": "Database",
        "dashboard.board": "Board Data",
        "dashboard.wait": "Waiting",
        "dashboard.tx.ready": "READY",
        "dashboard.tx.queue": "QUEUE",
        "dashboard.tx.sending": "SENDING",
        "dashboard.tx.delivered": "DELIVERED",
        "dashboard.tx.failed": "FAILED",
        "dashboard.tx.waiting": "WAITING",
        "dashboard.tx.offline": "OFFLINE",
        "dashboard.light.pending": "Evaluating light condition...",
        "dashboard.light.high": "Very bright, ideal for workspaces",
        "dashboard.light.mid": "Comfortable brightness",
        "dashboard.light.low": "Low light, consider turning on light",
        "dashboard.status.good": "Normal",
        "dashboard.status.warn": "Warning",
        "dashboard.status.danger": "Critical",
        "dashboard.status.info": "Info",
        "dashboard.class.temp.hot": "Too hot {value}°C",
        "dashboard.class.temp.warm": "Getting warm {value}°C",
        "dashboard.class.temp.cool": "Quite cool {value}°C",
        "dashboard.class.temp.ok": "Normal {value}°C",
        "dashboard.class.hum.high": "Very humid {value}%",
        "dashboard.class.hum.warn": "Needs attention {value}%",
        "dashboard.class.hum.ok": "Normal {value}%",
        "dashboard.class.light.dark": "Very dark {value}%",
        "dashboard.class.light.warn": "Fluctuating {value}%",
        "dashboard.class.light.ok": "Normal {value}%",
        "dashboard.conn.offline": "Firebase database disconnected",
        "dashboard.conn.live": "Database connected. Board updated {seconds}s ago",
        "dashboard.conn.wait": "Database connected but no board update",
        "dashboard.db.connected": "Connected",
        "dashboard.db.disconnected": "Disconnected",
        "dashboard.board.wait": "Waiting for board data",
        "dashboard.board.good": "OK ({seconds}s)",
        "dashboard.board.missing": "Missing ({seconds}s)",
        "dashboard.manual.lock": "Manual controls are locked by Auto mode",
        "dashboard.manual.unlock": "Manual controls are available",
        "dashboard.toast.relayBlocked": "Manual command blocked while Auto mode is enabled",
        "dashboard.toast.allOff": "All devices turned off",
        "dashboard.toast.sync": "Syncing now",
        "dashboard.toast.clear": "Logs cleared",
        "dashboard.toast.exportEmpty": "No logs to export",
        "dashboard.toast.exportDone": "CSV exported",
        "dashboard.toast.sendFail": "Failed to send command",
        "dashboard.toast.boardLost": "Board may be offline",
        "dashboard.log.started": "System started and waiting for Firebase data",
        "dashboard.log.nodeMissing": "Database connected but iot_data node is missing",
        "dashboard.log.dbConnected": "Firebase connected",
        "dashboard.log.dbFailed": "Cannot connect Firebase",
        "dashboard.log.boardGood": "Board heartbeat is healthy",
        "dashboard.log.boardMissing": "Board has no data for over 40 seconds",
        "dashboard.log.manualLock": "Auto enabled: manual controls locked",
        "dashboard.log.manualUnlock": "Auto disabled: manual controls unlocked",
        "dashboard.log.clear": "History logs cleared",
        "dashboard.log.export": "Logs exported to CSV",
        "dashboard.log.threshold": "Threshold preset updated: {preset}",
        "dashboard.log.theme": "Theme changed to {theme}",
        "dashboard.log.normal": "{label} returned to normal",
        "dashboard.log.critical": "Critical alert: {label} is dangerous",
        "dashboard.action.r1on": "Light on (Relay 1)",
        "dashboard.action.r1off": "Light off (Relay 1)",
        "dashboard.action.r2on": "Fan on (Relay 2)",
        "dashboard.action.r2off": "Fan off (Relay 2)",
        "dashboard.action.autoOn": "Auto mode enabled",
        "dashboard.action.autoOff": "Auto mode disabled",
        "dashboard.action.allOffLog": "Quick Action: all devices off and Auto disabled",
        "dashboard.action.syncLog": "Quick Action: sync now",

        "devices.title": "Device Control Center",
        "devices.subtitle": "Manage triple windows and custom devices (admin only)",
        "devices.window.title": "Triple-Layer Windows",
        "devices.window.label": "Window {index}",
        "devices.mode.auto": "Auto",
        "devices.mode.manual": "Manual",
        "devices.custom.title": "Add Custom Devices",
        "devices.type.custom": "Custom",
        "devices.type.light": "Light",
        "devices.type.fan": "Fan",
        "devices.type.pump": "Pump",
        "devices.type.valve": "Valve",
        "devices.add": "+ Add Device",
        "devices.placeholder": "Device name e.g. Pump A",
        "devices.empty": "No custom devices yet",
        "devices.remove": "Remove",

        "unauth.title": "Access Denied",
        "unauth.subtitle": "Your account does not have permission",
        "unauth.desc": "This page is restricted to administrators.",
        "unauth.reason.devices": "Devices page requires admin role",
        "unauth.reason.default": "You do not have enough permissions",
        "unauth.back": "Back to Dashboard",
        "unauth.login": "Sign in with another account"
    }
};

let currentLang = localStorage.getItem(LANG_KEY) === "en" ? "en" : "th";
function tt(key, vars = {}) {
    const template = (i18n[currentLang] && i18n[currentLang][key]) || (i18n.en && i18n.en[key]) || key;
    return template.replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? `{${k}}`));
}
function toggleLang() {
    currentLang = currentLang === "th" ? "en" : "th";
    localStorage.setItem(LANG_KEY, currentLang);
    applyLanguage();
}

function normalizeRole(role) {
    return role === "admin" ? "admin" : "user";
}

function authErrorKey(code) {
    if (code === "auth/email-already-in-use") return "auth.error.emailInUse";
    if (code === "auth/invalid-email") return "auth.error.invalidEmail";
    if (code === "auth/weak-password") return "auth.error.weakPassword";
    if (code === "auth/invalid-credential") return "auth.error.invalidCredential";
    if (code === "auth/too-many-requests") return "auth.error.tooManyRequests";
    return "auth.error.generic";
}

function buildTempAdminProfile() {
    return {
        uid: "temp-admin",
        email: TEMP_ADMIN_EMAIL,
        displayName: "Temporary Admin",
        role: "admin",
        isTemporary: true
    };
}

function saveTempSession() {
    localStorage.setItem(TEMP_AUTH_KEY, "1");
}

function clearTempSession() {
    localStorage.removeItem(TEMP_AUTH_KEY);
}

function hasTempSession() {
    return localStorage.getItem(TEMP_AUTH_KEY) === "1";
}

async function waitForUser() {
    return new Promise((resolve) => {
        const unsub = onAuthStateChanged(auth, (user) => {
            unsub();
            resolve(user || null);
        });
    });
}

async function getProfile(uid, fallbackEmail = "") {
    const snap = await get(ref(db, `app_users/${uid}`));
    if (!snap.exists()) {
        return { uid, email: fallbackEmail, displayName: "", role: "user" };
    }
    const data = snap.val();
    return {
        uid,
        email: String(data.email || fallbackEmail || ""),
        displayName: String(data.displayName || ""),
        role: normalizeRole(data.role)
    };
}

async function ensureProfile(user, displayName = "") {
    const userRef = ref(db, `app_users/${user.uid}`);
    const existing = await get(userRef);
    if (existing.exists()) {
        return getProfile(user.uid, user.email || "");
    }

    // Only the first account can claim admin when adminUid is truly null.
    const tx = await runTransaction(ref(db, "meta/adminUid"), (v) => (v === null ? user.uid : v));
    const adminUid = String(tx.snapshot.val() || "");
    const role = adminUid === user.uid ? "admin" : "user";

    const profile = {
        email: String(user.email || "").toLowerCase(),
        displayName: String(displayName || user.displayName || ""),
        role,
        createdAt: Date.now(),
        updatedAt: Date.now()
    };
    await set(userRef, profile);
    return { uid: user.uid, ...profile };
}

async function loginWithEmail(email, password) {
    if (!email || !password) return { ok: false, key: "auth.error.requiredEmailPassword" };
    const normalizedEmail = email.trim().toLowerCase();

    if (normalizedEmail === TEMP_ADMIN_EMAIL && password === TEMP_ADMIN_PASSWORD) {
        saveTempSession();
        return {
            ok: true,
            user: { uid: "temp-admin" },
            profile: buildTempAdminProfile()
        };
    }

    try {
        const cred = await signInWithEmailAndPassword(auth, normalizedEmail, password);
        clearTempSession();
        const profile = await ensureProfile(cred.user);
        return { ok: true, user: cred.user, profile };
    } catch (error) {
        return { ok: false, key: authErrorKey(error.code) };
    }
}

async function registerWithEmail(email, password, confirmPassword, displayName) {
    if (!email) return { ok: false, key: "auth.error.requiredEmail" };
    if (String(password).length < 6) return { ok: false, key: "auth.error.passwordTooShort" };
    if (password !== confirmPassword) return { ok: false, key: "auth.error.passwordMismatch" };

    try {
        const cred = await createUserWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
        if (displayName) {
            await updateProfile(cred.user, { displayName: String(displayName).trim() });
        }
        const profile = await ensureProfile(cred.user, displayName);
        return { ok: true, profile, key: profile.role === "admin" ? "auth.msg.registerAdminSuccess" : "auth.msg.registerSuccess" };
    } catch (error) {
        return { ok: false, key: authErrorKey(error.code) };
    }
}

const viewEls = {
    login: document.getElementById("view-login"),
    dashboard: document.getElementById("view-dashboard"),
    devices: document.getElementById("view-devices"),
    unauthorized: document.getElementById("view-unauthorized")
};

const toastWrap = document.getElementById("toast-wrap");
const authMessageEl = document.getElementById("auth-message");
const tabLoginBtn = document.getElementById("tab-login");
const tabRegisterBtn = document.getElementById("tab-register");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");
const registerName = document.getElementById("register-name");
const registerEmail = document.getElementById("register-email");
const registerPassword = document.getElementById("register-password");
const registerConfirm = document.getElementById("register-confirm");

const authUserDashboard = document.getElementById("auth-user-dashboard");
const authUserDevices = document.getElementById("auth-user-devices");

const tempEl = document.getElementById("temp-val");
const humEl = document.getElementById("hum-val");
const lightEl = document.getElementById("light-val");
const lightMoodEl = document.getElementById("light-mood");
const tempStatusEl = document.getElementById("temp-status");
const humStatusEl = document.getElementById("hum-status");
const lightStatusEl = document.getElementById("light-status");
const dbStatusEl = document.getElementById("db-status-chip");
const boardStatusEl = document.getElementById("board-status-chip");
const connectionStatusEl = document.getElementById("connection-status");
const manualLockNoteEl = document.getElementById("manual-lock-note");
const rxRateEl = document.getElementById("rx-rate");
const txLatencyEl = document.getElementById("tx-latency");
const txStateEl = document.getElementById("tx-state");
const logListEl = document.getElementById("log-list");
const warnCountEl = document.getElementById("warn-daily-count");
const dangerCountEl = document.getElementById("danger-daily-count");
const toggleRelay1 = document.getElementById("toggle-relay1");
const toggleRelay2 = document.getElementById("toggle-relay2");
const toggleAuto = document.getElementById("toggle-auto");
const relay1Wrapper = document.getElementById("relay1-wrapper");
const relay2Wrapper = document.getElementById("relay2-wrapper");
const allOffBtn = document.getElementById("all-off-btn");
const syncBtn = document.getElementById("sync-now-btn");
const clearLogsBtn = document.getElementById("clear-logs-btn");
const exportLogsBtn = document.getElementById("export-logs-btn");

const themeObsidianBtn = document.getElementById("theme-obsidian");
const themeCarbonBtn = document.getElementById("theme-carbon");
const themeNeonBtn = document.getElementById("theme-neon");
const modeDarkBtn = document.getElementById("mode-dark");
const modeLightBtn = document.getElementById("mode-light");
const modeContrastBtn = document.getElementById("mode-contrast");

const thresholdPresetEl = document.getElementById("threshold-preset");
const thTempWarnEl = document.getElementById("th-temp-warn");
const thTempDangerEl = document.getElementById("th-temp-danger");
const thHumWarnLowEl = document.getElementById("th-hum-warn-low");
const thHumWarnHighEl = document.getElementById("th-hum-warn-high");
const thHumDangerEl = document.getElementById("th-hum-danger");
const thLightDangerEl = document.getElementById("th-light-danger");
const thLightWarnLowEl = document.getElementById("th-light-warn-low");
const thLightWarnHighEl = document.getElementById("th-light-warn-high");
const applyThresholdBtn = document.getElementById("apply-threshold-btn");
const resetThresholdBtn = document.getElementById("reset-threshold-btn");

const newDeviceNameEl = document.getElementById("new-device-name");
const newDeviceTypeEl = document.getElementById("new-device-type");
const addDeviceBtn = document.getElementById("add-device-btn");
const extraDeviceListEl = document.getElementById("extra-device-list");

let session = { user: null, profile: null };
let currentView = "login";
let deniedReason = "default";

function showToast(message, level = "info") {
    const toast = document.createElement("div");
    toast.className = `toast toast-${level}`;
    toast.textContent = message;
    toastWrap.appendChild(toast);
    window.setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(16px)";
        window.setTimeout(() => toast.remove(), 280);
    }, 3200);
}

function setAuthMessage(key, type = "info") {
    authMessageEl.textContent = tt(key);
    authMessageEl.className = `auth-message mt-4 auth-${type}`;
}

function setUserChips() {
    const name = session.profile?.displayName || session.profile?.email || "-";
    const role = session.profile?.role === "admin" ? tt("common.role.admin") : tt("common.role.user");
    const text = tt("common.userChip", { name, role });
    authUserDashboard.textContent = text;
    authUserDevices.textContent = text;
}

function showView(view) {
    currentView = view;
    Object.entries(viewEls).forEach(([key, el]) => {
        if (!el) return;
        const isActive = key === view;
        el.classList.toggle("hidden", !isActive);
        el.style.display = isActive ? "" : "none";
        el.setAttribute("aria-hidden", isActive ? "false" : "true");
    });
    // Update navbar button active states
    document.querySelectorAll("[data-nav-view]").forEach((btn) => {
        btn.classList.toggle("nav-active", btn.dataset.navView === view);
    });
    if (view === "login") document.title = tt("page.title.login");
    if (view === "dashboard") document.title = tt("page.title.dashboard");
    if (view === "devices") document.title = tt("page.title.devices");
    if (view === "unauthorized") document.title = tt("page.title.unauthorized");
}

function goTo(view, reason = "default") {
    if (view === "devices" && session.profile?.role !== "admin") {
        deniedReason = "devices";
        showView("unauthorized");
        return;
    }
    deniedReason = reason;
    showView(view);
}

function setLangButtons() {
    document.querySelectorAll("[data-lang-toggle]").forEach((btn) => {
        btn.textContent = currentLang === "en" ? tt("common.lang.en") : tt("common.lang.th");
    });
    document.querySelectorAll("[data-logout]").forEach((btn) => {
        btn.textContent = tt("common.nav.logout");
    });
}

function applyLanguage() {
    document.documentElement.lang = currentLang;
    setLangButtons();

    const map = {
        "#login-title-text": "auth.title",
        "#login-subtitle-text": "auth.subtitle",
        "#tab-login": "auth.tab.login",
        "#tab-register": "auth.tab.register",
        "#login-email-label": "auth.label.email",
        "#login-password-label": "auth.label.password",
        "#register-name-label": "auth.label.name",
        "#register-email-label": "auth.label.newEmail",
        "#register-password-label": "auth.label.password",
        "#register-confirm-label": "auth.label.confirm",
        "#login-submit": "auth.submit.login",
        "#register-submit": "auth.submit.register",

        "#hero-title-text": "dashboard.heroTitle",
        "#hero-subtitle": "dashboard.heroSubtitle",
        "#pill-live": "dashboard.pill.live",
        "#pill-modern": "dashboard.pill.modern",
        "#pill-stable": "dashboard.pill.stable",
        "#theme-obsidian": "dashboard.theme.obsidian",
        "#theme-carbon": "dashboard.theme.carbon",
        "#theme-neon": "dashboard.theme.neon",
        "#mode-dark": "dashboard.mode.dark",
        "#mode-light": "dashboard.mode.light",
        "#mode-contrast": "dashboard.mode.contrast",
        "#rx-rate-label": "dashboard.rx",
        "#tx-latency-label": "dashboard.tx",
        "#command-label": "dashboard.cmd",
        "#metric-temp-label": "dashboard.metric.temp",
        "#metric-hum-label": "dashboard.metric.hum",
        "#metric-light-label": "dashboard.metric.light",
        "#light-chart-title": "dashboard.chart.light",
        "#light-trend-badge": "dashboard.chart.lightBadge",
        "#env-chart-title": "dashboard.chart.env",
        "#control-panel-title": "dashboard.panel.title",
        "#relay1-title": "dashboard.relay1.title",
        "#relay1-subtitle": "dashboard.relay1.subtitle",
        "#relay2-title": "dashboard.relay2.title",
        "#relay2-subtitle": "dashboard.relay2.subtitle",
        "#auto-title": "dashboard.auto.title",
        "#auto-subtitle": "dashboard.auto.subtitle",
        "#all-off-label": "dashboard.allOff",
        "#sync-now-label": "dashboard.syncNow",
        "#threshold-title": "dashboard.threshold.title",
        "#preset-balanced": "dashboard.threshold.balanced",
        "#preset-strict": "dashboard.threshold.strict",
        "#preset-relaxed": "dashboard.threshold.relaxed",
        "#th-label-temp-warn": "dashboard.threshold.tw",
        "#th-label-temp-danger": "dashboard.threshold.td",
        "#th-label-hum-warn-low": "dashboard.threshold.hwl",
        "#th-label-hum-warn-high": "dashboard.threshold.hwh",
        "#th-label-hum-danger": "dashboard.threshold.hd",
        "#th-label-light-danger": "dashboard.threshold.ld",
        "#th-label-light-warn-low": "dashboard.threshold.lwl",
        "#th-label-light-warn-high": "dashboard.threshold.lwh",
        "#apply-threshold-btn": "dashboard.threshold.apply",
        "#reset-threshold-btn": "dashboard.threshold.reset",
        "#sticker-title": "dashboard.sticker.title",
        "#sticker-desc": "dashboard.sticker.desc",
        "#latest-status-title": "dashboard.status.title",
        "#status-temp-label": "dashboard.metric.temp",
        "#status-hum-label": "dashboard.metric.hum",
        "#status-light-label": "dashboard.metric.light",
        "#status-db-label": "dashboard.db",
        "#status-board-label": "dashboard.board",
        "#logs-title": "dashboard.logs.title",
        "#export-csv-label": "dashboard.logs.export",
        "#clear-log-label": "dashboard.logs.clear",
        "#warn-today-label": "dashboard.logs.warn",
        "#danger-today-label": "dashboard.logs.danger",

        "#nav-dashboard": "common.nav.dashboard",
        "#nav-devices": "common.nav.devices",
        "#nav-dashboard-2": "common.nav.dashboard",
        "#nav-devices-2": "common.nav.devices",

        "#devices-hero-title": "devices.title",
        "#devices-hero-subtitle": "devices.subtitle",
        "#window-section-title": "devices.window.title",
        "#window-1-mode-auto": "devices.mode.auto",
        "#window-2-mode-auto": "devices.mode.auto",
        "#window-3-mode-auto": "devices.mode.auto",
        "#window-1-mode-manual": "devices.mode.manual",
        "#window-2-mode-manual": "devices.mode.manual",
        "#window-3-mode-manual": "devices.mode.manual",
        "#custom-device-title": "devices.custom.title",
        "#device-type-custom": "devices.type.custom",
        "#device-type-light": "devices.type.light",
        "#device-type-fan": "devices.type.fan",
        "#device-type-pump": "devices.type.pump",
        "#device-type-valve": "devices.type.valve",
        "#add-device-btn": "devices.add",

        "#unauthorized-title": "unauth.title",
        "#unauthorized-subtitle": "unauth.subtitle",
        "#unauthorized-desc": "unauth.desc",
        "#back-dashboard-top": "common.nav.dashboard",
        "#login-other-top": "unauth.login",
        "#back-dashboard-btn-text": "unauth.back",
        "#login-other-btn-text": "unauth.login"
    };

    Object.entries(map).forEach(([selector, key]) => {
        const el = document.querySelector(selector);
        if (el) el.textContent = tt(key);
    });

    document.getElementById("unauthorized-reason").textContent = deniedReason === "devices" ? tt("unauth.reason.devices") : tt("unauth.reason.default");
    loginEmail.placeholder = tt("auth.placeholder.loginEmail");
    registerName.placeholder = tt("auth.placeholder.name");
    registerEmail.placeholder = tt("auth.placeholder.registerEmail");
    newDeviceNameEl.placeholder = tt("devices.placeholder");

    document.getElementById("window-1-label").textContent = tt("devices.window.label", { index: 1 });
    document.getElementById("window-2-label").textContent = tt("devices.window.label", { index: 2 });
    document.getElementById("window-3-label").textContent = tt("devices.window.label", { index: 3 });

    lightChart.data.datasets[0].label = tt("dashboard.metric.light") + " (%)";
    envChart.data.datasets[0].label = tt("dashboard.metric.temp") + " (°C)";
    envChart.data.datasets[1].label = tt("dashboard.metric.hum") + " (%)";
    lightChart.update("none");
    envChart.update("none");

    setUserChips();
    updateConnectionBadge();
    renderExtraDevices();
    updateLightMood(lastLightPercent);
}

function parseNum(v) {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
}

const lightCtx = document.getElementById("lightChart").getContext("2d");
const lightGradient = lightCtx.createLinearGradient(0, 0, 0, 240);
lightGradient.addColorStop(0, "rgba(255, 170, 0, 0.55)");
lightGradient.addColorStop(1, "rgba(255, 170, 0, 0.05)");

const lightChart = new Chart(lightCtx, {
    type: "line",
    data: { labels: [], datasets: [{ label: "Light", borderColor: "#f59e0b", backgroundColor: lightGradient, data: [], tension: 0.35, fill: true, borderWidth: 3, pointRadius: 0 }] },
    options: { responsive: true, maintainAspectRatio: false, scales: { x: { grid: { color: "rgba(80,110,120,0.12)" } }, y: { beginAtZero: true, suggestedMax: 100, grid: { color: "rgba(80,110,120,0.12)" } } }, animation: { duration: 300 } }
});

const envCtx = document.getElementById("envChart").getContext("2d");
const envChart = new Chart(envCtx, {
    type: "line",
    data: {
        labels: [],
        datasets: [
            { label: "Temp", borderColor: "#ef4444", backgroundColor: "rgba(239,68,68,0.12)", data: [], tension: 0.33, borderWidth: 2, pointRadius: 0 },
            { label: "Humidity", borderColor: "#06b6d4", backgroundColor: "rgba(6,182,212,0.12)", data: [], tension: 0.33, borderWidth: 2, pointRadius: 0 }
        ]
    },
    options: { responsive: true, maintainAspectRatio: false, scales: { x: { grid: { color: "rgba(80,110,120,0.1)" } }, y: { grid: { color: "rgba(80,110,120,0.1)" } } }, animation: { duration: 300 } }
});

let lastBoardDataAt = 0;
let isDbConnected = false;
let lastLightPercent = null;
let pendingPatch = {};
let patchTimer = null;
let lastSnapshotAt = 0;
let manualLocked = null;
let persistedLogs = [];

let windowState = { 1: { mode: "auto", open: 0 }, 2: { mode: "auto", open: 0 }, 3: { mode: "auto", open: 0 } };
let extraDevices = [];

const thresholdDefaults = {
    balanced: { preset: "balanced", tempWarn: 30, tempDanger: 35, humWarnLow: 35, humWarnHigh: 70, humDanger: 80, lightDanger: 25, lightWarnLow: 45, lightWarnHigh: 90 },
    strict: { preset: "strict", tempWarn: 28, tempDanger: 32, humWarnLow: 40, humWarnHigh: 65, humDanger: 75, lightDanger: 35, lightWarnLow: 55, lightWarnHigh: 85 },
    relaxed: { preset: "relaxed", tempWarn: 32, tempDanger: 38, humWarnLow: 30, humWarnHigh: 75, humDanger: 85, lightDanger: 18, lightWarnLow: 35, lightWarnHigh: 95 }
};
let threshold = { ...thresholdDefaults.balanced };

function readJson(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return fallback;
        return JSON.parse(raw);
    } catch {
        return fallback;
    }
}

function saveLogs() { localStorage.setItem(LOG_KEY, JSON.stringify(persistedLogs)); }
function saveWindowState() { localStorage.setItem(WINDOWS_KEY, JSON.stringify(windowState)); }
function saveExtraDevices() { localStorage.setItem(DEVICES_KEY, JSON.stringify(extraDevices)); }

function pushLogToCloud(message, level) {
    if (!session.user || session.user.uid === "temp-admin") return;
    push(ref(db, "iot_logs"), {
        message: String(message),
        level: String(level),
        timestamp: Date.now(),
        user: String(session.profile?.displayName || session.profile?.email || "System")
    }).catch(() => {
        // Keep UI responsive even if cloud log write fails.
    });
}

function addLog(message, level = "info") {
    const entry = { message, level, time: new Date().toLocaleTimeString(currentLang === "en" ? "en-GB" : "th-TH", { hour12: false }) };
    persistedLogs.push(entry);
    while (persistedLogs.length > 40) persistedLogs.shift();
    saveLogs();
    renderLogs();
    pushLogToCloud(message, level);
}

function renderLogs() {
    logListEl.innerHTML = "";
    [...persistedLogs].reverse().forEach((entry) => {
        const div = document.createElement("div");
        div.className = `log-item log-${entry.level}`;
        div.innerHTML = `${entry.message}<span class="log-time">${entry.time}</span>`;
        logListEl.appendChild(div);
    });

    const today = new Date().toLocaleDateString(currentLang === "en" ? "en-GB" : "th-TH");
    const dayEntries = persistedLogs.filter(() => true);
    warnCountEl.textContent = String(dayEntries.filter((e) => e.level === "warn").length);
    dangerCountEl.textContent = String(dayEntries.filter((e) => e.level === "danger").length);
}

function moodByLight(light) {
    if (light === null) return tt("dashboard.light.pending");
    if (light >= 80) return tt("dashboard.light.high");
    if (light >= 45) return tt("dashboard.light.mid");
    return tt("dashboard.light.low");
}

function updateLightMood(light) {
    lastLightPercent = light;
    lightMoodEl.textContent = moodByLight(light);
}

function classifyTemp(v) {
    if (v === null) return { level: "info", text: tt("dashboard.wait") };
    if (v >= threshold.tempDanger) return { level: "danger", text: tt("dashboard.class.temp.hot", { value: v.toFixed(1) }) };
    if (v >= threshold.tempWarn) return { level: "warn", text: tt("dashboard.class.temp.warm", { value: v.toFixed(1) }) };
    if (v < 20) return { level: "info", text: tt("dashboard.class.temp.cool", { value: v.toFixed(1) }) };
    return { level: "good", text: tt("dashboard.class.temp.ok", { value: v.toFixed(1) }) };
}
function classifyHum(v) {
    if (v === null) return { level: "info", text: tt("dashboard.wait") };
    if (v >= threshold.humDanger) return { level: "danger", text: tt("dashboard.class.hum.high", { value: v.toFixed(1) }) };
    if (v >= threshold.humWarnHigh || v < threshold.humWarnLow) return { level: "warn", text: tt("dashboard.class.hum.warn", { value: v.toFixed(1) }) };
    return { level: "good", text: tt("dashboard.class.hum.ok", { value: v.toFixed(1) }) };
}
function classifyLight(v) {
    if (v === null) return { level: "info", text: tt("dashboard.wait") };
    if (v < threshold.lightDanger) return { level: "danger", text: tt("dashboard.class.light.dark", { value: v.toFixed(0) }) };
    if (v < threshold.lightWarnLow || v > threshold.lightWarnHigh) return { level: "warn", text: tt("dashboard.class.light.warn", { value: v.toFixed(0) }) };
    return { level: "good", text: tt("dashboard.class.light.ok", { value: v.toFixed(0) }) };
}

function statusMeta(level) {
    if (level === "good") return { chip: "status-good", dot: "dot-good" };
    if (level === "warn") return { chip: "status-warn", dot: "dot-warn" };
    if (level === "danger") return { chip: "status-danger", dot: "dot-danger" };
    return { chip: "status-info", dot: "dot-info" };
}
function setChip(el, res) {
    const m = statusMeta(res.level);
    el.className = `status-chip ${m.chip}`;
    el.innerHTML = `<span class="status-dot ${m.dot}"></span>${res.text}`;
}

function updateConnectionBadge() {
    if (!isDbConnected) {
        connectionStatusEl.className = "status-badge bg-rose-100 text-rose-700 w-fit";
        connectionStatusEl.innerHTML = `<i class="fa-solid fa-database mr-2"></i>${tt("dashboard.conn.offline")}`;
        txStateEl.textContent = tt("dashboard.tx.offline");
        txStateEl.className = "perf-value tx-fail";
        return;
    }

    const age = lastBoardDataAt ? Math.floor((Date.now() - lastBoardDataAt) / 1000) : null;
    if (age !== null && age <= 40) {
        connectionStatusEl.className = "status-badge bg-emerald-100 text-emerald-700 w-fit";
        connectionStatusEl.innerHTML = `<i class="fa-solid fa-circle-check mr-2"></i>${tt("dashboard.conn.live", { seconds: age })}`;
    } else {
        connectionStatusEl.className = "status-badge bg-amber-100 text-amber-700 w-fit";
        connectionStatusEl.innerHTML = `<i class="fa-solid fa-triangle-exclamation mr-2"></i>${tt("dashboard.conn.wait")}`;
    }
}

function setDatabaseStatus(connected) {
    isDbConnected = connected;
    if (connected) {
        dbStatusEl.className = "status-chip status-good";
        dbStatusEl.innerHTML = `<span class="status-dot dot-good"></span>${tt("dashboard.db.connected")}`;
    } else {
        dbStatusEl.className = "status-chip status-danger";
        dbStatusEl.innerHTML = `<span class="status-dot dot-danger"></span>${tt("dashboard.db.disconnected")}`;
    }
    updateConnectionBadge();
}

function setBoardStatus() {
    if (!lastBoardDataAt) {
        boardStatusEl.className = "status-chip status-warn";
        boardStatusEl.innerHTML = `<span class="status-dot dot-warn"></span>${tt("dashboard.board.wait")}`;
        updateConnectionBadge();
        return;
    }
    const age = Math.floor((Date.now() - lastBoardDataAt) / 1000);
    if (age <= 40) {
        boardStatusEl.className = "status-chip status-good";
        boardStatusEl.innerHTML = `<span class="status-dot dot-good"></span>${tt("dashboard.board.good", { seconds: age })}`;
    } else {
        boardStatusEl.className = "status-chip status-danger";
        boardStatusEl.innerHTML = `<span class="status-dot dot-danger"></span>${tt("dashboard.board.missing", { seconds: age })}`;
    }
    updateConnectionBadge();
}

function setManualLock(autoMode) {
    toggleRelay1.disabled = autoMode;
    toggleRelay2.disabled = autoMode;
    relay1Wrapper.classList.toggle("opacity-70", autoMode);
    relay2Wrapper.classList.toggle("opacity-70", autoMode);

    manualLockNoteEl.className = autoMode ? "manual-lock-note manual-lock-on" : "manual-lock-note manual-lock-off";
    const text = autoMode ? tt("dashboard.manual.lock") : tt("dashboard.manual.unlock");
    const icon = autoMode ? "lock" : "unlock";
    document.getElementById("manual-lock-text").textContent = text;
    manualLockNoteEl.querySelector("i").className = `fa-solid fa-${icon} mr-1`;

    if (manualLocked !== autoMode) {
        addLog(autoMode ? tt("dashboard.log.manualLock") : tt("dashboard.log.manualUnlock"), autoMode ? "warn" : "good");
        manualLocked = autoMode;
    }
}

function queuePatch(patch) {
    pendingPatch = { ...pendingPatch, ...patch };
    txStateEl.className = "perf-value tx-pending";
    txStateEl.textContent = tt("dashboard.tx.queue");
    if (patchTimer) window.clearTimeout(patchTimer);
    patchTimer = window.setTimeout(flushPatch, 80);
}

async function flushPatch() {
    if (!Object.keys(pendingPatch).length) return;
    const patch = pendingPatch;
    pendingPatch = {};

    txStateEl.className = "perf-value tx-pending";
    txStateEl.textContent = tt("dashboard.tx.sending");
    const t0 = performance.now();
    try {
        await update(ref(db, "iot_data"), patch);
        txLatencyEl.textContent = `${(performance.now() - t0).toFixed(0)} ms`;
        txStateEl.className = "perf-value tx-ok";
        txStateEl.textContent = tt("dashboard.tx.delivered");
        window.setTimeout(() => {
            txStateEl.className = "perf-value tx-live";
            txStateEl.textContent = tt("dashboard.tx.ready");
        }, 500);
    } catch {
        txStateEl.className = "perf-value tx-fail";
        txStateEl.textContent = tt("dashboard.tx.failed");
        showToast(tt("dashboard.toast.sendFail"), "danger");
    }
}

function pushChart(chart, values, label, max = 24) {
    if (chart.data.labels.length >= max) {
        chart.data.labels.shift();
        chart.data.datasets.forEach((d) => d.data.shift());
    }
    chart.data.labels.push(label);
    values.forEach((v, i) => chart.data.datasets[i].data.push(v));
    chart.update();
}

onValue(ref(db, "iot_data"), (snapshot) => {
    if (!session.user) return;
    if (!snapshot.exists()) {
        setDatabaseStatus(true);
        setBoardStatus();
        addLog(tt("dashboard.log.nodeMissing"), "warn");
        return;
    }

    const data = snapshot.val();
    setDatabaseStatus(true);
    lastBoardDataAt = Date.now();
    setBoardStatus();

    const now = performance.now();
    if (lastSnapshotAt > 0) {
        rxRateEl.textContent = `${(1000 / Math.max(1, now - lastSnapshotAt)).toFixed(1)} /s`;
    }
    lastSnapshotAt = now;

    const temp = parseNum(data.temperature);
    const hum = parseNum(data.humidity);
    const light = parseNum(data.light_percent);

    tempEl.textContent = temp === null ? "--" : temp.toFixed(1);
    humEl.textContent = hum === null ? "--" : hum.toFixed(1);
    lightEl.textContent = light === null ? "--" : light.toFixed(0);
    updateLightMood(light);

    const tempRes = classifyTemp(temp);
    const humRes = classifyHum(hum);
    const lightRes = classifyLight(light);

    setChip(tempStatusEl, tempRes);
    setChip(humStatusEl, humRes);
    setChip(lightStatusEl, lightRes);

    toggleRelay1.checked = Boolean(data.relay1);
    toggleRelay2.checked = Boolean(data.relay2);
    toggleAuto.checked = Boolean(data.auto_mode);
    setManualLock(Boolean(data.auto_mode));

    const timeLabel = new Date().toLocaleTimeString(currentLang === "en" ? "en-GB" : "th-TH", { hour12: false });
    pushChart(lightChart, [light], timeLabel);
    pushChart(envChart, [temp, hum], timeLabel);
}, () => {
    setDatabaseStatus(false);
});

window.setInterval(() => {
    if (session.user) setBoardStatus();
}, 2000);

function bindDashboardEvents() {
    toggleRelay1.addEventListener("change", (e) => {
        if (toggleAuto.checked) {
            e.target.checked = !e.target.checked;
            showToast(tt("dashboard.toast.relayBlocked"), "warn");
            return;
        }
        queuePatch({ relay1: e.target.checked });
        addLog(e.target.checked ? tt("dashboard.action.r1on") : tt("dashboard.action.r1off"), "info");
    });

    toggleRelay2.addEventListener("change", (e) => {
        if (toggleAuto.checked) {
            e.target.checked = !e.target.checked;
            showToast(tt("dashboard.toast.relayBlocked"), "warn");
            return;
        }
        queuePatch({ relay2: e.target.checked });
        addLog(e.target.checked ? tt("dashboard.action.r2on") : tt("dashboard.action.r2off"), "info");
    });

    toggleAuto.addEventListener("change", (e) => {
        queuePatch({ auto_mode: e.target.checked });
        addLog(e.target.checked ? tt("dashboard.action.autoOn") : tt("dashboard.action.autoOff"), e.target.checked ? "good" : "warn");
    });

    allOffBtn.addEventListener("click", () => {
        queuePatch({ relay1: false, relay2: false, auto_mode: false });
        showToast(tt("dashboard.toast.allOff"), "warn");
        addLog(tt("dashboard.action.allOffLog"), "warn");
    });

    syncBtn.addEventListener("click", () => {
        flushPatch();
        showToast(tt("dashboard.toast.sync"), "info");
        addLog(tt("dashboard.action.syncLog"), "info");
    });

    clearLogsBtn.addEventListener("click", () => {
        persistedLogs = [];
        saveLogs();
        renderLogs();
        addLog(tt("dashboard.log.clear"), "info");
        showToast(tt("dashboard.toast.clear"), "info");
    });

    exportLogsBtn.addEventListener("click", () => {
        if (!persistedLogs.length) {
            showToast(tt("dashboard.toast.exportEmpty"), "warn");
            return;
        }
        const rows = ["time,level,message", ...persistedLogs.map((l) => `${JSON.stringify(l.time)},${JSON.stringify(l.level)},${JSON.stringify(l.message)}`)];
        const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `iot-logs-${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        addLog(tt("dashboard.log.export"), "info");
        showToast(tt("dashboard.toast.exportDone"), "good");
    });

    [themeObsidianBtn, themeCarbonBtn, themeNeonBtn].forEach((btn) => {
        btn.addEventListener("click", () => setTheme(btn.id.replace("theme-", "")));
    });
    [modeDarkBtn, modeLightBtn, modeContrastBtn].forEach((btn) => {
        btn.addEventListener("click", () => setMode(btn.id.replace("mode-", "")));
    });

    thresholdPresetEl.addEventListener("change", (e) => {
        threshold = { ...thresholdDefaults[e.target.value] };
        writeThresholdInputs();
        localStorage.setItem(THRESHOLD_KEY, JSON.stringify(threshold));
        addLog(tt("dashboard.log.threshold", { preset: threshold.preset }), "info");
    });
    applyThresholdBtn.addEventListener("click", () => {
        threshold = normalizeThreshold(readThresholdInputs());
        localStorage.setItem(THRESHOLD_KEY, JSON.stringify(threshold));
        writeThresholdInputs();
        addLog(tt("dashboard.log.threshold", { preset: threshold.preset }), "info");
    });
    resetThresholdBtn.addEventListener("click", () => {
        threshold = { ...thresholdDefaults.balanced };
        localStorage.setItem(THRESHOLD_KEY, JSON.stringify(threshold));
        writeThresholdInputs();
    });
}

function normalizeThreshold(cfg) {
    const safe = { ...cfg };
    if (!Number.isFinite(safe.tempWarn)) safe.tempWarn = 30;
    if (!Number.isFinite(safe.tempDanger)) safe.tempDanger = 35;
    if (!Number.isFinite(safe.humWarnLow)) safe.humWarnLow = 35;
    if (!Number.isFinite(safe.humWarnHigh)) safe.humWarnHigh = 70;
    if (!Number.isFinite(safe.humDanger)) safe.humDanger = 80;
    if (!Number.isFinite(safe.lightDanger)) safe.lightDanger = 25;
    if (!Number.isFinite(safe.lightWarnLow)) safe.lightWarnLow = 45;
    if (!Number.isFinite(safe.lightWarnHigh)) safe.lightWarnHigh = 90;
    safe.preset = safe.preset || "balanced";
    return safe;
}
function writeThresholdInputs() {
    thresholdPresetEl.value = threshold.preset;
    thTempWarnEl.value = threshold.tempWarn;
    thTempDangerEl.value = threshold.tempDanger;
    thHumWarnLowEl.value = threshold.humWarnLow;
    thHumWarnHighEl.value = threshold.humWarnHigh;
    thHumDangerEl.value = threshold.humDanger;
    thLightDangerEl.value = threshold.lightDanger;
    thLightWarnLowEl.value = threshold.lightWarnLow;
    thLightWarnHighEl.value = threshold.lightWarnHigh;
}
function readThresholdInputs() {
    return {
        preset: thresholdPresetEl.value,
        tempWarn: Number(thTempWarnEl.value),
        tempDanger: Number(thTempDangerEl.value),
        humWarnLow: Number(thHumWarnLowEl.value),
        humWarnHigh: Number(thHumWarnHighEl.value),
        humDanger: Number(thHumDangerEl.value),
        lightDanger: Number(thLightDangerEl.value),
        lightWarnLow: Number(thLightWarnLowEl.value),
        lightWarnHigh: Number(thLightWarnHighEl.value)
    };
}

function setTheme(name) {
    const theme = ["obsidian", "carbon", "neon"].includes(name) ? name : "obsidian";
    document.body.classList.remove("theme-obsidian", "theme-carbon", "theme-neon");
    document.body.classList.add(`theme-${theme}`);
    localStorage.setItem(THEME_KEY, theme);
    addLog(tt("dashboard.log.theme", { theme: theme.toUpperCase() }), "info");

    themeObsidianBtn.classList.toggle("active", theme === "obsidian");
    themeCarbonBtn.classList.toggle("active", theme === "carbon");
    themeNeonBtn.classList.toggle("active", theme === "neon");
}

function setMode(name) {
    const mode = ["dark", "light", "contrast"].includes(name) ? name : "dark";
    document.body.classList.remove("mode-dark", "mode-light", "mode-contrast");
    document.body.classList.add(`mode-${mode}`);
    localStorage.setItem(MODE_KEY, mode);
    modeDarkBtn.classList.toggle("active", mode === "dark");
    modeLightBtn.classList.toggle("active", mode === "light");
    modeContrastBtn.classList.toggle("active", mode === "contrast");
}

function applyWindowUi(id) {
    const modeEl = document.getElementById(`window-${id}-mode`);
    const openEl = document.getElementById(`window-${id}-open`);
    const valueEl = document.getElementById(`window-${id}-value`);
    if (!modeEl || !openEl || !valueEl) return;
    const st = windowState[id];
    modeEl.value = st.mode;
    openEl.value = String(st.open);
    openEl.disabled = st.mode !== "manual";
    valueEl.textContent = `${st.open}%`;
}

function renderExtraDevices() {
    extraDeviceListEl.innerHTML = "";
    if (!extraDevices.length) {
        const p = document.createElement("p");
        p.className = "text-xs text-slate-400";
        p.textContent = tt("devices.empty");
        extraDeviceListEl.appendChild(p);
        return;
    }
    extraDevices.forEach((d) => {
        const row = document.createElement("div");
        row.className = "device-row";
        row.innerHTML = `
            <div>
                <p class="device-title">${d.name}</p>
                <p class="device-sub">${tt(`devices.type.${d.type}`)}</p>
            </div>
            <div class="device-actions">
                <label class="switch">
                    <input type="checkbox" data-device-toggle="${d.id}" ${d.state ? "checked" : ""}>
                    <span class="slider"></span>
                </label>
                <button type="button" class="device-remove-btn" data-device-remove="${d.id}">${tt("devices.remove")}</button>
            </div>
        `;
        extraDeviceListEl.appendChild(row);
    });
}

function bindDevicePageEvents() {
    [1, 2, 3].forEach((id) => {
        const modeEl = document.getElementById(`window-${id}-mode`);
        const openEl = document.getElementById(`window-${id}-open`);
        applyWindowUi(id);

        modeEl.addEventListener("change", async () => {
            windowState[id].mode = modeEl.value === "manual" ? "manual" : "auto";
            applyWindowUi(id);
            saveWindowState();
            await update(ref(db, "iot_data"), { [`windows/window${id}/mode`]: windowState[id].mode });
        });

        openEl.addEventListener("input", () => {
            windowState[id].open = Number(openEl.value);
            applyWindowUi(id);
        });

        openEl.addEventListener("change", async () => {
            saveWindowState();
            await update(ref(db, "iot_data"), { [`windows/window${id}/open`]: windowState[id].open });
        });
    });

    addDeviceBtn.addEventListener("click", () => {
        const name = (newDeviceNameEl.value || "").trim();
        if (!name) return;
        const type = newDeviceTypeEl.value || "custom";
        extraDevices.push({ id: `${Date.now()}-${Math.floor(Math.random() * 1000)}`, name, type, state: false });
        saveExtraDevices();
        renderExtraDevices();
        newDeviceNameEl.value = "";
    });

    extraDeviceListEl.addEventListener("click", (e) => {
        const target = e.target;
        if (!(target instanceof HTMLElement)) return;
        const removeId = target.dataset.deviceRemove;
        if (!removeId) return;
        extraDevices = extraDevices.filter((d) => d.id !== removeId);
        saveExtraDevices();
        renderExtraDevices();
    });

    extraDeviceListEl.addEventListener("change", async (e) => {
        const target = e.target;
        if (!(target instanceof HTMLInputElement)) return;
        const toggleId = target.dataset.deviceToggle;
        if (!toggleId) return;
        const d = extraDevices.find((x) => x.id === toggleId);
        if (!d) return;
        d.state = target.checked;
        saveExtraDevices();
        await update(ref(db, "iot_data"), { [`custom_devices/${d.id}/state`]: d.state });
    });
}

function loadState() {
    persistedLogs = readJson(LOG_KEY, []);
    threshold = normalizeThreshold(readJson(THRESHOLD_KEY, thresholdDefaults.balanced));
    windowState = readJson(WINDOWS_KEY, windowState);
    extraDevices = readJson(DEVICES_KEY, []);

    writeThresholdInputs();
    renderLogs();
    renderExtraDevices();

    setTheme(localStorage.getItem(THEME_KEY) || "obsidian");
    setMode(localStorage.getItem(MODE_KEY) || "dark");
}

function bindGlobalEvents() {
    document.querySelectorAll("[data-lang-toggle]").forEach((btn) => btn.addEventListener("click", toggleLang));
    document.querySelectorAll("[data-nav-view]").forEach((btn) => {
        btn.addEventListener("click", () => goTo(btn.dataset.navView));
    });
    document.querySelectorAll("[data-logout]").forEach((btn) => {
        btn.addEventListener("click", async () => {
            try {
                await signOut(auth);
            } catch {
                // Ignore signout failures for temporary offline admin mode.
            }
            clearTempSession();
            session = { user: null, profile: null };
            showView("login");
            applyLanguage();
        });
    });

    tabLoginBtn.addEventListener("click", () => {
        tabLoginBtn.classList.add("active");
        tabRegisterBtn.classList.remove("active");
        loginForm.classList.remove("hidden");
        registerForm.classList.add("hidden");
        setAuthMessage("auth.msg.loginHint", "info");
    });
    tabRegisterBtn.addEventListener("click", () => {
        tabRegisterBtn.classList.add("active");
        tabLoginBtn.classList.remove("active");
        registerForm.classList.remove("hidden");
        loginForm.classList.add("hidden");
        setAuthMessage("auth.msg.registerHint", "info");
    });

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const res = await loginWithEmail(loginEmail.value, loginPassword.value);
        if (!res.ok) return setAuthMessage(res.key, "error");
        session.user = res.user || { uid: res.profile?.uid || "temp-admin" };
        session.profile = res.profile;
        setAuthMessage("auth.msg.loginSuccess", "success");
        goTo("dashboard");
        applyLanguage();
    });

    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const res = await registerWithEmail(registerEmail.value, registerPassword.value, registerConfirm.value, registerName.value);
        if (!res.ok) return setAuthMessage(res.key, "error");
        session.profile = res.profile;
        setAuthMessage(res.key, "success");
        goTo("dashboard");
        applyLanguage();
    });
}

(async function bootstrap() {
    loadState();
    bindGlobalEvents();
    bindDashboardEvents();
    bindDevicePageEvents();

    const user = await waitForUser();
    if (!user && hasTempSession()) {
        session.user = { uid: "temp-admin" };
        session.profile = buildTempAdminProfile();
        showView("dashboard");
        addLog(tt("dashboard.log.started"), "info");
        applyLanguage();
        return;
    }

    if (!user) {
        showView("login");
        setAuthMessage("auth.msg.loginHint", "info");
        applyLanguage();
        return;
    }

    session.user = user;
    session.profile = await ensureProfile(user);
    showView("dashboard");
    addLog(tt("dashboard.log.started"), "info");
    applyLanguage();
})();
