<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as echarts from 'echarts'
import { isString } from 'lodash-es'
import { getLinearGradientColor } from './common/common'
import getLineOptions from './common/line'
import getBarOptions from './common/bar'
import getPieOptions from './common/pie'

const props = defineProps({
  height: {
    type: String,
    default: '110px'
  },
  width: {
    type: String,
    default: '100%'
  },
  lineWidth: {
    type: Boolean,
    default: false
  },
  /**
   * @type {import('echarts/types/src/util/types').ECBasicOption}
   */
  option: {
    type: Object,
    default: () => ({})
  },
  /**
   * 自定义封装的配置
   * @type {import('ZCharts').CustomizeOptions}
   */
  customizeOptions: {
    type: Object,
    default: () => ({})
  }
})
const emits = defineEmits(['pegging'])
/**
 * @type {import('vue').Ref<import('ZCharts').CustomizeOptions>}
 */
const options = ref()
const chartRef = ref()
/**
 * 图表实例对象
 * @type {import('echarts').ECharts}
 */
let myChart = null

onMounted(() => {
  nextTick(() => {
    myChart = echarts.init(chartRef.value)
    options.value && myChart.setOption(options.value)
    if (myChart) {
      myChart.off('click')
      myChart.on('click', function (params) {
        emits('pegging', params)
      })
    }
  })
})
onBeforeUnmount(() => {
  // eslint-disable-next-line no-unused-expressions
  myChart?.dispose()
})
watch([() => props.option, () => props.customizeOptions], () => {
  changeOption()
}, { deep: true, immediate: true })

function changeOption () {
  if (myChart) {
    // eslint-disable-next-line no-unused-expressions
    myChart?.clear()
  }
  if (props.option) {
    options.value = props.option
  } else {
    options.value = getOptions()
  }
  if (myChart) {
    options.value && myChart.setOption(options.value)
    myChart.off('click')
    myChart.on('click', function (params) {
      emits('pegging', params)
    })
  }
}

/**
 * @returns {import('echarts/types/src/util/types').ECBasicOption}
 */
function getOptions () {
  if (props.customizeOptions) {
    const options = props.customizeOptions
    if (!options.color) {
      // 备注：这里不要颜色 先这么处理
      if (options.type !== 'pie') {
        options.color = ['rgba(0, 214, 228, 1)', 'rgba(44, 121, 250, 1)']
      }
    } else if (isString(options.color)) {
      options.color = [options.color]
    }
    /**
     * @type {import('ZCharts').CustomizeType}
     */
    switch (options.type) {
      case 'line':
        return getLineOptions(options)
      case 'bar':
        return getBarOptions(options)
      case 'pie':
        return getPieOptions(options, props.lineWidth)
    }
  }
  if (process.NODE_ENV === 'development') {
    return {
      // color: ["rgba(0, 214, 228, 1)"],
      // 设置echarts上下左右的空间
      grid: {
        top: '0',
        bottom: '20px',
        left: '0',
        right: '0'
      },
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
        boundaryGap: false,
        axisLabel: {
          color: '#abb8ce'
        },
        axisLine: {
          lineStyle: {
            color: 'rgba(0, 0, 0, 0.2500)' // x轴刻度线的颜色
          }
        },
        data: [
          {
            value: 'Mon',
            textStyle: {
              align: 'left' // 第一个刻度名称左对齐
            }
          },
          'Tue',
          'Wed',
          'Thu',
          'Fri',
          'Sat',
          {
            value: 'Sun',
            textStyle: {
              align: 'right' // 最后一个刻度名称右对齐
            }
          }
        ]
      },
      yAxis: {
        type: 'value',
        show: false, // y轴不显示
        splitLine: { show: false }, // 去除网格线
        nameTextStyle: {
          color: '#abb8ce'
        },
        axisLabel: {
          color: '#abb8ce'
        },
        axisTick: {
          // y轴刻度线
          show: false
        },
        axisLine: {
          // y轴
          show: false
        }
      },
      series: [
        {
          type: 'line', // 折线图类型
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          showSymbol: false, // 设置不显示节点
          lineStyle: {
            color: 'rgba(0, 214, 228, 1)',
            width: 3
          },
          areaStyle: {
            // 折线图内部填充渐变
            normal: {
              color: getLinearGradientColor('rgba(0, 214, 228, 1)')
            }
          }
        }
      ]
    }
  } else {
    return {}
  }
}
</script>

<template>
<div ref="chartRef" class="echarts" :style="{
  width:props.width,height:props.height
}"/>
</template>

<style scoped lang="less">

</style>
