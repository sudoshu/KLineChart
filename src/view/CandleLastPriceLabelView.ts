/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { YAxisType } from '../common/Options'

import View from './View'

import YAxis from '../component/YAxis'

import { formatPrecision } from '../common/utils/format'

export default class CandleLastPriceLabelView extends View {
  protected drawImp (ctx: CanvasRenderingContext2D): void {
    const widget = this.getWidget()
    const pane = widget.getPane()
    const bounding = widget.getBounding()
    const chartStore = pane.getChart().getChartStore()
    const priceMarkStyles = chartStore.getStyles().candle.priceMark
    const lastPriceMarkStyles = priceMarkStyles.last
    const lastPriceMarkTextStyles = lastPriceMarkStyles.text
    if (priceMarkStyles.show && lastPriceMarkStyles.show && lastPriceMarkTextStyles.show) {
      const precision = chartStore.getPrecision()
      const yAxis = pane.getAxisComponent() as YAxis
      const dataList = chartStore.getDataList()
      const visibleDataList = chartStore.getVisibleDataList()
      const data = dataList[dataList.length - 1]
      if (data !== undefined) {
        const { close, open } = data
        const priceY = yAxis.convertToNicePixel(close)
        let backgroundColor: string
        if (close > open) {
          backgroundColor = lastPriceMarkStyles.upColor
        } else if (close < open) {
          backgroundColor = lastPriceMarkStyles.downColor
        } else {
          backgroundColor = lastPriceMarkStyles.noChangeColor
        }
        let text: string
        if (yAxis.getType() === YAxisType.PERCENTAGE) {
          const fromData = visibleDataList[0].data
          const fromClose = fromData.close
          text = `${((close - fromClose) / fromClose * 100).toFixed(2)}%`
        } else {
          text = formatPrecision(close, precision.price)
        }

        let x: number
        let textAlgin: CanvasTextAlign
        if (yAxis.isFromZero()) {
          x = 0
          textAlgin = 'left'
        } else {
          x = bounding.width
          textAlgin = 'right'
        }
        this.createFigure(
          'rectText',
          {
            x,
            y: priceY,
            text,
            align: textAlgin,
            baseline: 'middle'
          },
          {
            ...lastPriceMarkTextStyles,
            backgroundColor
          }
        )?.draw(ctx)
      }
    }
  }
}
