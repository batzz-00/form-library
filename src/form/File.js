// Imports
import React from 'react'
import PropTypes from 'prop-types'

import './form.sass'

export default class File extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      imageSize: {},
      image: null,
      loading: null

    }
    this.fileDetails = React.createRef()
    this.imageWrapper = React.createRef()
  }
  componentDidMount () {
    this.setFileDetails()
    this.loadThumbnail(this.props.file)
  }
  componentDidUpdate (prevProps) {
    if (this.props.file.name !== prevProps.file.name) {
      this.setFileDetails()
      this.loadThumbnail(this.props.file)
    }
  }
  setFileDetails () {
    let { file } = this.props
    let f = {}
    f.name = file.name
    f.type = file.type
    f.format = file.type.split('/')[file.type.split('/').length - 1]
    f.size = (file.size / 1000000 < 1 ? file.size / 1000 : file.size / 1000000).toFixed(2)
    f.sizeFormat = file.size / 1000000 < 1 ? 'KB' : 'MB'
    this.setState({ file: f })
  }
  loadThumbnail (file) {
    let isImage = file.type.split('/')[0] === 'image'
    if (!isImage) {
      if (this.state.image) {
        this.setState({ image: null })
      }
      return false
    }
    let f = {}
    const fr = new FileReader()
    let fileReader = new Promise((resolve, reject) => {
      fr.onloadstart = (e) => { this.setState({ loading: true }) }
      fr.onprogress = (e) => { this.setState({ loading: ((e.loaded / e.total) * 100) }) }
      fr.onloadend = (e) => { resolve(e.target.result); this.setState({ loading: false }) }
    })

    fr.readAsDataURL(file)
    fileReader.then(result => {
      let image = new Image()
      let imageID = Math.random().toString(11).replace('0.', '')
      f.id = imageID
      return new Promise((resolve, reject) => {
        image.onload = i => {
          resolve({ id: imageID, img: image })
        }
        image.src = result
      })
    }).then(image => {
      this.setState({ image: image.img })
    }).catch(err => {
      console.log('file loading failed: ' + err.message)
    })
  }
  render () {
    const { imageSize, loading, image, file } = this.state
    const { colour } = this.props
    return (
      <div className={'file-wrapper'}>
        { file ? <div className={'file-details' + (loading ? ' loading' : '')} ref={this.fileDetails}>
          <h1>{file.name}</h1>
          <h2>{`${file.size} ${file.sizeFormat}`}</h2>
        </div> : null }
        {image ? <div className='image-wrapper' ref={this.imageWrapper}><div className='image' style={{ backgroundImage: `url('${image.src}')`, ...imageSize }} /></div>
          : <div className='file-filler' style={{ backgroundColor: colour }}><i /></div>}
        {loading ? <div className='progress-bar'><div className='bar' style={{ width: this.state.loading + '%' }} /></div> : null }
      </div>
    )
  }
}

File.propTypes = {
  file: PropTypes.object,
  colour: PropTypes.string
}
