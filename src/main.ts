import {LitElement, html, css, PropertyValues} from 'lit'
import { customElement, query, state } from 'lit/decorators.js'
import { styleMap} from 'lit/directives/style-map.js'
import {unsafeHTML} from 'lit/directives/unsafe-html.js'
import '@material/mwc-snackbar'
import '@material/mwc-button'
import '@material/mwc-tab-bar'
import '@material/mwc-textarea'
import '@material/mwc-slider'
import '@material/mwc-textfield'
import {TextArea} from "@material/mwc-textarea";
import {hasJapanese} from 'asian-regexps'
import html2canvas from 'html2canvas'
import {Slider} from "@material/mwc-slider";
import 'vanilla-colorful'
import { DesignStructure } from './types'
import { convertTextToDesignStructure, DesignTemplate, play, playJapanese, playJapaneseAudio, saveFrame, sleep } from './util'
import { designStyles } from './styles/designStyles'
import './widget-span'
import './difference-widget'
import { globalStyles } from './styles/globalStyles'
import './widget-card'
import './widget-line'
import './widget-separator'
import './page-element'
import './jlpt-tag'
import './lofi-player'
// import '@material/mwc-icon-button'
// import '@material/mwc-dialog'
// import '@material/mwc-textfield'
// import '@material/mwc-checkbox'
import './posts/kaidan-nedan'
import { speakJapanese } from './speech'
import copyToClipboard from '@vdegenne/clipboard-copy'
import './constellation/constellation-element'
import 'vanilla-colorful'

// @ts-ignore
window.html = html
export {html, LitElement, globalStyles, css}
export {sleep, play, playJapaneseAudio, speakJapanese, playJapanese, copyToClipboard, saveFrame, html2canvas, styleMap}

declare global {
  interface Window {
    app: AppContainer;
    toast: (labelText: string, timeoutMs?: number) => void;
  }
}

const views = ['text', 'size', 'back', 'front', 'save'] as const
declare type View = typeof views[number]

@customElement('app-container')
export class AppContainer extends LitElement {

  @state() view: View = 'text';
  @state() text = ''
  @state() fontSize = 34
  @state() padding = 35
  @state() backColor = '#000000'
  @state() frontColor = '#ffffff'
  private data: any = null

  @query('#canvas') canvasElement!: HTMLDivElement;
  @query('mwc-textarea') textarea!: TextArea;

  static styles = [globalStyles, designStyles, css`
    :host {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      height: 100vh;
    }
    #stamp {
      position: absolute;
      bottom: 0;
      right: 0;
      font-size: 18px;
      opacity: 0.5;
    }

    #controls {
      width: 100%;
      flex: 1;
      //overflow: hidden;
    }
    .control-box {
      display: none;
    }
    .control-box[selected] {
      display: flex;
      height: 100%;
    }

    :host([lang=japanese]) #canvas > span {
      font-family: 'Noto Serif JP', serif;
      position: relative;
      top: -16px;
    }

    hex-color-picker {
      width: 100%;
      height: 100%;
      padding: 12px;
      box-sizing: border-box;
    }
  `]

