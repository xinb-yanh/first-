module.exports = app => {
    const express = require('express')
    const jwt = require('jsonwebtoken')
    const assert = require('http-assert')
    const AdminUser = require('../../models/AdminUser')
    const router = express.Router({
            mergeParams: true
        })
        // const Category = require('../../models/Category')
    router.post('/', async(req, res) => {
        const model = await req.Model.create(req.body)
        res.send(model)
    })
    router.put('/:id', async(req, res) => {
        const model = await req.Model.findByIdAndUpdate(req.params.id, req.body)
        res.send(model)
    })
    router.delete('/:id', async(req, res) => {
        await req.Model.findByIdAndDelete(req.params.id, req.body)
        res.send({
            success: true
        })
    })
    router.get('/', async(req, res) => {
        const queryOptions = {}
        if (req.Model.modelName === 'Category') {
            queryOptions.populate = 'parent'
        }
        const items = await req.Model.find().setOptions(queryOptions).limit(10)
        res.send(items)
    })
    router.get('/:id', async(req, res) => {
            const model = await req.Model.findById(req.params.id)
            res.send(model)
        })
        // 登陆校验中间件
    const authMiddleware = require('../../middleware/auth')
    const resourceMiddleware = require('../../middleware/resource')
    app.use('/admin/api/rest/:resource', authMiddleware(), resourceMiddleware(), router)

    const multer = require('multer')
    const upload = multer({
        dest: __dirname + '/../../uploads'
    })
    app.post('/admin/api/upload', authMiddleware(), upload.single('file'), async(req, res) => {
        const file = req.file
        file.url = `http://114.215.198.191:8081/uploads/${file.filename}`
        res.send(file)
    })

    app.post('/admin/api/login', async(req, res) => {
        console.log(req.body);
        const { username, password } = req.body
        const user = await AdminUser.findOne({ username }).select('+password')
        assert(user, 422, '用户不存在')
        const isValid = require('bcrypt').compareSync(password, user.password)
        assert(isValid, 422, '密码错误')
        const token = jwt.sign({
            id: user._id,
        }, app.get('secret'))
        res.send({ token })
    });
    app.post('/admin/api/signin', async(req, res) => {
        console.log(req.body);
        if (!req.body.username)
            return assert('error', 422, 'username is required');
        if (!req.body.password)
            return assert('error', 422, 'password is required');
        const user = await AdminUser.findOne({ username }).exec();
        if (user) return assert(user, 422, '用户已存在');
        const adminuser = await AdminUser.create({ username: req.body.username, password: req.body.password });
        if (!adminuser)
            return assert('error', 422, 'adminuser not created ');
        const token = jwt.sign({
            id: adminuser._id,
        }, app.get('secret'));
        res.send({ token });
    });
    app.use(async(err, req, res, next) => {
        res.status(err.statusCode || 500).send({
            message: err.message
        })
    })
}