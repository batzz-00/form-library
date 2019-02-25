// Imports
import React from 'react'
import PropTypes from 'prop-types'

// Local Functions
import { withHandler } from './withHandler'

// Style
import './form.sass'

// React Components
import Errors from './Errors'

class TimeInput extends React.Component {
  constructor (props) {
    super(props)
    this.state = { errors: null, displayValue: '' }
    this.actualValue = ''
    this.handleChange = this.handleChange.bind(this)
    this.onKeyDown = this.onKeyDown.bind(this)
  }
  handleChange (e) {
    let blockDelimiter = "\|"

    if (blockDelimiter.charCodeAt(0) === this.lastKey.charCodeAt(0)) {
      return false
    }

    const { displayValue } = this.state
    const { actualValue } = this
    // options

    let it = 0
    let blocks = 2
    let delimiterSize = 5
    let maxLength = 11

    let reg = new RegExp(blockDelimiter.replace(blockDelimiter, '\\$&'), 'g')
    console.log(e.target.value.replace(reg, ''))
    console.log(reg)
    let val = e.target.value.replace(reg, '').split('').slice(0, maxLength).join('')

    let diff = Math.abs(this.selectionStart - this.selectionEnd)

    if (this.lastKey === 'Backspace') {
      val = diff !== 0 ? displayValue.split('').slice(0, displayValue.length - diff).join('').replace(reg, '')
        : actualValue.split('').splice(0, actualValue.length - 1).join('')
    }

    let blockedOutput = []
    let split = val.split('')
    let count = 0
    for (let i in val.split('')) {
      if (val.split('').length % 2 === 0 && parseInt(i) === val.split('').length - 1) {
        break
      }
      if (it % blocks === 1) {
        blockedOutput.push(new Array(delimiterSize).fill(blockDelimiter))
      } else {
        blockedOutput[it] = []
        for (let b = 0; b <= blocks - 1; b++) {
          blockedOutput[it].push(split.splice(0, 1)[0])
        }
        it++
      }
      count++
      if (blocks === count) {
        it++
        count = 0
      }
    }
    console.log(blockedOutput)

    val = blockedOutput.length === 0 ? '' : blockedOutput.reduce((p, n) => { return p.concat(n) }).join('')
    this.actualValue = val.replace(reg, '')
    this.setState({ displayValue: val })
    // if(newActualValue.length >= maxLength){
    //   if(this.lastKey === "Backspace") {
    //     this.actualValue = newActualValue
    //     this.setState({ displayValue: val})
    //   }
    // } else {
    //   this.actualValue = newActualValue
    //   this.setState({ displayValue: val})
    // }
  }
  onKeyDown (e) {
    this.lastKey = e.key
    this.selectionStart = e.target.selectionStart
    this.selectionEnd = e.target.selectionEnd
    this.selectionDirection = e.target.selectionDirection
  }
  render () {
    const { title, name, placeholder, type, errors } = this.props
    const { displayValue } = this.state
    return (
      <div className='input-wrapper'>
        <div className={'input' + (errors ? ' error' : '')}>
          {title ? <h1>{title + (errors ? ' - Errors' : '')}</h1> : null}
          <input
            name={name || null}
            type={type || 'text'}
            placeholder={placeholder || null}
            onChange={this.handleChange}
            onKeyDown={this.onKeyDown}
            value={displayValue}
            onBlur={this.props.checkErrors} />
        </div>
        {errors
          ? <Errors errors={errors} />
          : null }
      </div>
    )
  }
}

export default withHandler(TimeInput)

TimeInput.propTypes = {
  title: PropTypes.string,
  placeholder: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  errors: PropTypes.array,
  checkErrors: PropTypes.func
}
