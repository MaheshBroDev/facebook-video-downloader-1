const fetchFile = require('./fetchFile');
import { ffmpeg } from "./ffmpeg";

export function Cleaner(raw_text) {
      this.value = raw_text ?? "";
      this.clean = function (...args) {
            args.length !== 0 && [...args].map(trash =>
                  this.value = this.value.replaceAll(trash, ""))
            return this;
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

function solveCors(link) {
      const regex = /(?<=video)(.*?)(?=.xx)/s;
      return link.replace(regex, "");
}

function extractLink(str, regex) {
      const extractedResult = (str + "").match(regex)[0] ?? "";
      return solveCors(extractedResult);
}

export function extractVideoLink(str, media) {
      const regex = new RegExp('(?<=FBQualityLabel="' + media + '">u003CBaseURL>)(.*?)(?=u003C\/BaseURL)', "s");
      return extractLink(str, regex);
}

export function extractAudioLink(str) {
      const regex = /(?<="audio":\[{"url":")(.*?)(?="\,"start":0)/s;
      return extractLink(str, regex);
}


export async function mergeVideo(video, audio, options) {
      if (!ffmpeg.isLoaded()) {
            await ffmpeg.load();
            ffmpeg.setProgress(({ ratio }) => {
                  console.log('parsing', (parseInt(ratio) * 100) + '%')
            });
      }
      let videoSize = 0;
      const videoFile = await fetchFile(video, options);
      let audioSize = 0;
      ffmpeg.FS('writeFile', 'video.mp4', videoFile);
      const audioFile = await fetchFile(audio, options);
      ffmpeg.FS('writeFile', 'audio.mp4', audioFile);

      await ffmpeg.run('-i', 'video.mp4', '-i', 'audio.mp4', '-c', 'copy', 'output.mp4');
      let data = await ffmpeg.FS('readFile', 'output.mp4');
      return data;
};

