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
    this.errors[name] = errors
  }
  async onSubmit (e) {
    e.preventDefault()
    let valid = await this.error()
    if (!valid) {
      if (this.props.onError) {
        this.props.onError(Object.keys(this.inputs).filter(e => this.inputs[e].required === true && this.inputs[e].value === ''))
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
    let valid = true
    let promises = []
    Object.keys(this.inputs).forEach(input => {
      promises.push(this.inputs[input].ref.current.checkErrors())
    })
    return Promise.all(promises).then(() => {
      Object.keys(this.errors).forEach(input => {
        if (this.errors[input].length !== 0) {
          valid = false
        }
      })
      return valid
    })
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
