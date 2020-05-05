# IMCSDialogVisualizer Doc

## The Life Cycle

Initialize a visualizer instance using the JavaScript new operator:

```javascript
var v = new IMCSDialogVisualizer(tree, element, settings);
```
Here
- *tree* is a JavaScript/JSON object, which represents the tree of dialog components according to Dialog Engine Metamodel (see below).
         Each element must have an integer *reference* field (>0) that will be used as a unique key to identify elements internally.
         IMCSDialogVisualizer will not change the tree. However, the tree can be changed in settings.eventHandler to update the values of the modified components.
- *element* is the id of the DOM element (or the element itself), where to put the dialog; if not specified, document.body will be used</td></tr>
- *settings* a JavaScript/JSON object contatining configuration settings according to the following table. All settings are optional. 

|Field in *settings*|Subfields|Description|
|-----|-----------|---|
|embedded||Normally, IMCSDialogVisualizer creates its own modal dialog window with an overlay. However, if (embedded) is true, the dialog window (with caption and border) won't be created.
|eventHandler|{|a function for handling dialog events; it must take 1 argument having the following fields:|
|| component | a dialog component (an object from the tree), where the event occurred|
|| eventName | the event name (e.g., "ClickEvent"), which is specific to a particular component|
|| value | an event-specific value (if applicable),  e.g., the text of the input field|
|| ... | additional event-specific fields (e.g., the cursor position, see the list of components and their events below)|
||}||

To visualize the dialog, invoke:
```javascript
v.visualize();
```

To refresh the dialog (e.g., after changing the structure of the *tree* of dialog elements), invoke:
```javascript
v.refresh(reference);
```
Here *reference* is an optional reference of some tree element. If not specified, the whole dialog window will be refreshed.

To close and distroy the window, invoke:
```javascript
v.close();
```

## Dialog Engine Metamodel
The metamodel describes the supported dialog elements and how they are organized into a tree by means of containers.

### Containers

The tree of components is organized by means of containers via the "component" link. The following figure displays the currently supported containers and how they are linked
to components. Notice that each container is also a component. Containers can be mixed to make a tree structure of your choice.


