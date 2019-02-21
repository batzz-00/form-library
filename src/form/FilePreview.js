// Imports
import React from 'react'
import PropTypes from 'prop-types'

import './form.sass'

export default class FilePreview extends React.Component {
  render () {
      const {name, src} = this.props
    return (
        <div className="file-wrapper">
            <div className='file-details'>{name}</div>
            {src ? <div className="image" style={{backgroundImage: `url('${src}')`}} /> : null}
        </div>
    )
  }
}

FilePreview.propTypes = {
  errors: PropTypes.array
}
