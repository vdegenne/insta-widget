import { css, html, LitElement, PropertyValueMap } from 'lit'
import { customElement, query, state } from 'lit/decorators.js'
import { randomNumber, sleep } from '../util';
// import fabric from 'fabric'

declare type Point = [number, number];
declare type Line = [number, number, number, number]

@customElement('constellation-element')
export class ConstellationElement extends LitElement {
  canvas!: fabric.Canvas;
  descriptionBox!: fabric.IText
  private _lines: fabric.Line[] = []
  private _points: fabric.Point[] = []
  private index: number = 0

  // @query('canvas') canvasElement!: HTMLCanvasElement;
  get canvasElement(): HTMLCanvasElement {
    return this.shadowRoot!.querySelector('canvas')!
  }


  static styles = css`
  :host {
    display: block;
    position: relative;
  }
  #canvas {
    background-color: white;
    width: 640px;
    height: 640px;
  }
  `
  render() {
    return html`
    <canvas id=canvas width=640 height=640></canvas>
    `
  }

  updated() {
    this.canvas && this.canvas.renderAll()
  }


  protected async firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    await sleep(500)
    this.canvas = new fabric.Canvas(this.canvasElement)
    fabric.Object.prototype.originX = fabric.Object.prototype.originY = 'center';
    this.descriptionBox = this.addTextToCanvas(50, 50, '', 'grey')
    this.createNewMap(['将来', '紹介', '招待'])
    this.canvas.on('object:moving', (e) => {
      var p = e.target as any;
      p.line1 && p.line1.set({ 'x2': p.left, 'y2': p.top });
      p.line2 && p.line2.set({ 'x1': p.left, 'y1': p.top });
      p.line3 && p.line3.set({ 'x1': p.left, 'y1': p.top });
      p.line4 && p.line4.set({ 'x1': p.left, 'y1': p.top });
      p.Text && p.Text.set({ 'left': p.left, 'top': p.top})
      p.Text && p.Text.setCoords()
      this.canvas.renderAll();
      // if (p.Text) {
      //   setTimeout(()=>{
      //     p.Text.bringToFront();
      //     p.Text && p.Text.setCoords()
      //     this.canvas.renderAll();
      //   }, 1000)
      // }
    });
  }

  addLineToCanvas(line: Line, strokeWidth = 10) {
    const lineObject = new fabric.Line(line, {
      strokeWidth,
      stroke: '#000',
    })
    this.canvas.add(lineObject)
    return lineObject;
  }

  addCircleToCanvas(x = 0, y = 0, radius = 10) {
    const circle = new fabric.Circle({
      left: x,
      top: y,
      radius,
      strokeWidth: 6,
      stroke: '#000',
      fill: '#fff'
    })
    this.canvas.add(circle)
    return circle
  }


  createNewMap (elements: string[]) {
    this._lines = []
    const padding = 36
    let firstPoint: Point, secondPoint: Point|undefined = undefined

    for (let i = 0; i < elements.length-1; i++) {
      firstPoint = secondPoint || [randomNumber(padding, 640 - padding), randomNumber(padding, 640 - padding)]
      secondPoint = [randomNumber(padding, 640 - padding), randomNumber(padding, 640 - padding)]
      const line = [...firstPoint, ...secondPoint] as Line
      const Line = this.addLineToCanvas(line)
      Line.selectable = Line.evented = false
      this._lines.push(Line)
    }
    // add the circles
    let Circle, previousLine, nextLine
    for (let i = 0; i <= this._lines.length; i++) {
      previousLine = this._lines[i - 1]
      nextLine = this._lines[i]
      if (nextLine) {
        Circle = this.addCircleToCanvas(nextLine.x1, nextLine.y1)
      } else {
        // final circle
        Circle = this.addCircleToCanvas(previousLine.x2, previousLine.y2)
      }
      Circle.hasControls = Circle.hasBorders = false
      if (previousLine) { // first point
        Circle.line1 = previousLine
      }
      if (nextLine) {
        Circle.line2 = nextLine
      }
      // add the text
      Circle.Text = this.addTextToCanvas(Circle.left, Circle.top, elements[i])
      Circle.element = elements[i]
    }
  }

  addTextToCanvas(x = 0, y = 0, text: string = 'text', color = '#000') {
    const itext = new fabric.IText(text, { left: x, top: y,
      fontFamily: 'Noto Serif JP',
      fontWeight: 'bold',
      fill: color
    })
    this.canvas.add(itext)
    itext.setCoords()
    return itext
  }

  changeDescription (description, fontFamily = 'Arial') {
    this.descriptionBox.text = description
    if (fontFamily) {
      this.descriptionBox.set({'fontFamily': fontFamily, fontWeight: 'normal'})
    }
    this.canvas.renderAll()
    this.descriptionBox.setCoords()
  }

  /** GETTERS */
  get selection() {
    return this.canvas.getActiveObject()
  }

}