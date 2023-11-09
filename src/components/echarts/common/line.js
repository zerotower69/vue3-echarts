import { isBoolean } from 'lodash-es'
import { setPublicOptions, getLinearGradientColor } from './common'
/**
 * 获取折线图的options
 * @param {import('ZCharts').CustomizeOptions} options 自定义的部分options
 * @return {import('echarts/types/src/util/types').ECBasicOption}
 */
export default function getOptions (options) {
  const xAxisData = (options.list || []).map((item, index) => {
    if (index === 0) {
      return {
        value: item.label,
        textStyle: {
          align: 'left' // 第一个刻度名称左对齐
        }
      }
    } else if (index + 1 === options.list.length) {
      return {
        value: item.label,
        textStyle: {
          align: 'right' // 第一个刻度名称左对齐
        }
      }
    } else {
      return item.label
    }
  })

  const echartsOptions = {
    color: options.color,
    // 弹窗
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false, // 在刻度中心
      axisLabel: {
        color: '#abb8ce'
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(0, 0, 0, 0.2500)' // x轴刻度线的颜色
        }
      },
      data: xAxisData
    },
    yAxis: {
      type: 'value',
      splitLine: { show: false }, // 去除网格线
      nameTextStyle: {
        color: '#abb8ce'
      },
      axisLabel: {
        color: '#abb8ce'
      },
      axisTick: { // y轴刻度线
        show: false
      },
      axisLine: { // y轴
        show: false
      }
    },
    series: [
      {
        type: 'line', // 折线图类型
        data: options.list.map(item => item.value),
        lineStyle: {
          color: options.color?.[0],
          width: 3
        },
        areaStyle: {
          // 折线图内部填充渐变
          normal: {
            color: getLinearGradientColor(options.color?.[0])
          }
        }
      }
    ]
  }
  options.seriesSetting && echartsOptions.series.forEach(item => {
    // 折线图是否显示节点
    if (options.seriesSetting?.showSymbol || isBoolean(options.seriesSetting?.showSymbol)) {
      (item).showSymbol = options.seriesSetting?.showSymbol
    }
    // 是否是阶梯线图
    if (options.seriesSetting?.step || isBoolean(options.seriesSetting?.step)) {
      (item).step = options.seriesSetting?.step
    }
  })

  return setPublicOptions(options, echartsOptions)
}
