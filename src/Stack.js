import React from 'react';
import Container from "./Container.js";

class Stack extends Container {

    static getLayoutName() {
      return "Stack";
    }

    getBounds(b) {

      let retVal = super.getBounds(b);
      //if (typeof(this.state.tree.verticalAlignment) === "undefined") {
        retVal.verticalAlignment = "TOP";
      //}
      return retVal;
    }

    render() {
      return (
        <div ref={this.myRef} style={this.state.style}>
        {this.renderChildren()}
        </div>
      );
    }
}
  
export default Stack;
