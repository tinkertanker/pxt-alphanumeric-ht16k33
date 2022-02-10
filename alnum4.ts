//% color=#008080 weight=100 icon="\uf26c"
namespace HT16K33_Alnum4 {
    let HT16K33_ADDRESS = 0xE0;
    let HT16K33_ON = 0x21;  // Commands
    let HT16K33_STANDBY = 0x20;
    let HT16K33_DISPLAYON = 0x81;
    let HT16K33_DISPLAYOFF = 0x80;
    let HT16K33_BRIGHTNESS = 0xE0;  // 0xE0|F from 0..15: Set brightness from 1/16 (0x00) to 16/16 (0x0F)

    const alphafonttable = [
        0b0000000000000001,
        0b0000000000000010,
        0b0000000000000100,
        0b0000000000001000,
        0b0000000000010000,
        0b0000000000100000,
        0b0000000001000000,
        0b0000000010000000,
        0b0000000100000000,
        0b0000001000000000,
        0b0000010000000000,
        0b0000100000000000,
        0b0001000000000000,
        0b0010000000000000,
        0b0100000000000000,
        0b1000000000000000,
        0b0000000000000000,
        0b0000000000000000,
        0b0000000000000000,
        0b0000000000000000,
        0b0000000000000000,
        0b0000000000000000,
        0b0000000000000000,
        0b0000000000000000,
        0b0001001011001001,
        0b0001010111000000,
        0b0001001011111001,
        0b0000000011100011,
        0b0000010100110000,
        0b0001001011001000,
        0b0011101000000000,
        0b0001011100000000,
        0b0000000000000000, //  
        0b0000000000000110, // !
        0b0000001000100000, // "
        0b0001001011001110, // #
        0b0001001011101101, // $
        0b0000110000100100, // %
        0b0010001101011101, // &
        0b0000010000000000, // '
        0b0010010000000000, // (
        0b0000100100000000, // )
        0b0011111111000000, // *
        0b0001001011000000, // +
        0b0000100000000000, // ,
        0b0000000011000000, // -
        0b0100000000000000, // .
        0b0000110000000000, // /
        0b0000000000111111, // 0
        0b0000000000000110, // 1
        0b0000000011011011, // 2
        0b0000000011001111, // 3
        0b0000000011100110, // 4
        0b0000000001101101, // 5
        0b0000000011111101, // 6
        0b0000000000000111, // 7
        0b0000000011111111, // 8
        0b0000000011101111, // 9
        0b0001001000000000, // :
        0b0000101000000000, // ;
        0b0010010000000000, // <
        0b0000000011001000, // =
        0b0000100100000000, // >
        0b0001000010000011, // ?
        0b0000001010111011, // @
        0b0000000011110111, // A
        0b0001001010001111, // B
        0b0000000000111001, // C
        0b0001001000001111, // D
        0b0000000011111001, // E
        0b0000000001110001, // F
        0b0000000010111101, // G
        0b0000000011110110, // H
        0b0001001000000000, // I
        0b0000000000011110, // J
        0b0010010001110000, // K
        0b0000000000111000, // L
        0b0000010100110110, // M
        0b0010000100110110, // N
        0b0000000000111111, // O
        0b0000000011110011, // P
        0b0010000000111111, // Q
        0b0010000011110011, // R
        0b0000000011101101, // S
        0b0001001000000001, // T
        0b0000000000111110, // U
        0b0000110000110000, // V
        0b0010100000110110, // W
        0b0010110100000000, // X
        0b0001010100000000, // Y
        0b0000110000001001, // Z
        0b0000000000111001, // [
        0b0010000100000000, // 
        0b0000000000001111, // ]
        0b0000110000000011, // ^
        0b0000000000001000, // _
        0b0000000100000000, // `
        0b0001000001011000, // a
        0b0010000001111000, // b
        0b0000000011011000, // c
        0b0000100010001110, // d
        0b0000100001011000, // e
        0b0000000001110001, // f
        0b0000010010001110, // g
        0b0001000001110000, // h
        0b0001000000000000, // i
        0b0000000000001110, // j
        0b0011011000000000, // k
        0b0000000000110000, // l
        0b0001000011010100, // m
        0b0001000001010000, // n
        0b0000000011011100, // o
        0b0000000101110000, // p
        0b0000010010000110, // q
        0b0000000001010000, // r
        0b0010000010001000, // s
        0b0000000001111000, // t
        0b0000000000011100, // u
        0b0010000000000100, // v
        0b0010100000010100, // w
        0b0010100011000000, // x
        0b0010000000001100, // y
        0b0000100001001000, // z
        0b0000100101001001, // {
        0b0001001000000000, // |
        0b0010010010001001, // }
        0b0000010100100000, // ~
        0b0011111111111111,
    ];

    let displaybuffer = [null, null, null, null, null, null, null, null];

    function command(c: number) {
        let cmd = c;
        pins.i2cWriteNumber(HT16K33_ADDRESS, cmd, NumberFormat.UInt16BE);
    }

    function setBrightness(b: number) {
        /* Brightness can vary from 0 to 15 */
        if (b > 15) b = 15;
        command(HT16K33_BRIGHTNESS | b);
    }

    function blinkRate(b: number) {
        if (b > 3) b = 0; // turn off if not sure
        /*  0: Blinking off
          1: Blink at 2Hz
          2: Blink at 1Hz
          3: Blink at 0.5Hz
        */
        command(HT16K33_DISPLAYON | (b << 1));
    }

    function begin() {
        command(HT16K33_ON);
        command(HT16K33_DISPLAYON);
        setBrightness(15);
    }

    function writeDisplay() {
        let buff = [null, null, null, null, null, null, null, null, null];
        buff[0] = 0x00;

        /* Changes the mapping of characters
        0 -> 2
        1 -> 3
        2 -> 0
        3 -> 1
        */
        for (var i = 0, p; i < 4; i++) {
            p = i ^ 2;  //new mapped position
            buff[(p << 1) | 1] = displaybuffer[i] & 0xFF;
            buff[(p << 1) + 2] = displaybuffer[i] >> 8;
        }
        pins.i2cWriteNumber(HT16K33_ADDRESS, buff, NumberFormat.UInt16BE);
    }

    function clearBuffer() {
		for (var i=0; i<4; i++) displaybuffer[i] = 0;
	}

    function writeRaw(position:number, bitmask:number) {
		displaybuffer[position] = bitmask;
	}

    /**
     * Prints a text on the alnum display, will scroll with interval if more than 4 letters 
     */
    //% weight=87 blockGap=8
    //% block="show|string %text" 
    //% async
    //% blockId=alnum_print_message
    //% icon="\uf1ec" interval.defl=250
    export function showString(text: string, interval?: number): void {
        console.log("alphanumeric display:" + text);
        return;
    }

    /**
     * Scroll a number on the screen. If the number fits on the screen (i.e. less than 4 digit), do not scroll.
     * Defaults to flush right
     */
    //% weight=96
    //% blockId=alnum_print_number 
    //% block="show|number %number" blockGap=8
    //% async rightAlign.defl=1 interval.defl=250
    export function showNumber(value: number, rightAlign?: boolean, interval?: number): void {
        console.log("alphanumeric display:" + value);
        return;
    }

    /**
     * initialises I2C for alnum display
     */
    //% blockId=alnum_init
    //% block="Initialize Alphanumeric Display"
    //% icon="\uf1ec"
    export function init(): void {
        return;
    }
}
