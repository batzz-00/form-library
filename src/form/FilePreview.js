// Imports
import React from 'react'
import PropTypes from 'prop-types'

import './form.sass'

export default class FilePreview extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      imageSize: {}
    }
    this.fileDetails = React.createRef()
    this.imageWrapper = React.createRef()

    window.addEventListener('resize', (e) => {
      this.render()
    })
  }
  componentDidUpdate () {
    this.fixImageScale()
  }
  fixImageScale () {
    // let imageWrapper = this.imageWrapper.current
    // const { image } = this.props
    // if (image) {
    //   let imageSize = { height: Math.round(image.height * (this.fileDetails.current.offsetWidth / image.width)), width: this.fileDetails.current.offsetWidth }
    //   if(this.state.imageSize.height !== imageSize.height || this.state.imageSize.width !== imageSize.width){
    //     this.setState({imageSize}, () => {
    //       console.dir(imageWrapper)
    //       console.log(imageWrapper.scrollHeight)
    //       console.log(imageWrapper.offsetHeight)
    //       if(imageWrapper.scrollHeight > imageWrapper.offsetHeight){
    //         console.log('shiun')
    //         let imageSize = { width: Math.round(image.width * (this.fileDetails.current.offsetHeight / image.height)), height: this.imageWrapper.offsetHeight }
    //         this.setState({imageSize})
    //       }
    //     })
    //   }
    // }
  }
  render () {
    const { name, image } = this.props
    const { imageSize } = this.state
    // THIS IS HOPING an IMAGE ISNT SUPPLIED WHEN THE COMPONENT IS CREATED ELSE THE REFS WONT BE MOUNTED, NEED TO FIND A FIX
    return (
      <div className='file-wrapper'>
        <div className='file-details' ref={this.fileDetails}>
          <h1>{name}</h1>
          {image ? <div className='image-wrapper' ref={this.imageWrapper}><div className='image' style={{ backgroundImage: `url('${image.src}')`, ...imageSize }} /></div> : null}
        </div>
      </div>
    )
  }
}

FilePreview.propTypes = {
  name: PropTypes.string,
  image: PropTypes.object

}
