
export function getComponentTypeByTree(tree) {
    let className = tree.className;
    if (!className)
        className = tree.getClassName();
    let j = className.indexOf("#");
    if (j>=0)
        className = className.substr(j+1);

    let q = window.ComponentTypes[className];
    return q;
}
  
