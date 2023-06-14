import {API, BlockTool} from "@editorjs/editorjs";
import katex from "katex";

interface KatexData {
  text: string
}

export default class KatexEquation implements BlockTool {

  _data: KatexData = {
    text: ''
  }
  api: API
  readOnly: boolean
  _CSS: {
    block: string,
    wrapper: string,
    display: string,
    input: string
  }

  _wrapperElement!: HTMLDivElement
  _displayElement!: HTMLDivElement
  _inputElement!: HTMLDivElement

  constructor({data, api, readOnly}: {data: KatexData, api: API, readOnly: boolean}) {
    this.api = api;
    this.readOnly = readOnly;

    this._CSS = {
      block: this.api.styles.block,
      wrapper: 'katex-wrapper',
      display: 'katex-e-display',
      input: this.api.styles.input
    };

    if (!this.readOnly) {
      this.onKeyUp = this.onKeyUp.bind(this);
    }

    if(data.text) {
      this._data = data
    }

    this._wrapperElement = this.drawView();
  }
  onKeyUp(e: KeyboardEvent) {
    let {textContent} = this._inputElement
    let renderText = textContent ? this.data.text : 'Empty Expression'
    this.renderKatex(renderText, this._displayElement)
  }

  drawView(): HTMLDivElement {

    this._wrapperElement = document.createElement('div')
    this._displayElement = document.createElement('div')
    this._inputElement = document.createElement('div')

    this._wrapperElement.classList.add(this._CSS.block, this._CSS.wrapper);
    this._displayElement.classList.add(this._CSS.display)
    this._inputElement.classList.add(this._CSS.input)

    this._wrapperElement.appendChild(this._displayElement)
    this._wrapperElement.appendChild(this._inputElement)

    if (!this.readOnly) {
      this._inputElement.contentEditable = String(true);
      this._inputElement.classList.remove('hide')
      this._inputElement.addEventListener('keyup', this.onKeyUp)
    } else {
      this._inputElement.contentEditable = String(false);
      this._inputElement.classList.add('hide')
    }

    this.insertEquation()

    return this._wrapperElement;
  }

  insertEquation() {
    let inputData = this.data.text.length ? this.data.text : 'Empty Equation'
    this._inputElement.innerHTML = this.data.text
    this.renderKatex(inputData, this._displayElement)
  }

  renderKatex(data: string, element: HTMLElement) {
    katex.render(data, element, {
      throwOnError: false,
      output: 'html',
      displayMode: true
    })
  }

  render() {
    return this._wrapperElement;
  }

  validate(savedData: KatexData) {
    if (savedData.text.trim() === '') {
      return false;
    }

    return true;
  }

  save() {
    return {
      text: this._inputElement.innerHTML
    };
  }

  static get conversionConfig() {
    return {
      export: 'text', // to convert Paragraph to other block, use 'text' property of saved data
      import: 'text' // to covert other block's exported string to Paragraph, fill 'text' property of tool data
    };
  }

  static get isReadOnlySupported() {
    return true;
  }

  get data() {
    let text = this._inputElement.innerHTML;

    this._data.text = text;

    return this._data;
  }

  set data(data) {
    this._data = data || {};

    this._inputElement.innerHTML = this._data.text || '';
  }

  static get toolbox() {
    return {
      icon: 'K',
      title: 'Katex'
    };
  }
}
