export default class inputSpacer {
  constructor (delimiter, delimiterSize = 2, blockSize = 2, maxLength = 0) {
    this.delimiter = delimiter
    this.delimiterSize = delimiterSize
    this.blockSize = blockSize
    this.maxLength = maxLength
    this.actualValue = ''
    this.displayValue = ''
    this.lastKey = null
    this.selectionStart = null
    this.selectionEnd = null
  }
  setLastKey (key) {
    this.lastKey = key
  }
  setSelectionStart (start) {
    this.selectionStart = start
  }
  setSelectionEnd (end) {
    this.selectionEnd = end
  }
  spaceInput (input) {
    const { delimiter } = this

    if (delimiter.charCodeAt(0) === this.lastKey.charCodeAt(0)) {
      return false
    }

    const { actualValue, displayValue, blockSize, delimiterSize, maxLength } = this

    let reg = new RegExp(delimiter.replace(delimiter, '\\$&'), 'g')
    let val = maxLength !== 0 ? input.replace(reg, '').split('').slice(0, maxLength).join('') : input.replace(reg, '')

    let diff = Math.abs(this.selectionStart - this.selectionEnd)

    if (this.lastKey === 'Backspace') {
      val = diff !== 0 ? displayValue.split('').slice(0, displayValue.length - diff).join('').replace(reg, '')
        : actualValue.split('').splice(0, actualValue.length - 1).join('')
    }

    let it = 0
    let blockedOutput = []
    let split = val.split('')
    let count = 0
    for (let i in val.split('')) {
      i = parseInt(i)
      if (blockSize === count) {
        it++
        count = 0
      }
      if (i % blockSize === 0 && i !== 0) {
        blockedOutput.push(new Array(delimiterSize).fill(delimiter))
        it++
      }
      if (!blockedOutput[it]) { blockedOutput[it] = [] }
      blockedOutput[it].push(split[i])
      count++
    }
    val = blockedOutput.length === 0 ? '' : blockedOutput.reduce((p, n) => { return p.concat(n) }).join('')
    this.actualValue = val.replace(reg, '')
    this.displayValue = val
  }
}
