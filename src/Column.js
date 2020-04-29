import React from 'react';
import Container from "./Container.js";

class Column extends Container {

    static getLayoutName() {
      return "Column";
    }

    getBounds() {
      let bnds = super.getBounds({
        minimumWidth: 10,
        minimumHeight: 10,
        horizontalSpacing: 0,
        verticalSpacing: 10
      });

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
  
export default Column;
