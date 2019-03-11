const e = function(sel) {
    return document.querySelector(sel)
}

var ajax = function(method, path, data, responseCallback) {
    var r = new XMLHttpRequest()
    r.open(method, path, true)
    r.onreadystatechange = function() {
        if (r.readyState === 4) {
            responseCallback(r)
        }
    }
    r.send(data)
}

let btnSubmit = e('#id-button-submit')
btnSubmit.addEventListener('click', function(event) {
    let url = e('#id-input-url').value
    let data = JSON.stringify({"url": url})
    if(url) {
        ajax('post', '/articles', data, function() {
            console.log('收藏成功.')
        })
    } else {
        alert('请输入正确的文章链接。')
    }

})
