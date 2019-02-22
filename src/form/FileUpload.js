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
    console.log(actualFiles)
    this.setState({ files: actualFiles })
  }
  render () {
    const { title, name, value, errors, multiple } = this.props
    const { files } = this.state
    console.log(files)
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
                      file={file}
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
