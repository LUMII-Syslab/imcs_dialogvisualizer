import React from 'react';

import { IMCSDialogLayout } from '@LUMII-Syslab/imcs_layoutengine';

import "normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/table/lib/css/table.css";

import $ from "jquery";

import { Dialog, Classes, Spinner } from "@blueprintjs/core";

// importing all our dialog components, since containers will search for them...

import { getComponentTypeByTree } from "./ComponentTypes";

import { LayoutContext } from "./LayoutContext";

import Label from "./Label.js";
import InputField from "./InputField.js";
import VerticalBox from "./VerticalBox.js";
import HorizontalBox from "./HorizontalBox.js";
import Stack from "./Stack.js";
import TabContainer from "./TabContainer.js";
import Tab from "./Tab.js";
import Row from "./Row.js";
import Column from "./Column.js";
import MultiLineTextBox from "./MultiLineTextBox.js";
import Button from "./Button.js";
import RadioButton from "./RadioButton.js";
import GroupBox from "./GroupBox.js";
import CheckBox from "./CheckBox.js";
import ComboBox from "./ComboBox.js";
import ListBox from "./ListBox.js";
import TextArea from "./TextArea.js";
import Tree from "./Tree.js";
import ImageButton from "./ImageButton.js";
import Image from "./Image.js";
import VTable from "./VTable.js";

let ComponentTypes = {
  "Label": Label,
  "InputField": InputField,
  "TextBox": InputField,
  "VerticalBox": VerticalBox,
  "HorizontalBox": HorizontalBox,
  "Stack": Stack,
  "TabContainer": TabContainer,
  "Tab": Tab,
  "Row": Row,
  "Column": Column,
  "MultiLineTextBox": MultiLineTextBox,
  "Button": Button,
  "RadioButton": RadioButton,
  "GroupBox": GroupBox,
  "CheckBox": CheckBox,
  "ComboBox": ComboBox,
  "ListBox": ListBox,
  "TextArea": TextArea,
  "Tree": Tree,
  "ImageButton": ImageButton,
  "Image": Image,
  "VTable": VTable
};

window.ComponentTypes = ComponentTypes;

class Form extends VerticalBox {

  constructor(props) {
    super(props);
    let layoutContext = {
      reference2react: {}, // map
      reference2tree: {}, // map
      loading:{}, // map reference -> true
      update: function (tree, clear) {
        if (clear)
          this.reference2tree = {};
        this.reference2tree[tree.reference] = tree;
        let arr = tree.component;
        if (arr && arr.length) {
          for (let i = 0; i < arr.length; i++)
            this.update(arr[i], false);
        }
      }
    };
    layoutContext.update(props.tree);
    if (props.eventHandler)
      layoutContext.eventHandler = props.eventHandler;
    else
      layoutContext.eventHandler = function (ev) {
        console.log("Ignoring " + ev.eventName + ", since eventHandler was not specified for IMCSDialogVisualizer; event=", ev);
      };

    this.callback = {
      load: function (reference) {
        if (!layoutContext.reference2react[reference]) {
          //console.log("load started "+reference+" of form "+formReference, layoutContext.reference2tree[reference]);
          layoutContext.loading[reference] = true;
          layoutContext.dialogLayout.loadStarted(reference);
        }
      },
      getAnchor: function (reference) {
        let tree = layoutContext.reference2tree[reference];

        if (!tree)
           return "sibling"; // some assertion error!!!
        let t = getComponentTypeByTree(tree);
        if (t.getAnchor)
          return t.getAnchor(); // static
      },
      getChildren: function (reference) {
        let tree = layoutContext.reference2tree[reference];
        if (!tree.component) // the component link goes to children
          return [];
        let arr = tree.component.map((child) => (child.reference));
        return arr;
      },
      getBounds: function (reference) {
        let ref = layoutContext.reference2react[reference];
        let retVal = ref.getBounds();
        return retVal;
      },
      getHorizontalRelativeInfo: function (reference) {
        let ref = layoutContext.reference2react[reference];
        return ref.getHorizontalRelativeInfo();
      },
      getVerticalRelativeInfo: function (reference) {
        let ref = layoutContext.reference2react[reference];
        return ref.getVerticalRelativeInfo();
      },
      getHorizontalRelativeInfoGroup: function (reference) {
        let ref = layoutContext.reference2react[reference];
        return ref.getHorizontalRelativeInfoGroup();
      },
      getVerticalRelativeInfoGroup: function (reference) {
        let ref = layoutContext.reference2react[reference];
        return ref.getVerticalRelativeInfoGroup();
      },
      getLayoutName: function (reference) {
        let tree = layoutContext.reference2tree[reference];
        let t = getComponentTypeByTree(tree);
        if (!t) {          
          console.log("Could not find a IMCSDialogVisualizer component for "+(tree.className?tree.className:tree.getClassName()), tree);
        }
        let retVal = null;
        if (t.getLayoutName)
          retVal = t.getLayoutName(); // static
        return retVal;
      },
      layout: function (reference, x, y, w, h) {
        //console.log("layout ",reference,x,y,w,h,layoutContext.reference2tree[reference]);
        let ref = layoutContext.reference2react[reference];
        ref.layout(x, y, w, h);
      },
      destroy: function (reference) {
        //console.log("destroy for "+reference);
        delete layoutContext.reference2react[reference];
      }
    };
    this.layoutContext = layoutContext;
    this.layoutContext.dialogLayout = new IMCSDialogLayout(this.callback);

    this.state.needsDialog = !props.iframe && !props.embedded;
    this.state.caption = props.tree.caption;
    this.state.spinner = true; // wait for layout initially...
    this.layoutContext.dialogLayout.loadAndLayout(this.props.tree.reference);
  }

