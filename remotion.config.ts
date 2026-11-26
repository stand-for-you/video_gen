import { Config } from '@remotion/cli/config';
// WebGL: the sets are real 3D, so the renderer needs a GPU-backed Chrome. angle+swiftshader
// is the configuration that works headlessly on a cloud box with no GPU.
Config.setChromiumOpenGlRenderer('angle');
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(92);
Config.setConcurrency(2);
Config.setChromiumDisableWebSecurity(false);
Config.setDelayRenderTimeoutInMilliseconds(60000);
