<template>
  <div class="chartPie">
      <div class="echart" ref="chartRef" :style="{height:props.height,width:props.width}"></div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useEcharts } from './hook'
import { graphic } from 'echarts'
import { merge } from './common/utils'
const { getCoordinates } = useEcharts()
const props = defineProps({
  /**
   * @type {{name:string;value:number;color:string;gradient:[number,string,string]}[]}
   */
  data: {
    type: Array,
    required: true
  },
  legendPadding: {
    type: Number,
    default: 4
  },
  /**
   * @type {import('ZCharts').EchartsOption}
   */
  options: {
    type: Object,
    default: () => ({})
  },
  textColor: {
    type: String,
    default: 'rgba(255, 255, 255, 1)'
  },
  chartName: String,
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: '110px'
  }
})
const chartRef = ref()

/**
 * 默认的配置
 * @type {import('echarts').EChartsOption}
 */
const defaultOptions = {
  tooltip: {
    trigger: 'item',
    formatter: '{b} : {d}%'
  },
  legend: {
    textStyle: {
      // color: "rgba(255, 255, 255, 1)",
      fontSize: 16,
      padding: [0, 0, 0, 10],
      rich: {
        text: {
          color: 'rgba(255, 255, 255, 1)'
        },
        ...textRich(data)
      }
    },
    formatter: (name) => {
      const item = data.find((dItem) => dItem.name === name)
      const text = name === '空气质量' ? name.padEnd(6) : name.padEnd(10)
      const valText = item.value + '%'
      // 文字和百分比显示不同的颜色
      return `{text|${text}}{${item.rich}|${valText}}`
    }
  },
  series: [
    {
      name: props?.chartName ?? 'pie',
      type: 'pie',
      radius: ['40%', '60%'],
      center: ['25%', '48%'],
      avoidLabelOverlap: false,
      label: {
        show: false
      },
      emphasis: {
        label: {
          show: false
        }
      },
      labelLine: {
        show: false
      }
    }
  ]

}

// 计算data的配置
function getSeriesDataOpts () {
  const dataOpts = props.data.map(item => {
    // 计算渐变的颜色
    let x1 = 0; let y1 = 0; let x2 = 0; let y2 = 1
    if (item?.gradient?.[0] ?? 0) {
      const deg = getCoordinates(0, item.gradient[0])
      x1 = deg.x
      x2 = deg.x2
      y1 = deg.y
      y2 = deg.y2
    }
    return {
      // 值和name
      value: item.value,
      name: item.name,
      itemStyle: {
        color: new graphic.LinearGradient(x1, y1, x2, y2, [
          {
            offset: '0%',
            color: item.gradient[1]
          },
          {
            offset: '100%',
            color: item.gradient[2]
          }
        ])
      }
    }
  })
}
// 计算图例legend的配置项
function getLegendOpts (customOpts = {}) {
  const defaultOpts = {
    orient: 'vertical',
    top: '30%',
    left: '50%',
    width: '20%',
    itemGap: 10,
    itemWidth: 14,
    itemHeight: 14,
    icon: 'circle', // 图例是小圆环
    textStyle: {
      fontSize: 16,
      padding: [0, 0, 0, 10]
    }
  }
  const richData = props.data.map((item, index) => ({
    ...item,
    rich: `color${index + 1}`
  }))
  const richOpts = richData.reduce((res, cur) => {
    res[cur.rick] = cur.color
  }, {
    text: {
      color: props.textColor ?? 'rgba(255, 255, 255, 1)'
    }
  })
  const formatter = (name) => {
    const item = richData.find((dItem) => dItem.name === name)
    // TODO:计算padding
    const text = name
    const valText = item.value + '%'
    // 文字和百分比显示不同的颜色
    return `{text|${text}}{${item.rich}|${valText}}`
  }
  const opts = merge(defaultOpts, customOpts)
  opts.textStyle.rich = richOpts
  opts.formatter = formatter
  return opts
}

function changeOptions(customizeOpts){
  //默认值
  const defaultOpts={};

}
</script>
<style scoped>

</style>
