import { createFFmpeg } from '@ffmpeg/ffmpeg';

export const ffmpeg=createFFmpeg({
      log: false,
      corePath: '/ffmpeg-core.js'
});