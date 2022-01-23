
module.exports = async (_data, options) => {
      let getContentLength, progress;
      if (options) {
            getContentLength = options?.getContentLength;
            progress = options?.progress;
      }
      let data = _data;
      if (typeof _data === 'undefined') {
            return new Uint8Array();
      }

      if (typeof _data === 'string') {
            const res = await fetch(new URL(_data))
                  .then(response => {
                        if (typeof getContentLength === 'function') {
                              const length = response.headers.get('Content-Length');
                              getContentLength(parseInt(length ?? 0))
                        }
                        return response.body;
                  })
                  .then(rs => consume(rs))
                  .then(rs => new Response(rs))
                  .then(rs => rs.blob());
            data = await res.arrayBuffer();
      }

      function consume(rs) {
            const reader = rs.getReader();
            return new ReadableStream({
                  async start(controller) {
                        while (true) {
                              const { done, value } = await reader.read();
                              if (done) {
                                    break;
                              }
                              if (typeof progress === 'function') {
                                    progress({ done, value })
                              }
                              controller.enqueue(value);
                        }
                        controller.close();
                        reader.releaseLock();
                  }
            })
      }
      return new Uint8Array(data);
};