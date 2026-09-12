const app = require('./app.json');

const mapsConfig = {};

if (process.env.GOOGLE_MAPS_ANDROID_API_KEY) {
  mapsConfig.androidGoogleMapsApiKey = process.env.GOOGLE_MAPS_ANDROID_API_KEY;
}

if (process.env.GOOGLE_MAPS_IOS_API_KEY) {
  mapsConfig.iosGoogleMapsApiKey = process.env.GOOGLE_MAPS_IOS_API_KEY;
}

module.exports = ({ config }) => ({
  ...config,
  ...app.expo,
  plugins: [
    ...app.expo.plugins,
    ['react-native-maps', mapsConfig],
  ],
});
