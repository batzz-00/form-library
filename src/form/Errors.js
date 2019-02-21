// Imports
import React from 'react'
import PropTypes from 'prop-types'

import './form.sass'

export default class Errors extends React.Component {
  render () {
    return (
      <div className='errors'>
        {this.props.errors.map((error, i) => {
          return (<div className='error' key={i}>{error.text}</div>)
        })}
      </div>
    )
  }
}

Errors.propTypes = {
  errors: PropTypes.array
}
