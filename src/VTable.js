import React from 'react';
import Component from "./Component";
import { Cell, Column, Table, SelectionModes } from "@blueprintjs/table";
import measure from "./measure";
import $ from "jquery";
import { getComponentTypeByTree } from "./ComponentTypes";

class VTable extends Component {

  constructor(props) {
    super(props)
    this.state.style.display = "inline-block";

    this.state.selectedRow = -1;
    let rows = this.state.tree.vTableRow ? this.state.tree.vTableRow : [];
    if (this.state.tree.selectedRow && this.state.tree.selectedRow.length > 0) {
      let selectedReference = this.state.tree.selectedRow[0].reference;
      this.state.selectedRow = rows.reduce((acc, row, index) => (row.reference === selectedReference ? index : acc));
    }
    this.state.rowsCount = rows.length;
  }

  componentDidUpdate() {
    if (this.myRef.current && this.myRef.current.rootTableElement) {
      if (this.state.style.height)
        $(this.myRef.current.rootTableElement).height(this.state.style.height);
      if (this.state.style.width)
        $(this.myRef.current.rootTableElement).width(this.state.style.width);
    }

    let rows = this.props.tree.vTableRow ? this.props.tree.vTableRow : [];
    if (this.state.tree === this.props.tree && this.state.rowsCount === rows.length)
      return;

    let newSelectedRow = -1;
    if (this.state.tree.selectedRow && this.state.tree.selectedRow.length > 0) {
      let selectedReference = this.state.tree.selectedRow[0].reference;
      newSelectedRow = rows.reduce((acc, row, index) => (row.reference === selectedReference ? index : acc));
    }

    this.setState({
      tree: this.props.tree,
      selectedRow: newSelectedRow,
      rowsCount: rows.length,
      empty: true // draw empty, then draw non-empty to refresh the cells
    }, () => this.setState({ empty: false }, () => this.setState({ empty: false })));

  }

  getBounds() {    
    let m = this.savedM;
    if (!m) {
      m = measure(this.myRef.current.rootTableElement);
      this.savedM = m;
    }

    if (m.w > window.innerWidth - 30)
      m.w = window.innerWidth - 30;

    return super.getBounds({
      minimumWidth: m.w,
      minimumHeight: m.h,
      maximumHeight: m.h
    });
  }

  renderChild(child, additionalProps) {
    let element = React.createElement(
      getComponentTypeByTree(child),
      { enabled: this.state.enabled, readOnly: this.state.readOnly, layoutContext: this.props.layoutContext, parentReference: this.state.tree.reference, ...additionalProps }
      // enabled and readOnly are recursive until the new child value is set
    );
    return element;
  }

  handleSelection(selection) {
    $(':focus').blur();

    if (this.state.selectedRow !== selection[0].rows[0]) {
      this.setState({
        selectedRow: selection[0].rows[0]
      }, () => this.context.eventHandler({ component: this.state.tree, eventName: "RowChangeEvent", value: this.state.selectedRow }))
    }
  }

  render() {
    let cols = this.state.tree.column ? this.state.tree.column : [];

    let myThis = this;



    if (this.state.empty)
      return (<div style={this.state.style}></div>);

    let renderedCols = cols.map((col, j) => {
      let renderer = (i) => {
        let rows = myThis.state.tree.vTableRow ? myThis.state.tree.vTableRow : [];
        let retVal = <Cell></Cell>;
        let cell = { value: "" };
        if (i < rows.length && j < rows[i].vTableCell.length) {
          cell = rows[i].vTableCell[j];
          retVal = <Cell>{cell.value ? cell.value : ""}</Cell>;
        }
        if (col.editable) {
          let cmpnt = null;
          if (cell.component && cell.component.length > 0)
            cmpnt = cell.component[0];
          if (!cmpnt) {
            if (col.component && col.component.length > 0)
              cmpnt = col.component[0];
          }
          if (cmpnt)
            retVal = myThis.renderChild(cmpnt, { tree: cell, key: cmpnt.reference });
        }
        else {
        }
        return retVal;
      };
      return <Column key={col.reference} name={col.caption} cellRenderer={renderer} />;
    });

    let rows = this.state.tree.vTableRow ? this.state.tree.vTableRow : [];
    let rowHeight = 31;
    return (
      <Table ref={this.myRef} enableColumnResizing={false} enableRowResizing={false} columnWidths={cols.map(col => col.width ? col.width : 50)} style={this.state.style} numRows={rows.length}
        maxRowHeight={rowHeight} minRowHeight={rowHeight} defaultRowHeight={rowHeight}
        onSelection={(e) => this.handleSelection(e)}
        selectionModes={SelectionModes.CELLS}
        enableMultipleSelection={false}
      >
        {renderedCols}
      </Table>
    );
  }
}
export default VTable;

