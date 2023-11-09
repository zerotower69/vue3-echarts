import { setPublicOptions } from './common'

/**
 * 获取饼图的options
 * @param {import('ZCharts').CustomizeOptions} options  自定义的options
 * @param {boolean} lineWidth
 * @return {import('echarts/types/src/util/types').ECBasicOption}
 */
export default function getOptions (options, lineWidth) {
  const echartsOptions = {
    tooltip: {
      trigger: 'item',
      axisPointer: {
        type: 'shadow',
        shadowStyle: {
          color: 'rgba(10,115,255,0.08)'
        }
      },
      formatter (data) {
        const params = data.data
        let res = `<div style='margin-bottom:6px;width:100%;height:24px;line-height:24px;color: #595959;text-align: left;'><p>${params.name
        } </p></div>`
        res += `<div style="color: #595959;font-size: 14px;text-align: left">
          <span style="display:inline-block;margin-right:5px;border-radius:50%;width:8px;height:8px;background-color:${[
          data.color
        ]};"></span>
          <span>数量 <span style="margin: 0 5px 0 25px">${params.value}</span> <span style="color: ${[data.color]}">${params.ratio}%</span> </span><br/>
        </div>`
        return res
      }
    },
    legend: {
      right: '100',
      top: '30',
      icon: 'rect',
      itemWidth: 12,
      itemHeight: 12,
      orient: 'vertical',
      textStyle: {
        lineHeight: 16,
        color: '#595959',
        rich: {
          title: {
            fontSize: 14
          }
        }
      },
      formatter (params) {
        return [`{title|${params}}`]
      }
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '50%'],
        data: options.list,
        label: {
          alignTo: 'edge',
          fontWeight: 'bold',
          minMargin: 5,
          edgeDistance: 300,
          lineHeight: 25,
          formatter (data) {
            return `{name|${data.name}}\n{ratio|${data.value}  (${data.data.ratio}%)}`
          },
          rich: {
            name: {
              fontSize: 14,
              color: '#595959'
            },
            ratio: {
              fontSize: 14,
              color: '#595959'
            }
          }
        },
        labelLine: {
          length: 10,
          length2: '0'
        },
        labelLayout (params) {
          const { width } = window.screen
          // 小屏使用
          const isLeft = lineWidth ? params.labelRect.x < 100 / 2 : params.labelRect.x < (width - 300) / 4
          const points = params.labelLinePoints
          points[2][0] = isLeft
            ? params.labelRect.x
            : params.labelRect.x + params.labelRect.width
          return {
            labelLinePoints: points
          }
        }
      }
    ]
  }
  return setPublicOptions(options, echartsOptions)
}
