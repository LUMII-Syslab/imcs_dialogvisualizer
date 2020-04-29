import React from 'react';
import Component from "./Component.js";
import {Button as BPButton, Popover} from "@blueprintjs/core";
import measure from "./measure";
import $ from "jquery";


class Image extends Component {

  constructor(props) {
    super(props);
    let myThis = this;

    this.picturesPath = props.picturesPath;
    if (!this.picturesPath) {
      this.picturesPath = this.state.tree.picturesPath;
    }
    if (!this.picturesPath) {
      let i = document.location.pathname.lastIndexOf("/");
      if (i>=0) {
        this.picturesPath = document.location.pathname.substring(0, i+1)+"Pictures/";        
      }
      else
        this.picturesPath = "/Pictures/";
    }
    this.getListing = props.getListing;
    if (!this.getListing) {
      this.getListing = this.state.tree.getListing;
    }
    if (!this.getListing) {
      this.getListing = async function() {
        return new Promise(function(resolve, reject) {
          console.log("qq", myThis.picturesPath);
          $.ajax({
            url: myThis.picturesPath,
            context: document.body
          }).done(function(x) {
            if (typeof x === "string" && x.charAt(0)==="<") {
              let parser = new DOMParser();
              let xml = parser.parseFromString(x,"text/html");
              let arr = xml.getElementsByTagName("a");
              let retVal = [];
              for (let i=0; i<arr.length; i++) {
                let item = arr[i].href;
                let j = item.lastIndexOf("/");
                if (j>=0)
                  item = item.substring(j+1);

                
                if (item.indexOf(".")===0)
                  continue;

                j = item.lastIndexOf(".");
                if (j>=0) {
                  let ext = item.substring(j+1).toLowerCase();
                  if ((ext==="bmp") || (ext==="png") || (ext==="svg") || (ext==="ico") || (ext==="gif"))
                    retVal.push(myThis.picturesPath+item);
                }
              }
              resolve(retVal);
            }
            else
              reject("directory listing is not html/xml; please, provide either a picturesPath component field (or react prop) or a getListing field (or react prop) as an async function returning an array of URL paths with images");
          });
        });
      };
    }


    let fileName = this.state.tree.fileName;
    if (!fileName)
      fileName = "";
    fileName = fileName.split("\\").join("/");
    let i = fileName.lastIndexOf("/");
    if (i>=0)
      fileName = fileName.substring(i+1);

    this.state.fileName = this.picturesPath+fileName;


    this.state.pictures = [];
    this.state.isPopoverOpen = false;

    this.getListing().then(function(arr) {
      myThis.setState({
        pictures: arr
      })
    }).catch(function(e){
      console.log(e);
    });

  }

  getBounds() {

    let m = measure(this.myRef.current.buttonRef);
    m.w++; // add 1 pixel to ensure the label fits

    //m.w=150;
    //m.h=150;

    return super.getBounds({
      minimumWidth: m.w,
//      preferredWidth: 0,
      maximumWidth: m.w,
      minimumHeight: m.h,
      maximumHeight: m.h
    });
  } 

  onClick(fileName) {
    

    this.setState({fileName: fileName, isPopoverOpen: false}, ()=>{
      this.context.eventHandler({component:this.state.tree, eventName:"ImageChangeEvent", value:this.state.fileName});
    });


    /*this.getListing().then(function(arr) {
      console.log(arr);

    }).catch(function(e){
      console.log(e);
    })*/

    

/*    if (this.state.tree.closeOnClick) {

      let child = this;
      let parent = null;
      for (;;) {
        parent = this.context.reference2react[child.props.parentReference];
        if (!parent)
          break;
        child = parent;
      }

      let form = child;
      if (form.close)
        form.close();

    }*/

  }

  render() {
    let editable = typeof(this.state.tree.editable)==="undefined" || this.state.tree.editable;

    let myThis = this;

    let imgs = this.state.pictures.map((item, index)=>{
      let arr = [];
      arr.push(<div onClick={(e)=>myThis.onClick(item)} style={{display:"inline-block", align:"center", width:"60px", height:"60px", cursor:"pointer"}}>
                <div style={{marginLeft:"5px", marginTop:"5px", display:"inline-block",width:"50px", height:"50px"}}><img alt={item} src={item} width='50px' height='auto'></img></div>
              </div>);
      if ((index+1)%10===0)
        arr.push(<br/>);
      return arr;
    });

    console.log("IMAGES",imgs,editable,this.state.enabled);

    if (this.state.pictures.length===0)
      imgs = <div style={{padding:"5px", width:"100%", height:"100%"}}>No images found</div>;

    return (
      <BPButton ref={this.myRef} style={this.state.style} disabled={!editable || !this.state.enabled} onClick={(e)=>this.setState({isPopoverOpen:!this.state.isPopoverOpen})}>
      <Popover style={{zIndex:100000,...this.state.style}} content={imgs} isOpen={this.state.isPopoverOpen} onInteraction={(value)=>{console.log(value);this.setState({isPopoverOpen:editable&&this.state.enabled&&value})}}>
        <img alt={this.state.fileName} style={{width:"100%", height:"auto"}} src={this.state.fileName}/>
      </Popover>
      </BPButton>
    );
  }
}

export default Image;

