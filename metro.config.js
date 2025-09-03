const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

// تحسينات الأداء
config.resolver.alias = {
  ...config.resolver.alias,
  'expo/virtual/streams.js': require.resolve('stream'),
};

// تحسين التخزين المؤقت
config.transformer.minifierConfig = {
  keep_fnames: true,
  mangle: {
    keep_fnames: true,
  },
};

module.exports = config;