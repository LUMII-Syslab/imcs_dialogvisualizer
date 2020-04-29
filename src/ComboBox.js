import React from 'react';
import Component from "./Component.js";
import { HTMLSelect } from "@blueprintjs/core";
import measure from "./measure";

import "./ComboBox.css";


class ComboBox extends Component {
  constructor(props) {
    super(props);
    this.state.editable = (this.state.tree.editable);

    this.state.text = this.state.tree.text?this.state.tree.text:""; // just the specified text
    this.state.index = 0;


    if (this.state.tree.selected && this.state.tree.selected.length>0)
      this.state.text = this.state.tree.selected[0].value;

    if (this.state.tree.selectedItem && this.state.tree.selectedItem.length>0)
      this.state.text = this.state.tree.selectedItem[0].value;

    // check whether the value is contained in the list of items...
    let items = this.state.tree.item;
    if (items) {
      for (let i=0; i<items.length; i++) {
        if (this.state.text === items[i].value) {
          this.state.index = i;
          break;
        }
      }
    }

    this.inputRef = React.createRef();

  }

  componentDidMount() {
    super.componentDidMount();
  }

  getElement() {
    if (this.myRef.current._reactInternalFiber)
      return this.myRef.current._reactInternalFiber.child.stateNode.firstElementChild;
    else
      return this.myRef.current;
  }

  getBounds() {
    let m = measure(this.getElement());

    let retVal = super.getBounds({});
    retVal.minimumWidth = m.w;
    retVal.minimumHeight = m.h;
    retVal.maximumHeight = m.h;
    return retVal;
  }

  onChange() {

    let index = this.getElement().value;
    let text = this.state.tree.item[index].value;

    this.setState({index: index, text: text}, ()=>{
      this.context.eventHandler({component:this.state.tree, eventName:"ChangeEvent", value:text})
    });    
  }

  onEdit() {

    // do not alter the index, just use the value
    let text = this.inputRef.current.value;

    this.setState({text: text}, ()=>{
      this.context.eventHandler({component:this.state.tree, eventName:"ChangeEvent", value:text})
    });    

  }

  onFocus() {
    this.context.eventHandler({component:this.state.tree, eventName:"FocusGainedEvent", value:this.state.text});
  }

  onBlur() {
    this.context.eventHandler({component:this.state.tree, eventName:"FocusLostEvent", value:this.state.text});
  }

  render() {
    let values = [];
    if (this.state.tree.item) {
      if (this.state.editable) 
        values = this.state.tree.item.map((item,index)=>(<option key={index} value={index}>{item.value}</option>));
      else
        values = this.state.tree.item.map((item,index)=>({label:item.value, value:index}));
    }

    let combo = null;

    let style1 = {};
    let style2 = {};
    if (this.state.style.width) {
      style1.width = this.state.style.width;
      style2.width = this.state.style.width-20;
    }
    if (this.state.style.height) {
      style1.height = this.state.style.height;
      style2.height = this.state.style.height;
    }

    if (this.state.editable) {
      combo = <div className="select-editable" style={{width:this.state.style.width}}>
        <select ref={this.myRef} disabled={!this.state.enabled || this.state.readOnly} value={this.state.index} style={style1} onFocus={(e)=>{this.onFocus()}}  onBlur={(e)=>{this.onBlur()}} onChange={(e)=>{this.onChange()}}>
          {values}
        </select>
        <input ref={this.inputRef} className="bp3-input" type="text" name="format" value={this.state.text} style={style2} onFocus={(e)=>{this.onFocus()}} onBlur={(e)=>{this.onBlur()}}  onChange={(e)=>{this.onEdit()}}/>
        </div>;
    }
    else {
      combo = <HTMLSelect ref={this.myRef} style={{width:this.state.style.width}} disabled={!this.state.enabled || this.state.readOnly} value={this.state.index} options={values} onChange={(e)=>{this.onChange()}} />;
    }

    return (
      <div style={this.state.style}>
        {combo}        
      </div>
    );
  }
}

export default ComboBox;

