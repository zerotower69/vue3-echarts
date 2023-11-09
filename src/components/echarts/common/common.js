import * as echarts from 'echarts'
import { merge } from './utils'
import { colorToRgba } from './color'

/**
 * 合并得到新的图表options
 * @param {import('ZCharts').CustomizeOptions} customizeOptions 自定义的options
 * @param {import('echarts/types/src/util/types').ECBasicOption} options 图表基础options
 * @return {*}
 */
export function setPublicOptions (customizeOptions, options) {
  return merge(customizeOptions, options)
}

/**
 * 获取径向渐变颜色
 * @param {string} startColor
 * @param {string|undefined} endColor
 */
export function getLinearGradientColor (startColor, endColor) {
  return new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
    offset: 0,
    color: startColor
  }, {
    offset: 1,
    color: endColor || colorToRgba(startColor, 0)
  }])
}
