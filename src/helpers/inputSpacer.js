export default class inputSpacer {
    constructor(delimiter, delimiterSize=2, blockSize=2, maxLength=0){
        this.delimiter = delimiter
        this.delimiterSize = delimiterSize
        this.blockSize = blockSize
        this.maxLength = maxLength
        this.actualValue = ''
        this.displayValue = ''
        this.lastKey = null
        this.lastKey, this.selectionStart, this.selectionEnd = null
    }
    setLastKey(key) {
        this.lastKey = key
    }
    setSelectionStart(start) {
        this.selectionStart = start
    }
    setSelectionEnd(end) {
        this.selectionEnd = end
    }
    spaceInput(input){
        const { delimiter } = this

        if (delimiter.charCodeAt(0) === this.lastKey.charCodeAt(0)) {
            return false
        }

        const { actualValue, displayValue, blockSize, delimiterSize, maxLength} = this

        let reg = new RegExp(delimiter.replace(delimiter, '\\$&'), 'g')
        let val = maxLength !== 0 ? input.replace(reg, '').split('').slice(0, maxLength).join('') : input.replace(reg, '')

        let diff = Math.abs(this.selectionStart - this.selectionEnd)

        if (this.lastKey === 'Backspace') {
        val = diff !== 0 ? displayValue.split('').slice(0, displayValue.length - diff).join('').replace(reg, '')
            : actualValue.split('').splice(0, actualValue.length - 1).join('')
        }
        console.log(blockSize)

        let it = 0
        let blockedOutput = []
        let split = val.split('')
        let count = 0
        for (let i in val.split('')) {
            console.log(count)
            if (val.split('').length % 2 === 0 && parseInt(i) === val.split('').length - 1) {
                break
            }
            if (it % blockSize === 1) {
                blockedOutput.push(new Array(delimiterSize).fill(delimiter))
            } else {
                blockedOutput[it] = []
                for (let b = 0; b <= blockSize - 1; b++) {
                blockedOutput[it].push(split.splice(0, 1)[0])
                }
                it++
            }
            count++
            if (blockSize === count) {
                it++
                count = 0
            }
        }
        val = blockedOutput.length === 0 ? '' : blockedOutput.reduce((p, n) => { return p.concat(n) }).join('')
        this.actualValue = val.replace(reg, '')
        this.displayValue = val
    }
}