  close() {
    if (this.props.closeFunction)
      this.props.closeFunction();
  }

  onClose() {
    this.layoutContext.eventHandler({ component: this.state.tree, eventName: "FormCloseEvent" });
  }

  getBounds() {
    let retVal = super.getBounds();
    if (!this.state.needsDialog) {
      Object.assign(retVal, {
        leftPadding: 5,
        rightPadding: 0,
        topPadding: 5,
        bottomPadding: 0,
        leftMargin: 10,
        rightMargin: 10,
        topMargin: 10,
        bottomMargin: 10        
      });  
    }
    else {
      Object.assign(retVal, {
        leftPadding: 10,
        rightPadding: 10,
        topPadding: 10,
        bottomPadding: 10,
        leftMargin: 10,
        rightMargin: 10,
        topMargin: 10,
        bottomMargin: 10        
      });  
    }
    return retVal;

  }

  layout(x, y, w, h) {

    let tree = this.state.tree;
    this.setState((state, props) => ({
      spinner: false,
      style: { marginLeft: x, marginTop: y, width: w, height: h+2, ...state.style },
      outerWidth: w,
      outerHeight: h + (this.state.needsDialog ? 40 : 0) // 40 is the height of the header
    }), () => {

      // after shown...
      this.layoutContext.eventHandler({ component: tree, eventName: "ResizeEvent", value: { width: w, height: h } });
    });
  }

  rerender(r) {
    //r=0; // re-render the whole form

    if (!r)
      r = this.state.tree.reference;
    let tree = this.layoutContext.reference2tree[r];
    if (!tree)
      tree = this.state.tree;

    // re-building the whole(!) map reference2tree...
    this.layoutContext.update(this.state.tree, true);

    // laying out the subtree, while trying to preserve the same form width and height...
    this.layoutContext.dialogLayout.refreshAndLayout(tree.reference, this.state.style.width, this.state.style.height);

    // re-render with React...
    this.forceUpdate();
  }

  render() {

    if (this.state.needsDialog)
      return (<Dialog isOpen={true} onClose={(e) => this.onClose()}
        title={this.state.caption}
        style={{ width: this.state.outerWidth, height: this.state.outerHeight }}>

        <LayoutContext.Provider value={this.layoutContext}>
          {this.state.spinner && <div style={{ marginLeft: 10, marginRight: 10, marginTop: 20, height: 50 }}><Spinner /></div>}
          <div ref={this.myRef} className={Classes.DIALOG_BODY} style={{ visibility: this.state.spinner ? "hidden" : "visible", ...this.state.style }}>
            {this.renderChildren().map((component, index) => {
              return (
                <div key={index}>
                  {component}
                </div>)
            })
            }
          </div>

        </LayoutContext.Provider>
      </Dialog>);
    else
      return (
        <div style={{ textAlign: "center" }} /*className="bp3-dark"*/>
          <LayoutContext.Provider value={this.layoutContext}>
            {this.state.spinner && <div style={{ marginLeft: 10, marginRight: 10, marginTop: 20, height: 50 }}><Spinner /></div>}
            <div ref={this.myRef} className={Classes.DIALOG_BODY} style={{ visibility: this.state.spinner ? "hidden" : "visible", ...this.state.style }}>
              {this.renderChildren().map((component, index) => {
                return (
                  <div key={index}>
                    {component}
                  </div>)
              })
              }
            </div>
          </LayoutContext.Provider>
        </div>);
  }
}

window.ComponentTypes["Form"] = Form;
export default Form;

