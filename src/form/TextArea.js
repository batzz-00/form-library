// Imports
import React from 'react'
import PropTypes from 'prop-types'

import './form.sass'

export default class TextArea extends React.Component {
  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.props.updateInput(props.value || '')
  }
  handleChange (e, custom = false) {
    if (!this.props.name) {
      console.warn("If you want to return the data from a form, you must provide a name (i.e name='x' in the JSX element) for the script to use as a key")
      return false
    }
    let val = e.target.value
    this.setState({
      value: val
    }, () => {
      this.props.updateInput(this.props.name, val) // ERROR CATCH FOR SAME KEY
    })
  }
  render () {
    const { title, value, name, placeholder } = this.props
    return (
      <div className='input'>
        {title ? <h1>{title}</h1> : null}
        <textarea
          name={name || null}
          onChange={(e) => this.handleChange(e)}
          defaultValue={value || ''}
          placeholder={placeholder || null}
        />
      </div>
    )
  }
}

TextArea.propTypes = {
  title: PropTypes.string,
  placeholder: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  updateInput: PropTypes.func
}
