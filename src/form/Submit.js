// Imports
import React from 'react'
import PropTypes from 'prop-types'

import './form.sass'

export default class Submit extends React.Component {
  render () {
    const { title, value } = this.props
    return (
      <div className='input-wrapper'>
        <div className='input button'>
          {title ? <h1>{title}</h1> : null}
          <input
            type='submit'
            value={value || null} />
        </div>
      </div>
    )
  }
}

Submit.propTypes = {
  title: PropTypes.string,
  value: PropTypes.string
}
