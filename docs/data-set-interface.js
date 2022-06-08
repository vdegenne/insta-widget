import {css, LitElement} from './app.js'

export class DataSetInterface extends LitElement {
  static properties = {
    blueprint: { type: Object },
    localStorageHandle: {}
  }

  _data = []
  _edited = null

  get dialog () { return this.shadowRoot.querySelector('mwc-dialog') }
  get editDialog () { return this.shadowRoot.querySelector('#editDialog') }

  get model () {
    const model = []
    // parsing
    for (const prop of this.blueprint) {
      const modelItem = {
        name: prop[0]
      }
      if (prop[1]) {
        modelItem.label = prop[1]
      }
      model.push(modelItem)
    }
    return model
  }

  static styles = css`
  mwc-textfield {
    display: block;
  }
  #elements {
    margin: 0 0 24px 0;
  }
  .element {
    display: flex;
    justify-content: space-between;
    align-items: center;
    /* padding: 12px; */
  }
  `
  render() {
    if (!this.blueprint) {
      return html`<span style="color:red">no blueprint defined</span>`
    }
    return html`
    <mwc-dialog heading=Data>
      <div id=elements>
      ${this._data.map(element=>{
        return html`
        <div class=element>
          <span>${element[this.model[0].name]}</span>
          <div>
            <mwc-icon-button icon=edit
              @click=${()=>{this.editElement(element)}}></mwc-icon-button>
            <mwc-icon-button icon=delete
              @click=${()=>{this.deleteElement(element)}}></mwc-icon-button>
          </div>
        </div>
        `
      })}
      </div>

      <mwc-button outlined @click=${()=>{
        this._edited = {}
        this.editDialog.show()
      }}>add element</mwc-button>

      <mwc-button unelevated slot="secondaryAction"
        @click=${()=>{this.submit()}}>submit</mwc-button>
      <mwc-button outlined slot="primaryAction" dialogAction="close">close</mwc-button>
    </mwc-dialog>


    <mwc-dialog id=editDialog heading=Edit>

      ${this.model.map(item => {
        return html`<mwc-textfield name=${item.name} label="${item.label || item.name}"></mwc-textfield>`
      })}
      <mwc-button outlined slot="secondaryAction" dialogAction="close">cancel</mwc-button>
      <mwc-button unelevated slot="primaryAction"
          @click=${()=>{this.submitEdit()}}>update</mwc-button>
    </mwc-dialog>
    `
  }

  firstUpdated() {
    this.loadData()
    this.dispatchEvent(new CustomEvent('load', { detail: this._data }))
    this.requestUpdate()
  }

  submit() {
    this.dispatchEvent(new CustomEvent('submit', {
      detail: this._data
    }))
  }

  submitEdit () {
    const form = this.editDialog
    const fields = [...form.querySelectorAll('mwc-textfield')]
    for (const field of fields) {
      this._edited[field.name] = field.value
      field.value = ''
    }
    this.editDialog.close()
    if (!this._data.includes(this._edited)) {
      this._data.push(this._edited)
    }
    this.requestUpdate()
    this.saveData()
  }

  editElement (element) {
    this._edited = element;
    const fields = this.editDialog.querySelectorAll('mwc-textfield')
    for (const field of fields) {
      field.value = this._edited[field.name]
    }
    this.editDialog.show()
  }

  deleteElement (element) {
    this._data.splice(this._data.indexOf(element), 1)
    this.requestUpdate()
    this.saveData()
  }

  show() {
    this.dialog.show()
  }


  loadData() {
    if (this.localStorageHandle == null) {
      console.warn('localStorageHandle were not defined. Data won\'t be saved')
    }
    let data = localStorage.getItem(this.localStorageHandle)
    if (data) {
      this._data = JSON.parse(data)
    }
    else {
      this._data = []
    }
  }

  saveData() {
    if (this.localStorageHandle == null) {
      console.warn('localStorageHandle were not defined. Can\'t save data')
      return
    }
    localStorage.setItem(this.localStorageHandle, JSON.stringify(this._data))
  }
}

window.customElements.define('data-set-interface', DataSetInterface);