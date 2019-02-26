export default class inputSpacer {
  constructor (delimiter, delimiterSize = 1, blockSize = 2, maxLength) { 
    this.delimiter = delimiter
    this.delimiterSize = delimiterSize
    this.blockSize = blockSize
    this.maxLength = blockSize.constructor === Array && !maxLength ? blockSize.reduce((p,n) => p+n) : maxLength || 0
    console.log(this.maxLength)
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

    const { actualValue, displayValue, delimiterSize, maxLength } = this
    let { blockSize } = this

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
      blockSize = this.blockSize.constructor === Array ? this.blockSize[it] || this.blockSize[this.blockSize.length-1] : blockSize
      let iterableSize = this.blockSize.constructor === Array ? this.blockSize.slice(0, it+1).reduce((p,n)=>p+n) : it * blockSize //Current total of blocks
      console.log(`${iterableSize} - ${i} - `)
      if (blockSize === count) {
        it++
        count = 0
      }
      if ((iterableSize - i) % blockSize === 0 && i !== 0 && i > iterableSize-1) { 
        // last check makes sure that a number below the current iterable ( in the case of a block array of [3,1,5]), is not ticked by the modulo operator at the first text
        // has to wait for the total text length (i) to reach at least to the current total (iterableSize)
        blockedOutput.push(new Array(delimiterSize).fill(delimiter))
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
