let servicos = JSON.parse(localStorage.getItem("servicos")) || [];

document.getElementById("formServico").addEventListener("submit", function(e) {
  e.preventDefault();

  const cliente = document.getElementById("cliente").value;
  const seguradora = document.getElementById("seguradora").value;
  const horario = new Date(document.getElementById("horario").value);
  const valor = parseFloat(document.getElementById("valor").value);
  const desconto = parseFloat(document.getElementById("desconto").value);

  const valorFinal = valor - (valor * desconto / 100);

  const servico = { id: Date.now(), cliente, seguradora, horario, valor, desconto, valorFinal };
  servicos.push(servico);
  salvarLocal();
  atualizarTabela();
});

function salvarLocal() {
  localStorage.setItem("servicos", JSON.stringify(servicos));
}

function atualizarTabela() {
  const tbody = document.querySelector("#tabelaServicos tbody");
  tbody.innerHTML = "";
  servicos.forEach(s => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${s.cliente}</td>
      <td>${s.seguradora}</td>
      <td>${new Date(s.horario).toLocaleString()}</td>
      <td>R$ ${s.valor.toFixed(2)}</td>
      <td>${s.desconto}%</td>
      <td>R$ ${s.valorFinal.toFixed(2)}</td>
      <td>
        <button onclick="editar(${s.id})">Editar</button>
        <button onclick="deletar(${s.id})">Excluir</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function editar(id) {
  const servico = servicos.find(s => s.id === id);
  document.getElementById("cliente").value = servico.cliente;
  document.getElementById("seguradora").value = servico.seguradora;
  document.getElementById("horario").value = new Date(servico.horario).toISOString().slice(0,16);
  document.getElementById("valor").value = servico.valor;
  document.getElementById("desconto").value = servico.desconto;
  deletar(id); // remove para atualizar depois
}

function deletar(id) {
  servicos = servicos.filter(s => s.id !== id);
  salvarLocal();
  atualizarTabela();
}

document.getElementById("btnRelatorio").addEventListener("click", function() {
  let total = servicos.reduce((acc, s) => acc + s.valorFinal, 0);
  alert("Relatório Le Guinchos\nTotal de Serviços: " + servicos.length + "\nValor Total: R$ " + total.toFixed(2));
});

// Inicializa tabela ao carregar
atualizarTabela();