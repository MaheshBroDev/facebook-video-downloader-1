import React from 'react'
import Head from 'next/head'

function MyApp({ Component, pageProps }) {
      return (
            <>
                  <Head>
                        <title>HD Video Downloader For Facebook</title>
                        <meta name="title" content="HD Video Downloader For Facebook"></meta>
                        <meta name="description" content="Private videos in facebook can be downloaded in multiple resolutions of 144 to 720 pixels."></meta>

                        <meta property="og:type" content="website"></meta>
                        <meta property="og:url" content="https://download-facebook-video.vercel.app/"></meta>
                        <meta property="og:title" content="HD Video Downloader For Facebook"></meta>
                        <meta property="og:description" content="Private videos in facebook can be downloaded in multiple resolutions of 144 to 720 pixels."></meta>
                        <meta property="og:image" content="https://download-facebook-video.vercel.app/app.png"></meta>

                        <meta property="twitter:card" content="summary_large_image"></meta>
                        <meta property="twitter:url" content="https://download-facebook-video.vercel.app/"></meta>
                        <meta property="twitter:title" content="HD Video Downloader For Facebook"></meta>
                        <meta property="twitter:description" content="Private videos in facebook can be downloaded in multiple resolutions of 144 to 720 pixels."></meta>
                        <meta property="twitter:image" content="https://download-facebook-video.vercel.app/app.png"></meta>
                  </Head>
                  <Component {...pageProps} />
            </>
      )
}

export default MyApp