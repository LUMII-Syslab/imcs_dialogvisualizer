import React from 'react';
import Stack from "./Stack.js";

import { Tabs } from "@blueprintjs/core";
import { Tab as BPTab } from "@blueprintjs/core";

import "./Tab.css";

import $ from "jquery";

class TabContainer extends Stack {

  getBounds() {
    let retVal = super.getBounds({
      minimumWidth: 10,
      minimumHeight: 10,
      preferredWidth: 10,
      preferredHeight: 10,
      horizontalSpacing: 0,
      verticalSpacing: 10
      //bottomPadding: 30
      //marginTop: 30
      //marginBottom: 30
    });

    retVal.bottomPadding = 30;

    retVal.verticalAlignment = "TOP";
    return retVal;
  }

  layout(x, y, w, h) {
    let el = this.myRef.current.tablistElement;
    this.setState((state,props) => ({
        style: { marginLeft: x, marginTop: y, width: w, height: (h-10), ...state.style }
    }), ()=>{
      $(el).css("margin-top", "-10px");
    });
  }

  onTabChange(newTabId, prevTabId) {
    let newR=0;
    if (newTabId) {
      newR = parseInt(newTabId.substring(newTabId.lastIndexOf("_")+1));
    }

    this.context.eventHandler({component:this.state.tree, eventName:"TabChangeEvent", value:this.context.reference2tree[newR]});
  }

  render() {
    let thisTabContainer = this;
    let children = this.renderChildren().map((child, index) => {
      let id = "tabcontainer_" + thisTabContainer.props.tree.reference + "_tab_" + child.props.tree.reference;
      return <BPTab className="sktab" id={id} key={id} title={child.props.tree.caption} panel={child} />
    });

    let defaultSelectedTabId = null;
    if (children.length>0)
      defaultSelectedTabId = children[0].props.id;
    if (this.state.tree.activeTab && this.state.tree.activeTab.length>0) {
      defaultSelectedTabId = "tabcontainer_" + thisTabContainer.props.tree.reference + "_tab_"+this.state.tree.activeTab[0].reference;
    }
    return (
      <Tabs ref={this.myRef} defaultSelectedTabId={defaultSelectedTabId} animate={true} style={this.state.style} renderActiveTabPanelOnly={false} onChange={(newTab, prevTab)=>this.onTabChange(newTab,prevTab)}>
        {children}
      </Tabs>
    );
  }
}

export default TabContainer;
