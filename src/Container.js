import React from 'react';
import Component from './Component';

import {getComponentTypeByTree} from "./ComponentTypes";

class Container extends Component {

    constructor(props) {
        super(props);
        this.state.style.verticalAlign = "top";
      }
  
    renderChild(child, additionalProps) {
        let element = React.createElement(
            getComponentTypeByTree(child),
            { tree: child, enabled: this.state.enabled, readOnly:this.state.readOnly, key: child.reference, layoutContext: this.props.layoutContext, parentReference: this.state.tree.reference, ...additionalProps }
            // enabled and readOnly are recursive until the new child value is set
        );
        return element;
    }

    selectRadioButton(child) {

        for (let i=0; i<this.radioButtons.length; i++) {
            let reference = this.radioButtons[i];
            let rb = this.context.reference2react[reference];
            rb.setValue(rb.props.tree.reference === child.props.tree.reference); // true for the given child, false for others
        }

    }

    componentDidMount() {
        super.componentDidMount();
        if (this.selectedRadioButton) {
            let rb = this.context.reference2react[this.selectedRadioButton];
            this.selectRadioButton(rb);
        }
    }

    renderChildren(additionalProps) {
        this.radioButtons = [];
        
        let a = [];
        if (!this.state.tree.component) // the component link goes to children, and there are no children
            return a;

        let firstRadioButton = 0;
        this.selectedRadioButton = 0;
        for (let i = 0; i < this.state.tree.component.length; i++) {
            let child = this.state.tree.component[i];
            let reactChild = this.renderChild(child, additionalProps);
            if (getComponentTypeByTree(child) === window.ComponentTypes.RadioButton) {
                this.radioButtons.push(child.reference);
                if (!firstRadioButton)
                    firstRadioButton = child.reference;
                if (!this.selectedRadioButton && child.selected)
                    this.selectedRadioButton = child.reference;
            }
            a.push(reactChild);
        }

        if (!this.selectedRadioButton)
            this.selectedRadioButton = firstRadioButton;

        return a;
    }

    render() {
        return null;
    }
}

export default Container;
