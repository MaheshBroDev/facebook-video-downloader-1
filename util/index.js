import { fetchFile } from "@ffmpeg/ffmpeg";
import { ffmpeg } from "./ffmpeg";

export function cleanLink(raw_link) {
      let value = raw_link ?? "";
      const clean = function (...args) {
            args.length !== 0 && [...args].map(trash =>
                  value = value.replaceAll(trash, ""))
            window.navigator.clipboard.writeText(value);
            return {
                  value,
                  clean: this
            }
      }
      return {
            value,
            clean
      }
};

export function checkMedia(str) {
      return {
            sd: (str + "").includes('FBQualityClass="sd"'),
            hd: (str + "").includes('FBQualityClass="hd"')
      }
}

export function checkResolutions(str) {
      return {
            '144p': (str + "").includes('FBQualityLabel="144p"'),
            '240p': (str + "").includes('FBQualityLabel="240p"'),
            '360p': (str + "").includes('FBQualityLabel="360p"'),
            '480p': (str + "").includes('FBQualityLabel="480p"'),
            '720p': (str + "").includes('FBQualityLabel="720p"')
      }
}

export function extractVideoLink(str, media) {
      const regex = new RegExp('(?<=FBQualityLabel="' + media + '">u003CBaseURL>)(.*?)(?=u003C\/BaseURL)', "s");
      const result = (str + "").match(regex);
      console.log('result ', result);
      return result ? result[0] : "";
}

export function extractAudioLink(str) {
      const regex = /(?<="audio":\[{"url":")(.*?)(?="\,"start":0)/s;
      return (str + "").match(regex)[0];
}

export function consume(reader) {
      var total = 0
      return new Promise((resolve, reject) => {
            function pump() {
                  reader.read().then(({ done, value }) => {
                        if (done) {
                              resolve()
                              return
                        }
                        total += value.byteLength
                        log(`received ${value.byteLength} bytes (${total} bytes in total)`)
                        pump()
                  }).catch(reject)
            }
            pump()
      })
}


export async function mergeVideo(video, audio) {
      if (!ffmpeg.isLoaded()) {
            await ffmpeg.load();
            ffmpeg.setProgress(({ ratio }) => {
                  console.log('parsing', (parseInt(ratio) * 100) + '%')
            });
      }
      const videoFile = await fetchFile(video);
      ffmpeg.FS('writeFile', 'video.mp4', videoFile);
      const audioFile = await fetchFile(audio);
      ffmpeg.FS('writeFile', 'audio.mp4', audioFile);

      await ffmpeg.run('-i', 'video.mp4', '-i', 'audio.mp4', '-c', 'copy', 'output.mp4');
      let data = await ffmpeg.FS('readFile', 'output.mp4');
      return data;
};

export async function downloadMedia(link) {
      const res = await fetch(link, { mode: 'no-cors' });
      return URL.createObjectURL(new Blob([res.buffer],
            { type: 'video/mp4' }))
}