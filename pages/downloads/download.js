import React from "react";
import { createFFmpeg } from '@ffmpeg/ffmpeg';

export default class Download extends React.Component{
      state={
            videoSrc:""
      }
      ffmpeg = createFFmpeg({
            log: true,
            corePath: '/ffmpeg-core.js'
          });
      doTranscode=async ()=>{
            await this.ffmpeg.load();

      }
      clickHandler=()=>window.parent.postMessage('message','*');
      render(){
            return (
                  <>
                        <h1>Hello</h1>
                        <video src={this.state.videoSrc}></video>
                        <button onClick={this.doTranscode}>test</button>
                  </>
            );
      }
}