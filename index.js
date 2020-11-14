const express = require("express")
const app = express()

app.set('secret', 'djnf7249845sjndskjd')
app.use(require('cors')())
app.use(express.json())
app.use('/uploads', express.static(__dirname + '/uploads')) // 托管静态文件

require('./plugins/db')(app)
require('./routes/admin')(app)





app.listen(3000, function() {
    console.log('listening on *:3000');
});