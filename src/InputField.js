import React from 'react';
import Component from "./Component";
import {InputGroup} from "@blueprintjs/core";
import measure from "./measure";

class InputField extends Component {

  constructor(props) {
    super(props);
    this.state.value = this.state.tree.text?this.state.tree.text:"";

    this.inputRef = React.createRef();
  }

  getBounds() {

    let m = measure(this.myRef.current);

    let bounds = super.getBounds({
      minimumHeight: m.h,
      maximumHeight: m.h
    });

    if (!bounds.minimumWidth)
      bounds.minimumWidth = 30;

    return bounds;
  }

  onFocus() {
    this.context.eventHandler({component:this.state.tree, eventName:"FocusGainedEvent", value:this.state.value});
  }

  onBlur() {
    this.context.eventHandler({component:this.state.tree, eventName:"FocusLostEvent", value:this.state.value});
  }

  render() {
    let editable = typeof(this.state.tree.editable)==="undefined" || this.state.tree.editable;
    return (
      <span ref={this.myRef} style={this.state.style}>
        <InputGroup inputRef={this.inputRef} value={this.state.value} disabled={!editable || !this.state.enabled} readOnly={this.state.readOnly} onFocus={(e)=>{this.onFocus()}} onBlur={(e)=>{this.onBlur()}} onChange={(e)=>{this.setState({value: this.inputRef.current.value}, ()=>{this.context.eventHandler({component:this.state.tree, eventName:"ChangeEvent", value:this.state.value})})}}/>
      </span>
      );
  }
}
export default InputField;

