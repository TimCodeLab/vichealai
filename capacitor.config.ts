import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.techocam.app',
  appName: 'techocam',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
    },
    SQLite: {
      iosDatabaseLocation: 'Library/Databases',
      iosEncryption: false,
      androidEncryption: false,
      androidBiometric: {
        biometricAuth: false,
        biometricTitle: 'Biometric login for database encryption',
        biometricSubtitle: 'Log in to access the database',
      },
    }
  }
};

export default config;
