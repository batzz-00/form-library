import React from 'react'
import PropTypes from 'prop-types'

import Validator from '../helpers/validator'

export const withHandler = (WrappedComponent, allowedRules = null, defaultValue) => {
  class Component extends React.Component {
    constructor (props) {
      super(props)
      // Initial state
      this.state = { value: '' }

      // Bindings
      this.handleChange = this.handleChange.bind(this)
      this.checkErrors = this.checkErrors.bind(this)

      // timer to detect last change was x abgo
      this.changing = false
      this.changeTimer = null

      // custom timer used if implemented
      this.afterTimer = null

      if (this.props.after && !this.props.do) {
        console.log('You have an after prop but no do prop, the after prop is redundant')
      }
      if (!this.props.after && this.props.do) {
        console.log('You have a do prop but no after prop, the do prop is redundant')
      }
      this.props.updateInput(props.name, props.default || props.defaultValue || defaultValue || '')

      this.validator = allowedRules ? new Validator(Component, props, allowedRules) : new Validator(Component, props)
    }
    handleChange (key, input) {
      if (!key) {
        console.warn("If you wish to return the data from a form, you must provide a name (i.e name='x' in the JSX element) for the script to use as a key")
        return false
      }
      this.setState({ value: input }, () => this.props.updateInput(key, input))

      // MOVE TO WITH TIMER?
      // Default on changetimer
      this.changing = true
      clearInterval(this.changeTimer)
      this.changeTimer = setTimeout(() => { this.changing = false; this.checkErrors() }, this.props.changeDelay || 600) // dynamic timer + defualt

      //
      if (this.props.after && this.props.do) {
        clearInterval(this.afterTimer)
        this.afterTimer = setTimeout(() => { this.props.do(this.state.value) }, this.props.after)
      }
    }
    componentWillUnmount () {
      clearInterval(this.changeTimer)
      if (this.afterTimer) {
        clearInterval(this.afterTimer)
      }
    }
    // move to withErrors?
    checkErrors () {
      const { customErrors } = this.props
      return new Promise((resolve, reject) => {
        this.validator.validateInput(this.state.value).then(errors => {
          let errorCollection = customErrors ? errors.concat(customErrors) : errors
          let problems = errorCollection.filter(error => !error.passed)
          this.props.setErrors(this.props.name, problems)
          if (problems.length === 0) {
            this.setState({ errors: null }, () => resolve(true))
          } else {
            this.setState({ errors: problems }, () => resolve(false))
          }
        })
      })
    }
    render () {
      return (<WrappedComponent handleChange={this.handleChange} value={this.state.value} checkErrors={this.checkErrors} errors={this.state.errors} {...this.props} />)
    }
  }
  Component.displayName = `withHandler.${getDisplayName(WrappedComponent)}`
  Component.propTypes = {
    changeDelay: PropTypes.number,
    updateInput: PropTypes.func,
    after: PropTypes.number,
    do: PropTypes.func,
    customErrors: PropTypes.array,
    Component: PropTypes.element,
    name: PropTypes.string,
    setErrors: PropTypes.func,
    defaultValue: PropTypes.string,
    default: PropTypes.string

  }
  return Component
}

function getDisplayName (Component) {
  return Component.displayName || Component.name || 'Component'
}

// FORWARD REFS ? maybe not even necessary
