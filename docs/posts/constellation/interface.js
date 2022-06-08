import {LitElement, html} from '../../app.js'
import '../../data-set-interface.js'

class PostElement extends LitElement {
  index = -1
  elements = []

  get constellation () { return this.shadowRoot.querySelector('constellation-element'); }
  get dataSetInterface () { return this.shadowRoot.querySelector('data-set-interface'); }

  render() {
    return html`
    <constellation-element
      highlightColor="#e91e63"
    ></constellation-element>
    <mwc-icon-button icon=settings
      @click=${()=>{this.dataSetInterface.show()}}></mwc-icon-button>
    <mwc-icon-button icon=arrow_backward @click=${()=>{this.onArrowBackwardClick()}}></mwc-icon-button>
    <mwc-icon-button icon=arrow_forward @click=${()=>{this.onArrowForwardClick()}}></mwc-icon-button>
    <data-set-interface
      blueprint='[["word"], ["hiragana"]]'
      localStorageHandle="insta-widget:constellation"
      @load=${(e)=>{const detail = e.detail; setTimeout((e)=>this.updateConstellation(detail), 500)}}
      @submit=${(e)=>{this.updateConstellation(e.detail)}}></data-set-interface>
    `
  }

  updateConstellation(elements) {
    this.constellation.createNewMap(elements.map(el=>el.word))
    this.elements = elements
  }

  onArrowForwardClick() {
    this.index++;
    this.constellation.highlightPoint(this.index)
    // try {
      this.constellation.setDescription(this.elements[this.index]?.hiragana || '')
    // } catch (e) {}
  }
  onArrowBackwardClick() {
    this.index--;
    this.constellation.highlightPoint(this.index)
    // try {
      this.constellation.setDescription(this.elements[this.index]?.hiragana || '')
    // } catch (e) {}
  }
}

window.customElements.define('post-element', PostElement)