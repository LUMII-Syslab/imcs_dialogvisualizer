import React from 'react';
import {Classes, Tree as BPTree} from "@blueprintjs/core";
import Component from "./Component";
import measure from "./measure";

class Tree extends Component {
  constructor(props) {
    super(props);

    this.state.value = this.state.tree.text?this.state.tree.text:"";

    this.areaRef = React.createRef();
    this.handleNodeCollapse = this.handleNodeCollapse.bind(this);
    this.handleNodeExpand = this.handleNodeExpand.bind(this);
    this.handleNodeClick = this.handleNodeClick.bind(this);
    this.forEachNode = this.forEachNode.bind(this);
    
    this.state.nodes = this.convert(this.state.tree.treeNode);

  }

  getElement() {
    return this.myRef.current._reactInternalFiber.child.stateNode;
  }

  getBounds() {
    let m = measure(this.getElement());
    if (m.w > 400)
      m.w = 400;

    return super.getBounds({
      minimumWidth: m.w,
      minimumHeight: m.h
    });
  }

  convert(arr) {
    let retVal = [];
    for (let i=0; i<arr.length; i++) {
      var obj = {
        treeNode: arr[i], // pointer to the original node
        id: arr[i].reference,
        label: arr[i].text,
        isSelected: (this.state.tree.selected && this.state.tree.selected.length>0)?this.state.tree.selected[0].reference===arr[i].reference:false,
        hasCaret: arr[i].childNode?true:false,
        isExpanded: (typeof arr[i].expanded === "undefined" || arr[i].expanded===true)
      };
      if (arr[i].childNode) {
        obj.childNodes = this.convert(arr[i].childNode);
      }
      if (obj.isSelected) {
        // eslint-disable-next-line
        this.state.selectedNode = obj; // convert is called from the constructor; thus, React allows us to change the state here
      }
      retVal.push(obj);

    }
    return retVal;
  }

  onFocus() {
    this.context.eventHandler({component:this.state.tree, eventName:"FocusGainedEvent"});
  }

  onBlur() {
    this.context.eventHandler({component:this.state.tree, eventName:"FocusLostEvent"});
  }

  handleNodeCollapse(nodeData) {
    nodeData.isExpanded = false;
    this.setState(this.state);
  }

  handleNodeExpand(nodeData) {
    nodeData.isExpanded = true;
    this.setState(this.state);
  }


  forEachNode(nodes, callback) {
    if (nodes == null)
        return;

    for (let node of nodes) {
        callback(node);
        this.forEachNode(node.childNodes, callback);
    }
  }

  handleNodeClick(nodeData) {
    const originallySelected = nodeData.isSelected;

    // deselect all...
    //this.forEachNode(this.state.nodes, n => (n.isSelected = false));
    let prevValue = null;
    if (this.state.selectedNode) {
      prevValue = this.state.selectedNode.treeNode;
      // eslint-disable-next-line
      this.state.selectedNode.isSelected = false; // we will issue setState below; thus, there will be no problems with React
    }

    nodeData.isSelected = originallySelected == null ? true : !originallySelected;
    this.setState({selectedNode:nodeData.isSelected?nodeData:null}, ()=>{
      this.context.eventHandler({component:this.state.tree, eventName:"TreeNodeSelectEvent", value:nodeData.isSelected?nodeData.treeNode:null, previousValue:prevValue});
    });
  }

  render() {
    let editable = typeof(this.state.tree.editable)==="undefined" || this.state.tree.editable;


    let style2 = {};
    if (this.state.style.width)
      style2.width = this.state.style.width+"px";
    if (this.state.style.height)
      style2.height = this.state.style.height+"px";
    return (
      <span className={Classes.ELEVATION_0} style={{display:"inline-block", ...this.state.style}}>
      <BPTree ref={this.myRef} style={style2} disabled={!editable || !this.state.enabled} readOnly={this.state.readOnly} onFocus={(e)=>{this.onFocus()}} onBlur={(e)=>{this.onBlur()}}
        contents={this.state.nodes}
        onNodeCollapse={this.handleNodeCollapse}
        onNodeExpand={this.handleNodeExpand}
        onNodeClick={this.handleNodeClick}
      />
      </span>
    );
  }
}
export default Tree;

