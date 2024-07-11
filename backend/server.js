require("dotenv").config();
const express = require("express")
const http = require('http');
const mongoose = require("mongoose")
const app = express();
const PORT = process.env.PORT || 8000;
const cors = require('cors');
const { Server } = require('socket.io');
const initializeChatSocket = require('./sockets/chat')
const userRoute = require("./routes/user")
const feedRoute = require("./routes/feed")
const teamRoute = require("./routes/team")
const fileRoute = require('./routes/files')
const chatRoute = require('./routes/chat')
const corsOptions = {
    credentials: true,
  };

app.use(express.json());
app.use(express.urlencoded({extended:false,useNewUrlParser: true, useUnifiedTopology: true}))
app.use(cors(corsOptions));
const server = http.createServer(app);


mongoose.connect(process.env.MONGO_URL)
.then(e => console.log("MongoDB Connected"));

const chatIo = initializeChatSocket(server);

app.get('/', (req, res) => {
    res.send('Welcome to the API');
});

app.use('/userAuth',userRoute);
app.use('/team',teamRoute);
app.use('/feed',feedRoute);
app.use('/files',fileRoute);
app.use('/chat',chatRoute);
app.set('chatIo', chatIo);
server.listen(PORT, () => {
    console.log('Server is running on port',PORT);
  });