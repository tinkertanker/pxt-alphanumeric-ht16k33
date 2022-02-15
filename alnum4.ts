//% color=#008080 weight=100 icon="\uf26c"
namespace HT16K33_Alnum4 {
    let HT16K33_ADDR = 0x70;
    let HT16K33_BLINK_CMD = 0x80; // I2C register for BLINK setting
    let HT16K33_BLINK_DISPLAYON = 0x01; // I2C value for steady on
    let HT16K33_BLINK_OFF = 0; // I2C value for steady off
    let HT16K33_BLINK_2HZ = 1; // I2C value for 2 Hz blink
    let HT16K33_BLINK_1HZ = 2; // I2C value for 1 Hz blink
    let HT16K33_BLINK_HALFHZ = 3; // I2C value for 0.5 Hz blink
    let HT16K33_CMD_BRIGHTNESS = 0xE0; // I2C register for BRIGHTNESS setting

    let displaybuffer: Array<NumberFormat.UInt16BE> = [0, 0, 0, 0, 0, 0, 0, 0];

    interface Map {
        [key: string]: number;
    }

    const charBits: Map = {
        " ": 0b0000000000000000,
        "!": 0b0000000000000110,
        "\"": 0b0000001000100000,
        "#": 0b0001001011001110,
        "$": 0b0001001011101101,
        "%": 0b0000110000100100,
        "&": 0b0010001101011101,
        "\'": 0b0000010000000000,
        "(": 0b0010010000000000,
        ")": 0b0000100100000000,
        "*": 0b0011111111000000,
        "+": 0b0001001011000000,
        ",": 0b0000100000000000,
        "-": 0b0000000011000000,
        ".": 0b0100000000000000,
        "/": 0b0000110000000000,
        "0": 0b0000110000111111,
        "1": 0b0000000000000110,
        "2": 0b0000000011011011,
        "3": 0b0000000010001111,
        "4": 0b0000000011100110,
        "5": 0b0010000001101001,
        "6": 0b0000000011111101,
        "7": 0b0000000000000111,
        "8": 0b0000000011111111,
        "9": 0b0000000011101111,
        ":": 0b0001001000000000,
        ";": 0b0000101000000000,
        "<": 0b0010010000000000,
        "=": 0b0000000011001000,
        ">": 0b0000100100000000,
        "?": 0b0001000010000011,
        "@": 0b0000001010111011,
        "A": 0b0000000011110111,
        "B": 0b0001001010001111,
        "C": 0b0000000000111001,
        "D": 0b0001001000001111,
        "E": 0b0000000011111001,
        "F": 0b0000000001110001,
        "G": 0b0000000010111101,
        "H": 0b0000000011110110,
        "I": 0b0001001000001001,
        "J": 0b0000000000011110,
        "K": 0b0010010001110000,
        "L": 0b0000000000111000,
        "M": 0b0000010100110110,
        "N": 0b0010000100110110,
        "O": 0b0000000000111111,
        "P": 0b0000000011110011,
        "Q": 0b0010000000111111,
        "R": 0b0010000011110011,
        "S": 0b0000000011101101,
        "T": 0b0001001000000001,
        "U": 0b0000000000111110,
        "V": 0b0000110000110000,
        "W": 0b0010100000110110,
        "X": 0b0010110100000000,
        "Y": 0b0001010100000000,
        "Z": 0b0000110000001001,
        "[": 0b0000000000111001,
        "\\": 0b0010000100000000,
        "]": 0b0000000000001111,
        "^": 0b0000110000000011,
        "_": 0b0000000000001000,
        "`": 0b0000000100000000,
        "a": 0b0001000001011000,
        "b": 0b0010000001111000,
        "c": 0b0000000011011000,
        "d": 0b0000100010001110,
        "e": 0b0000100001011000,
        "f": 0b0000000001110001,
        "g": 0b0000010010001110,
        "h": 0b0001000001110000,
        "i": 0b0001000000000000,
        "j": 0b0000000000001110,
        "k": 0b0011011000000000,
        "l": 0b0000000000110000,
        "m": 0b0001000011010100,
        "n": 0b0001000001010000,
        "o": 0b0000000011011100,
        "p": 0b0000000101110000,
        "q": 0b0000010010000110,
        "r": 0b0000000001010000,
        "s": 0b0010000010001000,
        "t": 0b0000000001111000,
        "u": 0b0000000000011100,
        "v": 0b0010000000000100,
        "w": 0b0010100000010100,
        "x": 0b0010100011000000,
        "y": 0b0010000000001100,
        "z": 0b0000100001001000,
        "{": 0b0000100101001001,
        "|": 0b0001001000000000,
        "}": 0b0010010010001001,
        "~": 0b0000010100100000,
    }

