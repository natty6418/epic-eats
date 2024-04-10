
function load_login_form(evt) {
    evt.preventDefault();
    const landing_page = document.getElementById('landing-page-container');
    const login_form = document.getElementById('login-form-container');
    landing_page.style.display = 'none';
    login_form.classList.toggle('off');
}

async function login(evt){
    evt.preventDefault();
    const email = document.querySelector('#login-form-container input[name="email"]').value;
    const password = document.querySelector('#login-form-container input[name="password"]').value;
    const data = {email, password};
    const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    // const text = await response.text();
    // console.log(text);
    const json = await response.json();
    console.log(json);
    if (response.status === 200) {
        console.log(json);
        window.location.href = '/feed';
    } else {
        console.log(json);
        const form = document.getElementById('login-form-container');
        const error = document.createElement('p');
        error.textContent = json.error;
        form.appendChild(error);
        error.style.color = 'red';
    }
}


const landing_page_login_btn = document.getElementById('landing-page-login-btn')
const landing_page_sign_up_btn = document.querySelector('.landing-page-action-buttons .sign-up-btn')

landing_page_login_btn.addEventListener('click', (evt) => load_login_form(evt));

const login_btn = document.getElementById('login-btn');
login_btn.addEventListener('click', (evt) => login(evt));