import Head from 'next/head'
import { useEffect } from 'react';
import { downloadMedia } from '../util';

export default function Home() {
      useEffect(() => {
            window.onmessage = async (e) => {
                  if (typeof e.data === 'string') {
                        const obj = JSON.parse(e.data);
                        if (obj.from === 'downloader-fb-hd') {
                              const msg = obj.data;
                              console.log('received in home',msg);
                              const video = await downloadMedia(msg.video);
                              const audio = await downloadMedia(msg.audio);
                              const data = {
                                    video,
                                    audio
                              }
                              if (video && audio)
                                    e.source.postMessage(JSON.stringify({
                                          from: 'downloader-fb-hd',
                                          data
                                    }), '*');
                        }
                  }
            };
      }, [])
      return (
            <div className="container">
                  <Head>
                        <title>Create Next App</title>
                        <link rel="icon" href="/favicon.ico" />
                  </Head>
                  <div className="container">
                        <h1>Main app</h1>
                        <iframe width="500px" height="600px" src="/downloads/download"></iframe>
                  </div>
                  <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
      `}</style>

                  <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
            </div>
      )
}
