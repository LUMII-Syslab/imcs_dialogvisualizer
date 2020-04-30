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

The tree of components is organized by means of containers.

![Containers From Dialog Enginge Metamodel](https://raw.githubusercontent.com/LUMII-Syslab/imcs_dialogvisualizer/master/doc/containers.png)

### Components