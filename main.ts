/**
* BMX160 block
*/
//% weight=100 color=#70c0f0 icon="\uf042" block="BMX160"
namespace bmx160 {

    const BMX160_ADDR = 0x68;

    function setreg(reg: number, dat: number): void {
        let tb = pins.createBuffer(2)
        tb[0] = reg
        tb[1] = dat
        pins.i2cWriteBuffer(BMX160_ADDR, tb)
    }


    function getInt8LE(reg: number): number {
        pins.i2cWriteNumber(BMX160_ADDR, reg, NumberFormat.UInt8BE);
        return pins.i2cReadNumber(BMX160_ADDR, NumberFormat.Int8LE);
    }

    function getUInt8LE(reg: number): number {
        pins.i2cWriteNumber(BMX160_ADDR, reg, NumberFormat.UInt8BE);
        return pins.i2cReadNumber(BMX160_ADDR, NumberFormat.Int8LE);
    }

    function getInt16LE(reg: number): number {
        pins.i2cWriteNumber(BMX160_ADDR, reg | 0x80, NumberFormat.UInt8BE);
        return pins.i2cReadNumber(BMX160_ADDR, NumberFormat.Int16LE);
    }

    function getUInt16LE(reg: number): number {
        pins.i2cWriteNumber(BMX160_ADDR, reg | 0x80, NumberFormat.UInt8BE);
        return pins.i2cReadNumber(BMX160_ADDR, NumberFormat.UInt16LE);
    }

    //% blockId="BMX160_INITIAL_LIGHT_STEP" block="Initial light weight step counter"
    //% weight=100 blockGap=8
    //% parts="BMX160"
    export function initialLightStep() {
        /*setreg(0x7E, 0xB6)
        control.waitMicros(15);
        
        setreg(0x7E, 0x11)
        control.waitMicros(50);
        setreg(0x7E, 0x15)
        control.waitMicros(100);
        setreg(0x7E, 0x19)
        control.waitMicros(10);
        */
        setreg(0x7E, 0x11)
        control.waitMicros(100);
        setreg(0x7A, 0x2D);
        setreg(0x7B, 8);
        setreg(0x7E, 0xB2);

        serial.writeLine("" + getUInt8LE(0x7A))
        serial.writeLine("" + getUInt8LE(0x7B))

    }

    //% blockId="BMX160_INITIAL_STEP" block="Initial step counter"
    //% weight=100 blockGap=8
    //% parts="BMX160"
    export function initialStep() {
        /*setreg(0x7E, 0xB6)
        control.waitMicros(15);
        
        setreg(0x7E, 0x11)
        control.waitMicros(50);
        setreg(0x7E, 0x15)
        control.waitMicros(100);
        setreg(0x7E, 0x19)
        control.waitMicros(10);
        */
        setreg(0x7E, 0x11)
        control.waitMicros(100);
        setreg(0x7A, 0x15);
        setreg(0x7B, 11);
        setreg(0x7E, 0xB2);

        serial.writeLine("" + getUInt8LE(0x7A))
        serial.writeLine("" + getUInt8LE(0x7B))

    }

    //% blockId="BMX160_RESET_STEP" block="Reset step counter"
    //% weight=100 blockGap=8
    //% parts="BMX160"
    export function resetStep() {
        setreg(0x7E, 0xB2);
    }

    //% blockId="BMX160_GET_STEP" block="Get step counter"
    //% weight=100 blockGap=8
    //% parts="BMX160"
    export function getStep(): number {
        let wbuf = pins.createBuffer(1);
        let step = 0;

        wbuf.setNumber(NumberFormat.UInt8LE, 0, 0x78);
        pins.i2cWriteBuffer(BMX160_ADDR, wbuf);

        let buf = pins.i2cReadBuffer(BMX160_ADDR, 2);
        if (buf.length == 2) {
            let lowByte = buf.getNumber(NumberFormat.UInt8LE, 0);
            let highByte = buf.getNumber(NumberFormat.UInt8LE, 1);

            step = (highByte << 8) + lowByte;

            return step;
        }

        return -1;
    }
}