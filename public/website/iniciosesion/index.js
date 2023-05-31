
loginBtn.addEventListener('click', () => {
    if(loginBtn.value === 'INICIANDO SESIÓN'){
        loginBtn.value = 'REGISTRANDOSE'
    } else if(loginBtn.value === 'REGISTRANDOSE'){
        loginBtn.value = 'INICIANDO SESIÓN'
    }
})

loginForm.enviar.addEventListener('click', () => {
    const data = {
        name: loginForm.name.value,
        password: loginForm.password.value
    }

    const operation = loginBtn.value === 'INICIANDO SESIÓN' ? 'login' : 'signin'

    dbRequest(`${mainUrl}/${operation}`, 'POST', data).then(response => {
        if(response.error) {
            error.innerHTML = `<p>${response.error}</p>`
            error.style.height = '60px'
        }
        else {
            localStorage.setItem('token', response.token)
            window.location.href = `/`
        }
    })
})

const mainUrl = 'http://localhost:3000'
async function dbRequest(url, method, body, token){
    const options = {
        headers:  {
            'Accept': 'aplication.json',
            'Content-Type': 'application/json',
        },
        method
    }
    if(token) options.headers.Authorization = `Bearer ${token}`
    if(method !== 'GET') options.body = JSON.stringify(body)

    try{
        const response = await fetch(url, options)
        return response.json()
    } catch (err) {
        console.error(err)
    }  
}
