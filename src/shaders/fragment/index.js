const requireShaders = require.context('./', true, /^.*\.gs$/);
export default requireShaders.keys().map((key) => ({
  code: requireShaders(key),
  key
}));
