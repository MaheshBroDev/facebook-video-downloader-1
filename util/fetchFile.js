const resolveURL = require('resolve-url');

const readFromBlobOrFile = (blob) => (
      new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.onload = () => {
                  resolve(fileReader.result);
            };
            fileReader.onerror = ({ target: { error: { code } } }) => {
                  reject(Error(`File could not be read! Code=${code}`));
            };
            fileReader.readAsArrayBuffer(blob);
      })
);

module.exports = async (_data, callback) => {
      let data = _data;
      if (typeof _data === 'undefined') {
            return new Uint8Array();
      }

      if (typeof _data === 'string') {
            /* From base64 format */
            if (/data:_data\/([a-zA-Z]*);base64,([^"]*)/.test(_data)) {
                  data = atob(_data.split(',')[1])
                        .split('')
                        .map((c) => c.charCodeAt(0));
                  /* From remote server/URL */
            } else {
                  const res=await fetch(resolveURL(_data))
                        .then(response => response.body)
                        .then(rs =>consume(rs))
                        .then(rs => new Response(rs))
                        .then(rs => rs.blob());
                  data=await res.arrayBuffer();
            }
            /* From Blob or File */
      } else if (_data instanceof File || _data instanceof Blob) {
            data = await readFromBlobOrFile(_data);
      }

      function consume(rs){
            const reader = rs.getReader();
            return new ReadableStream({
                  async start(controller) {
                        while (true) {
                              const { done, value } = await reader.read();
                              if (done) {
                                    break;
                              }
                              if(typeof callback === 'function')
                              {
                                    callback({done,value})
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