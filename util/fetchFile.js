export const fetchFile = async (_data, options) => {
      let getContentLength, progress, handleError, error, controller;
      if (options) {
            getContentLength = options?.getContentLength;
            progress = options?.progress;
            handleError = options?.handleError;
            controller = options?.controller;
      }
      let data = _data;
      if (typeof _data === 'undefined') {
            return Promise.reject(new Error('Cannot be undefined'));
      }

      if (typeof _data === 'string' && _data !== "") {
            const res = await fetch(new URL(_data), { signal: controller.signal })
                  .then(response => {
                        if (typeof getContentLength === 'function') {
                              const length = response.headers.get('Content-Length');
                              getContentLength(parseInt(length ?? 0))
                        }
                        return response.body;
                  })
                  .then(rs => consume(rs))
                  .then(rs => new Response(rs))
                  .then(rs => rs.blob())
                  .catch(err => {
                        if (!controller.signal.aborted && typeof handleError === 'function') {
                              handleError(err);
                        } else {
                              handleError('')
                        }
                        error = err;
                  });
            if (!error) {
                  data = await res.arrayBuffer();
            } else {
                  return Promise.reject(error);
            }
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