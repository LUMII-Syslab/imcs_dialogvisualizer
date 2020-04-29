import React from 'react';
import Component from "./Component.js";
import {Button as BPButton} from "@blueprintjs/core";
import measure from "./measure";

class Button extends Component {

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
      <BPButton ref={this.myRef} style={this.state.style} disabled={!this.state.enabled} onClick={(e)=>{this.onClick()}}>{this.state.tree.caption}</BPButton>
    );
  }
}

export default Button;

