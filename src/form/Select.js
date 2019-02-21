// Imports
import React from 'react'
import PropTypes from 'prop-types'

// Local Functions
import Validator from '../../src/validator'

import './form.sass'

export default class Select extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      chosen: props.chosen ? props.chosen.actualValue : props.options[0].actualValue, // revisit this 100% risky
      value: null,
      errors: null
    }
    this.validator = new Validator(props)
    this.handleChange = this.handleChange.bind(this)
    this.props.updateInput(props.name, this.state.chosen || '')
  }
  handleChange (e) {
    if (!this.props.name) {
      console.warn("If you want to return the data from a form, you must provide a name (i.e name='x' in the JSX element) for the script to use as a key")
      return false
    }
    let val = e.target.value
    this.setState({
      value: val, chosen: val
    }, () => {
      this.props.updateInput(this.props.name, val.actualValue) // ERROR CATCH FOR SAME KEY
    })
  }
  checkErrors () {
    return new Promise((resolve, reject) => {
      this.validator.validateInput(this.state.value).then(errors => {
        let problems = errors.filter(error => !error.passed)
        this.props.setErrors(this.props.name, problems)
        if (problems.length === 0) {
          this.setState({ errors: null }, resolve)
        } else {
          this.setState({ errors: problems }, resolve)
        }
      })
    })
  }
  render () {
    const { title, name, placeholder } = this.props
    let { options } = this.props
    const { chosen, errors, value } = this.state
    if (typeof options[0] !== 'object') {
      options = options.map(option => { return ({ actualValue: option, shownValue: option }) })
    }
    return (
      <div className='input-wrapper'>
        <div className={'input' + (errors ? ' error' : '')}>
          {title ? <h1>{title}</h1> : null}
          <select
            name={name || null}
            placeholder={placeholder || null}
            value={value || chosen || ''}
            onChange={(e) => this.handleChange(e, 'select')}>
            {options.map((option, i) => {
              return (<option value={option.actualValue} key={i}>{option.shownValue}</option>)
            })}
          </select>
        </div>
      </div>
    )
  }
}

Select.propTypes = {
  options: PropTypes.array.isRequired,
  title: PropTypes.string,
  placeholder: PropTypes.string,
  chosen: PropTypes.string,
  name: PropTypes.string,
  updateInput: PropTypes.func,
  setErrors: PropTypes.func
}

// typeFix () {
//     switch (this.props.type) {
//       case 'select':
//         if (this.props.chosen) {
//           this.props.options.forEach((option, idx) => {
//             if (this.props.chosen === option.actualValue) {
//               this.props.updateInput(this.props.name, this.props.options[idx].actualValue)
//             }
//           })
//         } else {
//           this.props.updateInput(this.props.name, this.props.options[0].actualValue)
//         }

//         break
//     }
//   }
