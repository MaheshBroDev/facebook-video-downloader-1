import React from "react";
import {
      checkMedia,
      checkResolutions,
      cleanLink,
      extractVideoLink,
      extractAudioLink,
      mergeVideo
} from '../../util';

export default class Download extends React.Component {
      state = {
            videoSrc: "",
            resourceStr: "",
            media: {
                  sd: false,
                  hd: false,
            },
            resolutions: {
                  '144p': false,
                  '240p': false,
                  '360p': false,
                  '480p': false,
                  '720p': false,
            },
            selectedMedia: "",
      }

      componentDidMount() {
            window.onmessage = async (e) => {
                  if (typeof e.data === 'string') {
                        const obj = JSON.parse(e.data);
                        if (obj.from === 'downloader-fb-hd') {
                              const msg = obj.data;
                              console.log('received in download', msg);
                              const result = await mergeVideo(msg.video, msg.audio);
                              console.log(((result.length / 1024) / 1024).toFixed(2), 'MB');
                              const videoSrc = URL.createObjectURL(new Blob([result.buffer],
                                    { type: 'video/mp4' }));
                              this.setState(prevState => {
                                    return {
                                          ...prevState,
                                          videoSrc
                                    }
                              })
                        }
                  }
            }
      }

      postMessage = (msg) => window.parent.postMessage(msg, '*');


      onChangeInput = (e) => {
            this.setState(prevState => {
                  let resourceStr = cleanLink(e.target.value)
                        .clean("\\", "amp;", " ").value;
                  return {
                        ...prevState,
                        resourceStr
                  }
            })
      }

      checkHDhandler = () => {
            const media = checkMedia(this.state.resourceStr);
            console.log(media);
            this.setState(prevState => {
                  return {
                        ...prevState,
                        media
                  }
            })
            if (media.hd || media.sd) {
                  const resolutions = checkResolutions(this.state.resourceStr);
                  console.log('resolutions', resolutions);
                  this.setState(prevState => {
                        return {
                              ...prevState,
                              resolutions
                        }
                  })
            }
      }

      extractLinkHandler = () => {
            const { resourceStr, selectedMedia } = this.state;
            if (crossOriginIsolated)
                  console.log('SharedArrayBuffer enabled.')
            if (resourceStr && selectedMedia) {
                  const video_link = extractVideoLink(resourceStr, selectedMedia);
                  const audio_link = extractAudioLink(resourceStr);
                  const data = {
                        video: video_link,
                        audio: audio_link
                  };
                  this.postMessage(JSON.stringify({
                        from: 'downloader-fb-hd',
                        data
                  }));
            }
      }

      selectMedia = (e) => {
            this.setState(prevState => {
                  return {
                        selectedMedia: e.target.value
                  }
            })
      }

      render() {
            return (
                  <>
                        <div className="container">
                              <h1>Hello</h1>
                              <input onChange={this.onChangeInput} />
                              {this.state.videoSrc && <video src={this.state.videoSrc}></video>}
                              <div id="sd" className={this.state.media.sd ? "" : "hide"}>
                                    <p>SD:</p>

                                    <div id="p144" className={this.state.resolutions['144p'] ? "" : "hide"}>
                                          <input type="radio" name="media"
                                                onClick={this.selectMedia} value="144p" />
                                          <label>144p</label>
                                    </div>

                                    <div id="p240" className={this.state.resolutions['240p'] ? "" : "hide"}>
                                          <input type="radio" name="media"
                                                onClick={this.selectMedia} value="240p" />
                                          <label>240p</label>
                                    </div>

                                    <div id="p360" className={this.state.resolutions['360p'] ? "" : "hide"} >
                                          <input type="radio" name="media"
                                                onClick={this.selectMedia} value="360p" />
                                          <label>360p</label>
                                    </div>

                                    <div id="p480" className={this.state.resolutions['480p'] ? "" : "hide"} >
                                          <input type="radio" name="media"
                                                onClick={this.selectMedia} value="480p" />
                                          <label>480p</label>
                                    </div>
                              </div>
                              <div id="hd" className={this.state.media.hd ? "" : "hide"}>
                                    <p>HD:</p>
                                    <div id="p720" className={this.state.resolutions['720p'] ? "" : "hide"} >
                                          <input type="radio" name="media"
                                                onClick={this.selectMedia} value="720p" />
                                          <label>720p</label>
                                    </div>
                              </div>
                              <button onClick={this.checkHDhandler}>Check SD/HD</button>
                              <button onClick={this.extractLinkHandler}>Download</button>
                        </div>
                        <style jsx>{`
                              .container {
                                    min-width:100vw;
                                    min-height: 100vh;
                                    padding: 0 0.5rem;
                                    display: flex;
                                    flex-direction: column;
                                    justify-content: center;
                                    align-items: center;
                              }
                              .hide{
                                    display:none;
                              }
                        `}</style>
                  </>
            );
      }
}