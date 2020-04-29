import React from 'react';
import Component from "./Component.js";
import {Checkbox as BPCheckBox} from "@blueprintjs/core";
import measure from "./measure";

class CheckBox extends Component {
  constructor(props) {
    super(props);
    this.state.value = this.state.tree.checked?true:false;
  }

  getBounds() {

    let m = measure(this.myRef.current.input.parentElement);

    let retVal = super.getBounds({});
    retVal.minimumWidth = m.w;
    retVal.minimumHeight = m.h;
    retVal.maximumHeight = m.h;
    return retVal;
  }

  onChange() {

    this.setState({value: this.myRef.current.input.checked}, ()=>{
      this.context.eventHandler({component:this.state.tree, eventName:"ChangeEvent", value:this.state.value})
    });

  }

  onFocus() {
    this.context.eventHandler({component:this.state.tree, eventName:"FocusGainedEvent", value:this.state.value});
  }

  onBlur() {
    this.context.eventHandler({component:this.state.tree, eventName:"FocusLostEvent", value:this.state.value});
  }

  render() {
    return (
      <BPCheckBox ref={this.myRef} style={{marginBottom:0, ...this.state.style}} disabled={!this.state.enabled || this.state.readOnly} checked={this.state.value} label={this.state.tree.caption} onFocus={(e)=>{this.onFocus()}} onBlur={(e)=>{this.onBlur()}} onChange={(e)=>{this.onChange()}} />

    );
  }
}

export default CheckBox;