  render () {
    if (hasJapanese(this.text)) {
      this.setAttribute('lang', 'japanese')
    }
    else {
      this.removeAttribute('lang')
    }

    const structure = convertTextToDesignStructure(this.text)

    return html`
      <style>
        :host {
          --front-color: ${this.frontColor};
        }
        #canvas {
            background-color: ${this.backColor};
            color: ${this.frontColor};
            font-size: ${this.fontSize}px;
        }
        #canvas > page-element {
          padding: ${this.padding}px;
        }
      </style>

      <!-- EVAL -->
      ${eval('html`' + this.text + '`')}


      <mwc-tab-bar activeIndex=${views.indexOf(this.view)} style="width: 100%"
          @MDCTabBar:activated="${e=> {this.onMDCTabBarActivate(e)}}">
          <mwc-tab icon="text_format"></mwc-tab>
          <mwc-tab icon="straighten"></mwc-tab>
          <mwc-tab icon="flip_to_back"></mwc-tab>
          <mwc-tab icon="flip_to_front"></mwc-tab>
          <mwc-tab icon="save"></mwc-tab>
      </mwc-tab-bar>

        <div id="controls">
            <div class="control-box" ?selected="${this.view == 'text'}">
                <mwc-textarea style="width:100%;height:100%"
                    @keyup="${()=>this.text=this.textarea.value}" value="${this.text}"></mwc-textarea>
            </div>
            <div class="control-box" ?selected="${this.view == 'size'}" style="flex-direction:column">
                <mwc-slider
                        discrete
                        min="12"
                        max="500"
                        step="1"
                        value="${this.fontSize}"
                        @input="${e=> this.fontSize=e.detail.value}"
                        style="margin: 48px 0;width:100%"
                ></mwc-slider>
                <mwc-slider
                        discrete
                        min="0"
                        max="100"
                        step="1"
                        value="${this.padding}"
                        @input="${e=> this.padding=e.detail.value}"
                        style="margin: 48px 0;width:100%"
                ></mwc-slider>
            </div>
            <!-- background color -->
            <div class="control-box" ?selected="${this.view == 'back'}">
                <hex-color-picker
                        color=${this.backColor}
                        @color-changed=${e=> {this.backColor = e.detail.value}}
                        style="width:100%;height:100%;"
                ></hex-color-picker>
            </div>
            <!-- text color -->
            <div class="control-box" ?selected="${this.view == 'front'}">
                <hex-color-picker
                        color="${this.frontColor}"
                        @color-changed="${e=> this.frontColor=e.detail.value}"
                        style="width:100%;height:100%;"
                ></hex-color-picker>
            </div>
            <div class="control-box" ?selected="${this.view == 'save'}" style="justify-content: center;align-items: center">
              <div>
                <mwc-button raised
                    @click=${()=>{saveFrame(this.canvasElement)}}>save</mwc-button>
                <mwc-button raised
                    @click=${()=>{this.operate()}}>operate</mwc-button>
              </div>
            </div>
        </div>
    `

    return html`


        <div id="canvas">
        <div id=stamp>@chikojap</div>
        </div>
        <!-- ${DesignTemplate(structure)}</div> -->


    `
  }

  protected firstUpdated(_changedProperties: PropertyValues) {
    window.addEventListener('resize', this.onResize.bind(this))

    // load save version text
    const text = localStorage.getItem('japanese-difference:text')
    if (text) {
      this.text = text
    }
    let options: any = localStorage.getItem('japanese-difference:options')
    if (options !== null) {
      options = JSON.parse(options)
      this.fontSize = options.size
      this.padding = options.padding
      this.text = options.text
      this.backColor = options.backColor
      this.frontColor = options.frontColor
      this.view = options.view
    }


    this._firstUpdated = true
    // super.firstUpdated(_changedProperties);
  }

  private _firstUpdated = true
  protected updated(_changedProperties: PropertyValues) {
    this.onResize()
    if (!this._firstUpdated) {
      if (_changedProperties.has('text')) {
        if (this.text)
          localStorage.setItem('japanese-difference:text', this.text)
      }
      this.saveOptions()
    }
    else {
      this._firstUpdated = false
    }
    // console.log(_changedProperties)
    // super.updated(_changedProperties);
  }

  async onMDCTabBarActivate (e) {
    this.view=views[e.detail.index]
    await this.requestUpdate()
    if (views[e.detail.index]=='size') {
      this.shadowRoot!.querySelectorAll('mwc-slider').forEach(el=>el.layout())
    }
  }

  onResize () {
    try {
      const canvasStyles = window.getComputedStyle(this.canvasElement)
      this.canvasElement.style.height = `${~~parseInt(canvasStyles.width)}px`
    } catch (e) {}
  }


  saveOptions () {
    localStorage.setItem('japanese-difference:options', JSON.stringify({
      text: this.text,
      size: this.fontSize,
      backColor: this.backColor,
      frontColor: this.frontColor,
      padding: this.padding,
      view: this.view,
    }))
  }

  async operate() {
    const operableElements = [...this.shadowRoot!.querySelectorAll<any>('*')].filter(el=>el.operate);
    for (const el of operableElements) {
      await el.operate()
    }
  }
}
