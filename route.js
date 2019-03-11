const Article = require('./db').Article
const read = require('node-readability')

var index = {
    path: '/',
    method: 'get',
    handler: function(req, res, next) {
        Article.all((err, articles) => {
            if (err) {
                return next(err)
            }
            res.send(articles)
        })
    }
}

var articles = {
    path: '/articles',
    method: 'get',
    handler: function(req, res, next) {
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
    }
}

var newArticle = {
    path: '/articles',
    method: 'post',
    handler: function(req, res, next) {
        const url = req.body.url
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
                    res.send('OK')
                }
            )
        })
    }
}

var article = {
    path: '/articles/:id',
    method: 'get',
    handler: function(req, res, next) {
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
    }
}

var deleteArticle = {
    path: '/articles/:id',
    method: 'delete',
    handler: function(req, res, next) {
        const id = req.params.id
        Article.delete(id, (err) => {
            if (err) {
                return new next(err)
            }
            res.send({ message: 'deleted'})
        })
    }
}

var routers = [
    index,
    articles,
    newArticle,
    article,
    deleteArticle,
]

module.exports.routers = routers
