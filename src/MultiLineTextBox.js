import React from 'react';
import { TextArea as BPTextArea } from "@blueprintjs/core";
import Component from "./Component";
import measure from "./measure";

class MultiLineTextBox extends Component {

  constructor(props) {
    super(props);

    this.cursorText = "[^%&£$!юёяšķē]";

    if (props.tree.textLine) {
      this.state.value = props.tree.textLine.map((line) => line.text).join("\n");
    }
    else
      this.state.value = this.state.tree.text;

    if (!this.state.value)
      this.state.value = "";

    this.state.pos = this.state.value.length;

    let currentLineArr = props.tree.currentLine;
    if (!currentLineArr)
      currentLineArr = props.tree.current;
    if (props.tree.textLine && currentLineArr && currentLineArr.length) {
      let currentLine = currentLineArr[0];
      let valueWithCursor = props.tree.textLine.map((line) => line.reference === currentLine.reference ? line.text + this.cursorText : line.text).join("\n");
      let i = valueWithCursor.indexOf(this.cursorText);
      if (i >= 0)
        this.state.pos = i;
    }

    this.areaRef = React.createRef();

    // TODO: current line + focus
    // https://stackoverflow.com/questions/499126/jquery-set-cursor-position-in-text-area
  }

  setSelectionRange(input, selectionStart, selectionEnd) {
    if (input.setSelectionRange) {
      input.focus();
      input.setSelectionRange(selectionStart, selectionEnd);
    }
    else if (input.createTextRange) {
      var range = input.createTextRange();
      range.collapse(true);
      range.moveEnd('character', selectionEnd);
      range.moveStart('character', selectionStart);
      range.select();
    }
  }

  getCaretPosition(input) {
    var retVal = 0;
    if (document.selection) {
      input.focus();
      var range = document.selection.createRange();
      range.moveStart('character', -input.value.length);
      retVal = range.text.length;
    }
    else if (input.selectionStart || input.selectionStart === '0')
      retVal = input.selectionDirection === 'backward' ? input.selectionStart : input.selectionEnd;
    return retVal;
  }

  componentDidMount() {
    super.componentDidMount();
    this.areaRef.current.internalTextAreaRef.style.resize = "none";
    this.setSelectionRange(this.areaRef.current.internalTextAreaRef, this.state.pos, this.state.pos);
  }

  getBounds() {
    let m = measure(this.myRef.current);

    return super.getBounds({
      minimumWidth: m.w,
      preferredWidth: m.w,
      minimumHeight: m.h
    });
  }

  getCurrentLine() {
    let pos = this.getCaretPosition(this.areaRef.current.internalTextAreaRef);
    let valueWithCursor = this.state.value.substring(0, pos) + this.cursorText + this.state.value.substring(pos);
    let arr = valueWithCursor.split("\n");
    let currentLine = arr.length - 1; // the last line
    if (currentLine < 0)
      currentLine = 0;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].indexOf(this.cursorText) >= 0) {
        currentLine = i;
        break;
      }
    }

    return currentLine;
  }

  onChange() {
    this.setState({ value: this.areaRef.current.internalTextAreaRef.value }, () => {
      this.context.eventHandler({ component: this.state.tree, eventName: "MultiLineTextBoxChangeEvent", value: this.state.value, position: this.getCaretPosition(this.areaRef.current.internalTextAreaRef), currentLine: this.getCurrentLine() })
    });

  }

  onFocus() {
    this.context.eventHandler({ component: this.state.tree, eventName: "FocusGainedEvent", value: this.state.value, currentLine: this.getCurrentLine() });
  }

  onBlur() {
    this.context.eventHandler({ component: this.state.tree, eventName: "FocusLostEvent", value: this.state.value, currentLine: this.getCurrentLine() });
  }

  render() {
    let editable = typeof (this.state.tree.editable) === "undefined" || this.state.tree.editable;
    return (
      <span ref={this.myRef} style={{ display: "inline-block", ...this.state.style }}>
        <BPTextArea ref={this.areaRef} value={this.state.value} wrap="off" disabled={!editable || !this.state.enabled} onFocus={(e) => { this.onFocus() }} onBlur={(e) => { this.onBlur() }} readOnly={this.state.readOnly}
          growVertically={false}
          onChange={(e) => { this.onChange() }} />

      </span>
    );
  }
}
export default MultiLineTextBox;

