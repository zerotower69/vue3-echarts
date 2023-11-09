import * as echarts from 'echarts'
import { setPublicOptions } from '@/components/echarts/common/common'

/**
 * 获取柱状图的图表options
 * @param {import('ZCharts').CustomizeOptions} options 自定义的options
 * @return {import('echarts/types/src/util/types').ECBasicOption}
 */
export default function getOptions (options) {
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
      axisLabel: {
        color: '#abb8ce'
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(0, 0, 0, 0.2500)' // x轴刻度线的颜色
        }
      },
      data: options.list.map(item => item.label)
    },
    yAxis: {
      type: 'value',
      show: options.showYAxis || true, // y轴是否显示
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
        type: 'bar', // 折线图类型
        data: options.showAll ? options.list : options.list.map(item => item.value), // 兼容需要自定传参的数据
        color: options.showGradientCololr && new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: '#0A73FF'
          },
          {
            offset: 1,
            color: '#83B8FF'
          }
        ]),
        itemStyle: {
          borderRadius: [5, 5, 0, 0]
        },
        markLine: options.markLine && {
          symbol: [],
          silent: true,
          itemStyle: {
            normal: {
              show: true,
              color: 'rgba(0, 0, 0, 0.4500)'
            }
          },
          label: {
            normal: {
              color: 'rgba(0, 0, 0, 0.4500)',
              // formatter:'参考线 {c}',
              formatter: options.markLine.formatter,
              position: 'insideStartTop'
            }
          },
          data: options.markLine.data
        }
      }
    ]
  }
  return setPublicOptions(options, echartsOptions)
}
