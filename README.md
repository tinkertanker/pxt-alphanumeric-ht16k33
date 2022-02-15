for PXT/microbit

# HT16K33 Alphanumeric Display PXT Package

This is the PXT Package for HT16K33 Alphanumeric Display from ElecFreaks

## Hardware Setup
1. Connect SCL, SDA to the Tinkercademy breakout board's I2C pins.
2. Connect VCC, GND to the break out board as well.

## PXT Blocks
1. Initialize Alphanumeric Display: This block will initialise the display to receive display inputs. It defaults to using micro:bit's I2C pins (I2C_SDA0 and I2C_SCL0).
2. Show String: This block will receive a string and display it on the Alphanumeric Display. If string has 4 or less characters, it will just display it without scrolling. If not, it will scroll with an interval of 250ms between shifts. (Interval can be changed in JavaScript)

3. Show Number: This block will receive an integer and display it on the Alphanumeric Display. If the number has 4 or less characters (inclusive of negative sign), it will be displayed without scrolling, aligned to the right. If not, it will be converted to a string and scrolled as per 'Show String'.

4. Set Blink Rate (Advanced): This block will receive either an "off" state or a frequency (2 Hz, 1 Hz, 0.5Hz) that will determine the blink rate of the alphanumeric display.

5. Set Brightness (Advanced): This block will receive an integer of value 0 to 15 (anything less than 0 will be mapped to 0, and anything more than 15 will be mapped to 15) that will determine the brightness of the alphanumeric display.

## Footnotes
1. Quirks with numbering of LEDs on ElecFreaks's alphanumeric display.
LED 11 and LED 13 are swapped as compared to Adafruit's alphanumeric display.
The 'font' was designed for Adafruit's display and has been swapped inside this package via software.

2. Numbering of digits
In this program, the digits are numbered from left to right, 0-indexed. Eg: 0-1-2-3
However, they are numbered as 2-3-0-1 in specifications.
They are renumbered in this package using xor: hardware_pos = software_pos^2 or software_pos = hardware_pos^2.

3. Datasheet
Implemented according to datasheet: http://www.robotshop.com/media/files/pdf/EF4058-ht16K33v110-datasheet.pdf
