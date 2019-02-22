// Imports
import React from 'react'
import PropTypes from 'prop-types'

// Style
import './form.sass'

// React Components
import Errors from './Errors'
import FilePreview from './FilePreview'

class FileUpload extends React.Component {
  constructor (props) {
    super(props)
    this.state = { errors: null, value: '', files: null }

    this.fileInput = React.createRef()

    this.handleChange = this.handleChange.bind(this)
    this.browseFiles = this.browseFiles.bind(this)
  }
  browseFiles () {
    this.fileInput.current.click()
  }
  handleChange () {
    let actualFiles = Object.keys(this.fileInput.current.files).map(file => { if (file !== 'length') { return this.fileInput.current.files[file] } })
    let files = []
    actualFiles.forEach(file => {
      let isImage = file.type.split('/')[0] === 'image'
      let f = {}
      if (isImage) {
        const fr = new FileReader()
        let imageID = Math.random().toString(11).replace('0.', '')
        f.id = imageID
        new Promise((resolve, reject) => {
          fr.onload = (e) => { resolve({ id: imageID, base64: e.target.result }); console.log(e) }
        }).then(result => {
          let image = new Image()
          return new Promise((resolve, reject) => {
            image.onload = i => {
              resolve({ id: result.id, img: image })
            }
            image.src = result.base64
          })
        }).then(image => {
          this.imageLoaded(image)
        }).catch(err => {
          console.log('file loading failed: ' + err.message)
        })
        fr.readAsDataURL(file)
      }
      f.name = file.name
      f.type = file.type
      f.size = file.size
      files.push(f)
    })
    this.setState({ files })
  }
  imageLoaded (image) {
    let files = this.state.files.slice() // might be undefined but file is always defined so no error? maybe catch hmm
    files.filter(file => file.id).forEach(file => {
      if (file.id === image.id) {
        file.image = image.img
      }
    })
    this.setState({ files: files })
  }
  render () {
    const { title, name, placeholder, value, errors, multiple } = this.props
    const { files } = this.state
    console.log(placeholder)
    return (
      <div className='input-wrapper'>
        <div className={'input' + (errors ? ' error' : '')}>
          {title ? <h1>{title + (errors ? ' - Errors' : '')}</h1> : null}
          <input
            ref={this.fileInput}
            name={name || null}
            type='file'
            defaultValue={value || null}
            onChange={this.handleChange}
            multiple
            onBlur={this.props.checkErrors} />
          <div className={'select-file' + (multiple ? ' multiple' : '')} onClick={this.browseFiles} >
            {files
              ? <React.Fragment>
                {files.map((file, i) => {
                  return (
                    <FilePreview
                      key={i}
                      {...file}
                    />)
                })}
              </React.Fragment>
              : <div />}
          </div>
        </div>
        {errors
          ? <Errors errors={errors} />
          : null }
      </div>
    )
  }
}

export default FileUpload

FileUpload.propTypes = {
  title: PropTypes.string,
  placeholder: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  handleChange: PropTypes.func,
  errors: PropTypes.array,
  checkErrors: PropTypes.func,
  multiple: PropTypes.bool
}
