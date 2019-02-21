// Imports
import React from 'react'
import PropTypes from 'prop-types'

// Local Functions
import { withHandler } from './withHandler'

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
      let actualFiles = Object.keys(this.fileInput.current.files).map(file => {if(file !== "length"){return this.fileInput.current.files[file]}})
      actualFiles.forEach(file => {
          let isImage = file.type.split("/")[0] == "image" ? true : false;
          if(isImage){
            const fr = new FileReader()
            let imageID = Math.random().toString(11).replace('0.', '')
            file.id = imageID
            new Promise((resolve, reject) => {
                fr.onload = (e) => {resolve({id: imageID, src: e.target.result});}
            }).then(id=> {
                this.imageLoaded(id)
            }).catch(err => {
                console.log('file loading failed: ' + err.message)
            })
            fr.readAsDataURL(file);
          }
      })
      this.setState({files: actualFiles}, () => {console.log('state si done')})
  }
  imageLoaded(image) {
    let files = this.state.files.slice() //might be undefined but file is always defined so no error? maybe catch hmm
    files.filter(file=>file.id).forEach(file => {
        if(file.id === image.id){
            file.src = image.src
        }
    })
    this.setState({files: files})
  }
  render () {
    const { title, name, placeholder, value, type, errors, multiple } = this.props
    const { files } = this.state
    return (
      <div className='input-wrapper'>
        <div className={'input' + (errors ? ' error' : '')}>
          {title ? <h1>{title + (errors ? ' - Errors' : '')}</h1> : null}
          <input
            ref={this.fileInput}
            name={name || null}
            type="file"
            defaultValue={value || null}
            onChange={this.handleChange}
            multiple
            onBlur={this.props.checkErrors}/>
            <div className={"select-file" + (multiple ? " multiple": "")} onClick={this.browseFiles} >
                {files ?
                    <React.Fragment>
                    {files.map((file, i) => {
                        return (
                            <FilePreview 
                                key={i}
                                {...file}
                            />)
                    })} 
                    </React.Fragment>
                :<div></div>}
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
  type: PropTypes.string,
  handleChange: PropTypes.func,
  errors: PropTypes.array,
  checkErrors: PropTypes.func
}
