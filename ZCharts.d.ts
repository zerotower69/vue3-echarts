import type { ECBasicOption } from 'echarts/types/src/util/types'

declare module "ZCharts"{
  export {}
  export type EchartsData ={
    value: string | number;
    label: string;
  }

// 定义图表的枚举类型
  export enum CustomizeType {
    // 折线图
    LINE = 'line',
    // 柱状图
    BAR = 'bar',
    // 饼图
    PIE = 'pie'
  }
  export interface CustomizeOptions extends ECBasicOption {
    type: CustomizeType; // 类型
    color?: string | string[]; // 颜色
    list: EchartsData[];

    /* 设置边距 */
    grid?: {
      top?: string; // 上边距
      bottom?: string; // 下边距
      left?: string; // 左边距
      right?: string; // 右边距
      containLabel?: boolean; // grid 区域是否包含坐标轴的刻度标签。『防止标签溢出』
    };

    /* x轴设置 */
    xAxis?: {
      boundaryGap?: boolean; // 是否在刻度中心
    };

    /* y轴设置 */
    yAxis?: {
      show?: boolean; // 是否展示
    };

    markLine?: {
      data: any[];
      formatter?: any;
    };

    /* */
    seriesSetting?: {
      showSymbol?: boolean; // 折线图是否显示节点
      step?: 'start' | 'middle' | 'end';// 当类型为'line' 时，是否为阶梯线图 https://echarts.apache.org/zh/option.html#series-line.step
    };
  }
  export interface RgbJSON<T> {
    r: T;
    g: T;
    b: T;
    a: T;
    rgb: boolean;
    rgba: boolean;
  }
}
