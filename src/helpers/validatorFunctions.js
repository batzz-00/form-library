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
  if (value === '' || value === undefined || value === null || value.length === 0) {
    return false
  } else {
    return true
  }
}

export const maxFiles = (files, maxFileCount) => {
  if (files.length > maxFileCount) {
    return false
  } else {
    return true
  }
}

export const maxSize = (files, maxFileSize) => {
  if (files.length === 0) {
    return true
  }
  if (Object.keys(files).map(file => files[file].size).reduce((p, n) => p + n) > maxFileSize * 1000) {
    return false
  } else {
    return true
  }
}
