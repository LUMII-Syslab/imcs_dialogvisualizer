import React from 'react';
import Component from "./Component.js";
import {Button as BPButton} from "@blueprintjs/core";
import measure from "./measure";

class Button extends Component {


  constructor(props) {
    super(props);

    this.state.caption = this.state.tree.caption;

    // handling the case when we are inside a VTable cell...
    if (this.state.tree.value)
      this.state.caption = this.state.tree.value;
    if (this.state.tree.component && this.state.tree.component.length>0 && this.state.tree.component[0].caption)
      this.state.caption = this.state.tree.component[0].caption;

    this.inputRef = React.createRef();
  }

  getBounds() {

    let m = measure(this.myRef.current.buttonRef);
    m.w++; // add 1 pixel to ensure the label fits

    return super.getBounds({
      minimumWidth: m.w,
//      preferredWidth: 0,
      maximumWidth: m.w,
      minimumHeight: m.h,
      maximumHeight: m.h
    });
  }

  onClick() {
    this.context.eventHandler({component:this.state.tree, eventName:"ClickEvent"});
    if (this.state.tree.closeOnClick) {

      let child = this;
      let parent = null;
      for (;;) {
        parent = this.context.reference2react[child.props.parentReference];
        if (!parent)
          break;
        child = parent;
      }

      let form = child;
      if (form.close)
        form.close();

    }

  }

  render() {
    return (
      <BPButton ref={this.myRef} style={this.state.style} disabled={!this.state.enabled} onClick={(e)=>{this.onClick()}}>{this.state.caption}</BPButton>
    );
  }
}

export default Button;

