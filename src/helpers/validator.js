import { supportedRules } from './validatorRules.js'
import * as validatorFunctions from './validatorFunctions.js'

export default class Validator {
  constructor (props) {
    let rules = []
    Object.keys(props).forEach(prop => {
      if (supportedRules.includes(prop)) {
        if (rules.includes(prop)) {
          console.warn(`Trying to add duplicate rule ${prop}, please remove this, will be ignored.`)
        } else {
          rules.push({ rule: prop, value: props[prop] })
        }
      }
    })
    this.rules = rules
    this.validateInput = this.validateInput.bind(this)
  }
  validateInput (input) {
    return new Promise((resolve, reject) => {
      let rules = []
      for (let idx in this.rules) {
        let rule = this.rules[idx]
        switch (rule.rule) {
          case 'min':
            rules.push({ rule: rule.rule, text: `Minimum ${rule.value} characters`, passed: validatorFunctions.min(input, rule.value) })
            break
          case 'required':
            rules.push({ rule: rule.rule, text: `Field is required`, passed: validatorFunctions.required(input) })
            break
          case 'max':
            rules.push({ rule: rule.rule, text: `Maximum ${rule.value} characters`, passed: validatorFunctions.max(input, rule.value) })
            break
        }
      }
      resolve(rules)
    })
  }
}

// current supported rules (must adhere to prop types name else will not work)
// max
// min
// email
// integer
// string
// regex
// greater than
// less than
// between
// before
// after
// on
