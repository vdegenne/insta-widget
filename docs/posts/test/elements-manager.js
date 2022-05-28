import { html, LitElement, css } from '../../app.js'

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
          <span>${el.w}/${el.s}/${el.m}</span>
          <mwc-icon-button icon=delete
            @click=${()=>{this.onDeleteButtonClick(i)}}></mwc-icon-button>
        </div>
        `
      })}

      <mwc-button unelevated slot=secondaryAction icon=add
          @click=${()=>{this.createElementDialog.show()}}>element</mwc-button>
      <mwc-button outlined slot=secondaryAction dialogAction=close>close</mwc-button>
    </mwc-dialog>

    <mwc-dialog heading="Create Element">

      <mwc-textfield outlined id=w label="word" @keyup=${()=>{this.onTextFieldKeyPress()}}></mwc-textfield>
      <mwc-textfield outlined id=s label="secondary" @keyup=${()=>{this.onTextFieldKeyPress()}}></mwc-textfield>
      <mwc-textfield outlined id=m label="meaning" @keyup=${()=>{this.onTextFieldKeyPress()}}></mwc-textfield>
      <mwc-textfield outlined id=i label="image (url)" @keyup=${()=>{this.onTextFieldKeyPress()}}></mwc-textfield>

      <mwc-button outlined slot=secondaryAction dialogAction=close>close</mwc-button>
      <mwc-button unelevated slot=primaryAction icon=add
        @click=${()=>{this.submit()}}>add</mwc-button>
    </mwc-dialog>
    `
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
    const inputs = this.dialog.querySelectorAll('[id]')
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
}

window.customElements.define('elements-manager', ElementsManager)