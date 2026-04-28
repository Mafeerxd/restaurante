import { auth, db } from './firebase-config.js';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    signInWithPopup, 
    GoogleAuthProvider, 
    FacebookAuthProvider, 
    GithubAuthProvider 
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

const tabLogin = document.getElementById('tab-login');
const tabReg = document.getElementById('tab-register');
const loginForm = document.getElementById('login-form');
const regForm = document.getElementById('register-form');
const errorMsg = document.getElementById('auth-error');

tabReg.addEventListener('click', () => {
    regForm.style.display = 'flex';
    loginForm.style.display = 'none';
    tabReg.classList.add('active');
    tabLogin.classList.remove('active');
    errorMsg.innerText = "";
});

tabLogin.addEventListener('click', () => {
    loginForm.style.display = 'flex';
    regForm.style.display = 'none';
    tabLogin.classList.add('active');
    tabReg.classList.remove('active');
    errorMsg.innerText = "";
});

regForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nombre = document.getElementById('reg-nombre').value;
    const email = document.getElementById('reg-email').value;
    const pass = document.getElementById('reg-password').value;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        const user = userCredential.user;

        await setDoc(doc(db, "usuarios", user.uid), {
            nombre: nombre,
            email: email,
            rol: "usuario_estandar",
            fechaRegistro: new Date()
        });

        window.location.href = "dashboar.html"; // Redirige al éxito
    } catch (error) {
        errorMsg.innerText = "Error: " + error.message;
    }
});

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-password').value;

    try {
        await signInWithEmailAndPassword(auth, email, pass);
        window.location.href = "dashboar.html"; // Redirige al entrar
    } catch (error) {
        errorMsg.innerText = "Usuario o contraseña incorrectos.";
    }
});

const btnGoogle = document.getElementById('btn-google');
const btnFacebook = document.getElementById('id-facebook');
const btnGithub = document.getElementById('btn-github');

async function guardarUsuarioSocial(user) {
    const userRef = doc(db, "usuarios", user.uid);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
        await setDoc(userRef, {
            nombre: user.displayName || "Usuario Social",
            email: user.email,
            rol: "usuario_estandar",
            fechaRegistro: new Date(),
            foto: user.photoURL
        });
    }
}

btnGoogle.addEventListener('click', async () => {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        await guardarUsuarioSocial(result.user);
        window.location.href = "reserva.html";
    } catch (error) {
        errorMsg.innerText = "Error con Google: " + error.message;
    }
});

btnFacebook.addEventListener('click', async () => {
    const provider = new FacebookAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        await guardarUsuarioSocial(result.user);
        window.location.href = 'reserva.html';
    } catch (error) {
        errorMsg.innerText = "Error con Facebook: " + error.message;
    }
});

btnGithub.addEventListener('click', async () => {
    const provider = new GithubAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        await guardarUsuarioSocial(result.user);
        window.location.href = "dashboar.html";
    } catch (error) {
        errorMsg.innerText = "Error con GitHub: " + error.message;
    }
});