import { humpToMidline } from './utils'
import { useCssVar } from '@vueuse/core'

/**
 * rgb转换16进制颜色
 * @param {string} rgb
 */
export function rgbToHex (rgb) {
  // 十六进制颜色值的正则表达式
  const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
  // 如果是rgb颜色表示
  if (/^(rgb|RGB)/.test(rgb)) {
    const aColor = rgb.replace(/(?:\(|\)|rgb|RGB)*/g, '').split(',')
    let strHex = '#'
    for (let i = 0; i < aColor.length; i++) {
      let hex = Number(aColor[i]).toString(16)
      if (hex.length < 2) {
        hex = `0${hex}`
      }
      strHex += hex
    }
    if (strHex.length !== 7) {
      strHex = rgb
    }
    return strHex
  }
  if (reg.test(rgb)) {
    const aNum = rgb.replace(/#/, '').split('')
    if (aNum.length === 6) {
      return rgb
    }
    if (aNum.length === 3) {
      let numHex = '#'
      for (let i = 0; i < aNum.length; i += 1) {
        numHex += (aNum[i] + aNum[i])
      }
      return numHex
    }
  }
  return rgb
}

/**
 * 十六进制转换成rgb/rgba
 * @param {string} hex
 */
export function hexToRgb (hex) {
  if (/^(rgb|RGB)/.test(hex)) {
    return hex
  }
  const processedHex = properColorValues(hex)
  const { r } = processedHex
  const { g } = processedHex
  const { b } = processedHex
  const { a } = processedHex
  const { rgb } = processedHex
  const { rgba } = processedHex

  let rgbText = ''
  if (rgb) {
    rgbText = `rgb(${parseInt(r, 16)}, ${parseInt(g, 16)}, ${parseInt(b, 16)})`
  } else if (rgba) {
    rgbText = `rgba(${parseInt(r, 16)}, ${parseInt(g, 16)}, ${parseInt(
      b,
      16
    )}, ${parseInt(a, 16) / 255})`
  }
  return rgbText
}

/**
 * @param {string} color
 * @return {import('ZCharts').RgbJSON<number>}
 */
export function decimalColorList (color) {
  const colorList = properColorValues(color)
  return {
    r: parseInt(colorList.r, 16),
    g: parseInt(colorList.g, 16),
    b: parseInt(colorList.b, 16),
    a: parseInt(colorList.a, 16),
    rgb: colorList.rgb,
    rgba: colorList.rgba
  }
}

/**
 * @param {string} color
 * @return {import('ZCharts').RgbJSON<string>}
 */
export function properColorValues (color) {
  if (/^(rgb|RGB)/.test(color)) {
    if (/^(rgba|RGBA)/.test(color)) {
      const aColor = color.replace(/(?:\(|\)|rgba|RGBA)*/g, '').split(',')
      return {
        r: aColor[0],
        g: aColor[1],
        b: aColor[2],
        a: aColor[3],
        rgb: false,
        rgba: true
      }
    }
    const aColor = color.replace(/(?:\(|\)|rgb|RGB)*/g, '').split(',')
    return {
      r: aColor[0],
      g: aColor[1],
      b: aColor[2],
      a: '1',
      rgb: true,
      rgba: false
    }
  }

  color = color.replace('#', '')
  if (color.length === 3 || color.length === 6) {
    return processRGBHex(color)
  }
  if (color.length === 4 || color.length === 8) {
    return processRGBAHex(color)
  }
  throw new Error(`#${color} 可能不是个颜色字符串`)
}

/**
 * @param {string} hex
 * @return {import('ZCharts').RgbJSON<string>}
 */
function processRGBHex (hex) {
  if (hex.length === 3 && /^([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    return {
      r: hex.charAt(0) + hex.charAt(0),
      g: hex.charAt(1) + hex.charAt(1),
      b: hex.charAt(2) + hex.charAt(2),
      a: '1',
      rgb: true,
      rgba: false
    }
  }
  if (hex.length === 6 && /^([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    return {
      r: hex.substring(0, 2),
      g: hex.substring(2, 4),
      b: hex.substring(4, 6),
      a: '1',
      rgb: true,
      rgba: false
    }
  }
  throw new Error(`#${hex} is not a convertible hex value`)
}

/**
 * @param {string} hex
 * @return {import('ZCharts').RgbJSON<string>}
 */
function processRGBAHex (hex) {
  if (hex.length === 4 && /^([A-Fa-f0-9]{4}){1,2}$/.test(hex)) {
    return {
      r: hex.charAt(0) + hex.charAt(0),
      g: hex.charAt(1) + hex.charAt(1),
      b: hex.charAt(2) + hex.charAt(2),
      a: hex.charAt(3) + hex.charAt(3),
      rgb: false,
      rgba: true
    }
  }
  if (hex.length === 8 && /^([A-Fa-f0-9]{4}){1,2}$/.test(hex)) {
    return {
      r: hex.substring(0, 2),
      g: hex.substring(2, 4),
      b: hex.substring(4, 6),
      a: hex.substring(6, 8),
      rgb: false,
      rgba: true
    }
  }
  throw new Error(`#${hex} is not a convertible hex value`)
}

/**
 *
 * @param {string} color
 * @param {undefined|number} opacity
 * @return string
 */
export function colorToRgba (color, opacity) {
  const json = properColorValues(color)
  if (opacity || opacity === 0) {
    json.a = opacity + ''
  }
  return `rgba(${json.r}, ${json.g}, ${json.b},${json.a})`
}

/**
 *
 * @param {Record<string, string>} variableList
 */
export function setCssVariableData (variableList) {
  const el = document.documentElement
  Object.keys(variableList).forEach((key) => {
    const midlineKey = humpToMidline(key)
    const elVariable = useCssVar(`--el-${midlineKey}`, el)
    const variable = useCssVar(`--${midlineKey}`, el)
    elVariable.value = variableList[key]
    variable.value = variableList[key]
  })
}
