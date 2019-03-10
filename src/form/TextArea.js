// Imports
import React from 'react'
import PropTypes from 'prop-types'

import './form.sass'
import { withHandler } from './withHandler'

// React Components
import Errors from './Errors'

class TextArea extends React.Component {
  constructor (props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)
  }
  handleChange (e) {
    let val = e.target.value
    this.props.handleChange(this.props.name, val) // ERROR CATCH FOR SAME KEY
  }
  render () {
    const { title, value, name, placeholder, errors, loadRef } = this.props
    return (
      <div className='input-wrapper'>
        <div className={'input' + (errors ? ' error' : '')}>
          {title ? <h1>{title}</h1> : null}
          <textarea
            name={name || null}
            onChange={(e) => this.handleChange(e)}
            defaultValue={value || ''}
            placeholder={placeholder || null}
            ref={loadRef}
          />
        </div>
        {errors
          ? <Errors errors={errors} />
          : null }
      </div>
    )
  }
}

export default withHandler(TextArea)

TextArea.propTypes = {
  title: PropTypes.string,
  placeholder: PropTypes.string,
  name: PropTypes.string,
  loadRef: PropTypes.func,
  value: PropTypes.string,
  handleChange: PropTypes.func,
  errors: PropTypes.array
}
