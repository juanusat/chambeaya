(function() {
    const userData = JSON.parse(document.getElementById('user-data').textContent);
    console.log(userData)
    document.querySelector('.avatar').innerHTML = `<img src="/static/upload/${userData.url_picture}">`
    document.querySelector('.profile-name').innerText = `${userData.nombre} ${userData.apellido}`
})()
