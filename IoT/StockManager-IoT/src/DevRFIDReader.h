#include <Arduino.h>
#include <vector>
#include "BaseRFIDReader.h"

using namespace std;

class DevRFIDReader : public BaseRFIDReader
{
private:
    vector<String> rfidList;
    int index = 0;
    unsigned long lastRead = 0;
public:
    DevRFIDReader(vector<String> rfidList) : rfidList(rfidList) {}

    void init()
    {
    }

    String read()
    {
        if (millis() - lastRead < 1000)
        {
            return "";
        }

        if (index >= rfidList.size())
        {
            index = 0;
        }
        
        lastRead = millis();

        return rfidList[index++];
    }
};