![Containers From Dialog Enginge Metamodel](https://raw.githubusercontent.com/LUMII-Syslab/imcs_dialogvisualizer/master/doc/containers.png)

Container|Fields&Events|Description
---------------|-----------|---
**Component**||An abstract class for representing leaf tree components as well as containers; not used directly.
||
**Container**||An abstract class for containers; not used directly.
||
**VerticalBox**||Children are laid out vertically.
||
**HorizontalBox**||Children are laid out horizontally.
||
**GroupBox**||A visible container with a bevel, where elements can be visually grouped together. Useful for radio buttons and other related components.
&nbsp;|*caption*|a title to display on top of the group box.
||
**Column**||Similar to VerticalBox, but children of neighbouring columns will be aligned into a table.
||
**Row**||Similar to HorizontallBox, but children of neighbouring rows will be aligned into a table.
||
**Stack**||Children will be organized into layers, one on top of another, like a card stack. Used to implement TabContainer.
||
**TabContainer**||A visible container, where several tabs occupy the same space, and the user can switch between tabs. Child componenets must be of type Tab.
&nbsp;|*activeTab[{reference}]*|an array of a single element with the *reference* field pointing to a selected tab; if the array is omitted, the first tab will be selected
||
&nbsp;|*TabChangeEvent*|emitted when the user changes the active tab; the *value* field will contain the child Tab object corresponding to the newly selected tab
||
**Tab**||A visible tab container with a caption. It must be a child (via the component/container link) of a TabContainer. The children within a Tab are laid out vertically.
&nbsp;|*caption*|the visible name of the tab

### The Form Container
Besides the abovementioned containers, there is also the *Form* container, which must be the root of the tree of components. If the *embedded* setting is false, the form can contain the *caption*
attribute to be displayed as a title. *Form* is a subclass of *VerticalBox*; thus, child components are laid out vertically. However, a *HorizontalBox* or a *Row* can be attached as a child component to describe a horizontal layout.

Mapping to JavaScript objects is as follows:
* Class names are mapped to the "className" field. If the class name contains some prefix ending with #, the prefix is automatically dropped, e.g., D#HorizontalBox becomes HorizontalBox.
* Class attributes are mapped to the fileds of the corresponding JavaScript/JSON objects.
* Links are mapped to the array fields. 
* Besides, each component must have a unique integer *reference* field. It is used by IMCSDialogVisualizer internally. In addition, it can be used to specify cross-links, e.g., the *activeTab* link to an existing child *Tab*.

Container|Fields&Events|Description
---------|-----------|---
**Form**||the root container, where children specified in the *component* field are laid out vertically as in VerticalBox
&nbsp;|*caption*|the window title of the form; displayed only when IMCS Dialog Visualizer invoked with the option embedded==false
||
&nbsp;|*ResizeEvent*|emitted when the form is being resized (e.g., by the layout algorithm); the *value* field of the event is an object with the new *width* and *height* in pixels

#### Example

A Form with a single TabContainer containing 2 empty Tabs:
```javascript
{
    reference: 50,
    className: "Form",
    caption: "My dialog form",
    component: [{
        reference: 100,
        className: "TabContainer",
        component: [{
            reference: 101,
            className: "Tab",
            caption: "The first tab" 
        },{
            reference: 102,
            className: "Tab",
            caption: "The second tab" 
        }
        ],
        activeTab: [{
            reference: 102
        }],
    }]
}
```

### Components

Below we list currently implemented components, which can be put inside containers. We also describe the attributes and events of the components.

Component|Fields&Events|Description
---------|-----------|---
***Any component***||
&nbsp;|*enabled*|(boolean) whether the given component is enabled; this value, if set, is propagated recursively to all descendands until another value is encountered (default: true) 
&nbsp;|*readOnly*|(boolean) whether the given component is readOnly; some components are displayed equally if !enabled or readOnly; this value, if set, is propagated recursively to all descendands until another value is encountered (default: false) 
||
**Button**||a clickable button
&nbsp;|*caption*|the displayed name of the button
||
&nbsp;|*ClickEvent*|emitted when the user clicks the button; no value is passed
||
**CheckBox**||a label with a clickable square for a tick
&nbsp;|*caption*|the displayed name of the checkbox label
&nbsp;|*checked*|(boolean) whether the checkbox is checked (default: false)
||
&nbsp;|*ChangeEvent*|emitted when the user checks or unchecks the checkbox; the checkbox value (true or false) is passed in the *value* field of the event
&nbsp;|*FocusGainedEvent*|emitted when the component gains the focus; the checkbox value (true or false) is passed in the *value* field of the event
&nbsp;|*FocusLostEvent*|emitted when the component loses the focus; the checkbox value (true or false) is passed in the *value* field of the event
||
**ComboBox**||a single-line text input field combined with a list of values to select from
&nbsp;|*text*|the text value of the input field (if editable==false, the text value must be one of the values of the items)
&nbsp;|*item[{value}]*|an array of items, where each item must have a *value* field; such values will be shown in the drop down menu
&nbsp;|*editable*|(boolean) whether the user can enter an arbitrary value, not just a value from the list; if *false*, only the HTML select will be displayed (default: true)
||
&nbsp;|*ChangeEvent*|emitted when the user selects one of the values in the drop down menu, or enters a new text value
&nbsp;|*FocusGainedEvent*|emitted when the component gains the focus; the text value is passed in the *value* field of the event
&nbsp;|*FocusLostEvent*|emitted when the component loses the focus; the text value is passed in the *value* field of the event
||
**Image**||an clickable icon image; a dialog to choose another image is displayed on click; since the dialog can be quite large, the root form should not be put inside an iframe (e.g., the *embedded* setting must be false); otherwise, the image choosing dialog won't be displayed
&nbsp;|*fileName*|the image file name; only the last name (after the last "/") will be used
&nbsp;|*picturesPath*|a URL path, where the image choosing dialog should search for images (default: path of the current document URL + "/Pictures")
&nbsp;|*getListing*|a JS funciton returning an array of URL paths to available images (default: a function that uses HTTP GET to the *picturesPath* URL and parses the result as XML to obtain all links)
&nbsp;|*editable*|(boolean) whether the user can choose another image from the dialog (default: true)
||
&nbsp;|*ImageChangeEvent*|emitted when the user selects another image from the image choosing dialog; the newly selected fileName will be passed in the *value* field of the event
||
**ImageButton**||a clickable button with an image instead of a caption
&nbsp;|*fileName*|the image file name; only the last name (after the last "/") will be used
&nbsp;|*picturesPath*|a URL path, from where the to download the image (default: path of the current document URL + "/Pictures")
||
&nbsp;|*ClickEvent*|emitted when the user clicks the button; no value is passed
||
**InputField**||a single-line text input field
&nbsp;|*text*|the text value of the input field
&nbsp;|*editable*|(boolean) whether the input field is editable (default: true)
||
&nbsp;|*ChangeEvent*|emitted when the user changes the text; the new text value is passed in the *value* field of the event
&nbsp;|*FocusGainedEvent*|emitted when the component gains the focus; the text value is passed in the *value* field of the event
&nbsp;|*FocusLostEvent*|emitted when the component loses the focus; the text value is passed in the *value* field of the event
||
**Label**||just a label
&nbsp;|*caption*|the text to be displayed
||
**ListBox**||a menu-like list of items to choose (highlight) one or multiple values
&nbsp;|*item[{reference,value}]*|an array of items, where each item must have the *reference* (some unique non-zero integer) and *value* (a displayable name of the item) fields
&nbsp;|*selected[{reference}]*|an array of items, each having the *reference* field; all items having the same reference will be selected
&nbsp;|*multiSelect*|(boolean) whether the user can select more than one item (default: false)
||
&nbsp;|*ListBoxChangeEvent*|emitted when the user changes the selected item(s); the *value* field of the event will be an array containing references of the newly selected items
&nbsp;|*RightClickEvent*|emitted when the the user clicks the right mouse button somewhere on the list box; no value is passed
||
**MultiLineTextBox**||a multi-line box for text input with the ability to handle each line separately
&nbsp;|*textLine[{reference,text}]*|an array of lines, where each line must have a *reference* and a *text* value;
&nbsp;|*text*|the cumulative text value of the input field (if not specified, it will be obtained by joining the textLine array using the new line symbol)
&nbsp;|*editable*|(boolean) whether the input field is editable (default: true)
||
&nbsp;|*MultiLineTextBoxChangeEvent*|emitted when the user changes the text; the new cumulative text value is passed in the *value* field of the event, the *position* field will contain the cursor position (within the cumulative text), and the *currentLine* field will contain the current line index (starting from 0)
&nbsp;|*FocusGainedEvent*|emitted when the component gains the focus; the cumulative text value is passed in the *value* field of the event, and the current line index will be passed in the *currentLine* field
&nbsp;|*FocusLostEvent*|emitted when the component loses the focus; the cumulative text value is passed in the *value* field of the event, and the current line index will be passed in the *currentLine* field
||
**RadioButton**||a label with a clickable circle to choose one value among multiple radio buttons within the same container (the group)
&nbsp;|*caption*|the text to display as a label
&nbsp;|*selected*|(boolean) whether the value of this radio button is selected (default: false)
||
&nbsp;|*ChangeEvent*|emitted when the the selected status of this radio button changes; the current radio button value (true or false) is passed in the *value* field of the event; each selection status change will emit 2 ChangeEvent-s: one for the selected radio button, and the other for the deselected radio button
&nbsp;|*ClickEvent*|emitted when the user selects this radio button (i.e., emitted only after ChangeEvent having *value*==true)
&nbsp;|*FocusGainedEvent*|emitted when the component gains the focus; the current value (true or false) is passed in the *value* field of the event
&nbsp;|*FocusLostEvent*|emitted when the component loses the focus; the current value (true or false) is passed in the *value* field of the event
||
**TextArea**||a multi-line box for text input (a simplified version of MultiLineTextBox)
&nbsp;|*text*|the cumulative text value of the input field
&nbsp;|*editable*|(boolean) whether the input field is editable (default: true)
||
&nbsp;|*ChangeEvent*|emitted when the user changes the text; the new cumulative text value is passed in the *value* field of the event
&nbsp;|*FocusGainedEvent*|emitted when the component gains the focus; the cumulative text value is passed in the *value* field of the event
&nbsp;|*FocusLostEvent*|emitted when the component loses the focus; the cumulative text value is passed in the *value* field of the event
||
**Tree**||a tree browser with the ability to select one node
&nbsp;|*treeNode[{reference, text, expanded, childNode[...]}]*|an array of tree nodes (each node can have children specified in the *childNode* field in the same format to describe deeper levels of the tree); the *reference* field identifies the node, the *text* field is the text to be displayed for that node, and the *expanded* field (boolean) denotes whether this node is expanded or collapsed
&nbsp;|*selected[{reference}]*|an array consisting of one item having the *reference* field; the tree node having the same reference will be selected
||
&nbsp;|*TreeNodeSelectEvent*|emitted when the user changes the selected tree node; the tree node object corresponding to the selected node is passed in the *value* field, and the previous value is passed in the *previousValue* field; if the *value* (or *previousValue*) is null, then this indicates that no tree node is (was) selected
&nbsp;|*FocusGainedEvent*|emitted when the component gains the focus; no value is passed
&nbsp;|*FocusLostEvent*|emitted when the component loses the focus; no value is passed
||
**VTable**||a scrollable vertical table, having one header row
&nbsp;|*column[{caption,width,editable,component[]}]*|an array of column descriptions; each column description must have a *reference* field to identify the column type; the optional *width* field is the preferred width of the column in pixels; the *editable* field specifies whether the user can change the values of the cells within this column, and the optional *component* field can specify an array of a single component that will be a default component for the cells in this column; the component can correspond to any of the components above, however, the width and height of the component will be adjusted to fit into the table
&nbsp;|*vTableRow[{reference, vTableCell[reference,value,component[]]}]*|an array of table rows; each row is identified by a *reference* and contains an array of *vTableCell*-s; each *vTableCell* has a reference an a string value corresponding to the value of the cell component (the component can be specified in as the *component* field of the cell or the corresponding column); the component will be used only if the corresponding column is *editable*; otherwise, the cell value will be displayed as a text
||
&nbsp;|*RowChangeEvent*|emitted when the current row is changed (the current row is the row with the focused cell); the *value* field will contain the row index (starting from 0)
&nbsp;|*(component-specific events)*|if a default component for some column has been specified, each cell in that column will be represented by a copy of that component; such components will emit their events as usual, but the component passed to the event will be a cell element (some vTableRow[i].vTableCell[j])
||

## Example

A JSON file describing a sample dialog window can be obtained [here](https://github.com/LUMII-Syslab/imcs_dialogvisualizer/blob/master/src/dialog.json).

The result:

![The resulting dialog window](https://raw.githubusercontent.com/LUMII-Syslab/imcs_dialogvisualizer/master/doc/dialog_sample.png)

## Support for webAppOS

This library is used by webAppOS DialogEngine to visualize dialog windows. IMCSDialogVisualizer is written in such a way
that webAppOS web memory objects representing the tree of components can be passed "as is" as soon as they conform
to the IMCSDialogVisualizer metamodel.

Since webAppOS web memory objects do not have the className field, but have the getClassName() method,
IMCSDialogVisualizer will use getClassName() when className is not available.

If you are interested in webAppOS, please, visit its [homepage](http://webappos.org).

