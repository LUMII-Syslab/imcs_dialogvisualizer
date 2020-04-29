import React from 'react';
import Component from "./Component.js";
import measure from "./measure";
import $ from "jquery";

class ListBox extends Component {
  constructor(props) {
    super(props);
    this.state.values = [];
    
    if (this.state.tree.item && this.state.tree.item.length>0) {

      let selectedArr = this.state.tree.selected;
      if (!selectedArr)
        selectedArr = this.state.tree.selectedItem;

      if (selectedArr && selectedArr.length>0) {
        for (let i=0; i<selectedArr.length; i++) {
          this.state.values.append(selectedArr[i].reference);
        }
      }
    }

  }

  getBounds() {
    let m = measure(this.myRef.current);

    if (m.h<73)
      m.h = 73;

    let retVal = super.getBounds({});
    retVal.minimumWidth = m.w;
    retVal.minimumHeight = m.h;
    return retVal;
  }

  onChange() {
    let values = $(this.myRef.current).val();

    if (!this.state.tree.multiSelect) {
      if (values.length>0)
        values = [ values[0] ];
      else {
        values = [];
      }

      $(this.myRef.current).val(values);

    }

    if (values.length===this.state.values.length) {
      if (values.length===0)
        return;
      if (values.length===1 && values[0]===this.state.values[0])
        return
    }
    //Variant: if(JSON.stringify(values) == JSON.stringify(this.state.values))...

    this.setState({values: values}, () => {
      this.context.eventHandler({component:this.state.tree, eventName:"ListBoxChangeEvent", value:values});
    });

  }

  onRightClick(e) {
    e.preventDefault();
    this.context.eventHandler({component:this.state.tree, eventName:"RightClickEvent"});
  }

  render() {
    return (
      <select multiple={true}/*we will manage multiple manually*/ value={this.state.values} ref={this.myRef} style={{ ...this.state.style}} disabled={!this.state.enabled || this.state.readOnly} onChange={(e)=>{this.onChange()}} onContextMenu={(e)=>{this.onRightClick(e)}}>
        {this.state.tree.item.map((item)=><option key={item.reference} value={item.reference}>{item.value}</option>)}
      </select>
    );
  }
}

export default ListBox;

