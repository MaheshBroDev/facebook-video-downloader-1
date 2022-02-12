import { fetchFile } from "./fetchFile";
import { ffmpeg } from "./ffmpeg";

export function Cleaner(raw_text) {
      this.value = raw_text ?? "";
      this.clean = function (...args) {
            args.length !== 0 && [...args].map(trash =>
                  this.value = this.value.replaceAll(trash, ""))
            return this;
      }
};

export function checkResolutions(str) {
      return {
            '144p': (str + "").includes('FBQualityLabel="144p"'),
            '180p': (str + "").includes('FBQualityLabel="180p"'),
            '240p': (str + "").includes('FBQualityLabel="240p"'),
            '270p': (str + "").includes('FBQualityLabel="270p"'),
            '360p': (str + "").includes('FBQualityLabel="360p"'),
            '480p': (str + "").includes('FBQualityLabel="480p"'),
            '540p': (str + "").includes('FBQualityLabel="540p"'),
            '720p': (str + "").includes('FBQualityLabel="720p"'),
            '1080p':(str + "").includes('FBQualityLabel="1080p"'),
      }
}

function solveCors(link) {
      console.log('origin:',link)
      const regex = /(?<=video)(.*?)(?=.fbcdn)/s;
      return link.replace(regex, ".xx");
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
      const videoFile = await fetchFile(video, options);
      ffmpeg.FS('writeFile', 'video.mp4', videoFile);
      const audioFile = await fetchFile(audio, options);
      ffmpeg.FS('writeFile', 'audio.mp4', audioFile);

      await ffmpeg.run('-i', 'video.mp4', '-i', 'audio.mp4', '-c', 'copy', 'output.mp4');
      let data = await ffmpeg.FS('readFile', 'output.mp4');
      return data;
};

export {ffmpeg};
