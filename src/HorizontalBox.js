import React from 'react';
import Container from "./Container.js";

class HorizontalBox extends Container {


    static getLayoutName() {
      return "HorizontalBox";
    }
  
    getBounds() {
      let bnds = super.getBounds({
        minimumWidth: 10,
        minimumHeight: 10,
        horizontalSpacing: 10,
        verticalSpacing: 0
      });


      /*if (!bnds.horizontalAlignment)
        bnds.horizontalAlignment = "CENTER";
      if (!bnds.verticalAlignment)
        bnds.verticalAlignment = "CENTER";*/
      return bnds;
    }

    render() {
      return (
        <span ref={this.myRef} style={this.state.style}>
          {this.renderChildren()}
        </span>
      );
    }
}
  
export default HorizontalBox;
