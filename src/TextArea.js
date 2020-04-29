import React from 'react';
import {TextArea as BPTextArea} from "@blueprintjs/core";
import Component from "./Component";
import measure from "./measure";

class TextArea extends Component {
  constructor(props) {
    super(props);

    this.state.value = this.state.tree.text?this.state.tree.text:"";

    this.areaRef = React.createRef();
  }

  componentDidMount() {
    super.componentDidMount();
    this.areaRef.current.internalTextAreaRef.style.resize = "none";
  }

  getBounds() {
    let m = measure(this.myRef.current);

    return super.getBounds({
      minimumWidth: m.w,
//      preferredWidth: m.w,
      minimumHeight: m.h
    });
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
      <span ref={this.myRef} style={{display:"inline-block", ...this.state.style}}>
      <BPTextArea ref={this.areaRef} style={{width:"100%", height:"100%"}} value={this.state.value} wrap="off" disabled={!editable || !this.state.enabled} readOnly={this.state.readOnly} onFocus={(e)=>{this.onFocus()}} onBlur={(e)=>{this.onBlur()}} onChange={(e)=>{this.setState({value: this.areaRef.current.internalTextAreaRef.value}, ()=>{this.context.eventHandler({component:this.state.tree, eventName:"ChangeEvent", value:this.state.value})})}}/>

      </span>
    );
  }
}
export default TextArea;

