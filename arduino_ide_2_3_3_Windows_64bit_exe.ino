// ไฟล์: main.ino
#include <WiFi.h>
#include <WiFiManager.h>
#include <Firebase_ESP_Client.h> 
#include "addons/TokenHelper.h"
#include "addons/RTDBHelper.h"
#include <DHT.h>
#include "secrets.h" // ดึงข้อมูล API Key จากไฟล์ที่ซ่อนไว้

// ---------------- กำหนดขาอุปกรณ์ ----------------
#define RELAY1_PIN 18 // หลอดไฟ
#define RELAY2_PIN 19 // พัดลม
#define DHTPIN 14
#define DHTTYPE DHT22
#define LDR_PIN 34    
#define LED_STATUS 2
#define RESET_WIFI_PIN 4 

DHT dht(DHTPIN, DHTTYPE);

// ตัวแปร Firebase
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;
bool signupOK = false;

// ตัวแปรจับเวลา (Non-blocking)
unsigned long previousMillis = 0;
const long interval = 100;       // อัปเดตทุก 500ms

// ตัวแปรเก็บค่า
float temp = 0.0;
float hum = 0.0;
int light_percent = 0;
bool relay1_state = false;
bool relay2_state = false;

// ค่า Settings (Smart Auto)
bool auto_mode = false;
float auto_fan_temp = 30.0;

void setup() {
  Serial.begin(115200);

  pinMode(RELAY1_PIN, OUTPUT);
  pinMode(RELAY2_PIN, OUTPUT);
  pinMode(LED_STATUS, OUTPUT);
  pinMode(RESET_WIFI_PIN, INPUT_PULLUP); 
  
  digitalWrite(RELAY1_PIN, HIGH);
  digitalWrite(RELAY2_PIN, HIGH);

  dht.begin();

  // ---------------- ระบบ WiFiManager ----------------
  WiFiManager wm;
  if (digitalRead(RESET_WIFI_PIN) == LOW) {
    Serial.println("Resetting WiFi Settings...");
    wm.resetSettings(); 
  }

  Serial.println("Connecting to WiFi...");
  if (!wm.autoConnect("(´。＿。｀)")) {
    Serial.println("Failed to connect, restarting...");
    delay(3000);
    ESP.restart();
  }

  Serial.println("\nWiFi Connected!");
  digitalWrite(LED_STATUS, HIGH);

  // ---------------- เชื่อมต่อ Firebase ----------------
  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;
  config.signer.test_mode = true; 
  signupOK = true; 

  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
}

void loop() {
  unsigned long currentMillis = millis();

  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;

    hum = dht.readHumidity();
    temp = dht.readTemperature();
    
    int ldr_raw = analogRead(LDR_PIN);
    light_percent = map(ldr_raw, 4095, 0, 0, 100); 
    light_percent = constrain(light_percent, 0, 100); // ใช้ constrain แทน if จะคลีนกว่า

    if (isnan(hum) || isnan(temp)) {
      Serial.println("Failed to read from DHT sensor!");
      return; 
    }

    Serial.printf("Temp: %.1f C | Hum: %.1f %% | Light: %d %%\n", temp, hum, light_percent);

    syncWithFirebase();
    checkSmartAuto();
  }
}

// ---------------- ฟังก์ชันจัดการ Firebase (ปรับให้เร็วขึ้น) ----------------
void syncWithFirebase() {
  if (Firebase.ready() && signupOK) {
    
    // 1. ส่งข้อมูลแบบมัดรวม (JSON) จะเร็วกว่าส่งแยกทีละตัวมาก
    FirebaseJson json;
    json.set("temperature", temp);
    json.set("humidity", hum);
    json.set("light_percent", light_percent);
    
    // ใช้ updateNode เพื่อไม่ให้ค่า relay ทับหายไป
    if (Firebase.RTDB.updateNode(&fbdo, "/iot_data", &json)) {
      Serial.println("✅ Firebase: อัปเดตข้อมูลเซ็นเซอร์สำเร็จ!");
    } else {
      Serial.print("❌ Firebase Error: ");
      Serial.println(fbdo.errorReason());
    }

    // 2. ดึงข้อมูลทีละตัว (เพื่อความเสถียร)
    if (Firebase.RTDB.getBool(&fbdo, "/iot_data/relay1")) {
      relay1_state = fbdo.boolData();
      digitalWrite(RELAY1_PIN, relay1_state ? LOW : HIGH);
    }
    
    if (Firebase.RTDB.getBool(&fbdo, "/iot_data/relay2")) {
      relay2_state = fbdo.boolData();
      if (!auto_mode) {
        digitalWrite(RELAY2_PIN, relay2_state ? LOW : HIGH);
      }
    }

    if (Firebase.RTDB.getBool(&fbdo, "/iot_data/auto_mode")) {
      auto_mode = fbdo.boolData();
    }
    
  } else {
    Serial.println("⏳ กำลังรอการเชื่อมต่อ Firebase...");
  }
}

void checkSmartAuto() {
  if (auto_mode) {
    if (temp >= auto_fan_temp && !relay2_state) {
      relay2_state = true;
      digitalWrite(RELAY2_PIN, LOW); 
      updateRelayToFirebase("/iot_data/relay2", true);
      Serial.println("Auto Mode: พัดลมเปิด");
    } 
    else if (temp < (auto_fan_temp - 2.0) && relay2_state) {
      relay2_state = false;
      digitalWrite(RELAY2_PIN, HIGH); 
      updateRelayToFirebase("/iot_data/relay2", false);
      Serial.println("Auto Mode: พัดลมปิด");
    }
  }
}

void updateRelayToFirebase(String path, bool state) {
  if (Firebase.ready() && signupOK) {
    Firebase.RTDB.setBool(&fbdo, path, state);
  }
}