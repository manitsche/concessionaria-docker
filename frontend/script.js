// Alternância de abas
const tabs = document.querySelectorAll(".tabs_wrap ul li");
const sections = document.querySelectorAll(".form_section");

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    sections.forEach(sec => sec.classList.remove("active"));
    tab.classList.add("active");
    document.querySelector(`.${tab.dataset.tabs}`).classList.add("active");
  });
});

// Envio genérico de dados para o backend
async function enviarDados(url, dados) {
  const resposta = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados)
  });
  return resposta.json();
}

// Cadastro de carro
document.getElementById("enviarCarro").addEventListener("click", async (e) => {
  e.preventDefault();
  const carro = {
    marca: document.getElementById("marcaCarro").value,
    modelo: document.getElementById("modeloCarro").value,
    ano: parseInt(document.getElementById("anoCarro").value),
    cor: document.getElementById("corCarro").value,
    placa: document.getElementById("placaCarro").value,
    preco: parseFloat(document.getElementById("precoCarro").value)
  };
  const resposta = await enviarDados("http://localhost:3000/cars", carro);
  alert(resposta.mensagem || "Carro cadastrado com sucesso!");
});

// Cadastro de cliente
document.getElementById("enviarCliente").addEventListener("click", async (e) => {
  e.preventDefault();
  const cliente = {
    nomecliente: document.getElementById("nomeCliente").value,
    cpfcliente: document.getElementById("cpfCliente").value,
    telefonecliente: document.getElementById("telefoneCliente").value
  };
  const resposta = await enviarDados("http://localhost:3000/clients", cliente);
  alert(resposta.mensagem || "Cliente cadastrado com sucesso!");
});

// Cadastro de vendedor
document.getElementById("enviarVendedor").addEventListener("click", async (e) => {
  e.preventDefault();
  const vendedor = {
    nomevendedor: document.getElementById("nomeVendedor").value,
    cpfvendedor: document.getElementById("cpfVendedor").value,
    telefonevendedor: document.getElementById("telefoneVendedor").value
  };
  const resposta = await enviarDados("http://localhost:3000/sellers", vendedor);
  alert(resposta.mensagem || "Vendedor cadastrado com sucesso!");
});

// Realizar venda
document.getElementById("realizarVenda").addEventListener("click", async (e) => {
  e.preventDefault();
  const venda = {
    idcarro: document.getElementById("carroVenda").value,
    idcliente: document.getElementById("clienteVenda").value,
    idvendedor: document.getElementById("vendedorVenda").value
  };
  const resposta = await enviarDados("http://localhost:3000/sales", venda);
  alert(resposta.mensagem || "Venda realizada com sucesso!");
});

// Preenchimento de selects genérico
async function preencherSelect(id, url, campo) {
  try {
    const res = await fetch(url);
    const dados = await res.json();
    const select = document.getElementById(id);
    select.innerHTML = '<option value="">-- Selecione --</option>';
    dados.forEach(item => {
      if (item[campo]) {
        select.innerHTML += `<option value="${item._id}">${item[campo]}</option>`;
      }
    });
  } catch (err) {
    console.error(`Erro ao preencher select ${id}:`, err);
  }
}

// Preencher carros disponíveis para venda
async function preencherSelectCarros() {
  try {
    const res = await fetch("http://localhost:3000/cars?vendido=false");
    const dados = await res.json();
    const select = document.getElementById("carroVenda");
    select.innerHTML = '<option value="">-- Selecione --</option>';
    dados.forEach(carro => {
      const descricao = `${carro.marca} ${carro.modelo} ${carro.cor} (${carro.ano})`;
      select.innerHTML += `<option value="${carro._id}">${descricao}</option>`;
    });
  } catch (err) {
    console.error("Erro ao preencher select de carros:", err);
  }
}

// Quando abrir a aba de vendas, preencher os selects
document.querySelector('[data-tabs="vendas"]').addEventListener("click", () => {
  preencherSelectCarros();
  preencherSelect("clienteVenda", "http://localhost:3000/clients", "nomecliente");
  preencherSelect("vendedorVenda", "http://localhost:3000/sellers", "nomevendedor");
});

// Botão para listar carros vendidos ou disponíveis
document.getElementById("btnSelecionarListagem").addEventListener("click", async (e) => {
  e.preventDefault();
  const tipo = document.getElementById("categoriaProduto").value;
  let url = "";

  if (tipo === "carros_vendidos") {
    url = "http://localhost:3000/reports/vendidos";
  } else if (tipo === "carros_disponiveis") {
    url = "http://localhost:3000/reports/naoVendidos";
  }

  if (url) {
    try {
      const res = await fetch(url);
      const dados = await res.json();

      if (tipo === "carros_vendidos") {
        exibirListagemDeVendidos(dados);
      } else {
        exibirListagemDisponiveis(dados);
      }

    } catch (err) {
      console.error("Erro ao buscar listagem:", err);
    }
  } else {
    alert("Selecione uma listagem válida.");
  }
});

// Exibir listagem de carros disponíveis
function exibirListagemDisponiveis(dados) {
  const container = document.getElementById("resultadoListagem");
  try {
    container.innerHTML = dados.length
      ? dados.map(item =>
          `<p>${item.marca} ${item.modelo} (${item.ano}) - ${item.cor} - ${item.placa} - R$ ${item.preco.toFixed(2)}</p>`
        ).join("")
      : "<p>Nenhum resultado encontrado.</p>";
  } catch (err) {
    console.error("Erro ao exibir carros disponíveis:", err);
    container.innerHTML = "<p>Erro ao exibir carros disponíveis.</p>";
  }
}

// Exibir listagem de carros vendidos com cliente e vendedor
function exibirListagemDeVendidos(dados) {
  const container = document.getElementById("resultadoListagem");
  try {
    container.innerHTML = dados.length
      ? dados.map(item =>
          `<div style="border-bottom:1px solid #ccc; margin-bottom:10px; padding-bottom:10px;">
            ${item.marca} ${item.modelo} (${item.ano})<br>
            Cor: ${item.cor} | Placa: ${item.placa} | Preço: R$ ${item.preco.toFixed(2)}<br>
            <em>Cliente:</em> ${item.nomecliente} | <em>Vendedor:</em> ${item.nomevendedor}
          </div>`
        ).join("")
      : "<p>Nenhum resultado encontrado.</p>";
  } catch (err) {
    console.error("Erro ao exibir carros vendidos:", err);
    container.innerHTML = "<p>Erro ao exibir carros vendidos.</p>";
  }
}

// Abre o Drawio
document.getElementById('btnAbrirDrawio').addEventListener('click', function () {
  window.open('http://localhost:8088', '_blank');
});