    function setBrightness(b: NumberFormat.UInt8BE) {
        if (b > 15) b = 15; // limit to max brightness
        let buffer = HT16K33_CMD_BRIGHTNESS | b;
        pins.i2cWriteNumber(HT16K33_ADDR, buffer, NumberFormat.UInt8BE)
    }

    function blinkRate(b: NumberFormat.UInt8BE) {
        if (b > 3) b = 0; // turn off if not sure
        let buffer = HT16K33_BLINK_CMD | HT16K33_BLINK_DISPLAYON | (b << 1);
        pins.i2cWriteNumber(HT16K33_ADDR, buffer, NumberFormat.UInt8BE);
    }

    function begin() {
        // turn on oscillator
        pins.i2cWriteNumber(HT16K33_ADDR, 0x21, NumberFormat.UInt8BE);

        // internal RAM powers up with garbage/random values.
        // ensure internal RAM is cleared before turning on display
        // this ensures that no garbage pixels show up on the display
        // when it is turned on.
        clear();
        writeDisplay();
        blinkRate(HT16K33_BLINK_OFF);
        setBrightness(15); // max brightness
    }

    function writeDisplay() {
        let buffer = pins.createBuffer(9);
        buffer[0] = 0x00; // start at address 00
        for (let i = 0; i < 4; i++) {
            let p = i ^ 2;  //new mapped position
            buffer[(p << 1) | 1] = displaybuffer[i] & 0xFF;
            buffer[(p << 1) + 2] = displaybuffer[i] >> 8;
        }
        pins.i2cWriteBuffer(HT16K33_ADDR, buffer);
    }

    function clear() {
        for (let i = 0; i < 8; i++) {
            displaybuffer[i] = 0;
        }
    }

    function writeDigitRaw(n: NumberFormat.UInt8BE, bitmask: NumberFormat.UInt16BE) {
        displaybuffer[n] = bitmask;
    }

    function writeAscii(n: number, a: string, dot = false) {
        let bitmask: NumberFormat.UInt16BE = charBits[a];
        if (bitmask = undefined) bitmask = 0b0000000000000000;
        if (!!(bitmask & (1 << 11)) != !!(bitmask & (1 << 13))) {
            bitmask ^= (1 << 11) ^ (1 << 13);
        }
        if (dot) bitmask |= (1 << 14); //dot is the 15th bit
        displaybuffer[n] = bitmask;
    }

    function scroll(s: string, interval = 250) {
        let L = s.length;
        if (interval < 0 || L <= 0) {
            clear();
            writeDisplay();
            return;
        }
        let seq: Array<NumberFormat.UInt16BE> = [];
        for (let i = 0; i < L; i++) {
            if (i && s.charAt(i) == '.') {
                if ((seq[seq.length - 1] & (1 << 14)) == 0) {
                    seq[seq.length - 1] |= (1 << 14);
                    continue;
                }
            }
            //let bitmask = alphafonttable[parseInt(s.charAt(i))];
            let bitmask = charBits[s[i]];
            if (!!(bitmask & (1 << 11)) != !!(bitmask & (1 << 13)))
                bitmask ^= (1 << 11) ^ (1 << 13);
            seq.push(bitmask);
        }
        L = seq.length;
        if (L <= 4) {
            clear();
            for (let i = 0; i < L; i++) {
                let p = 4 - L + i;
                writeDigitRaw(p, seq[i]);
            }
            writeDisplay();
        } else {
            for (let i = -3; i <= L; i++) {
                for (let p = 0; p < 4; p++) {
                    if (i + p < 0 || i + p >= L) writeDigitRaw(p, 0);
                    else writeDigitRaw(p, seq[i + p]);
                }
                writeDisplay();
                basic.pause(interval);
            }
        }
        seq = [];
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
        scroll(text, interval);
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
        if (interval < 0) {
            clear();
            writeDisplay();
            return;
        }
        if (value < 0) {
            let nValue = -value;
            let s = nValue.toString();
            if (s.length > 3) {
                scroll(s, interval);
                return;
            }
            /* assume its 3 digits */
            clear();
            writeAscii(0, '-');
            for (let i = 0; i < s.length; i++) {
                let p = 3 - s.length + i + 1;
                writeAscii(p, s.charAt(i));
            }
        }
        else {
            let s = value.toString();
            if (s.length > 4) {
                scroll(s, interval);
                return;
            }
            /* assume its 4 digits */
            clear();
            for (let i = 0; i < s.length; ++i) {
                let p = 4 - s.length + i;
                writeAscii(p, s.charAt(i));
            }
        }
        writeDisplay();
    }

    /**
     * initialises I2C for alnum display
     */
    //% blockId=alnum_init
    //% block="Initialize Alphanumeric Display"
    //% icon="\uf1ec"
    export function init(): void {
        begin();
    }
}