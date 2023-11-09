import { isArray, isObject } from 'lodash-es'

/**
 * 合并对象
 * @param target
 * @param {any[]} source
 * @return {*}
 */
export function merge (target, ...source) {
  if (isObject(target)) {
    return objectMerge(target, ...source)
  } else if (isArray(target)) {
    return arrayMerge(target, ...source)
  } else {
    throw new Error('合并target的目标参数不是一个键值对象或者数组')
  }
}

/**
 * 深拷贝
 * @param data
 * @return {*|*[]|{}}
 */
export function deepCopy (data) {
  if (!isArray(data) && !isObject(data)) { return data }

  const weakMap = new WeakMap()

  function copy (data) {
    if (weakMap.has(data)) { return null } // 打断施法
    const copyData = data instanceof Array ? [] : {}
    weakMap.set(data, true)

    for (const [key, value] of Object.entries(data)) {
      copyData[key] = typeof value === 'object' ? copy(value) : value
    }

    return copyData
  }

  return copy(data)
}

/**
 * 获取键数组
 * @param value
 * @return {string[]}
 */
function getKeys (value) {
  return Object.keys(value)
}

/**
 * 对象合并
 * @param target
 * @param {any[]} source
 * @return {*}
 */
function objectMerge (target, ...source) {
  // 校验
  validateObject(target, '合并的目标参数必须是一个键值对象')
  if (!source.length) { return target } // 没有要合并的参数返回原值
  source.forEach(value => validateObject(value, '被合并的参数必须是一个键值对象'))

  // 合并
  source.forEach(value => {
    const valueKeys = getKeys(value)
    valueKeys.forEach(key => {
      const val = value[key]

      if (isObject(val)) { // 值为对象
        if (!target[key]) { target[key] = {} }
        if (isObject(target[key])) {
          target[key] = objectMerge(target[key], val)
        } else {
          target[key] = deepCopy(val)
        }
      } else if (isArray(val)) { // 值为数组
        if (!target[key]) { target[key] = [] }
        if (isArray(target[key])) {
          target[key] = arrayMerge(target[key], val)
        } else {
          target[key] = deepCopy(val)
        }
      } else {
        target[key] = val
      }
    })
  })

  return target
}

/**
 * 数组合并
 * @param target
 * @param {any[]} source
 * @return {*}
 */
function arrayMerge (target, ...source) {
  // 校验
  validateArray(target, '合并的目标对象必须是一个数组对象')
  if (!source.length) { return target } // 无合并对象，返回
  source.forEach(value => validateArray(value, '被合并的对象必须是一个数组'))

  // 合并
  source.forEach(value => {
    value.forEach((item, index) => {
      if (isObject(item)) {
        if (!target[index]) { target[index] = {} }
        if (isObject(target[index])) {
          target[index] = objectMerge(target[index], item)
        } else {
          target[index] = deepCopy(item)
        }
      } else if (isArray(item)) {
        if (!target[index]) { target[index] = [] }
        if (isArray(target[index])) {
          target[index] = arrayMerge(target[index], item)
        } else {
          target[index] = deepCopy(item)
        }
      } else {
        target[index] = item
      }
    })
  })

  return target
}

/**
 * 对象校验
 * @param value
 * @param message
 */
function validateObject (value, message = '') {
  if (!isObject(value)) {
    throw new Error(`${message || '参数必须是一个键值对象'}，参数：${value}`)
  }
}

/**
 * 数组校验
 * @param value
 * @param message
 */
function validateArray (value, message = '') {
  if (!isArray(value)) {
    throw new Error(`${message || '参数必须是一个数组对象'}，参数：${value}`)
  }
}

/**
 * 小驼峰转中划线方法
 * @param {string} str 小驼峰字符串
 * @returns {string} 返回中划线变量字符串
 * @example
 * humpToMidline('humpToMidline') -> 'hump-to-midline'
 */
export function humpToMidline (str) {
  const hyphenateRE = /\B([A-Z])/g
  return str.replace(hyphenateRE, '-$1').toLowerCase()
}
