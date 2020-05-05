import React from 'react';
import Component from "./Component";
import { Cell, Column, Table, SelectionModes } from "@blueprintjs/table";
import measure from "./measure";
import $ from "jquery";
import {getComponentTypeByTree} from "./ComponentTypes";

class VTable extends Component {

  constructor(props) {
    super(props)
    this.state.style.display = "inline-block";
    
    this.selectedRow = -1;
    let rows = this.state.tree.vTableRow?this.state.tree.vTableRow:[];
    if (this.state.tree.selectedRow && this.state.tree.SelectedRow.length>0) {
      let selectedReference = this.state.tree.selectedRow[0].reference;
      this.selectedRow = rows.reduce((acc,row,index)=>(row.reference===selectedReference?index:acc));
    }
  }

  getBounds() {
    let m = measure(this.myRef.current.rootTableElement);

    if (m.w>window.innerWidth-30)
      m.w = window.innerWidth-30;

    return super.getBounds({
      minimumWidth: m.w,
      maximumWidth: m.w,
      minimumHeight: m.h,
      maximumHeight: m.h
    });
  }

  renderChild(child, additionalProps) {
    let element = React.createElement(
        getComponentTypeByTree(child),
        { enabled: this.state.enabled, readOnly:this.state.readOnly, key: child.reference, layoutContext: this.props.layoutContext, parentReference: this.state.tree.reference, ...additionalProps }
        // enabled and readOnly are recursive until the new child value is set
    );
    return element;
  }

  handleSelection(selection) {
    $(':focus').blur();

    if (this.selectedRow!==selection[0].rows[0]) {
      this.selectedRow = selection[0].rows[0];
      this.context.eventHandler({component:this.state.tree, eventName:"RowChangeEvent", value:this.selectedRow});
    }
  }

  componentDidUpdate() {
    if (this.state.style.height)
      $(this.myRef.current.rootTableElement).height(this.state.style.height);
  }
  render() {
    let rows = this.state.tree.vTableRow?this.state.tree.vTableRow:[];
    let cols = this.state.tree.column?this.state.tree.column:[];

    let renderedCols = cols.map((col,j)=>{      
      let renderer = (i) => {
        let retVal = <Cell></Cell>;
        let cell = {value:""};
        if (i<rows.length && j<rows[i].vTableCell.length) {
          cell = rows[i].vTableCell[j];
          retVal = <Cell>{cell.value?cell.value:""}</Cell>;
        }
        if (col.editable) {
          let cmpnt = null;
          if (cell.component && cell.component.length>0)
            cmpnt = cell.component[0];
          if (!cmpnt) {
            if (col.component && col.component.length>0)
              cmpnt = col.component[0];
          }
          if (cmpnt)
            retVal = this.renderChild(cmpnt, {tree: cell});
        }
        else {
        }
        return retVal;
      };
      return <Column key={col.reference} name={col.caption} cellRenderer={renderer}/>;
    })

    let rowHeight = 31;
    return (
      <Table ref={this.myRef} enableColumnResizing={false} enableRowResizing={false} columnWidths={cols.map(col=>col.width?col.width:50)} style={this.state.style} numRows={rows.length} 
        maxRowHeight={rowHeight} minRowHeight={rowHeight} defaultRowHeight={rowHeight}
        onSelection={(e)=>this.handleSelection(e)}
        selectionModes={SelectionModes.CELLS}
        enableMultipleSelection={false}
      >
        {renderedCols}
      </Table>
    );
  }
}
export default VTable;

