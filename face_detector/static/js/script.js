'use strict';

const toast = new bootstrap.Toast(document.querySelector('#toast'));
const toastMessage = document.querySelector('#toast-message');

UpUp.start({
    'content-url': '/html/offline.html',
    'assets': [
        '/img/telkom.svg',
        '/img/telkom-wide.svg',
        '/img/gear-solid.svg',
        '/css/style.css',
    ],
});

function triggerToast(message) {
    toastMessage.innerText = message;
    toast.show();
}

function alpineData() {
    return {
        userToken: {
            token: localStorage.getItem('token') ?? '',
            name: localStorage.getItem('name') ?? '',
        },
        loginData: {
            email: '',
            password: '',
        },
        doLogin: function (loginData) {
            if (!loginData.email || !loginData.password) {
                alert('Email and password input must be filled!');
                return;
            }

            axios.post('/login', {
                email: loginData.email,
                password: loginData.password,
            }).then((response) => {
                this.userToken.token = response.data.message.token;
                this.userToken.name = response.data.message.name;

                localStorage.setItem('token', response.data.message.token);
                localStorage.setItem('name', response.data.message.name);

                this.loginData = {};
            }).catch((error) => {
                alert('Email and/or password incorrect!');
            });
        },
        doLogout: function () {
            localStorage.removeItem('token');
            localStorage.removeItem('name');
            this.userToken.token = '';
            this.userToken.name = '';
        }
    }
}
