 // Verificação de login
if (!localStorage.getItem('loggedUser')) {
    window.location.href = 'index.html';
}
// Suas credenciais do Supabase
const SUPABASE_URL = 'https://xgufqlimgcocbhohwflf.supabase.co';
const SUPABASE_KEY = 'sb_publishable_8wNd2CeD0hn6w5V13isX7g_DxNtQH90';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Função para carregar os comentários do Banco de Dados
async function loadComments() {
    // Buscamos todas as seções que aceitam comentários
    const sections = document.querySelectorAll('[data-section]');
    
    // Buscamos todos os comentários de uma vez
    const { data: todosComentarios, error } = await _supabase
        .from('comentarios')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Erro ao carregar comentários:", error);
        return;
    }

    sections.forEach(section => {
        const sectionId = section.getAttribute('data-section');
        const commentsList = section.querySelector('.comments-list');
        
        // Filtramos os comentários para cada seção (se você usar IDs diferentes)
        // Se for um feed único, você pode remover esse filtro
        const comentariosDaSecao = todosComentarios; 

        if (comentariosDaSecao.length > 0) {
            const noComments = section.querySelector('.no-comments');
            if (noComments) noComments.remove();

            commentsList.innerHTML = comentariosDaSecao.map(comment => `
                <div class="comment-item">
                    <div class="comment-header">
                        <span class="comment-author">${comment.nome} 💕</span>
                        <span class="comment-time">${new Date(comment.created_at).toLocaleString('pt-BR')}</span>
                    </div>
                    <div class="comment-text">${comment.mensagem}</div>
                </div>
            `).join('');
        }
    });
}

// Função para adicionar comentário ao Banco de Dados
async function addComment(sectionId) {
    const section = document.querySelector(`[data-section="${sectionId}"]`);
    const textarea = section.querySelector('textarea');
    const btn = section.querySelector('button');
    const commentText = textarea.value.trim();
    const loggedUser = localStorage.getItem('loggedUser') || 'Alguém especial';

    if (!commentText) {
        alert('Por favor, escreva um comentário antes de enviar! 💕');
        return;
    }

    // Desabilita o botão para evitar cliques múltiplos
    btn.disabled = true;

    const { error } = await _supabase
        .from('comentarios')
        .insert([{ 
            nome: loggedUser, 
            mensagem: commentText 
        }]);

    if (error) {
        alert('Erro ao salvar no banco. Verifique se o RLS está desativado.');
        console.error(error);
        btn.disabled = false;
    } else {
        textarea.value = '';
        btn.disabled = false;
        loadComments(); // Recarrega a lista para mostrar o novo
    }
}

// Inicializa ao carregar a página
document.addEventListener('DOMContentLoaded', loadComments);

// Atalho Ctrl+Enter
document.addEventListener('keydown', function(e) {
    if (e.target.tagName === 'TEXTAREA' && e.ctrlKey && e.key === 'Enter') {
        const section = e.target.closest('[data-section]');
        const sectionId = section.getAttribute('data-section');
        addComment(sectionId);
    }
});

function atualizarContagem() {
    const inicio = new Date("2025-02-01T00:00:00");
    const agora = new Date();
    const diff = agora - inicio;

    const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutos = Math.floor((diff / (1000 * 60)) % 60);
    const segundos = Math.floor((diff / 1000) % 60);

    const texto = `<span style="font-size: 3rem; font-weight: 300; line-height: 1.8;">Me apaixonando há: <strong>${dias}</strong> dias, <strong>${horas}</strong> horas, <strong>${minutos}</strong> minutos e <strong>${segundos}</strong> segundos 💖</span>`;
    
    const contadorEl = document.getElementById("contador-dias");
    if(contadorEl) contadorEl.innerHTML = texto;
}

setInterval(atualizarContagem, 1000);
atualizarContagem();

function logout() {
    if (confirm('Tem certeza que deseja sair? 😢')) {
        localStorage.removeItem('loggedUser');
        window.location.href = 'index.html';
    }
}