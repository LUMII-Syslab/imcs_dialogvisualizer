import React from 'react';
import Component from "./Component.js";
import {Radio} from "@blueprintjs/core";

import measure from "./measure";

class RadioButton extends Component {
  constructor(props) {
    super(props);
    this.state.value = this.state.tree.selected?true:false;
  }

  getBounds() {
    let m = measure(this.myRef.current.parentElement);

    let retVal = super.getBounds();
    retVal.minimumWidth = m.w;
    
    retVal.minimumHeight = m.h;
    retVal.maximumHeight = m.h;
    return retVal;
  }

  setValue(value) { // will be called from the parent
    let oldValue = this.state.value;
    this.setState({value: value}, ()=>{
      if (oldValue !== value) {
        this.context.eventHandler({component:this.state.tree, eventName:"ChangeEvent", value:this.state.value})
        if (value)
          this.context.eventHandler({component:this.state.tree, eventName:"ClickEvent", value:this.state.value});
      }
    });
  }

  onChange() {
    let parent = this.context.reference2react[this.props.parentReference];
    if (parent && this.myRef.current.checked) {
      parent.selectRadioButton(this);
    }
  }

  onFocus() {
    this.context.eventHandler({component:this.state.tree, eventName:"FocusGainedEvent", value:this.state.value});
  }

  onBlur() {
    this.context.eventHandler({component:this.state.tree, eventName:"FocusLostEvent", value:this.state.value});
  }

  render() {
    return (
      <Radio inputRef={this.myRef} style={{marginBottom:0, ...this.state.style}} disabled={!this.state.enabled || this.state.readOnly} checked={this.state.value} label={this.state.tree.caption} onFocus={(e)=>{this.onFocus()}} onBlur={(e)=>{this.onBlur()}} value={"radiobutton_"+this.state.reference}
        onChange={(e)=>{this.onChange()}}
      />

    );
  }
}

export default RadioButton;

