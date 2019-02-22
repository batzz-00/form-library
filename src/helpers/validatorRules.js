export const supportedRules = [
  'max', // Maximum length (i.e 10 aaaaaaaaa)
  'min', // Minimum length (i.e 3 aaa)
  'email', // Must be an email
  'integer', // Must be an integer
  'string', // Must be a string ? bit vague tbf strings can contain numbers, might be redundant ----
  'regex', // Must follow the given regex (if valid)
  'greaterThan', // Must be greater than given number
  'required', // The field cannot be empty
  'lessThan', // Less than given number
  'between', // Between given two numbers (maybe have an and prop or send an object hmm)
  'before', // DATE - maybe merge with greaterthan for ease of use if possibel
  'after', // DATE
  'on' // DATE
]

export const checkRules = (props) => {
  let hasRules = false
  Object.keys(props).forEach(prop => {
    if (supportedRules.includes(prop)) {
      hasRules = true
    }
  })
  return hasRules
}
