const e = function(sel) {
    return document.querySelector(sel)
}

var ajax = function(method, path, data, responseCallback) {
    var r = new XMLHttpRequest()
    r.open(method, path, true)
    r.setRequestHeader('Content-Type', 'application/json')
    r.onreadystatechange = function() {
        if (r.readyState === 4) {
            responseCallback(r)
        }
    }
    r.send(data)
}

const addArticle = function() {
    let btnSubmit = e('#id-button-submit')
    btnSubmit.addEventListener('click', function(event) {
        var url = e('#id-input-url').value
        var data = JSON.stringify({"url": url})
        if(url) {
            ajax('post', '/articles', data, function(r) {
                // console.log('收藏成功.', r.response)
                document.location.reload()
            })
        } else {
            // bootstrap 模态框
            
        }
    })
}

const insertArticle = function(article) {
    let content = e('#id-ul-content')
    let title = article.title
    let id = article.id
    let html = `<li class="article-item"><a href="/article/${id}">${title}</a></li>`
    content.insertAdjacentHTML('beforeend', html)
}

const insertArticles = function(articles) {
    for (let i = 0; i < articles.length; i++) {
        let a = articles[i]
        insertArticle(a)
    }
}

const insertAllArticles = function() {
    ajax('get', '/api/article/all', '', function(r) {
        let as = JSON.parse(r.response)
        insertArticles(as)
    })
}

const __main = function() {
    addArticle()
    insertAllArticles()
}

__main()
