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
    
    // Feedback visual (opcional)
    // alert(`${nome} adicionado ao carrinho!`);
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

// Funções para modificar o carrinho (usadas na página carrinho.html)
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

// Inicialização em todas as páginas
document.addEventListener('DOMContentLoaded', () => {
    atualizarContadorCarrinho();
    
    // Se estiver na página do carrinho, renderiza os itens
    if (document.getElementById('itens-carrinho')) {
        renderizarCarrinho();
    }
}); 
// No seu carrinho.js (ou onde você tem o botão de finalizar)
async function finalizarPedido() {
  const codigo = "PED-" + Math.floor(100000 + Math.random() * 900000); // código aleatório

  const pedido = {
    codigo: codigo,
    cliente: "Cliente Temporário", // depois você pega do login ou formulário
    itens: carrinho,               // array dos produtos
    total: calcularTotal(),
    status: "pendente",
    data: new Date().toISOString()
  };

  alert(`✅ Pedido registrado!\n\nCÓDIGO: ${codigo}\nGuarde esse código para rastrear!`);

  // Salva localmente só para o cliente ver
  localStorage.setItem('ultimoPedido', JSON.stringify(pedido));

  // Limpa o carrinho
  carrinho = [];
  renderCarrinho();
}