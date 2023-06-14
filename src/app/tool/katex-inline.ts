import {API, InlineTool} from "@editorjs/editorjs";

export default class KatexInline implements InlineTool {
  static get CSS() {
    return 'inline-katex';
  };

  api: API
  button!: HTMLButtonElement
  tag = 'SPAN'
  iconClasses!: {
    base: string,
    active: string
  }
  constructor({api}: {api: API}) {
    this.api = api;
    this.iconClasses = {
      base: this.api.styles.inlineToolButton,
      active: this.api.styles.inlineToolButtonActive
    };
  }
  static get isInline() {
    return true;
  }
  render() {
    this.button = document.createElement('button');
    this.button.type = 'button';
    this.button.classList.add(this.iconClasses.base);
    this.button.innerHTML = 'K';

    return this.button;
  }
  surround(range: Range) {
    if (!range) {
      return;
    }

    let termWrapper = this.api.selection.findParentTag(this.tag, KatexInline.CSS);

    if (termWrapper) {
      this.unwrap(termWrapper);
    } else {
      this.wrap(range);
    }
  }

  wrap(range: Range) {
    let marker = document.createElement(this.tag);

    marker.classList.add(KatexInline.CSS);
    marker.appendChild(range.extractContents());
    range.insertNode(marker);
    this.api.selection.expandToTag(marker);
  }
  unwrap(termWrapper: HTMLElement) {
    this.api.selection.expandToTag(termWrapper);

    let sel = window.getSelection()!;
    let range = sel.getRangeAt(0);

    let unwrappedContent = range.extractContents();
    termWrapper.parentNode!.removeChild(termWrapper);
    range.insertNode(unwrappedContent);
    sel.removeAllRanges();
    sel.addRange(range);
  }

  checkState() {
    const termTag = this.api.selection.findParentTag(this.tag, KatexInline.CSS);

    this.button.classList.toggle(this.iconClasses.active, !!termTag);
    return !!termTag
  }

  static get sanitize() {
    return {
      span: {
        class: KatexInline.CSS
      }
    };
  }
}
