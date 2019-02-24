export const min = (value, min) => {
  if (typeof min !== 'number') {
    console.warn(`Rule min not supplied with correct value, is ${typeof min}, needs to be a number, will be ignored.`)
    return false
  }
  if (value.length < min) {
    return false
  } else {
    return true
  }
}

export const max = (value, max) => {
  if (typeof max !== 'number') {
    console.warn(`Rule max not supplied with correct value, is ${typeof max}, needs to be a number, will be ignored.`)
    return false
  }
  if (value.length > max) {
    return false
  } else {
    return true
  }
}

export const required = (value) => {
  if (value === '' || value === undefined || value === null) {
    return false
  } else {
    return true
  }
}

export const maxFiles = (value, maxFileCount) => {
  console.log(value)
  if (value.length > maxFileCount) {
    return false
  } else {
    return true
  }
}
