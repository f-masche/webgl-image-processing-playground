const requireTextures = require.context('./', true, /^.*\.jpg$/);
export default requireTextures.keys();
