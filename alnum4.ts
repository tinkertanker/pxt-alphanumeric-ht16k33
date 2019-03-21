//% color=#008080 weight=100 icon="\uf26c"
declare namespace HT16K33_Alnum4 {

    /**
     * Prints a text on the alnum display, will scroll with interval if more than 4 letters 
     */
    //% weight=87 blockGap=8
    //% block="show|string %text" 
    //% async
    //% blockId=alnum_print_message
    //% icon="\uf1ec" interval.defl=250 shim=HT16K33_Alnum4::showString
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
    //% async rightAlign.defl=1 interval.defl=250 shim=HT16K33_Alnum4::showNumber
    export function showNumber(value: number, rightAlign?: boolean, interval?: number): void {
        console.log("alphanumeric display:" + value);
        return;
    }

    /**
     * initialises I2C for alnum display
     */
    //% blockId=alnum_init
    //% block="Initialize Alphanumeric Display"
    //% icon="\uf1ec" shim=HT16K33_Alnum4::init
    export function init(): void {
        return;
    }
}
