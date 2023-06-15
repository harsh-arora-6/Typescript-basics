const path = require('path');
module.exports = {
    entry:'./src/app.ts',
    output:{
        fileName:'bundle.js',
        path:path.resolve(__dirname,'dist')//dist = name should match with outDir of tsconfig
    }
}