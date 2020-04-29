import React from 'react';
import Container from "./Container.js";

class VerticalBox extends Container {

    static getLayoutName() {
      return "VerticalBox";
    }

    getBounds() {
      return super.getBounds({
        minimumWidth: 10,
        minimumHeight: 10,
        horizontalSpacing: 0,
        verticalSpacing: 10,
        horizontalAlignment: -1
      });
    }
  

    render() {
      return (
        <div ref={this.myRef} style={this.state.style}>
        {this.renderChildren()}
        </div>
      );
    }
}
  
export default VerticalBox;
