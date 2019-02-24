// Imports
import React from 'react'

// React components
import Form from './form/Form'
import Textbox from './form/TextBox'
// import Textarea from './form/TextArea'
import FileUpload from './form/FileUpload'
import Submit from './form/Submit'

export default class App extends React.Component {
  constructor (props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }
  onSubmit (data) {
    console.log(data)
  }
  render () {
    return (
      <React.Fragment>
        <div className='container' style={{ width: '50%', margin: '50px auto' }}>
          <Form onSubmit={this.onSubmit}>
            <Textbox title='Name' name='rat' required />
            <FileUpload title='File Upload' name='files' multiple required maxFiles={10} maxSize={1024} />
            <Submit value='Submit' />
          </Form>
        </div>
      </React.Fragment>
    )
  }
}
