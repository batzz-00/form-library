// Imports
import React from 'react'
import PropTypes from 'prop-types'

// Style
import './form.sass'

// React Components
import Errors from './Errors'
import File from './File'

import { withHandler } from './withHandler'

// value == files

class FileUpload extends React.Component {
  constructor (props) {
    super(props)
    this.state = { errors: null, files: [], uploaded: [] }

    this.fileInput = React.createRef()
    this.complete = false

    this.handleChange = this.handleChange.bind(this)
    this.browseFiles = this.browseFiles.bind(this)
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
    let actualFiles = this.props.append ? this.state.files : []
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
    let rawFiles = actualFiles.map(obj => obj.file)
    this.props.handleChange(this.props.name, rawFiles)
    this.setState({ files: actualFiles, uploaded: [] })
    // interesting behaviour on file, new file objects dont seem to generated, rather the data is switched so react doesnt know to render a new object as its getting the
    // same ref? fixed by using componentdidupdate, somehow got some additional efficiency lol
    // must be something in the diffing algorithm
  }

  render () {
    const { title, name, multiple, errors } = this.props
    const { files } = this.state
    return (
      <div className='input-wrapper'>
        <div className={'input' + (errors ? ' error' : '')}>
          {title ? <h1>{title + (errors ? ' - Errors' : '')}</h1> : null}
          <input
            ref={this.fileInput}
            name={name || null}
            type='file'
            onChange={this.handleChange}
            multiple
            onBlur={this.props.checkErrors} />
          <div className={'select-file' + (multiple ? ' multiple' : '')} ref={this.fileUploadBox} onClick={this.browseFiles} >
            {files
              ? <React.Fragment>
                {files.map((file, i) => {
                  return (
                    <File
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

export default withHandler(FileUpload, ['required'], [])

FileUpload.propTypes = {
  title: PropTypes.string,
  name: PropTypes.string,
  checkErrors: PropTypes.func,
  multiple: PropTypes.bool,
  append: PropTypes.bool,
  handleChange: PropTypes.func,
  errors: PropTypes.array
}
