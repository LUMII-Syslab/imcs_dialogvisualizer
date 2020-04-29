import VerticalBox from "./VerticalBox.js";

class Tab extends VerticalBox {

  constructor(props) {
    super(props);

    this.state.style.left = 0;
    this.state.style.top = 0;
}
    static getAnchor() {
      return "parent";
    }

    getBounds() {
      let retVal = super.getBounds({
        minimumWidth: 10,
        minimumHeight: 10,
        preferredWidth: 10,
        preferredHeight: 10,
        horizontalSpacing: 0,
        verticalSpacing: 10,
        leftPadding: 10,
        rightPadding: 10,
        topPadding: 10,
        bottomPadding: 10
      });

      retVal.verticalAlignment = "TOP";
      return retVal;
    }

}
  
export default Tab;
