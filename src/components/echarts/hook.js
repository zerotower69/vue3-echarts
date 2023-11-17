export function useEcharts () {
  /**
   * 线性渐变起止方向的计算方法
   * @param {*} startArc 开始角度
   * @param {*} endArc 结束角度
   * @returns 四个坐标 x,y,x2,y2
   */
  function getCoordinates (startArc, endArc) {
    const posi = [Math.sin(startArc), -Math.cos(startArc), Math.sin(endArc), -Math.cos(endArc)]
    const dx = posi[2] - posi[0]
    const dy = posi[3] - posi[1]

    return getLocation(dx, dy)
  }

  function getLocation (dx, dy) {
    const tanV = dx / dy
    const directSign = Math.abs(tanV) < 1
    const t = directSign ? tanV : 1 / tanV

    const sign1 = t > 0 ? 1 : -1
    const sign2 = dx > 0 ? 1 : -1
    const sign = directSign ? sign1 * sign2 : sign2

    const group1 = [0.5 - (sign * t) / 2, 0.5 + (sign * t) / 2]
    const group2 = sign > 0 ? [0, 1] : [1, 0]
    const group = [...group1, ...group2]
    const keys = directSign ? ['x', 'x2', 'y', 'y2'] : ['y', 'y2', 'x', 'x2']
    const res = {}
    keys.forEach((k, idx) => {
      res[k] = group[idx]
    })
    return res
  }
  return {
    getCoordinates
  }
}
