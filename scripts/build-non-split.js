const rewire = require('rewire');
const defaults = rewire('react-scripts/scripts/build.js');
let config = defaults.__get__('config');

config.optimization.splitChunks = {
    cacheGroups: {
        default: false,
    },
};

config.optimization.runtimeChunk = false;

//config.output.filename = 'static/js/[name].js';
//config.output.filename = 'static/js/imcs_dialogvisualizer.js';
config.output.filename = 'imcs_dialogvisualizer.js';

//config.plugins[5].options.filename = 'static/css/[name].css';
//config.plugins[5].options.filename = 'static/css/imcs_dialogvisualizer.css';
config.plugins[5].options.filename = 'imcs_dialogvisualizer.css';

//config.plugins[5].options.moduleFilename = () => 'static/css/main.css';
//config.plugins[5].options.moduleFilename = () => 'static/css/imcs_dialogvisualizer.css';

config.plugins[5].options.moduleFilename = () => 'imcs_dialogvisualizer.css';
