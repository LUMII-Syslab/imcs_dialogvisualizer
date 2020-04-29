import $ from "jquery";

function measure(component) {
    let w = component.offsetWidth;
    let h =component.offsetHeight;

    if (!w && !h) {
        var $hiddenElement = $(component).clone().appendTo('body');
        w = $hiddenElement.outerWidth();
        h = $hiddenElement.outerHeight();      
        $hiddenElement.remove();      
    }

    return {w: Math.ceil(w), h: Math.ceil(h)}    
}

export default measure;
