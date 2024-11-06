#include <Arduino.h>
#include <WiFi.h>
#include <SPI.h>
#include <HTTPClient.h>
#include "config.h"
#include "BaseRFIDReader.h"

#ifdef DEV_MODE
#include "DevRFIDReader.h"
BaseRFIDReader *rfidReader = new DevRFIDReader({"RFID-VL2IT7Z1M", "RFID-FC72D6E5F2"});
#else
#include "RFIDReader.h"
BaseRFIDReader *rfidReader = new RFIDReader(SS_PIN, RST_PIN);
#endif

HTTPClient http;

void sendRequest(String endpoint, String rfid)
{
  String url = SERVER_URL + endpoint + DEVICE_ID + "?token=" + DEVICE_TOKEN + "&rfid=" + rfid;
  LOG(url);
  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  int httpResponseCode = http.POST("");
  if (httpResponseCode > 0)
  {
    String response = http.getString();
    LOG(httpResponseCode);
    LOG(response);
  }
  else
  {
    LOG("Error on sending POST: " + http.errorToString(httpResponseCode));
  }
  http.end();
}

void setup()
{
  Serial.begin(9600);

  pinMode(INCREASE_PIN, INPUT);
  pinMode(DECREASE_PIN, INPUT);

  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(1000);
    LOG("Connecting to WiFi..");
  }
  LOG("Connected to the WiFi network");

  rfidReader->init();
}

void loop()
{
  String rfid = rfidReader->read();
  if (rfid != "")
  {
    if (digitalRead(INCREASE_PIN) == HIGH)
    {
      sendRequest(SERVER_INCREMENT_ENDPOINT, rfid);
    }
    else if (digitalRead(DECREASE_PIN) == HIGH)
    {
      sendRequest(SERVER_DECREMENT_ENDPOINT, rfid);
    }
  }
}
