import React from "react";
import {
      checkMedia,
      checkResolutions,
      Cleaner,
      extractVideoLink,
      extractAudioLink,
      mergeVideo,
} from '../util';
import Modal from '../components/Modal';

export default class Home extends React.Component {
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
            loading: false,
            isModalVisible: false,
            status: ":D",
      }

      async componentDidMount() {
            if (crossOriginIsolated)
                  console.log('SharedArrayBuffer enabled.')
      }

      onChangeInput = (e) => {
            this.setState(prevState => {
                  const cleaner = new Cleaner(e.target.value);
                  let resourceStr = cleaner.clean("\\", "amp;", " ").value;
                  return {
                        ...prevState,
                        resourceStr
                  }
            })
      }

      checkHDhandler = () => {
            const media = checkMedia(this.state.resourceStr);
            this.setState(prevState => {
                  return {
                        ...prevState,
                        media
                  }
            })
            if (media.hd || media.sd) {
                  const resolutions = checkResolutions(this.state.resourceStr);
                  // console.log('resolutions', resolutions);
                  this.setState(prevState => {
                        return {
                              ...prevState,
                              resolutions,
                              isModalVisible: true
                        }
                  })
            }
      }

      extractLinkHandler = async () => {
            const { resourceStr, selectedMedia } = this.state;
            if (resourceStr && selectedMedia) {
                  this.setState(prevState => {
                        return {
                              ...prevState,
                              loading: true,
                              isModalVisible: false,
                              status: ""
                        }
                  })
                  const video_link = extractVideoLink(resourceStr, selectedMedia);
                  const audio_link = extractAudioLink(resourceStr);
                  const data = await mergeVideo(video_link, audio_link);
                  const videoSrc = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
                 
                  this.setState(prevState => {
                        return {
                              ...prevState,
                              videoSrc,
                              loading: false,
                              status: "Thanks for using my app. :D",
                        }
                  })
            }
      }

      selectMedia = (e) => {
            this.setState(prevState => {
                  return {
                        selectedMedia: e.target.value
                  }
            })
      }
      hideModal = (that) => {
            that.setState(prevState => {
                  return {
                        ...prevState,
                        isModalVisible: false
                  }
            })
      }

      render() {
            const spinner = (
                  <>
                        <div className="lds-ellipsis">
                              <div></div>
                              <div></div>
                              <div></div>
                              <div></div>
                        </div>
                  </>
            );
            return (
                  <>
                        <div className="container">
                              <h1>Facebook Video Downloader</h1>
                              <textarea className="input-box"
                                    placeholder="view-source: link and paste here"
                                    onChange={this.onChangeInput} ></textarea>

                              <button onClick={this.checkHDhandler}
                                    className="check-button">
                                    Check SD/HD</button>
                              
                              <div className="status">{this.state.status}{this.state.loading && spinner}</div>
                              {this.state.videoSrc && <video className="video-player"
                                    src={this.state.videoSrc} controls></video>}
                        </div>
                        <Modal
                              visible={this.state.isModalVisible}>
                              <h2>Select Resolution</h2>
                              <div className="options">
                                    <div id="sd" className={this.state.media.sd ? "" : "hide"}>
                                          <p>SD:</p>

                                          <div id="p144"
                                                className={this.state.resolutions['144p'] ? "" : "hide"}>
                                                <input type="radio" name="media"
                                                      onClick={this.selectMedia} value="144p" />
                                                <label>144p</label>
                                          </div>

                                          <div id="p240"
                                                className={this.state.resolutions['240p'] ? "" : "hide"}>
                                                <input type="radio" name="media"
                                                      onClick={this.selectMedia} value="240p" />
                                                <label>240p</label>
                                          </div>

                                          <div id="p360"
                                                className={this.state.resolutions['360p'] ? "" : "hide"} >
                                                <input type="radio" name="media"
                                                      onClick={this.selectMedia} value="360p" />
                                                <label>360p</label>
                                          </div>

                                          <div id="p480"
                                                className={this.state.resolutions['480p'] ? "" : "hide"} >
                                                <input type="radio" name="media"
                                                      onClick={this.selectMedia} value="480p" />
                                                <label>480p</label>
                                          </div>
                                    </div>
                                    <div id="hd"
                                          className={this.state.media.hd ? "" : "hide"}>
                                          <p>HD:</p>
                                          <div id="p720"
                                                className={this.state.resolutions['720p'] ? "" : "hide"} >
                                                <input type="radio" name="media"
                                                      onClick={this.selectMedia} value="720p" />
                                                <label>720p</label>
                                          </div>
                                    </div>
                              </div>
                              <div className="modal-footer">
                                    <button onClick={() => this.hideModal(this)}
                                          className="button">
                                          Cancel
                                    </button>
                                    <button
                                          className={(this.state.loading || !this.state.selectedMedia)
                                                ? "button disabled" : "button"}
                                          onClick={this.extractLinkHandler}
                                          disabled={this.state.loading || !this.state.selectedMedia}>
                                          Download</button>
                              </div>
                        </Modal>
                        <style jsx>{`
                              .container {
                                    width:100vw;
                                    min-height: 100vh;
                                    padding: 0 0.5rem;
                                    display: flex;
                                    flex-direction: column;
                                    justify-content: center;
                                    align-items: center;
                                    background:#ffffff;
                                    color:white;
                              }
                              .options{
                                    padding:0 20px;
                                    margin-top:10px;
                                    min-width:0;
                                    display:flex;
                                    gap:20px;
                              }
                              #hd,#sd{
                                    flex:1;
                              }
                              .hide{
                                    display:none;
                              }
                              .video-player{
                                    width:380px;
                              }
                              .input-box{
                                    margin:10px 0;
                                    border:none;
                                    outline:none;
                                    border-radius:5px;
                                    min-width:380px;
                                    min-height:120px;
                                    color:black;
                                    padding:8px;
                                    background:#e8eded;
                              }
                              .check-button{
                                    margin:10px 0;
                                    min-width:380px;
                                    min-height:40px;
                                    border:none;
                                    outline:none;
                                    border-radius:5px;
                                    background:#0a2342;
                                    color:white;
                                    text-align:center;
                              }
                              .check-button:hover{
                                    filter:brightness(1.5);
                                    transition:filter 300ms;
                              }
                              .status{
                                    color:#0b0a0a;
                                    min-width:380px;
                                    text-align:left;
                              }
                              .modal-footer{
                                    width:100%;
                                    padding:1rem 0;
                                    display:flex;
                                    justify-content:space-between;
                                    gap:20px;
                              }
                              .button{
                                    min-width:80px;
                                    padding:10px 25px;
                                    border-radius:5px;
                                    color:white;
                                    background:#29C5F6;
                                    text-align:center;
                                    border:none;
                              }
                              .button:hover{
                                    filter:brightness(1.3);
                                    transition:filter 300ms;
                              }
                              .disabled{
                                    filter:brightness(1) !important;
                                    background:#8d99ae !important;
                                    cursor: not-allowed;
                              }
                             
                        `}</style>

                        <style jsx global>{`
                              *{
                                    margin:0;
                                    box-sizing:border-box;
                              }
                              h1,
                              h2{
                                    color:#0b0a0a;
                              }
                              @media (max-width:480px){
                                    .check-button,
                                    .input-box,.status,
                                    .video-player{
                                          min-width:350px;
                                    }
                              }
                              .lds-ellipsis {
                                    display: inline-block;
                                    position: relative;
                                    background:yellow;
                                  }
                                  .lds-ellipsis div {
                                    position: absolute;
                                    width: 8px;
                                    height: 8px;
                                    border-radius: 50%;
                                    background: #0a2342;
                                    animation-timing-function: cubic-bezier(0, 1, 1, 0);
                                  }
                                  .lds-ellipsis div:nth-child(1) {
                                    left: 8px;
                                    animation: lds-ellipsis1 0.6s infinite;
                                  }
                                  .lds-ellipsis div:nth-child(2) {
                                    left: 8px;
                                    animation: lds-ellipsis2 0.6s infinite;
                                  }
                                  .lds-ellipsis div:nth-child(3) {
                                    left: 32px;
                                    animation: lds-ellipsis2 0.6s infinite;
                                  }
                                  .lds-ellipsis div:nth-child(4) {
                                    left: 56px;
                                    animation: lds-ellipsis3 0.6s infinite;
                                  }
                                  @keyframes lds-ellipsis1 {
                                    0% {
                                      transform: scale(0);
                                    }
                                    100% {
                                      transform: scale(1);
                                    }
                                  }
                                  @keyframes lds-ellipsis3 {
                                    0% {
                                      transform: scale(1);
                                    }
                                    100% {
                                      transform: scale(0);
                                    }
                                  }
                                  @keyframes lds-ellipsis2 {
                                    0% {
                                      transform: translate(0, 0);
                                    }
                                    100% {
                                      transform: translate(24px, 0);
                                    }
                                  }                                  
                        `}</style>
                  </>
            );
      }
}