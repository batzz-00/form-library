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
    this.uploadComplete = this.uploadComplete.bind(this)
    this.fileUploadBox = React.createRef()
  }
  browseFiles (e) {
    if (!e.target.classList.contains('select-file')) {
      return false
    }
    this.fileInput.current.click()
  }
  handleChange () {
    let colours = ['#2980b9', '#27ae60', '#16a085', '#d35400', '#c0392b']
    let actualFiles = []
    let formatColours = {}
    for (let i in Object.keys(this.fileInput.current.files)) {
      if (formatColours[this.fileInput.current.files.item(i).type]) {
        actualFiles.push({ colour: formatColours[this.fileInput.current.files.item(i).type], file: this.fileInput.current.files.item(i) })
      } else {
        let colour = colours.splice(0, 1)[0]
        formatColours[this.fileInput.current.files.item(i).type] = colour
        actualFiles.push({ colour, file: this.fileInput.current.files.item(i) })
      }
    }
    // let files = Object.keys(this.fileInput.current.files).map((file, i) =>
    //   {
    //     // if(file === "length")
    //     console.log(file)
    //     file.colour = "red"
    //     return this.fileInput.current.files[file]
    //   })
    this.setState({ files: actualFiles })
    // interesting behaviour on file, new file objects dont seem to generated, rather the data is switched so react doesnt know to render a new object as its getting the
    // same ref? fixed by using componentdidupdate, somehow got some additional efficiency lol

    // note
    // upload logic is in filepreview
  }
  uploadComplete (idx) {
    console.log(this.state.files[idx])
  }
  checkErrors () {
    return true
  }
  render () {
    const { title, name, value, errors, multiple } = this.props
    const { files } = this.state
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
          <div className={'select-file' + (multiple ? ' multiple' : '')} ref={this.fileUploadBox} onClick={this.browseFiles} >
            {files
              ? <React.Fragment>
                {files.map((file, i) => {
                  return (
                    <FilePreview
                      uploadComplete={() => { this.uploadComplete(i) }}
                      file={file.file}
                      colour={file.colour}
                      key={i}
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
  name: PropTypes.string,
  value: PropTypes.string,
  errors: PropTypes.array,
  checkErrors: PropTypes.func,
  multiple: PropTypes.bool
}
