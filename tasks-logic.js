import { auth, db } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import { 
    collection, addDoc, query, where, onSnapshot, orderBy, doc, getDoc, deleteDoc, updateDoc 
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

const taskList = document.getElementById('task-list');
const taskForm = document.getElementById('task-form');
const welcomeMsg = document.getElementById('welcome-msg');
const btnLogout = document.getElementById('btn-logout');

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const userDoc = await getDoc(doc(db, "usuarios", user.uid));
        if (userDoc.exists()) {
            const data = userDoc.data();
            welcomeMsg.innerText = `🎀 Agenda de ${data.nombre}`;
            if (data.rol === 'admin') {
                const adminDiv = document.createElement('div');
                adminDiv.className = 'admin-badge';
                adminDiv.innerText = "MODO ADMINISTRADOR";
                document.getElementById('admin-container').appendChild(adminDiv);
            }
        }
        cargarTareas(user.uid);
    } else {
        window.location.href = "index01.html";
    }
});

taskForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    try {
        await addDoc(collection(db, "tareas"), {
            userId: user.uid,
            titulo: document.getElementById('task-title').value,
            descripcion: document.getElementById('task-desc').value,
            fecha: document.getElementById('task-date').value,
            completada: false,
            timestamp: new Date()
        });
        taskForm.reset();
    } catch (err) { console.error(err); }
});

function cargarTareas(uid) {
    const q = query(collection(db, "tareas"), where("userId", "==", uid), orderBy("timestamp", "desc"));
    onSnapshot(q, (snapshot) => {
        taskList.innerHTML = snapshot.empty ? '<p>No hay tareas pendientes. ✨</p>' : '';
        snapshot.forEach((docSnap) => {
            const t = docSnap.data();
            const id = docSnap.id;
            const div = document.createElement('div');
            div.className = `task-card ${t.completada ? 'completed' : ''}`;
            div.innerHTML = `
                <div>
                    <h4 style="margin:0; color:#ff4d6d; ${t.completada ? 'text-decoration: line-through;' : ''}">${t.titulo}</h4>
                    <p style="margin:5px 0; font-size:0.9rem;">${t.descripcion}</p>
                    <small>📅 ${new Date(t.fecha).toLocaleString()}</small>
                </div>
                <div>
                    <button onclick="marcarTarea('${id}', ${t.completada})" class="btn-check">
                        ${t.completada ? '↩️' : '✅'}
                    </button>
                    <button onclick="eliminarTarea('${id}')" class="btn-delete">🗑️</button>
                </div>
            `;
            taskList.appendChild(div);
        });
    });
}

window.eliminarTarea = async (id) => {
    if (confirm("¿Eliminar esta tarea?")) {
        try { await deleteDoc(doc(db, "tareas", id)); } 
        catch (err) { console.error(err); }
    }
};

window.marcarTarea = async (id, estado) => {
    try { await updateDoc(doc(db, "tareas", id), { completada: !estado }); } 
    catch (err) { console.error(err); }
};

btnLogout?.addEventListener('click', () => signOut(auth));