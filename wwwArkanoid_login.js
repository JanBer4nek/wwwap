function toggleFields() {
    const role = document.getElementById('role').value;
    const usernameLabel = document.getElementById('usernameLabel');
    const passwordLabel = document.getElementById('passwordLabel');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const registerButton = document.getElementById('registerButton');

    if (role === 'guest') {
        usernameLabel.style.display = 'none';
        passwordLabel.style.display = 'none';
        usernameInput.style.display = 'none';
        passwordInput.style.display = 'none';
        registerButton.style.display = 'none';

    } else if (role === 'admin') {
        usernameLabel.style.display = 'block';
        passwordLabel.style.display = 'block';
        usernameInput.style.display = 'block';
        passwordInput.style.display = 'block';
        registerButton.style.display = 'none';

    } else {
        usernameLabel.style.display = 'block';
        passwordLabel.style.display = 'block';
        usernameInput.style.display = 'block';
        passwordInput.style.display = 'block';
        registerButton.style.display = 'block';

    }
}

function login() {
    const role = document.getElementById('role').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const loggedInRoleElement = document.getElementById('loggedInRole');

    if (role === 'member' && (username === '' || password === '')) {
        alert('Name and password cannot be empty.');
    } else {
        if (role === 'guest') {
            loggedIn();
            loggedInRoleElement.textContent = `Logged in as: Guest`;


        } else if (role === 'admin') {
            const storedAdmins = JSON.parse(localStorage.getItem('admins')) || [];
            const admin = storedAdmins.find(u => u.name === username && u.password === password);
            
            if (admin) {
                loggedIn();

            loggedInRoleElement.textContent = `Logged in as Admin: ${username}`;
            document.getElementById('clearHighScoresButton').style.display = 'block';

            } else {
            alert('Invalid username or password.');

            }

        } else {
            const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
            const user = storedUsers.find(u => u.name === username && u.password === password);
            
            if (user) {
                loggedIn();
                loggedInRoleElement.textContent = `Logged in as: ${username}`;

            } else {
                alert('Invalid username or password.');

            }
        }
    }
}

function addAdmin(username, password) {
    let storedAdmins = JSON.parse(localStorage.getItem('admins')) || [];
    storedAdmins.push({ name: username, password: password });
    localStorage.setItem('admins', JSON.stringify(storedAdmins));
    
}
addAdmin('honzaB', 'neuhodnutelné:)');
addAdmin('petrD', '1234');


function register() {
    const role = document.getElementById('role').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (role === 'member' && (username === '' || password === '')) {
        alert('Name and password cannot be empty.');

    } else {
        const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
        const userExists = storedUsers.some(u => u.name === username);

        if (userExists) {
            alert('Username already exists. Please choose a different one.');

        } else {
            storedUsers.push({ name: username, password: password });
            localStorage.setItem('users', JSON.stringify(storedUsers));
            alert('Registration successful!');
            
        }
    }
}

function logOut() {
    document.getElementById('loginPopup').style.display = 'block';
    document.getElementById('logOutButton').style.display = 'none';
    document.getElementById('gameMenu').style.display = 'none';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.getElementById('clearHighScoresButton').style.display = 'none';
    location.reload();

}

function loggedIn() {
    document.getElementById('loginPopup').style.display = 'none';
    document.getElementById('logOutButton').style.display = 'block';
    document.getElementById('gameMenu').style.display = 'block';
    displayHighScores();

}

document.addEventListener('DOMContentLoaded', function () {
    // Set initial state of login fields
    toggleFields();

});
