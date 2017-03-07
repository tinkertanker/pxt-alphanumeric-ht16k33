// Auto-generated. Do not edit.
declare namespace HT16K33_Alnum4 {

    /**
     * Prints a text on the alnum display, will scroll with interval if more than 4 letters 
     */
    //% help=basic/show-string 
    //% weight=87 blockGap=8
    //% block="show|string %text" 
    //% async
    //% blockId=alnum_print_message
    //% icon="\uf1ec" interval.defl=250 shim=HT16K33_Alnum4::showString
    function showString(text: string, interval?: number): void;

    /**
     * Scroll a number on the screen. If the number fits on the screen (i.e. less than 4 digit), do not scroll.
     * Defaults to flush right
     */
    //% help=basic/show-number
    //% weight=96
    //% blockId=alnum_print_number 
    //% block="show|number %number" blockGap=8
    //% async rightAlign.defl=1 interval.defl=250 shim=HT16K33_Alnum4::showNumber
    function showNumber(value: number, rightAlign?: boolean, interval?: number): void;

    /**
     * initialises I2C for alnum display
     */
    //% blockId=alnum_init
    //% block="Initialize Alphanumeric Display"
    //% icon="\uf1ec" shim=HT16K33_Alnum4::init
    function init(): void;
}

// Auto-generated. Do not edit. Really.
