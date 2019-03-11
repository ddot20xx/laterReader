// 创建web程序
// 搭建RESTful服务
// 持久化数据
// 使用模板
// post /articles
// get /articles/:id
// get /articles
// delete /articles/:id

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const Article = require('./db').Article
const read = require('node-readability')

app.use(express.static('static'))

// const port = process.env.PORT || 3000
app.set('port', process.env.PORT || 3000)

app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: true }))

app.use('/css/bootstrap.css',
    express.static('node_modules/bootstrap/dist/css/bootstrap.css'))

// const articles = [{title: 'example'}]
// const url = 'http://www.manning.com/cantelon2/'

app.get('/', (req, res) => {
    Article.all((err, articles) => {
        if (err) {
            return next(err)
        }
        res.redirect('/articles')
    })
})

app.get('/articles', (req, res, next) => {
    // res.send(articles)
    Article.all((err, articles) => {
        if (err) {
            return next(err)
        }
        res.format({
            html: () => {
                res.render('articles.ejs', { articles })
            },
            json: () => {
                res.send(articles)
            }
        })
    })
})

app.post('/articles', (req, res, next) => {
    // const article = { title: req.body.title }
    const url = req.body.url
    // console.log('***', url, typeof url)
    read(url, (err, result) => {
        // 结果有 .title, .content
        Article.new(
            {
                title: result.title,
                content: result.content
            },
            (err, article) => {
                // save to db
                if (err) {
                    return next(err)
                }
                // res.send('OK')
                Article.all((err, articles) => {
                    if (err) {
                        return next(err)
                    }
                    articles.push(article)
                    res.redirect('/articles')
                })
            }
        )
    })

})

app.get('/articles/:id', (req, res, next) => {
    const id = req.params.id
    Article.find(id, (err, article) => {
        if (err) {
            return new next(err)
        }
        // res.send(article)
        res.format({
            html: () => {
                res.render('article.ejs', { article })
            },
            json: () => {
                res.send(article)
            }
        })
    })
    // console.log('Fetching:', id)
    // res.send(articles[id])
})

app.delete('/articles/:id', (req, res, next) => {
    const id = req.params.id
    Article.delete(id, (err) => {
        if (err) {
            return new next(err)
        }
        res.send({ message: 'deleted'})
    })
    // console.log('delete:', id)
    // delete articles[id]
    // res.send({message: 'deleted'})
})

app.listen(app.get('port'), () => {
    console.log('Express web app at localhost:', app.get('port'))
})

module.exports = app
