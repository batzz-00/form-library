// Imports
import React from 'react'

// React components
import Form from './form/Form'
import Textbox from './form/TextBox'
import Textarea from './form/TextArea'
import FileUpload from './form/FileUpload';

export default class App extends React.Component {
  kek(){
    console.log('kek')
  }
  render () {
    return (
      <React.Fragment>
        <div className="container" style={{width: "50%", margin: "50px auto"}}>
        <Form>
          <Textbox title="Name" name="rat" after={1500} do={this.kek}/>
          <FileUpload  title="File Upload" name="file" multiple/>
        </Form>
        </div>
      </React.Fragment>
    )
  }
}
