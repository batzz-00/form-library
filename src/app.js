// Imports
import React from 'react'

// React components
import Form from './form/Form'
import Textbox from './form/TextBox'
// import Textarea from './form/TextArea'
import FileUpload from './form/FileUpload'
import Submit from './form/Submit'
import TextArea from './form/TextArea'

export default class App extends React.Component {
  constructor (props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }
  onSubmit (data) {
    console.log(this.test.current)
    console.log(data)
  }
  onError (data) {
    console.log(data)
  }
  test (e) {
    console.log(e)
  }
  render () {
    return (
      <React.Fragment>
        <div className='container' style={{ width: '50%', margin: '50px auto' }}>
          <Form onSubmit={this.onSubmit} onError={this.onError}>
            <Textbox title='Name' name='rat' required innerRef={this.test} />
            <TextArea title='rara' name='rata' required innerRef={this.test} />
            <FileUpload title='File Upload' name='files'multiple required maxFiles={10} maxSize={1024} innerRef={this.test} />
            <Submit value='Submit' />
          </Form>
        </div>
      </React.Fragment>
    )
  }
}
