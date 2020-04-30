import React from 'react';

import {LayoutContext} from "./LayoutContext";


class Component extends React.Component {

    static contextType = LayoutContext;

    constructor(props) {
        super(props);

        let disabled = (typeof props.enabled!=="undefined" && !props.enabled) || (typeof props.tree.enabled!=="undefined" && !props.tree.enabled);
        if (props.tree.enabled)
            disabled = false;

        let readOnly = props.tree.readOnly || (typeof props.tree.readOnly==="undefined" && props.readOnly);

        this.state = {
            tree: props.tree,
            eventHandler: props.eventHandler,
            style: { display: "inline-block", textAlign:"left", verticalAlign: "top", ...props.style },
            enabled: !disabled, // default true
            readOnly: readOnly // default false
        };

        if (props.tree.leftMargin) {
            this.state.style.marginLeft = props.tree.leftMargin;
        }

        this.myRef = React.createRef();
    }

    componentDidMount() {
        let ctx = this.context;
        if (!ctx)
            ctx = this.layoutContext;

        ctx.reference2react[this.state.tree.reference] = this;
        if (ctx.loading[this.state.tree.reference]) {
            //console.log("load finished (after mount) for "+this.state.tree.reference);
            delete ctx.loading[this.state.tree.reference];
            ctx.dialogLayout.loadFinished(this.state.tree.reference);
        }
    }

    componentDidUpdate() {
        let ctx = this.context;
        if (!ctx)
            ctx = this.layoutContext;

        ctx.reference2react[this.state.tree.reference] = this;
        if (ctx.loading[this.state.tree.reference]) {
            //console.log("load finished (during update) for "+this.state.tree.reference);
            delete ctx.loading[this.state.tree.reference];
            ctx.dialogLayout.loadFinished(this.state.tree.reference);
        }
    
    }

    // For IMCSDialogLayout =>
    layout(x, y, w, h) {
        this.setState((state,props) => ({
            style: { marginLeft: x, marginTop: y, width: w, height: h, ...state.style }
        }));
    }

    getInitialBounds() {
        let node = this.state.tree;
        let retVal = {};
        retVal.leftMargin = node.leftMargin;
        //retVal.rightMargin = node.rightMargin;
        retVal.topMargin = node.topMargin;
        //retVal.bottomMargin = node.bottomMargin;

        retVal.leftPadding = node.leftPadding;
        retVal.rightPadding = node.rightPadding;
        retVal.topPadding = node.topPadding;
        retVal.bottomPadding = node.bottomPadding;

        retVal.leftBorder = node.leftBorder;
        retVal.rightBorder = node.rightBorder;
        retVal.topBorder = node.topBorder;
        retVal.bottomBorder = node.bottomBorder;

        retVal.horizontalSpacing = node.horizontalSpacing;
        retVal.verticalSpacing = node.verticalSpacing;

        if (node.horizontalAlignment) {
            if ((node.horizontalAlignment < 0) || (node.horizontalAlignment === "-1"))
                retVal.horizontalAlignment = "LEFT";
            else
                if ((node.horizontalAlignment > 0) || (node.horizontalAlignment === "+1"))
                    retVal.horizontalAlignment = "RIGHT";
                else
                    retVal.horizontalAlignment = "CENTER";
        }
        else
            node.horizontalAlignment = "CENTER";


        if (node.verticalAlignment) {
            if ((node.verticalAlignment < 0) || (node.verticalAlignment ===
                "-1"))
                retVal.verticalAlignment = "TOP";
            else
                if ((node.verticalAlignment > 0) || (node.verticalAlignment === "+1"))
                    retVal.verticalAlignment = "BOTTOM";
                else
                    retVal.verticalAlignment = "CENTER";
        }
        else
            retVal.verticalAlignment = "CENTER";

        if (node.minimumWidth)
            retVal.minimumWidth = node.minimumWidth;
        if (node.minimumHeight)
            retVal.minimumHeight = node.minimumHeight;
        if (node.maximumWidth)
            retVal.maximumWidth = node.maximumWidth;
        if (node.minimumHeight)
            retVal.maximumHeight = node.maximumHeight;
        if (node.preferredWidth)
            retVal.preferredWidth = node.preferredWidth;
        if (node.preferredHeight)
            retVal.preferredHeight = node.preferredHeight;

        if (node.minimumRelativeWidth)
            retVal.minimumRelativeWidth = node.minimumRelativeWidth;
        if (node.minimumRelativeHeight)
            retVal.minimumRelativeHeight = node.minimumRelativeHeight;

        if (node.preferredRelativeWidth)
            retVal.preferredRelativeWidth = node.preferredRelativeWidth;
        if (node.preferredRelativeHeight)
            retVal.preferredRelativeHeight = node.preferredRelativeHeight;

        if (node.maximumRelativeWidth)
            retVal.maximumRelativeWidth = node.maximumRelativeWidth;
        if (node.maximumRelativeHeight)
            retVal.maximumRelativeHeight = node.maximumRelativeHeight;

        Object.keys(retVal).forEach(key => retVal[key] === undefined && delete retVal[key]); // delete undefined
        return retVal;
    }

