
// const dateFormats = {
//   m: { size: 2, max: 60, min: 0 }, // minute
//   H: { size: 2, max: 24, min: 0 }, // 24 hour
//   h: { size: 2, max: 12, min: 0 }, // 12 hour
//   s: { size: 2, max: 60, min: 0 },
//   ampm: { options: ['AM', 'PM'] }
// }

const cursorMoves = {
  backspace: { buffer: -1, dir: -1 },
  delete: { buffer: 0, dir: 1 },
  default: { buffer: 1, dir: 1 }
}

export default class inputSpacer {
  constructor (options = {}) {
    this.setOptions(options)
    this.spaceInput = this.spaceInput.bind(this)
    this.val = ''
  }
  setOptions (options) {
    this.options = {
      delimiter: ' ',
      delimiterSize: 1,
      blockSize: 2,
      maxLength: options.blockSize ? options.blockSize.constructor === Array && !options.maxLength ? options.blockSize.reduce((p, n) => p + n) : 0 : options.maxLength || 0,
      blockFormatting: [],
      suffix: null,
      prefix: null,
      ...options
    }
  }
  spaceInput (e) {
    const { delimiter } = this.options
    console.clear()
    this.element = e.target
    if (delimiter.charCodeAt(0) === this.lastKey.charCodeAt(0)) { return false }
    if (this.checkDeletingDelimiter() === true) {
      this.setString(this.fixString())
    } else {
      this.setString(e.target.value)
    }

    this
      .removeDelimiter()
      .setMaxLength()
      .splitIntoBlocks()
      .setAffixes()
      .turnIntoString()

    this.actualValue = this.val
    this.displayValue = this.val
  }
  fixString () {
    const { startSelect } = this
    let { lastKey } = this
    const { delimiter, delimiterSize } = this.options
    lastKey = lastKey.toLowerCase()
    let directionInformation = cursorMoves[lastKey] ? cursorMoves[lastKey] : cursorMoves.default
    let removeStart = startSelect + directionInformation.dir
    let val = this.val.split('')
    while(val[removeStart] === delimiter ){ 
      removeStart += directionInformation.dir
    }
    val.splice(removeStart, 1)
    return val.join('')
  }
  onKeyDownHandler (e) {
    this.lastKey = e.key
    this.startSelect = e.target.selectionStart
    this.endSelect = e.target.selectionEnd
  }
  setString (input) {
    this.oldVal = this.val
    this.val = input
    return this
  }
  removeDelimiter () {
    const { delimiter } = this.options
    let reg = new RegExp(delimiter.replace(delimiter, '\\$&'), 'g')
    this.val = this.val.replace(reg, '')
    return this
  }
  setMaxLength () {
    const { maxLength } = this.options
    if (maxLength !== 0) {
      this.val = this.val.substring(0, maxLength)
    }
    return this
  }
  splitIntoBlocks () {
    let { blockSize } = this.options
    const { delimiterSize, delimiter, blockFormatting, maxLength } = this.options
    const immutableBSisze = blockSize
    let it = 0 // Current index of which the blockOutput is being pushed to (incremented by wto because a space array is added)
    let blockedOutput = []
    let count = 0 // Current index of block being processed from block array
    // console.log(this.val.length)
    for (let i = 0; i <= this.val.length; i++) {
      blockSize = immutableBSisze.constructor === Array ? immutableBSisze[count] || immutableBSisze[immutableBSisze.length - 1] : blockSize
      let iterableSize = immutableBSisze.constructor === Array ? immutableBSisze.slice(0, count + 1).reduce((p, n) => p + n) : count * blockSize // Current total of blocks
      let finalLength = immutableBSisze.constructor === Array ? immutableBSisze.reduce((p, n) => p + n) : maxLength
      if ((iterableSize - i) % blockSize === 0 && i !== 0 && i > iterableSize - 1 && i !== finalLength) {
        // last check makes sure that a number below the current iterable ( in the case of a block array of [3,1,5]), is not ticked by the modulo operator at the first text
        // has to wait for the total text length (i) to reach at least to the current total (iterableSize)
        blockedOutput.push({ text: new Array(delimiterSize).fill(delimiter), type: 'delimiter' })
        count++
        it += 2
      }

      if (!blockedOutput[it]) { blockedOutput[it] = { text: [], type: 'text' } }

      blockedOutput[it].text.push(this.val.substring(i, i + 1))
      blockedOutput[it].text = this.blockFormatter(blockFormatting.constructor === Array ? blockFormatting[count] : blockFormatting, blockedOutput[it].text)
    }
    this.blocks = blockedOutput
    this.val = blockedOutput
    return this
  }
  blockFormatter (blockType, blockText) {
    switch (blockType) {
      case 'num':
        return blockText.filter(b => !isNaN(b))
    }
  }
  setAffixes () {
    const { suffix, prefix, maxLength } = this.options
    if (suffix) {
      if (maxLength === 0) {
        console.warn('You must have non-zero maxLength property to add a suffix')
      } else {
        // hmm
      }
    }
    if (prefix) {
      this.val = [{ text: prefix.split(''), type: 'prefix' }].concat(this.val)
    }
    return this
  }
  turnIntoString () {
    if (this.val.length !== 0) {
      this.val = this.val.reduce((p, n, i) => { return { text: p.text.concat(n.text) } }).text.join('')
    }
    return this
  }
  setCursorPosition () {
    const { lastKey, startSelect } = this
    const { delimiter, delimiterSize } = this.options
    const { element } = this
    let cursorBuffer = (cursorMoves[lastKey.toLowerCase()] || cursorMoves['default'])
    let extraBuffer = 0
    if (this.val[startSelect + cursorBuffer.buffer] === delimiter) {
      let curIdx = startSelect + cursorBuffer.buffer
      while (true) {
        if (this.val[curIdx] !== delimiter || extraBuffer === delimiterSize) {
          break
        } else {
          curIdx += cursorBuffer.dir
          extraBuffer += cursorBuffer.dir
        }
      }
    }
    element.setSelectionRange(startSelect + cursorBuffer.buffer + extraBuffer, startSelect + cursorBuffer.buffer + extraBuffer)
  }
  getRawString () {
    return this.rawString
  }
  checkDeletingDelimiter () {
    const { delimiter } = this.options
    const { element } = this
    if (!(this.lastKey === 'Backspace' || this.lastKey === 'Delete')) { return false }
    if (this.val[element.selectionStart] === delimiter) {
      return true
    }
  }
  getString (idx) {
    return this.val.split('').filter(i => i !== idx).join('')
  }
}
