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
    let blockDelimiter = ' '

    if (blockDelimiter.charCodeAt(0) === this.lastKey.charCodeAt(0)) {
      return false
    }

    // options
    let reg = new RegExp(blockDelimiter, 'g')
    let val = e.target.value.replace(reg, '')
    let it = 0
    let blocks = 2
    // let maxLength = 10 //implement // put all this in a helper
    // let limit // set limit

    if (this.lastKey === 'Backspace') {
      val = this.actualValue.split('').splice(0, this.actualValue.length - 1).join('')
    }

    let blockedOutput = []
    let split = val.split('')
    let count = 0
    val.split('').forEach(() => {
      if (it % blocks === 1) {
        blockedOutput.push(new Array(blocks).fill(blockDelimiter).map(e => e))
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
    })

    val = blockedOutput.length === 0 ? '' : blockedOutput.reduce((p, n) => { return p.concat(n) }).join('')

    this.actualValue = val.replace(reg, '')
    this.setState({ displayValue: val })
  }
  onKeyDown (e) {
    this.lastKey = e.key
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
