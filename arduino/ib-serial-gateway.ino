// This #include statement was automatically added by the Particle IDE.
#include "InternetButton.h"

/*
 *  Made for the Internet Button, this sketch receives data through
 *  the virtual serial port and maps the values out as LED colors
 *  to the ring in succession.
 *
 *  Eric McNiece, Dec. 6 2015
 */

InternetButton b = InternetButton();

bool rainbow_mode = false;
uint8_t ledIndex = 0;   // 0 to numLeds * 3, single color byte index
uint8_t numLeds = 12;
int outputColor[ 36 ]; // 3*numLeds
boolean stringComplete = false;
bool xStart = false;
bool xEnd = true;

void setup() {

    b.setNumLeds(numLeds);
    b.begin();
    
    Serial.begin(921600);
}

void loop(){

    // If this calls for a full spectrum situation, let's go rainbow!
    if(b.allButtonsOn()) {
        b.rainbow(5);
        rainbow_mode = true;
        return;
    }

    // If we are not in rainbow mode anymore, turn the LEDs off
    if (rainbow_mode == true) {
        b.allLedsOff();
        rainbow_mode = false;
    }

    if (b.buttonOn(3)) {
        b.ledOn(6, 0, 0, 255); // Blue
        Particle.publish("button3",NULL, 60, PRIVATE);
        delay(500);
        b.ledOn(6, 0, 0, 0);
        //b.allLedsOff();
        Serial.println("Clear");    // triggers reset in NodeJS app
    }

    if(b.allButtonsOff()) {
        // Do something here when all buttons are off
    }
}

// Every 3 byte packets, update the next LED
void serialEvent()
{
    while (Serial.available()) {
        // get the new byte:
        byte inByte = Serial.read();

        Serial.println( (int) inByte);
        b.ledOn( (int) inByte, Serial.read(), Serial.read(), Serial.read() );
        
    }
}