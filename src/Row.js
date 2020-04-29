import React from 'react';
import Container from "./Container.js";

class Row extends Container {

    static getLayoutName() {
      return "Row";
    }

    getBounds() {
      let bnds = super.getBounds({
        minimumWidth: 10,
        minimumHeight: 10,
        horizontalSpacing: 10,
        verticalSpacing: 0
      });

      bnds.verticalAlignment = "CENTER";

      return bnds;
    }

  
    render() {
      return (
        <div ref={this.myRef} style={this.state.style}>
          {this.renderChildren()}
        </div>
      );
    }
}
  
export default Row;
