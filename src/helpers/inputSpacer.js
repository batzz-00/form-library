const dateFormats = {
  m: { size: 2, max: 60, min: 0 },
  h: { size: 2, max: 12, min: 0 }
}

export default class inputSpacer {
  constructor (delimiter, delimiterSize = 1, blockSize = 2, maxLength, blockFormatting = []) {
    this.delimiter = delimiter
    this.delimiterSize = delimiterSize
    this.blockSize = blockSize
    this.maxLength = blockSize.constructor === Array && !maxLength ? blockSize.reduce((p, n) => p + n) : maxLength || 0
    this.actualValue = ''
    this.displayValue = ''
    this.lastKey = null
    this.selectionStart = null
    this.selectionEnd = null
    this.blockFormatting = blockFormatting
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
  blockFormatter (blockType, blockText, blockFullLength) {
    let format = dateFormats[blockType]
    let output = blockText.join('')
    let formatBlock = String(format.max).split('')
    switch (blockType) {
      case 'h' :
      case 'm':
        let input = parseInt(output)
        if (isNaN(input)) { return '' }
        if (input < format.min) {
          output = format.min
        }
        console.log(parseInt(formatBlock[1]))
        if (input > formatBlock[1] && blockText.length === 1) {
          output = `0${input}`
        } else if (input > format.max && blockText.length === 2) {
          output = format.max
        }
    } // think of best way to implemnt his
    return String(output).split('')
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

    let it = 0 // Current index of which the blockOutput is being pushed to (incremented by wto because a space array is added)
    let blockedOutput = []
    let split = val.split('')
    let count = 0 // Current index of block being processed from block array
    for (let i in val.split('')) {
      i = parseInt(i)
      blockSize = this.blockSize.constructor === Array ? this.blockSize[count] || this.blockSize[this.blockSize.length - 1] : blockSize
      let iterableSize = this.blockSize.constructor === Array ? this.blockSize.slice(0, count + 1).reduce((p, n) => p + n) : count * blockSize // Current total of blocks

      if ((iterableSize - i) % blockSize === 0 && i !== 0 && i > iterableSize - 1) {
        // last check makes sure that a number below the current iterable ( in the case of a block array of [3,1,5]), is not ticked by the modulo operator at the first text
        // has to wait for the total text length (i) to reach at least to the current total (iterableSize)
        blockedOutput.push(new Array(delimiterSize).fill(delimiter))
        count++
        it += 2
      }
      if (!blockedOutput[it]) { blockedOutput[it] = [] }
      blockedOutput[it].push(split[i])
      if (this.blockFormatting[count]) { blockedOutput[it] = this.blockFormatter(this.blockFormatting[count], blockedOutput[it]) }
    }
    val = blockedOutput.length === 0 ? '' : blockedOutput.reduce((p, n) => { return p.concat(n) }).join('')
    this.blocks = blockedOutput
    this.blocksWithoutDelimiters = blockedOutput.filter((b, i) => b[0] !== delimiter)
    this.actualValue = val.replace(reg, '')
    this.displayValue = val
  }
}
