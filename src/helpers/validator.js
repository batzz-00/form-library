import { supportedRules } from './validatorRules.js'
import * as validatorFunctions from './validatorFunctions.js'

export default class Validator {
  constructor (component, props, allowedRules = Object.keys(validatorFunctions)) {
    let rules = []
    let componentSpecificRules = supportedRules.filter(rule => rule.split('.')[0] === component.displayName.split('.')[1]).map(rule => rule.split('.')[1])
    Object.keys(props).forEach(prop => {
      if (supportedRules.includes(prop) || componentSpecificRules.includes(prop)) {
        if (rules.includes(prop)) {
          console.warn(`Trying to add duplicate rule ${prop}, please remove this, will be ignored.`) // redundant react doesnt seem to pass props twice anyway
        } else if (supportedRules.includes(prop) && !allowedRules.includes(prop)) {
          console.warn(`You can not add the rule: ${prop} to ${component.displayName.split('.')[1]}, this will be ignored (allowed rules: ${allowedRules.join(',')})`)
        } else {
          rules.push({ rule: prop, value: props[prop] })
        }
      }
    })
    this.rules = rules
    this.validateInput = this.validateInput.bind(this)
  }
  getRules () {
    return this.rules
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
          case 'maxFiles':
            rules.push({ rule: rule.rule, text: `You can only upload ${rule.value} files`, passed: validatorFunctions.maxFiles(input, rule.value) })
            break
          case 'maxSize':
            rules.push({ rule: rule.rule, text: `Maximum file size of ${rule.value} passed`, passed: validatorFunctions.maxSize(input, rule.value) })
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
