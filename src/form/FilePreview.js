// Imports
import React from 'react'
import PropTypes from 'prop-types'

import './form.sass'

export default class FilePreview extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      imageSize: {},
      loading: null
    }
    this.fileDetails = React.createRef()
    this.imageWrapper = React.createRef()
    this.loadFile(props.file)
    window.addEventListener('resize', (e) => {
      this.render()
    })
  }
  loadFile (image) {
    console.log('LOADER')
    let isImage = image.type.split('/')[0] === 'image'
    let f = {}
    if (isImage) {

    }
    const fr = new FileReader()
    let imageID = Math.random().toString(11).replace('0.', '')
    f.id = imageID
    let file = new Promise((resolve, reject) => {
      console.log('batch')
      fr.onprogress = (e) => {
        if (e.loaded === e.total) {
          this.setState({ loading: null })
        } else {
          this.setState({ loading: ((e.loaded / e.total) * 100) })
        }
      }
      fr.onload = (e) => { resolve({ id: imageID, base64: e.target.result }); console.log(e) }
    })
    fr.readAsDataURL(image)
    if (isImage) {
      file.then(result => {
        let image = new Image()
        console.log('batch')
        return new Promise((resolve, reject) => {
          image.onload = i => {
            resolve({ id: result.id, img: image })
          }
          image.src = result.base64
        })
      }).then(image => {
        // this.imageLoaded(image)
      }).catch(err => {
        console.log('file loading failed: ' + err.message)
      })
    }
    f.name = image.name
    f.type = image.type
    f.size = image.size
    this.setState({ file: f })
  }
  render () {
    console.log(this.state.loading)
    const { imageSize, loading, name, image } = this.state
    // THIS IS HOPING an IMAGE ISNT SUPPLIED WHEN THE COMPONENT IS CREATED ELSE THE REFS WONT BE MOUNTED, NEED TO FIND A FIX
    return (
      <div className='file-wrapper'>
        <div className='file-details' ref={this.fileDetails}>
          <h1>{name}</h1>
          {image ? <div className='image-wrapper' ref={this.imageWrapper}><div className='image' style={{ backgroundImage: `url('${image.src}')`, ...imageSize }} /></div> : null}
          {loading ? <div className='progress-bar'><div className='bar' style={{ width: this.state.loading + '%' }} /></div> : null }
        </div>
      </div>
    )
  }
}

FilePreview.propTypes = {
  file: PropTypes.object
}
