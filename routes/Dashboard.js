import express from 'express'
import { Getalldata, GetUser, Userdelete } from '../controllers/Dashboard.js'
import { isAdmin } from '../middleware/isAdmin.js'

const DashboardRoutes = express.Router()

DashboardRoutes.get('/',isAdmin,Getalldata)
DashboardRoutes.get('/users',isAdmin,GetUser)
DashboardRoutes.delete('/deleteuser/:id',isAdmin,Userdelete)

export default DashboardRoutes