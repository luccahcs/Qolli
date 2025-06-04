import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'Qolli',
  webDir: 'www',
  plugins: {
    Keyboard: {
      resize: 'body', // or 'ionic'
      style: 'light',
      resizeOnFullScreen: true,
    },
  },
};

export default config;