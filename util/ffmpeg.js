import { createFFmpeg } from '@ffmpeg/ffmpeg';

export const ffmpeg=createFFmpeg({
      log: true,
      corePath: '/ffmpeg-core.js'
});