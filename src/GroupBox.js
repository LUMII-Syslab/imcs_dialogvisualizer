import React from 'react';
import VerticalBox from "./VerticalBox.js";
import { Label, Card, Elevation } from "@blueprintjs/core";

class GroupBox extends VerticalBox {

  constructor(props) {
    super(props);
    this.state.style.padding = 0;
  }

  hasBorder() {
    if (typeof this.state.tree.hasBorder === "undefined")
      return true;

    if (!this.state.tree.hasBorder || (this.state.tree.hasBorder==="false"))
      return false;

    return true;
  }

  getBounds() {
    let retVal = super.getBounds();
    retVal.leftPadding = 10;
    retVal.rightPadding = 10;
    retVal.topPadding = 10;
    if (this.state.tree.caption) {
      retVal.topPadding += 23;
    }
    retVal.bottomPadding = 10;
    return retVal;
  }

    render() {

      let style2 = Object.assign({}, this.state.style);
      style2.leftPadding = 10;
      style2.rightPadding = 10;
      style2.topPadding = 10;
      style2.bottomPadding = 10;
      if (!this.hasBorder()) {
          style2.boxShadow = "0 0 0 0";
          style2.backgroundColor = "inherit";    
        } 
      let elevation = Elevation.ONE;

      let captionDiv = null;
      if (this.state.tree.caption) {
        captionDiv = <div style={{height:0}}><Label style={{position:"relative", top:5, left:10, borderBottom:"1px dotted black", width:this.state.style.width?this.state.style.width-20:0}}><b>{this.state.tree.caption}</b></Label></div>;
      }
      return (
        <Card interactive={false} elevation={elevation} /*ref={this.myRef}*/ style={style2}> {/* no left/top here */}
        {captionDiv}
        {this.renderChildren().map((component, index) => {return (
          <div key={index}>
              { component }
          </div>)})
        }
        </Card>
      );
    }
}
  
export default GroupBox;
