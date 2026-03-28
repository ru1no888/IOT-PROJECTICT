# IOT-PROJECTICT

แดชบอร์ด IoT สำหรับติดตามค่าแสง อุณหภูมิ และความชื้นแบบเรียลไทม์ พร้อมระบบควบคุมรีเลย์ผ่าน Firebase Realtime Database

## ภาพรวมระบบ

- Web Dashboard: แสดงกราฟและสถานะแบบเรียลไทม์ พร้อมระบบแจ้งเตือน
- Device Controller: ควบคุม Relay 1/Relay 2 และโหมด Auto
- Data Backend: Firebase Realtime Database
- Embedded Sketch: โค้ด Arduino/ESP สำหรับอ่านเซนเซอร์และส่งค่าเข้า Firebase

## ฟีเจอร์หลัก

- แสดงค่าเซนเซอร์แบบสด: Temperature, Humidity, Light
- กราฟเรียลไทม์ 2 ส่วน: Light Trend และ Environment Trend
- แจ้งเตือนหลายระดับ: info/warn/danger พร้อมสีแยกตามเซนเซอร์
- ระบบ Auto Lock: เมื่อเปิด Auto จะล็อกการสั่งงานแบบแมนนวล
- Theme Switcher: Obsidian / Carbon / Neon
- Mode Switcher: Dark / Light
- Threshold Preset ปรับจากหน้า UI ได้ทันที
- Log ย้อนหลัง + บันทึกลง LocalStorage
- Export Log เป็น CSV

## โครงสร้างไฟล์สำคัญ

- index.html: Dashboard หลัก (UI + Logic ฝั่งเว็บ)
- arduino_ide_2_3_3_Windows_64bit_exe.ino: สเก็ตช์หลักสำหรับ Arduino/ESP
- secrets.h: เก็บข้อมูลลับ (เช่น Wi-Fi/Firebase credentials) ไม่ควรอัปขึ้น Git

## วิธีใช้งาน (Web)

1. เปิดไฟล์ index.html ในเบราว์เซอร์
2. ตรวจว่า Firebase Config ถูกต้อง
3. ดูสถานะการเชื่อมต่อด้านบน
4. ใช้แผงควบคุมเพื่อสั่งงาน Relay หรือเปิด Auto
5. ปรับ Threshold จากพาเนล Threshold Preset

## วิธีใช้งาน (Arduino/ESP)

1. เปิดไฟล์ .ino ใน Arduino IDE
2. ใส่ค่าคอนฟิกจริงใน secrets.h
3. เลือกบอร์ดและพอร์ตให้ถูกต้อง
4. อัปโหลดโค้ดไปยังอุปกรณ์

## ความปลอดภัย

- ห้าม commit ไฟล์ secrets.h
- ไม่ควรใส่ credential จริงไว้ในไฟล์ที่แชร์สาธารณะ

## หมายเหตุ

โปรเจกต์นี้ถูกออกแบบเพื่อการเรียนรู้และการทดลองระบบ IoT Dashboard แบบครบวงจร ตั้งแต่เซนเซอร์ถึงหน้าเว็บ
