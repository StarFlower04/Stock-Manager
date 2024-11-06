#pragma once
#include <Arduino.h>

class BaseRFIDReader
{
public:
    virtual void init() = 0;
    virtual String read() = 0;
};
