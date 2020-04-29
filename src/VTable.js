import React from 'react';
import Component from "./Component";
import { Cell, Column, Table } from "@blueprintjs/table";
import measure from "./measure";
import $ from "jquery";
import {getComponentTypeByTree} from "./ComponentTypes";

class VTable extends Component {

  constructor(props) {
    super(props)
    this.state.style.display = "inline-block";
  }

  getBounds() {
    console.log("TBL",this.myRef.current.rootTableElement);
    let m = measure(this.myRef.current.rootTableElement);

    if (m.w>window.innerWidth-30)
      m.w = window.innerWidth-30;
    //let m = {w:500, h:300};

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
        { tree: child, enabled: this.state.enabled, readOnly:this.state.readOnly, key: child.reference, layoutContext: this.props.layoutContext, parentReference: this.state.tree.reference, ...additionalProps }
        // enabled and readOnly are recursive until the new child value is set
    );
    return element;
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
          if (!cell.value)
            cell.value="";
          retVal = <Cell>{cell.value}</Cell>;
        }
        if (col.editable) {
          let cmpnt = null;
          if (cell.component && cell.component.length>0)
            cmpnt = cell.component[0];
          if (!cmpnt) {
            if (col.component && col.component.length>0)
              cmpnt = col.component[0];
          }
          /*if (!cmpnt) {
            cmpnt = {
              className: "D#TextBox",
              reference: (i*rows.length+cols+1),
              text: cell.value
            };
          } */
          if (cmpnt)       
            retVal = this.renderChild(cmpnt);
        }
        return retVal;
      };
      return <Column key={col.reference} name={col.caption} cellRenderer={renderer}/>;
    })

    console.log("VTABLE",this.state.style);

    let rowHeight = 31;
    return (
      <Table ref={this.myRef} enableColumnResizing={false} enableRowResizing={false} columnWidths={cols.map(col=>col.width?col.width:50)} style={this.state.style} numRows={rows.length} maxRowHeight={rowHeight} minRowHeight={rowHeight} defaultRowHeight={rowHeight}>
        {renderedCols}
      </Table>
    );
  }
}
export default VTable;

