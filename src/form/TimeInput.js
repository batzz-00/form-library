// Imports
import React from 'react'
import PropTypes from 'prop-types'

// Local Functions
import { withHandler } from './withHandler'

// Style
import './form.sass'

// Helpers
import InputSpacer from '../helpers/inputSpacer'

// React Components
import Errors from './Errors'

class TimeInput extends React.Component {
  constructor (props) {
    super(props)
    this.state = { errors: null, displayValue: '' }
    this.actualValue = ''
    this.handleChange = this.handleChange.bind(this)
    this.onKeyDown = this.onKeyDown.bind(this)
    this.input = React.createRef()
  }
  componentDidMount () {
    this.inputSpacer = new InputSpacer({ delimiter: ':', delimiterSize: 1, blockSize: 2, maxLength: 4, blockFormatting: ['h', 'm'] })
  }
  handleChange (e) {
    e.persist()
    this.inputSpacer.spaceInput(e)
    this.setState({ displayValue: this.inputSpacer.displayValue }, () => { this.inputSpacer.setCursorPosition(e) })
  }
  onKeyDown (e) {
    this.inputSpacer.onKeyDownHandler(e)
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
            onKeyUp={this.onKeyUp}
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
