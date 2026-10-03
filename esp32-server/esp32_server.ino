#include <WiFi.h>
#include <WebServer.h>

// ==================== CONFIGURATION ====================
// Change these to match your WiFi network
const char* WIFI_SSID     = "YOUR_WIFI_SSID";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";

// ==================== PIN DEFINITIONS ====================
const int SOIL_MOISTURE_PIN = 34;   // Analog input
const int SMOKE_SENSOR_PIN  = 35;   // Analog input
const int DHT_PIN           = 4;    // Digital input (if using DHT)

// ==================== WEB SERVER ====================
WebServer server(80);

// ==================== SENSOR FUNCTIONS ====================

// Replace these with your actual sensor libraries
// Example: #include <DHT.h>
// DHT dht(DHT_PIN, DHT22);

float readTemperature() {
  // TODO: Replace with actual DHT22/BMP280 reading
  // return dht.readTemperature();
  return 24.5 + random(-20, 20) / 10.0;  // Demo value
}

float readHumidity() {
  // TODO: Replace with actual DHT22 reading
  // return dht.readHumidity();
  return 55.0 + random(-50, 50) / 10.0;  // Demo value
}

int readSoilMoistureRaw() {
  int raw = analogRead(SOIL_MOISTURE_PIN);
  return raw;
}

int readSoilMoisturePercent() {
  int raw = analogRead(SOIL_MOISTURE_PIN);
  // Map: dry=4095, wet=1200 (typical for capacitive sensors)
  int percent = map(raw, 4095, 1200, 0, 100);
  percent = constrain(percent, 0, 100);
  return percent;
}

int readSmokeRaw() {
  int raw = analogRead(SMOKE_SENSOR_PIN);
  return raw;
}

bool isSmokeDetected() {
  int raw = analogRead(SMOKE_SENSOR_PIN);
  return raw > 300;  // Threshold
}

// ==================== CORS HELPER ====================
// Adds CORS headers to EVERY response so the browser allows the fetch

void addCorsHeaders() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
  server.sendHeader("Access-Control-Max-Age", "86400");
}

// ==================== ROUTE HANDLERS ====================

void handleOptions() {
  addCorsHeaders();
  server.send(204);
}

void handleSensors() {
  addCorsHeaders();

  float temperature    = readTemperature();
  float humidity       = readHumidity();
  int soilRaw          = readSoilMoistureRaw();
  int soilPercent      = readSoilMoisturePercent();
  int smokeRaw         = readSmokeRaw();
  bool smokeDetected   = isSmokeDetected();

  // Build JSON manually (no ArduinoJson dependency needed)
  String json = "{";
  json += "\"temperature\":" + String(temperature, 1) + ",";
  json += "\"humidity\":" + String(humidity, 1) + ",";
  json += "\"soil_moisture_raw\":" + String(soilRaw) + ",";
  json += "\"soil_moisture_percent\":" + String(soilPercent) + ",";
  json += "\"smoke_raw\":" + String(smokeRaw) + ",";
  json += "\"smoke_detected\":" + String(smokeDetected ? "true" : "false");
  json += "}";

  server.send(200, "application/json", json);
}

void handleRoot() {
  addCorsHeaders();
  server.send(200, "text/plain", "ESP32 IoT Sensor Server is running");
}

void handleNotFound() {
  addCorsHeaders();
  server.send(404, "application/json", "{\"error\":\"Not found\"}");
}

// ==================== SETUP ====================

void setup() {
  Serial.begin(115200);
  delay(100);

  Serial.println("\n=== ESP32 IoT Sensor Server ===");

  // Initialize sensor pins
  pinMode(SOIL_MOISTURE_PIN, INPUT);
  pinMode(SMOKE_SENSOR_PIN, INPUT);

  // Initialize DHT sensor (uncomment if using)
  // dht.begin();

  // Connect to WiFi
  Serial.print("Connecting to WiFi");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 30) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi connected!");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\nWiFi connection failed! Running without network.");
  }

  // Define routes
  server.on("/",          HTTP_GET, handleRoot);
  server.on("/api/sensors", HTTP_GET, handleSensors);
  server.on("/api/sensors", HTTP_OPTIONS, handleOptions);

  // Catch-all for CORS preflight
  server.onNotFound([]() {
    if (server.method() == HTTP_OPTIONS) {
      handleOptions();
    } else {
      handleNotFound();
    }
  });

  // Start server
  server.begin();
  Serial.println("HTTP server started on port 80");

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("Dashboard URL: http://" + WiFi.localIP().toString());
  }
}

// ==================== LOOP ====================

void loop() {
  server.handleClient();
}
