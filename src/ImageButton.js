import React from 'react';
import Component from "./Component.js";
import {Button as BPButton} from "@blueprintjs/core";
import measure from "./measure";


class ImageButton extends Component {

  constructor(props) {
    super(props);

    this.picturesPath = props.picturesPath;
    if (!this.picturesPath) {
      this.picturesPath = this.state.tree.picturesPath;
    }
    if (!this.picturesPath) {
      let i = document.location.pathname.lastIndexOf("/");
      if (i>=0) {
        this.picturesPath = document.location.pathname.substring(0, i+1)+"Pictures/";        
      }
      else
        this.picturesPath = "/Pictures/";
    }
    
    let fileName = this.state.tree.fileName;
    if (!fileName)
      fileName = "";
    fileName = fileName.split("\\").join("/");
    let i = fileName.lastIndexOf("/");
    if (i>=0)
      fileName = fileName.substring(i+1);

    this.state.fileName = this.picturesPath+fileName;

  }

  getBounds() {

    let m = measure(this.myRef.current.buttonRef);
    m.w++; // add 1 pixel to ensure the label fits

    //m.w=150;
    //m.h=150;

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
  }


  render() {
    return (
      <BPButton ref={this.myRef} style={this.state.style} disabled={!this.state.enabled} onClick={(e)=>{this.onClick()}} >
        <img alt={this.state.fileName} style={{width:"100%", height:"auto"}} src={this.state.fileName}/>
      </BPButton>
    );
  }
}

export default ImageButton;

