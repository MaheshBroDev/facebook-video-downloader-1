export function MediaOptions({
      resolutions = {},
      selectMedia }) {
      return (
            <>
                  <div className="options">
                        {
                              Object.values(resolutions).some(v => v)
                                    ? <>
                                          <div id="sd">
                                                <div id="p144"
                                                      className={resolutions['144p'] ? "" : "hide"}>
                                                      <input type="radio" name="media"
                                                            onClick={selectMedia} value="144p" />
                                                      <label>144p</label>
                                                </div>

                                                <div id="p240"
                                                      className={resolutions['240p'] ? "" : "hide"}>
                                                      <input type="radio" name="media"
                                                            onClick={selectMedia} value="240p" />
                                                      <label>240p</label>
                                                </div>

                                                <div id="p360"
                                                      className={resolutions['360p'] ? "" : "hide"} >
                                                      <input type="radio" name="media"
                                                            onClick={selectMedia} value="360p" />
                                                      <label>360p</label>
                                                </div>

                                                <div id="p480"
                                                      className={resolutions['480p'] ? "" : "hide"} >
                                                      <input type="radio" name="media"
                                                            onClick={selectMedia} value="480p" />
                                                      <label>480p</label>
                                                </div>

                                                <div id="p540"
                                                      className={resolutions['540p'] ? "" : "hide"} >
                                                      <input type="radio" name="media"
                                                            onClick={selectMedia} value="540p" />
                                                      <label>540p</label>
                                                </div>
                                          </div>
                                          <div id="hd">
                                                <div id="p720"
                                                      className={resolutions['720p'] ? "" : "hide"} >
                                                      <input type="radio" name="media"
                                                            onClick={selectMedia} value="720p" />
                                                      <label>720p</label>
                                                </div>
                                          </div>
                                    </>
                                    : <p className="error">Can't find any media!</p>}
                  </div>
                  <style jsx>{`
                        .options{
                              padding:10px 20px 0;
                              margin-top:10px;
                              min-width:0;
                              min-height:140px;
                              display:flex;
                              gap:20px;
                        }
                        #hd,#sd{
                              flex:1;
                              display:flex;
                              flex-direction:column;
                              gap:5px;
                        }

                        input[name="media"]{
                              margin-right:8px;
                        }
                        .error{
                              color:red;
                              text-align:center;
                              width:100%;
                        }
                        #p144,#p240,#p360,#p480,#p540,#p720{
                              display:flex;
                              justify-content:center;
                        }
                  `}</style>
            </>
      )
}