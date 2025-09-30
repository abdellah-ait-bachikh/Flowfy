module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],  // 👈 use this instead of metro-react-native-babel-preset
    plugins: [
      'react-native-reanimated/plugin', // 👈 must be last
    ],
  };
};
