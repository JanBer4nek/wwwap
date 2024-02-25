class User {
    constructor(name, password) {
        this.name = name;
        this.password = password;
    }
}

class Admin extends User {}

class UserManager {
    constructor(storageKey) {
        this.storageKey = storageKey;
        this.users = JSON.parse(localStorage.getItem(this.storageKey)) || [];
    }

    addUser(user) {
        this.users.push(user);
        localStorage.setItem(this.storageKey, JSON.stringify(this.users));
    }

    getUser(username, password) {
        return this.users.find(user => user.name === username && user.password === password);
    }

    userExists(username) {
        return this.users.some(user => user.name === username);
    }
}

const ADMIN_PASSWORD_PETR_D = '1234';
const ADMIN_PASSWORD_HONZA_B = 'neuhodnutelne';

class Login {
    constructor(main, gameRenderer, highScoreManager) {
        this.main = main;
        this.gameRenderer = gameRenderer;
        this.highScoreManager = highScoreManager;

        document.addEventListener('DOMContentLoaded', () => {
            this.toggleFields();
        });

        const loginButton = document.getElementById('loginButton');
        if (loginButton) {
            loginButton.addEventListener('click', () => this.login());
        }
    }

    toggleFields() {
        const role = document.getElementById('role').value;
        const usernameLabel = document.getElementById('usernameLabel');
        const passwordLabel = document.getElementById('passwordLabel');
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        const registerButton = document.getElementById('registerButton');

        usernameLabel.style.display = role === 'guest' ? 'none' : 'block';
        passwordLabel.style.display = role === 'guest' ? 'none' : 'block';
        usernameInput.style.display = role === 'guest' ? 'none' : 'block';
        passwordInput.style.display = role === 'guest' ? 'none' : 'block';
        registerButton.style.display = role === 'member' ? 'block' : 'none';
    }

    login() {
        const role = document.getElementById('role').value;
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const loggedInRoleElement = document.getElementById('loggedInRole');

        const userManager = role === 'admin' ? new UserManager('admins') : new UserManager('users');
        const user = userManager.getUser(username, password);

        if (!user && role !== 'guest') {
            alert('Invalid username or password.');
            return;
        }

        if (role === 'admin') {
            const validAdmins = [
                { username: 'petrD', password: ADMIN_PASSWORD_PETR_D },
                { username: 'honzaB', password: ADMIN_PASSWORD_HONZA_B }
            ];
            const isValidAdmin = validAdmins.some(admin => admin.username === username && admin.password === password);
            if (!isValidAdmin) {
                alert('You are not authorized to log in as an admin.');
                return;
            }
        }

        this.loggedIn(user, role);
        loggedInRoleElement.textContent = `Logged in as ${role === 'guest' ? 'Guest' : username}`;
        if (role === 'admin') {
            document.getElementById('clearHighScoresButton').style.display = 'block';
        }
    }

    register() {
        const role = document.getElementById('role').value;
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const userManager = new UserManager('users');

        if (userManager.userExists(username)) {
            alert('Username already exists. Please choose a different one.');
            return;
        }

        const user = new User(username, password);
        userManager.addUser(user);
        alert('Registration successful!');
    }

    loggedIn(user, role) {
        document.getElementById('clearHighScoresButton').style.display = role === 'admin' ? 'block' : 'none';
        document.getElementById('loginPopup').style.display = 'none';
        document.getElementById('logOutButton').style.display = 'block';
        document.getElementById('gameMenu').style.display = 'block';
        this.highScoreManager.displayHighScores();
    }

    logOut() {
        document.getElementById('loginPopup').style.display = 'block';
        document.getElementById('logOutButton').style.display = 'none';
        document.getElementById('gameMenu').style.display = 'none';
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        document.getElementById('clearHighScoresButton').style.display = 'none';
        location.reload();
    }
}

const login = new Login(main, gameRenderer, highScoreManager);