function login() {
    const user = document.getElementById("username").value.trim();
    const pass = document.getElementById("password").value;
    const errorDiv = document.getElementById("error");

    // Credenciais válidas
    const usuarios = {
    "mozin": "29032025",
    "vida": "29032025"
    };

    if (usuarios[user] && usuarios[user] === pass) {
    // Login bem-sucedido
    localStorage.setItem('loggedUser', user);
    window.location.href = "inicial.html";
    } else {
    // Login falhou
    errorDiv.textContent = "Usuário ou senha inválidos! 😔";
    errorDiv.style.display = "block";
    
    // Limpa a mensagem de erro após 3 segundos
    setTimeout(() => {
        errorDiv.style.display = "none";
    }, 3000);
    }
}

// Permite login com Enter
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
    login();
    }
});

// Verifica se já está logado
if (localStorage.getItem('loggedUser')) {
    window.location.href = "inicial.html";
}