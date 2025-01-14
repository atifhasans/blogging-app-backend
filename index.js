import express from 'express';
import dontenv from 'dotenv'
import DBCon from './utils/db.js'
import AuthRoutes from './routes/Auth.js';
import cookieParser from 'cookie-parser';
import BlogsRoutes from './routes/Blog.js';
import DashboardRoutes from './routes/Dashboard.js';
import CommentRoutes from './routes/Comments.js';
import PublicRoutes from './routes/Public.js';

dontenv.config()


const PORT = process.env.PORT || 3000

const app = express();

// mongodb connection
DBCon()
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())
app.get("/",(req,res) => {
    res.send("hello from backend")
})
app.use('/auth',AuthRoutes)
app.use('/blog',BlogsRoutes)
app.use('/dashboard',DashboardRoutes)
app.use('/comment',CommentRoutes)
app.use('/public',PublicRoutes)

app.listen(PORT, () => {
    console.log(`app is running on PORT ${PORT}`)
}

)