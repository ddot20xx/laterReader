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

const showArticle = function(article) {
    let post = e('#id-div-article')
    let title = article.title
    let content = article.content
    let html = `
        <h3 class="text-primary text-center">${title}</h3>
        <div class="row">
            <div class="col-8 offset-md-2">${content}</div>
        </div>
    `
    post.insertAdjacentHTML('beforeend', html)
    // 设置页面 title 未文章的标题
    document.title = title
}

const init = function() {
    let id = document.URL.split('/').slice(-1).toString()
    let path = '/api/article/' + id
    ajax('get', path, '', function(r) {
        let a = JSON.parse(r.response)
        showArticle(a)
        imgCenter()
    })
}

const imgCenter = function() {
    let imgs = document.querySelectorAll('img')
    for(let i = 0; i < imgs.length; i++) {
        let img = imgs[i]
        img.classList.add('mx-auto')
        img.classList.add('d-block')
        img.classList.add('img-fluid')
    }
}

const __main = function() {
    init()
}

__main()
