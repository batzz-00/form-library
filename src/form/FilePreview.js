// Imports
import React from 'react'
import PropTypes from 'prop-types'

import './form.sass'

export default class FilePreview extends React.Component {
  constructor (props) {
    super(props)
    this.fileDetails = React.createRef()

    this.fixImageScale = this.fixImageScale.bind(this)

    window.addEventListener('resize', (e) => {
      this.render()
    })
  }
  componentDidMount () {
    this.fixImageScale()
  }
  fixImageScale () {
    const { image } = this.props
    console.log(image)
  }
  render () {
    const { name, image } = this.props
    let imageSize
    if (image) {
      imageSize = { height: Math.round(image.height * (this.fileDetails.current.offsetWidth / image.width)), width: this.fileDetails.current.offsetWidth }
    }
    return (
      <div className='file-wrapper'>
        <div className='file-details' ref={this.fileDetails}>
          <h1>{name}</h1>
          {image ? <div className='image' style={{ backgroundImage: `url('${image.src}')`, ...imageSize }} /> : null}
        </div>
      </div>
    )
  }
}

FilePreview.propTypes = {
  name: PropTypes.string,
  image: PropTypes.object

}
