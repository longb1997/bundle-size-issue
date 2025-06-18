import { merge } from 'webpack-merge';
import common from './webpack.config.mjs';

export default (env) => merge(common({...env, mode: 'production'}), {

})
