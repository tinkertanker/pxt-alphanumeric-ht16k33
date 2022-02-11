// tests go here; this will not be compiled when this package is used as a library
HT16K33_Alnum4.init();
serial.writeString("Hello\r\n");
basic.forever(() => {
    HT16K33_Alnum4.showNumber(1234);
})