#pragma one

// Comment this line to disable the debug mode
#define DEV_MODE true
// Comment this line to disable the serial log
#define LOG_SERIAL true

// Buttons pins
#define DECREASE_PIN 22
#define INCREASE_PIN 23

// RFID Reader pins
#define SS_PIN 10
#define RST_PIN 9

// WiFi configuration
#define WIFI_SSID "Wokwi-GUEST"
#define WIFI_PASSWORD ""

// Device configuration
#define DEVICE_ID 4
#define DEVICE_TOKEN "e4034e62b3600852947ac9f76beabf93-1724538714761"

// Server configuration
#define SERVER_URL "http://7.tcp.eu.ngrok.io:17424"
#define SERVER_INCREMENT_ENDPOINT "/iot/increase/"
#define SERVER_DECREMENT_ENDPOINT "/iot/decrease/"

#ifdef LOG_SERIAL
#define LOG(x) Serial.println(x)
#else
#define LOG(x)
#endif