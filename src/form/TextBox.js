// Imports
import React from 'react'
import PropTypes from 'prop-types'

// Local Functions
import { withHandler } from './withHandler'

// Style
import './form.sass'

// React Components
import Errors from './Errors'

class TextBox extends React.Component {
  constructor (props) {
    super(props)
    this.state = { errors: null, value: '' }
    this.handleChange = this.handleChange.bind(this)
  }
  handleChange (e) {
    let val = e.target.value
    this.props.handleChange(this.props.name, val) // ERROR CATCH FOR SAME KEY
  }
  render () {
    const { title, name, placeholder, value, type, errors, loadRef } = this.props
    return (
      <div className='input-wrapper'>
        <div className={'input' + (errors ? ' error' : '')}>
          {title ? <h1>{title + (errors ? ' - Errors' : '')}</h1> : null}
          <input
            name={name || null}
            type={type || 'text'}
            placeholder={placeholder || null}
            defaultValue={value || null}
            onChange={this.handleChange}
            ref={loadRef}
            onBlur={this.props.checkErrors} />
        </div>
        {errors
          ? <Errors errors={errors} />
          : null }
      </div>
    )
  }
}

export default withHandler(TextBox)

TextBox.propTypes = {
  title: PropTypes.string,
  placeholder: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  type: PropTypes.string,
  loadRef: PropTypes.func,
  handleChange: PropTypes.func,
  errors: PropTypes.array,
  checkErrors: PropTypes.func
}
