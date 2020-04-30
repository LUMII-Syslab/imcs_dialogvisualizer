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
|| component | a dialog component (from the tree), where the event occurred;|
|| eventName | the event name (e.g., "Click") corresponding to the metamodel (without the "on" prefix);|
|| value | an event-specific value (if applicable),  e.g., the string value of the input field;|
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

The tree of components is organized by means of containers via the "component" link. The following fragment lists the currently supported containers and how they are linked
to components. Notice that each container is also a component.


![Containers From Dialog Enginge Metamodel](https://raw.githubusercontent.com/LUMII-Syslab/imcs_dialogvisualizer/master/doc/containers.png)

|Container class|Description|
|---------------|-----------|
|Container|Abstract class, not used directly|
|VerticalBox|Children are laid out vertically|
|HorizontalBox|Children are laid out horizontally|
|GroupBox|A visible container with a bevel, where elements can be visually grouped together. Useful for radio buttons and other related components.|
|Column|Similar to VerticalBox, but children of neighbouring columns will be aligned into a table.|
|Row|Similar to HorizontallBox, but children of neighbouring rows will be aligned into a table.|
|Stack|Children will be organized into layers, one on top of another, like a card stack. Used to implement TabContainer.|
|TabContainer|A visible container, where several tabs occupy the same space, and the user can switch between tabs. Child componenets must be of type Tab.|
|Tab|A visible tab container with a caption. It must be a child (via the component/container link) of TabContainer. The children within a Tab are laid out vertically.|

### The Form Container
Besides the abovementioned containers, there is also the *Form* container, which must be the root of the tree of components. If the *embedded* setting is false, the form can contain the *caption*
attribute to be displayed as a title. *Form* is a subclass of *VerticalBox*; thus, child components are laid out vertically. However, a *HorizontalBox* or a *Row* can be attached as a child component to describe a horizontal layout.

Mapping to JavaScript objects is as follows:
* Class names are mapped to the "className" field. If the class name contains some prefix ending with #, the prefix is automatically dropped, e.g., D#HorizontalBox becomes HorizontalBox.
* Class attributes are mapped to the fileds of the corresponding JavaScript/JSON objects.
* Links are mapped to the array fields. 
* Besides, each component must have a unique integer *reference* field. It is used by IMCSDialogVisualizer internally. In addition, it can be used to specify cross-links, e.g., the *activeTab* link to an existing child *Tab*.

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