    getBounds(retVal) {
        if (!retVal) {
            // containers or non-implemented...
            retVal = this.getInitialBounds();
            retVal.minimumWidth = 10;
            retVal.minimumHeight = 10;
            //			retVal.preferredWidth = 10;
            //			retVal.preferredHeight = 10;
            retVal.horizontalSpacing = 10;
            retVal.verticalSpacing = 10;
            /*if (this.state.tree.horizontalAlignment)
                if ((this.state.tree.horizontalAlignment < 0) || (this.state.tree.horizontalAlignment === "-1"))
                    retVal.horizontalAlignment = "LEFT";
                else
                    if ((this.state.tree.horizontalAlignment > 0) || (this.state.tree.horizontalAlignment === "+1"))
                        retVal.horizontalAlignment = "RIGHT";

            if (this.state.tree.verticalAlignment)
                if ((this.state.tree.verticalAlignment < 0) || (this.state.tree.verticalAlignment === "-1"))
                    retVal.verticalAlignment = "TOP";
                else
                    if ((this.state.tree.verticalAlignment > 0) || (this.state.tree.verticalAlignment === "+1"))
                        retVal.verticalAlignment = "BOTTOM";*/
        }
        else {
            let q = this.getInitialBounds();
            Object.assign(q, retVal);
            retVal = q;
        }

        for (var key in retVal) {
            if (typeof retVal[key] == "number")
                retVal[key] = Math.ceil(retVal[key]);
        }

        return retVal;
    }

    static getAnchor() {
        return "sibling"; // default for blueprint.js (except for tabs)
        // see also: https://github.com/LUMII-Syslab/imcs_layoutengine/blob/master/doc/IMCSDialogLayout.md
    }

    static getLayoutName() {
        return null;
    }

    getChildren() {
        if (!this.state.tree.component) // the component link goes to children
            return [];

        return this.state.tree.component.map((child) => (child.reference));
    }

    getHorizontalRelativeInfo() {
        return this.state.tree; // will be read only (we hope)
    }

    getVerticalRelativeInfo() {
        return this.state.tree; // will be read only (we hope)
    }

    getHorizontalRelativeInfoGroup() {
        let c = this.state.tree;
        if (c.relativeWidthGroup) {
            if (typeof c.relativeWidthGroup == 'number')
                return c.relativeWidthGroup;
            if (c.relativeWidthGroup.length && c.relativeWidthGroup.length > 0)
                return c.relativeWidthGroup[0].reference;
        }

        if (c.container && (c.container.length > 0))
            return c.container[0].reference;
        else
            return this.props.parentReference ? this.props.parentReference : 0;
    }

    getVerticalRelativeInfoGroup() {
        let c = this.state.tree;
        if (c.relativeHeightGroup) {
            if (typeof c.relativeHeightGroup == 'number')
                return c.relativeHeightGroup;
            if (c.relativeHeightGroup.length && c.relativeHeightGroup.length > 0)
                return c.relativeHeightGroup[0].reference;
        }
        if (c.container && (c.container.length > 0))
            return c.container[0].reference;
        else
            return this.props.parentReference ? this.props.parentReference : 0;
    }
    // <= For IMCSDialogLayout

    render() {
        return null;
    }
}

export default Component;
