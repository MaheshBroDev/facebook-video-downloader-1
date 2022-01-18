import React from "react";

export default class Download extends React.Component{
      clickHandler=()=>window.parent.postMessage('message','*');
      render(){
            return (
                  <>
                        <h1>Hello</h1>
                        <button onClick={this.clickHandler}>test</button>
                  </>
            );
      }
}