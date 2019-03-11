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

let btnSubmit = e('#id-button-submit')
btnSubmit.addEventListener('click', function(event) {
    var url = e('#id-input-url').value
    var data = JSON.stringify({"url": url})
    if(url) {
        ajax('post', '/articles', data, function(r) {
            // console.log('收藏成功.', r.response)
        })
    } else {
        alert('请输入正确的文章链接。')
    }

})
