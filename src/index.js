import React from 'react';
import ReactDOM from 'react-dom';
//import './index.css';
import Form from './Form';

import rTestForm from './dialog.json';
//import rTestForm from './dialog_with_table.json';
//import rTestForm from './dialog_with_tree.json';


/**
 * Creates a new JavaScript dialog window, which is automatically laid out on the screen.<br/>
 * @constructor
 * @param {object} tree - a JavaScript/JSON object, which represents the tree of dialog components according to Dialog Engine Metamodel;
 *                        IMCSDialogVisualizer does not change the tree; however, the tree can be changed in settings.eventHandler to update the values
 *                        of the modified components
 * @param {string} element - the id of the element, where to put the dialog; if not specified, document.body will be used</td></tr>
 * @param {object} settings - a JavaScript/JSON object contatining configuration settings. All settings are optional. The fields are:
 * <table cellspacing=0 cellpadding=0>
 * <tr><td>eventHandler</td>
 *     <td>a function for handling dialog events; it must take 1 argument having the following fields:<br/>
 *         <ul>
 *         <li><b>component</b> - a dialog component (from the tree), where the event occurred;</li>
 *         <li><b>eventName</b> - the event name (e.g., "Click") corresponding to the metamodel (without the "on" prefix);</li>
 *         <li><b>value</b> - an event-specific value (if applicable),  e.g., the string value of the input field;</li>
 *         <li><b>currentLine</b> - the cursor line number (only for a MultiLineTextBox)</li>
 *         </ul>
 *     </td>
 * </tr>
 * <tr><td>iframe</td>
 *     <td>the iframe, where the dialog window is being created; if not specified, we will create our own modal dialog window with overlay</td>
 * </tr>
 * </table>
 */
let IMCSDialogVisualizer = class  {
  constructor(tree, element, settings) {    
    this.tree = tree?tree:rTestForm;
    if (element) {
      if (typeof element === "string")
        this.element = document.getElementById(element);
      else
        this.element = element;
    }
    else
      this.element = document.body;
    this.settings = settings?settings:{};
  }

  visualize() {
    this.formRef = React.createRef();
    ReactDOM.render(
      //<React.StrictMode>
      <div>
      <Form ref={this.formRef} tree={this.tree} closeFunction={()=>{this.close()}} {...this.settings}/>
      </div>        
      //</React.StrictMode>
      ,
      this.element
    );    
  }

  refresh(r) {
    this.formRef.current.rerender(r);
  }

  close() {
    ReactDOM.unmountComponentAtNode(this.element);
  }
};

window.IMCSDialogVisualizer = IMCSDialogVisualizer;
export default IMCSDialogVisualizer;



