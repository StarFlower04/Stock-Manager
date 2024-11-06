#pragma once
#include <Arduino.h>
#include <SPI.h>
#include <MFRC522.h>
#include "BaseRFIDReader.h"

class RFIDReader : public BaseRFIDReader
{
private:
    MFRC522 mfrc522;

public:
    RFIDReader(int ssPin, int rstPin) : mfrc522(ssPin, rstPin) {}
    ~RFIDReader()
    {
        SPI.end();
    }

    void init()
    {
        SPI.begin();
        mfrc522.PCD_Init();
    }

    String read()
    {
        if (!mfrc522.PICC_IsNewCardPresent() || !mfrc522.PICC_ReadCardSerial())
        {
            return "";
        }

        String uidStr = "";
        for (byte i = 0; i < mfrc522.uid.size; i++)
        {
            uidStr += String(mfrc522.uid.uidByte[i], HEX);
        }

        return uidStr;
    }
};
