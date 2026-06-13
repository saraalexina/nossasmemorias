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
    const sections = document.querySelectorAll('[data-section]');
    
    const { data: todosComentarios, error } = await _supabase
        .from('comentarios')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Erro ao carregar comentários:", error);
        return;
    }

    sections.forEach(section => {
        const commentsList = section.querySelector('.comments-list');
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
        loadComments(); 
    }
}

// Inicializa componentes de dados
document.addEventListener('DOMContentLoaded', () => {
    loadComments();
    atualizarContagem(); 
});

// Atalho Ctrl+Enter para enviar o comentário
document.addEventListener('keydown', function(e) {
    if (e.target.tagName === 'TEXTAREA' && e.ctrlKey && e.key === 'Enter') {
        const section = e.target.closest('[data-section]');
        const sectionId = section.getAttribute('data-section');
        addComment(sectionId);
    }
});

// Função que calcula e renderiza o tempo do relacionamento (Anos, Meses e Dias exatos)
function atualizarContagem() {
    const inicio = new Date("2025-02-01T00:00:00");
    const agora = new Date();
    
    let anos = agora.getFullYear() - inicio.getFullYear();
    let meses = agora.getMonth() - inicio.getMonth();
    let dias = agora.getDate() - inicio.getDate();
    
    // Se o dia atual for menor que o dia de início, compensa pegando dias do mês anterior
    if (dias < 0) {
        const ultimoDiaMesPassado = new Date(agora.getFullYear(), agora.getMonth(), 0).getDate();
        dias += ultimoDiaMesPassado;
        meses--;
    }
    
    // Se o mês ficar negativo, compensa voltando um ano
    if (meses < 0) {
        meses += 12;
        anos--;
    }
    
    // Armazena as strings das partes ativas
    let partes = [];
    if (anos > 0) {
        partes.push(`<strong>${anos}</strong> ${anos === 1 ? 'ano' : 'anos'}`);
    }
    if (meses > 0) {
        partes.push(`<strong>${meses}</strong> ${meses === 1 ? 'mês' : 'meses'}`);
    }
    if (dias > 0) {
        partes.push(`<strong>${dias}</strong> ${dias === 1 ? 'dia' : 'dias'}`);
    }
    
    // Formata a frase dinamicamente colocando vírgulas e "e" nos lugares certos
    let tempoFormatado = "";
    if (partes.length === 3) {
        tempoFormatado = `${partes[0]}, ${partes[1]} e ${partes[2]}`;
    } else if (partes.length === 2) {
        tempoFormatado = `${partes[0]} e ${partes[1]}`;
    } else if (partes.length === 1) {
        tempoFormatado = partes[0];
    } else {
        tempoFormatado = "<strong>0</strong> dias";
    }

    const texto = `
        <div class="cozy-glass-card">
            <span class="cozy-label">Nos apaixonando há</span>
            <span class="cozy-value">${tempoFormatado}</span>
        </div>
    `;
    
    const contadorEl = document.getElementById("contador-dias");
    if (contadorEl) contadorEl.innerHTML = texto;
}

// Atualiza a cada 1 hora (suficiente para a contagem de dias)
setInterval(atualizarContagem, 1000 * 60 * 60);

// Função de logout
function logout() {
    if (confirm('Tem certeza que deseja sair? 😢')) {
        localStorage.removeItem('loggedUser');
        window.location.href = 'index.html';
    }
}

// Mapeamento das seções especiais
const timelineData = [
    { label: "O Começo", target: "inicio" },
    { label: "O 1º dia", target: "primeirodia" },
    { label: "1° Encontro", target: "encontro1" },
    { label: "O Pedido", target: "pedido" },
    { label: "1 Mês", target: "mes1" },
    { label: "Eu te amo!", target: "amor" }
];

function initTimeline() {
    const list = document.querySelector('.timeline-points');
    if(!list) return;
    
    list.innerHTML = ''; // Limpa para evitar duplicações
    timelineData.forEach((item) => {
        const li = document.createElement('li');
        li.className = 'timeline-point';
        li.innerText = item.label;
        li.onclick = () => document.getElementById(item.target).scrollIntoView({ behavior: 'smooth' });
        li.dataset.target = item.target;
        list.appendChild(li);
    });
}

document.addEventListener('DOMContentLoaded', initTimeline);

// Lógica de ativação conforme o scroll
window.addEventListener('scroll', () => {
    timelineData.forEach((item, index) => {
        const el = document.getElementById(item.target);
        if(!el) return;
        
        const rect = el.getBoundingClientRect();
        const points = document.querySelectorAll('.timeline-point');
        
        if(rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2) {
            points.forEach(p => p.classList.remove('active'));
            if(points[index]) points[index].classList.add('active');
        }
    });
});

// Controle de visibilidade temporária no Mobile
let timeoutMenu;
function showMobileMenu() {
    const nav = document.querySelector('.timeline-nav');
    if (!nav || window.innerWidth > 768) return;

    nav.classList.add('visible');
    clearTimeout(timeoutMenu);
    
    timeoutMenu = setTimeout(() => {
        nav.classList.remove('visible');
    }, 1200);
}

window.addEventListener('scroll', showMobileMenu);
window.addEventListener('touchstart', showMobileMenu);

// Monitoramento do gatilho de exibição da Seção Alvo (carta1)
window.addEventListener('scroll', function() {
    const timelineNav = document.querySelector('.timeline-nav');
    const secaoAlvo = document.getElementById('carta'); 

    if (timelineNav && secaoAlvo) {
        const posicaoSecao = secaoAlvo.getBoundingClientRect().top;

        // Ativa a estrutura base da nav após passar pela carta1
        if (posicaoSecao < 200) {
            timelineNav.classList.add('visivel-scroll');
        } else {
            timelineNav.classList.remove('visivel-scroll');
        }
    }
});