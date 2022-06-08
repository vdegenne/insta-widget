import { html, LitElement, css, copyToClipboard } from '../../app.js'
import { googleImageSearch } from '../../util.js'

export class ElementsManager extends LitElement {
  static properties = {
    elements: { type: Array }
  }

  constructor () {
    super()
    this.elements= []
    this.loadLocalStorage()
  }

  get dialog () { return this.shadowRoot.querySelector('mwc-dialog') }
  get createElementDialog () { return this.shadowRoot.querySelector('mwc-dialog[heading="Create Element"]') }

  static styles = css`
  mwc-textfield {
    width: 100%;
    margin: 12px 0;
  }
  `

  render() {
    return html`
    <mwc-dialog heading=Elements>
      ${this.elements.map((el,i)=> {
        return html`
        <div class="element" style="display:flex;align-items:center;justify-content:space-between;padding:12px 0;font-size:1.4em">
          <span @click=${()=>{this.onElementClick(el)}}>${el.w}/${el.s}/${el.m}/${el.j}</span>
          <div style="white-space:nowrap">
            <mwc-icon-button icon=arrow_upward
              @click=${()=>{this.onArrowUpwardClick(i)}}></mwc-icon-button>
            <mwc-icon-button icon=arrow_downward
              @click=${()=>{this.onArrowDownwardClick(i)}}></mwc-icon-button>
            <mwc-icon-button icon=delete
              @click=${()=>{this.onDeleteButtonClick(i)}}></mwc-icon-button>
          </div>
        </div>
        `
      })}

      <mwc-button outlined slot="secondaryAction" icon="copy_all"
          @click=${()=>{copyToClipboard(JSON.stringify(this.elements))}}>data</mwc-button>
      <mwc-button outlined slot=secondaryAction icon="copy_all"
        @click=${()=>{this.copyInstaDescription()}}>insta</mwc-button>
      <mwc-button unelevated slot=secondaryAction icon=add
          @click=${()=>{this.createElementDialog.show()}}>element</mwc-button>
      <mwc-button outlined slot=secondaryAction dialogAction=close>close</mwc-button>
    </mwc-dialog>


    <mwc-dialog heading="Create Element">
      <mwc-textfield outlined id=w label="word" @keyup=${()=>{this.onTextFieldKeyPress()}}></mwc-textfield>
      <mwc-textfield outlined id=s label="secondary" @keyup=${()=>{this.onTextFieldKeyPress()}}></mwc-textfield>
      <mwc-textfield outlined id=m label="meaning" @keyup=${()=>{this.onTextFieldKeyPress()}}></mwc-textfield>
      <mwc-textfield outlined id=j label="jlpt" @keyup=${()=>{this.onTextFieldKeyPress()}}></mwc-textfield>
      <mwc-textfield outlined id=i label="image (url)" @keyup=${()=>{this.onTextFieldKeyPress()}}></mwc-textfield>

      <mwc-button outlined slot=secondaryAction icon=travel_explore
        @click=${()=>{googleImageSearch(this.shadowRoot.querySelector('#w').value)}}>search</mwc-button>
      <mwc-button outlined slot=secondaryAction dialogAction=close>close</mwc-button>
      <mwc-button unelevated slot=primaryAction icon=add
        @click=${()=>{this.submit()}}>add</mwc-button>
    </mwc-dialog>
    `
  }

  onElementClick (element) {
    const input = prompt('change info', `${element.w}/${element.s}/${element.m}/${element.j}`)
    if (input) {
      const [w, s, m, j] = input.split('/')
      element.w = w
      element.s = s
      element.m = m
      element.j = j
      console.log(element)
    }

    this.saveLocalStorage()
    this.requestUpdate()
  }

  onArrowUpwardClick (index) {
    if (index == 0) return
    const downElement = this.elements[index - 1]
    this.elements[index - 1] = this.elements[index]
    this.elements[index] = downElement
    this.requestUpdate()
    this.saveLocalStorage()
    this.dispatchEvent(new CustomEvent('submit'))
  }
  onArrowDownwardClick (index) {
    if (index + 1 == this.elements.length) return
    const upElement = this.elements[index + 1]
    this.elements[index + 1] = this.elements[index]
    this.elements[index] = upElement
    this.requestUpdate()
    this.saveLocalStorage()
    this.dispatchEvent(new CustomEvent('submit'))
  }

  onTextFieldKeyPress () {
    this.requestUpdate()
  }

  async submit () {
    const inputs = this.createElementDialog.querySelectorAll('[id]')
    const object = {}
    for (const inputEl of inputs) {
      object[inputEl.id] = inputEl.value
    }

    this.createElementDialog.close()
    await this.createElementDialog.updateComplete
    this.reset()
    this.elements.push(object)
    this.saveLocalStorage()
    this.requestUpdate()

    this.dispatchEvent(new CustomEvent('submit', {
      detail: object
    }))
  }
  onDeleteButtonClick (index) {
    this.elements.splice(index,1);this.requestUpdate();this.saveLocalStorage()
    this.dispatchEvent(new CustomEvent('submit'))
  }

  show () {
    this.dialog.show()
  }

  reset () {
    const inputs = this.createElementDialog.querySelectorAll('[id]')
    inputs.forEach(el=>el.value = '')
  }

  loadLocalStorage () {
    let payload = localStorage.getItem('insta-widget:elements')
    if (payload) {
      payload = JSON.parse(payload)
      this.elements = payload
    }
  }

  saveLocalStorage () {
    localStorage.setItem('insta-widget:elements', JSON.stringify(this.elements))
  }

  copyInstaDescription () {
    const content = `${this.elements.map(el=>`${el.w} (${el.s}) : ${el.m}`).join('\n')}

#learnjapanese #japanesestudy #studyjapan #japanesestudying #studyjapanese #learningjapanese #learnjapaneseonline #japaneseonline #practicejapanese #japaneselearning #japaneselesson #japaneselessons #japaneseclass #japaneselanguageteacher #jlpt #jlptn1 #jlptn2 #jlptn3 #jlptn4 #jlptn5 #jlpt1 #jlpt2 #jlpt3 #jlpt4 #jlpt5 #japanesetest`
    copyToClipboard(content)
  }
}

window.customElements.define('elements-manager', ElementsManager)