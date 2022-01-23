import React from "react";
import {
      checkMedia,
      checkResolutions,
      Cleaner,
      extractVideoLink,
      extractAudioLink,
      mergeVideo,
} from '../util';
import {
      Modal,
      Spinner,
      NetworkMonitor,
      MediaOptions,
      VideoPlayer
} from '../components/';

export default class Home extends React.Component {
      state = {
            contentLength: 0,
            chunkSize: 0,
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
            isModalVisible: false
      }

      update = (newObj) => {
            this.setState(prevState => {
                  return {
                        ...prevState,
                        ...newObj
                  }
            })
      }

      componentDidMount() {
            if (crossOriginIsolated)
                  console.log('SharedArrayBuffer enabled.')
      }

      onChangeInput = (e) => {
            const cleaner = new Cleaner(e.target.value);
            let resourceStr = cleaner.clean("\\", "amp;", " ").value;
            this.update({
                  resourceStr
            })
      }

      checkHDhandler = () => {
            const resolutions = checkResolutions(this.state.resourceStr);
            const media = checkMedia(resolutions);
            this.update({
                  resolutions,
                  isModalVisible: true,
                  media
            })
      }

      extractLinkHandler = async () => {
            const { resourceStr, selectedMedia } = this.state;
            if (resourceStr && selectedMedia) {
                  this.update({
                        loading: true,
                        isModalVisible: false,
                  })
                  const video_link = extractVideoLink(resourceStr, selectedMedia);
                  const audio_link = extractAudioLink(resourceStr);
                  const getContentLength = (length) => this.update({
                        contentLength: length + this.state.contentLength
                  });
                  const progress = ({ done, value }) => this.update({
                        chunkSize: this.state.chunkSize + value.byteLength
                  })
                  const data = await mergeVideo(video_link, audio_link,
                        { getContentLength, progress });
                  const videoSrc = URL.createObjectURL(new Blob([data.buffer],
                        { type: 'video/mp4' }));
                  this.update({
                        videoSrc,
                        loading: false,
                  })
            }
      }

      selectMedia = (e) => {
            this.update({
                  selectedMedia: e.target.value
            })
      }
      hideModal = () => {
            this.update({
                  isModalVisible: false
            })
      }

      render() {
            const contentLengthInMB = (this.state.contentLength / 1048576).toFixed(2);
            const chunkSizeInMB = (this.state.chunkSize / 1048576).toFixed(2);
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

                              <div className="status">
                                    <div>{this.state.loading && <Spinner />}</div>
                                    <div>
                                          {this.state.loading
                                                && <NetworkMonitor
                                                      contentLength={contentLengthInMB}
                                                      chunkSize={chunkSizeInMB} />}
                                    </div>
                              </div>
                              <VideoPlayer videoSrc={this.state.videoSrc} />
                        </div>
                        <Modal
                              visible={this.state.isModalVisible}>
                              <h2>Select Resolution</h2>
                              <MediaOptions
                                    resolutions={this.state.resolutions}
                                    selectMedia={this.selectMedia}
                                    media={this.state.media} />
                              <div className="modal-footer">
                                    <button onClick={this.hideModal}
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
                                    padding: 100px 0.5rem 0;
                                    display: flex;
                                    flex-direction: column;
                                    justify-content: flex-start;
                                    align-items: center;
                                    background:#ffffff;
                                    color:white;
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
                                    min-height:0px;
                                    box-sizing:border-box;
                                    display:grid;
                                    grid-template:auto / repeat(2,1fr);
                                    align-items:center;
                                    gap:25px;
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
                              .hide{
                                    display:none;
                              }
                              @media (max-width:480px){
                                    .check-button,
                                    .input-box,.status,
                                    .video-player{
                                          min-width:350px;
                                    }
                              }                               
                        `}</style>
                  </>
            );
      }
}