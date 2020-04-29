import React from 'react';
import Component from "./Component";
import {Label as BPLabel} from "@blueprintjs/core";
import measure from "./measure";

class Label extends Component {

  constructor(props) {
    super(props)
    this.state.style.display = "inline-block";
  }

  getBounds() {
    let m = measure(this.myRef.current);

    return super.getBounds({
      minimumWidth: m.w,
      maximumWidth: m.w,
      minimumHeight: m.h,
      maximumHeight: m.h
    });
  }

  render() {
    return (
      <span ref={this.myRef} style={{display:"inline-block", ...this.state.style}}>
        <BPLabel style={{display:"inline-block",marginTop:"12px",whiteSpace: "nowrap"}}>{this.state.tree.caption}</BPLabel>
      </span>
    );
  }
}
export default Label;

