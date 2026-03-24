// js/carrinho.js
// Carrega o carrinho do localStorage ou inicia vazio
let carrinho = JSON.parse(localStorage.getItem('carrinhoAromaLuxo')) || [];

// Atualiza o contador no ícone (presente em todas as páginas)
function atualizarContadorCarrinho() {
    const contador = document.getElementById('cartCount');
    if (!contador) return;
   
    const totalItens = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
    contador.textContent = totalItens;
}

// Função principal de adicionar produto
function adicionarAoCarrinho(codigo, nome, preco) {
    const itemExistente = carrinho.find(item => item.codigo === codigo);
   
    if (itemExistente) {
        itemExistente.quantidade++;
    } else {
        carrinho.push({
            codigo,
            nome,
            preco: Number(preco),
            quantidade: 1
        });
    }
   
    localStorage.setItem('carrinhoAromaLuxo', JSON.stringify(carrinho));
    atualizarContadorCarrinho();
   
    // Feedback visual mais bonito com a cor roxa
    const feedback = document.createElement('div');
    feedback.style.position = 'fixed';
    feedback.style.bottom = '20px';
    feedback.style.left = '50%';
    feedback.style.transform = 'translateX(-50%)';
    feedback.style.background = '#6B48FF';
    feedback.style.color = 'white';
    feedback.style.padding = '12px 24px';
    feedback.style.borderRadius = '8px';
    feedback.style.boxShadow = '0 4px 12px rgba(107, 72, 255, 0.3)';
    feedback.style.zIndex = '1000';
    feedback.style.fontWeight = '500';
    feedback.textContent = `${nome} adicionado ao carrinho!`;
    document.body.appendChild(feedback);

    setTimeout(() => {
        feedback.style.transition = 'opacity 0.5s';
        feedback.style.opacity = '0';
        setTimeout(() => feedback.remove(), 500);
    }, 2500);
}

// Função para renderizar o carrinho (usada só na página carrinho.html)
function renderizarCarrinho() {
    const container = document.getElementById('itens-carrinho');
    const totalEl = document.getElementById('total-carrinho');
    const contadorEl = document.getElementById('quantidade-total');
   
    if (!container) return; // só executa na página do carrinho
   
    if (carrinho.length === 0) {
        container.innerHTML = '<p class="carrinho-vazio">Seu carrinho está vazio.</p>';
        totalEl.textContent = 'R$ 0,00';
        if (contadorEl) contadorEl.textContent = '0';
        return;
    }
   
    let html = '';
    let totalGeral = 0;
   
    carrinho.forEach(item => {
        const subtotal = item.preco * item.quantidade;
        totalGeral += subtotal;
       
        html += `
            <div class="item-carrinho">
                <div class="item-info">
                    <strong>${item.nome}</strong><br>
                    <small>Cód: ${item.codigo}</small>
                </div>
                <div class="item-preco">
                    R$ ${item.preco.toFixed(2).replace('.', ',')}
                </div>
                <div class="controle-quantidade">
                    <button class="btn-qty" onclick="alterarQuantidade('${item.codigo}', -1)">−</button>
                    <span>${item.quantidade}</span>
                    <button class="btn-qty" onclick="alterarQuantidade('${item.codigo}', 1)">+</button>
                </div>
                <div class="item-subtotal">
                    R$ ${subtotal.toFixed(2).replace('.', ',')}
                </div>
                <button class="btn-remover" onclick="removerItem('${item.codigo}')">Remover</button>
            </div>
        `;
    });
   
    container.innerHTML = html;
    totalEl.textContent = 'R$ ' + totalGeral.toFixed(2).replace('.', ',');
    if (contadorEl) contadorEl.textContent = carrinho.reduce((acc, i) => acc + i.quantidade, 0);
}

// Funções para modificar o carrinho
window.alterarQuantidade = function(codigo, delta) {
    const item = carrinho.find(i => i.codigo === codigo);
    if (item) {
        item.quantidade = Math.max(1, item.quantidade + delta);
        localStorage.setItem('carrinhoAromaLuxo', JSON.stringify(carrinho));
        renderizarCarrinho();
        atualizarContadorCarrinho();
    }
};

window.removerItem = function(codigo) {
    carrinho = carrinho.filter(i => i.codigo !== codigo);
    localStorage.setItem('carrinhoAromaLuxo', JSON.stringify(carrinho));
    renderizarCarrinho();
    atualizarContadorCarrinho();
};

// Limpar carrinho
function limparCarrinho() {
    if (confirm('Deseja realmente limpar todo o carrinho?')) {
        carrinho = [];
        localStorage.setItem('carrinhoAromaLuxo', JSON.stringify(carrinho));
        renderizarCarrinho();
        atualizarContadorCarrinho();
    }
}

// Função para finalizar pedido (melhorada com cor roxa)
async function finalizarPedido() {
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    const codigo = "PED-" + Math.floor(100000 + Math.random() * 900000);
    const total = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);

    const pedido = {
        codigo: codigo,
        cliente: "Cliente Temporário", 
        itens: carrinho,
        total: total,
        status: "pendente",
        data: new Date().toISOString()
    };

    // Mensagem com cor roxa (feedback visual)
    const msg = document.createElement('div');
    msg.style.position = 'fixed';
    msg.style.top = '50%';
    msg.style.left = '50%';
    msg.style.transform = 'translate(-50%, -50%)';
    msg.style.background = '#6B48FF';
    msg.style.color = 'white';
    msg.style.padding = '25px 35px';
    msg.style.borderRadius = '12px';
    msg.style.boxShadow = '0 10px 30px rgba(107, 72, 255, 0.4)';
    msg.style.zIndex = '2000';
    msg.style.textAlign = 'center';
    msg.style.maxWidth = '380px';
    msg.innerHTML = `
        ✅ Pedido realizado com sucesso!<br><br>
        <strong>CÓDIGO DO PEDIDO:</strong><br>
        <span style="font-size:1.4rem; font-weight:bold;">${codigo}</span><br><br>
        Total: R$ ${total.toFixed(2).replace('.', ',')}<br><br>
        Guarde este código para rastrear seu pedido!
    `;
    document.body.appendChild(msg);

    // Salva o último pedido
    localStorage.setItem('ultimoPedido', JSON.stringify(pedido));

    // Limpa o carrinho
    carrinho = [];
    localStorage.setItem('carrinhoAromaLuxo', JSON.stringify(carrinho));

    setTimeout(() => {
        msg.style.transition = 'opacity 0.6s';
        msg.style.opacity = '0';
        setTimeout(() => {
            msg.remove();
            window.location.reload(); // atualiza a página do carrinho
        }, 600);
    }, 4500);
}

// Inicialização em todas as páginas
document.addEventListener('DOMContentLoaded', () => {
    atualizarContadorCarrinho();
   
    // Se estiver na página do carrinho, renderiza os itens
    if (document.getElementById('itens-carrinho')) {
        renderizarCarrinho();
    }
});