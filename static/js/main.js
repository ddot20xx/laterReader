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
            $('#modal-submit').modal()
        }
    })
}

const insertArticle = function(article) {
    let content = e('#id-ul-content')
    let title = article.title
    let id = article.id
    let html = `
    <div class="form-inline">
        <input type="button" class="btn btn-danger btn-sm btn-delete" value="删除">
        <li class="article-item"><a href="/article/${id}">${title}</a></li>
    </div>`
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

const deleteArticle = function() {
    let c = document.querySelector('#id-ul-content')
    c.addEventListener('click', function(event) {
        let t = event.target
        if (t.tagName == 'INPUT') {
            let a = t.nextElementSibling.firstChild
            let id = a.href.split('/').slice(-1).toString()
            let path = '/delete/' + id
            ajax('delete', path, '', function(r) {
                document.location.reload()
                // console.log('delete success')
            })
        }
    })

}

const __main = function() {
    addArticle()
    insertAllArticles()
    deleteArticle()
}

__main()
