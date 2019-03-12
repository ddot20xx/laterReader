'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const Article = require('./db').Article
const read = require('node-readability')
const fs = require('fs')

app.use(express.static('static'))

// const port = process.env.PORT || 3000
app.set('port', process.env.PORT || 3000)

app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: true }))

app.use('/css/bootstrap.css',
    express.static('node_modules/bootstrap/dist/css/bootstrap.css'))

const sendHtml = function(path, response) {
    let option = {
        encoding: 'utf-8'
    }
    fs.readFile(path, option, (err, data) => {
        if (err) {
            console.log('err:', err)
        }
        response.send(data)
    })
}

app.get('/', (req, res) => {
    sendHtml('views/index.html', res)
})

app.get('/api/article/all', (req, res) => {
    Article.all((err, articles) => {
        if (err) {
            return next(err)
        }
        res.send(articles)
    })
})

app.get('/api/article/:id', (req, res) => {
    const id = req.params.id
    Article.find(id, (err, article) => {
        if (err) {
            return new next(err)
        }
        res.send(article)
    })
})

// app.get('/articles', (req, res, next) => {
//     Article.all((err, articles) => {
//         if (err) {
//             return next(err)
//         }
//         res.format({
//             html: () => {
//                 res.render('articles.ejs', { articles })
//             },
//             json: () => {
//                 res.send(articles)
//             }
//         })
//     })
// })

app.post('/articles', (req, res, next) => {
    const url = req.body.url
    read(url, (err, result) => {
        // 结果有 .title, .content
        Article.new(
            {
                title: result.title,
                content: result.content
            },
            (err, article) => {
                if (err) {
                    return next(err)
                }
                Article.all((err, articles) => {
                    if (err) {
                        return next(err)
                    }
                    articles.push(article)
                    res.redirect('/')
                })
            }
        )
    })

})

app.get('/article/:id', (req, res, next) => {
    sendHtml('views/detail.html', res)
    // const id = req.params.id
    // Article.find(id, (err, article) => {
    //     if (err) {
    //         return new next(err)
    //     }
    //     res.send(article)
        // res.format({
        //     html: () => {
        //         res.render('article.ejs', { article })
        //     },
        //     json: () => {
        //         res.send(article)
        //     }
        // })
    // })
})

app.delete('/articles/:id', (req, res, next) => {
    const id = req.params.id
    Article.delete(id, (err) => {
        if (err) {
            return new next(err)
        }
        res.send({ message: 'deleted'})
    })
})

app.listen(app.get('port'), () => {
    console.log('Express web app at localhost:', app.get('port'))
})

module.exports = app
