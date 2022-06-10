import {LitElement, html, playJapanese} from '../../app.js'
import '../../data-set-interface.js'

class PostElement extends LitElement {
  index = -1
  elements = []
  backgroundColor = '#fff'
  textColor = '#00f'

  get constellation () { return this.shadowRoot.querySelector('constellation-element'); }
  get dataSetInterface () { return this.shadowRoot.querySelector('data-set-interface'); }

  render() {
    return html`
    <div style="position: relative;">
      <div style="position: absolute;bottom:0;left:0;z-index:999;color:white">@chikojap</div>
      <constellation-element
        backgroundColor=${this.backgroundColor}
        textColor=${this.textColor}
        lineColor=${this.textColor}
        highlightColor="orange"
      ></constellation-element>
    </div>
    <mwc-icon-button icon=settings
      @click=${()=>{this.dataSetInterface.show()}}></mwc-icon-button>
    <mwc-icon-button icon=casino @click=${()=>{this.updateConstellation(this.elements)}}></mwc-icon-button>
    <mwc-icon-button icon=volume_up @click=${()=>{this.playAudio()}}></mwc-icon-button>
    <mwc-icon-button icon=arrow_backward @click=${()=>{this.onArrowBackwardClick()}}></mwc-icon-button>
    <mwc-icon-button icon=arrow_forward @click=${()=>{this.onArrowForwardClick()}}></mwc-icon-button>
    <mwc-icon-button icon=save @click=${()=>{this.saveToPng()}}></mwc-icon-button>
    <div style="text-align: center">
    <hex-color-picker style="display: inline-flex;max-height:100px"
        color="${this.backgroundColor}"
        @color-changed=${e=>this.constellation.backgroundColor=e.detail.value}></hex-color-picker>
    <hex-color-picker style="display: inline-flex;max-height:100px"
        color="${this.textColor}"
        @color-changed=${e=>{
          this.constellation.textColor=e.detail.value;
          this.constellation.lineColor=e.detail.value
        }}></hex-color-picker>
    </div>
    <data-set-interface
      blueprint='[["word"], ["hiragana"], ["meaning"]]'
      localStorageHandle="insta-widget:constellation"
      @load=${(e)=>{const detail = e.detail; setTimeout((e)=>this.updateConstellation(detail), 500)}}
      @submit=${(e)=>{this.updateConstellation(e.detail)}}></data-set-interface>
    `
  }

  firstUpdated () {
    window.addEventListener('keydown', e=> {
      if (e.composedPath()[0].nodeName == 'INPUT') { return }
      // console.log(e)
      if (e.code == 'KeyA') {
        e.preventDefault()
        this.onArrowBackwardClick()
      }
      if (e.code == 'KeyD') {
        e.preventDefault()
        this.onArrowForwardClick()
      }
      if (e.code == 'KeyS') {
        e.preventDefault()
        this.playAudio()
      }
    })
  }

  playAudio () {
    const element = this.elements[this.index]
    if (element) {
      playJapanese(element.hiragana)
    }
  }

  saveToPng () {
    this.constellation.saveToPng()
  }

  updateConstellation(elements) {
    this.index = -1
    this.constellation.createNewMap(elements.map(el=>el.word))
    this.elements = elements
  }

  onArrowForwardClick() {
    this.index++;
    this.constellation.highlightPoint(this.index)
    // try {
      const element = this.elements[this.index]
      this.constellation.setDescription(element ? `${element.hiragana}\n${element.meaning}` : '')
    // } catch (e) {}
  }
  onArrowBackwardClick() {
    this.index--;
    this.constellation.highlightPoint(this.index)
    // try {
      const element = this.elements[this.index]
      this.constellation.setDescription(element ? `${element.hiragana}\n${element.meaning}` : '')
    // } catch (e) {}
  }
}

window.customElements.define('post-element', PostElement)