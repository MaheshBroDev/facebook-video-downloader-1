module.exports = {
      async headers() {
            return [
                  {
                        // matching all API routes
                        source: "/downloads/download",
                        headers: [
                              {
                                    "key": "Cross-Origin-Opener-Policy",
                                    "value": "same-origin"
                              },
                              {
                                    "key": "Cross-Origin-Embedder-Policy",
                                    "value": "require-corp"
                              },
                              {
                                    key: 'X-Frame-Options',
                                    value: 'SAMEORIGIN'
                              }
                        ]
                  }
            ]
      }
};