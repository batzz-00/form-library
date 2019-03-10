// Imports
import React from 'react'
import PropTypes from 'prop-types'

// Style
import './form.sass'

export default class Form extends React.Component {
  constructor (props) {
    super(props)
    this.errors = {}

    let { children } = props
    children = !Array.isArray(children) ? [children] : children

    let inputs = {}
    React.Children.forEach(children, child => {
      if (child.type.name !== 'Submit') {
        inputs[child.props.name] = { value: '', ref: React.createRef() }
      }
    })
    this.inputs = inputs
    this.onSubmit = this.onSubmit.bind(this)
    this.updateInput = this.updateInput.bind(this)
    this.addError = this.addError.bind(this)
  }
  addError (name, errors) {
    if (errors.length === 0 && this.errors[name]) {
      delete this.errors[name]
    } else if (errors.length !== 0) {
      this.errors[name] = errors
    }
  }
  async onSubmit (e) {
    e.preventDefault()
    let valid = await this.error()
    if (!valid) {
      if (this.props.onError) {
        this.props.onError(this.errors)
      }
      return false
    }
    let inputs = {}
    Object.keys(this.inputs).forEach(input => { inputs[input] = this.inputs[input].value })
    if (this.props.onSubmit) {
      this.props.onSubmit(inputs)
    }
  }
  error () {
    let promises = []
    Object.keys(this.inputs).forEach(input => {
      promises.push(this.inputs[input].ref.current.checkErrors())
    })

    return Promise.all(promises).then((result) => {
      if (result.filter(error => !error).length > 0) {
        return false
      } else {
        return true
      }
    })
    // good practice to resolve with the errors that didnt pass or reject if a single error failed? - this way a single error will reject the whole process
    // due to promise.all dying if a single promise fails
    // usign the resolve approach here as I don't want to handle the error, as its already shown on the client side and a validation error isnt a program breaking
    // error, also allows me to have optional errors.
  }
  updateInput (key, value) {
    let data = this.inputs
    data[key].value = value
    if (this.props.liveChanges) {
      this.props.liveChanges(data)
    }
  }
  render () {
    if (!this.props.children) {
      console.error('No children provided for form!')
      return false
    }
    let { children } = this.props
    const { size } = this.props
    children = !Array.isArray(children) ? [children] : children
    const childrenWithProps = React.Children.map(children, child => {
      if (child.type.name !== 'Submit') {
        return (React.cloneElement(child, { updateInput: this.updateInput, setErrors: this.addError, ref: this.inputs[child.props.name].ref }))
      }
      return (React.cloneElement(child))
    })
    return (
      <form
        onSubmit={this.onSubmit}
        className={size ? 'full' : 'normal'}>
        {childrenWithProps}
      </form>
    )
  }
}

Form.propTypes = {
  onSubmit: PropTypes.func,
  onError: PropTypes.func,
  size: PropTypes.bool,
  liveChanges: PropTypes.func,
  children: PropTypes.node.isRequired
}
