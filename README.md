[![License](https://img.shields.io/badge/license-multiple--foss--licenses-brightgreen)](https://raw.githubusercontent.com/LUMII-Syslab/imcs_dialogvisualizer/master/imcs_dialogvisualizer.COPYING)

# IMCS Dialog Visualizer
IMCS Dialog Visualizer (imcs_dialogvisualizer) is a JavaScript library for visualizing dialog windows described in JSON. Useful for displaying generated dialogs, since the library will lay out the dialog window nicely.
It has been created by Sergejs Kozlovičs by utilizing multiple libraries (see the [license file]((https://raw.githubusercontent.com/LUMII-Syslab/imcs_dialogvisualizer/master/imcs_dialogvisualizer.COPYING)) for details).

The JS module imcs_dialogvisualizer.js provides the IMCSDialogVisualizer JavaScript "class" (an object that support the "new" operator).

## How to import the library

### Using a script tag (local .js):
```html
<script type="text/javascript" src="dist/imcs_dialogvisualizer.js"></script>
```

### Using a script tag (remote .js):
```html
<script type="text/javascript" src="https://raw.githubusercontent.com/LUMII-Syslab/imcs_dialogvisualizer/master/dist/imcs_dialogvisualizer.js"></script>
```

### Using as a node.js/npm package:
  1) install the package:
     ```bash
     npm install @LUMII-Syslab/imcs_dialogvisualizer --registry=https://npm.pkg.github.com
     ```
  2) import it and use in your code:
     ```bash
     import IMCSDialogVisualizer from '@LUMII-Syslab/imcs_dialogvisualizer';
     ```

## API Documentation

* [IMCSDialogVisualizer](https://github.com/LUMII-Syslab/imcs_dialogvisualizer/blob/master/doc/IMCSDialogVisualizer.md)

## Sample Dialog

* A dialog example can be found [here](https://github.com/LUMII-Syslab/imcs_dialogvisualizer/blob/master/src/dialog.json).
* A sample dialog invocation from HTML can be found [here](https://github.com/LUMII-Syslab/imcs_dialogvisualizer/blob/master/public/index.html).

#### The resulting dialog window for dialog.json
![The resulting dialog window for dialog.json](https://raw.githubusercontent.com/LUMII-Syslab/imcs_dialogvisualizer/master/doc/dialog_sample.png){:height="50%" width="50%"}
#### The resulting dialog window for index.html
![The resulting dialog window for index.html](https://raw.githubusercontent.com/LUMII-Syslab/imcs_dialogvisualizer/master/doc/index_sample.png){:height="50%" width="50%"}


## How to compile from sources

```bash
npm install
npm run build
```

## Related Publications

* S. Kozlovics. A Dialog Engine Metamodel for the Transformation-Driven Architecture. In: Scientific Papers, University of Latvia. vol. 756, pp. 151-170 (2010)
  - src/code/lv/lumii/dialoglayout
* S. Kozlovics. Calculating The Layout For Dialog Windows Specified As Models. In: Scientific Papers, University of Latvia. vol. 787, pp. 106-124 (2012)
  - src/code/lv/lumii/dialoglayout
