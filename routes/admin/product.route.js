const express = require('express')
const route = express.Router()
const multerHelper = require('../../helpers/multer.helper')

const upload = multerHelper()

const controller = require('../../controllers/admin/product.controller')
const validate = require('../../validates/admin/product.validate')

route.get('/',controller.index)
route.get('/trash',controller.trash)
route.get('/create',controller.create)
route.get('/edit/:id',controller.edit)
route.get('/detail/:id',controller.detail)
route.post('/create',upload.single('thumbnail'),validate.createPost,controller.createPost)
route.patch('/change-status/:status/:id',controller.changeStatus)
route.patch('/change-multi',controller.changeMulti)
route.patch('/edit/:id',upload.single('thumbnail'),validate.createPost,controller.editPatch)
route.patch('/restore/:id',controller.restoreItem)
route.delete('/delete/:id',controller.deleteItem)
route.delete('/delete-force/:id',controller.deleteForce)

module.exports = route;