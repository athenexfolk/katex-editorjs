import {Component, OnInit} from '@angular/core';
import EditorJS from "@editorjs/editorjs";
import KatexEquation from "./tool/katex-equation";
import KatexInline from "./tool/katex-inline";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'editor-tool';
  code: string = ''

  editor!: EditorJS

  save() {
    this.editor.save().then(r=>{
      this.code = JSON.stringify(r, null, 4)
    })
  }

  ngOnInit() {
    this.editor = new EditorJS(
      {
        holder: "editorjs",
        tools: {
          katex: KatexEquation,
          katexInline: {
            class: KatexInline,
            shortcut: 'CMD+M'
          }
        }
      }
    )
  }
}
