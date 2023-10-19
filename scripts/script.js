$(document).ready(() => {
    // Validação para garantir pelo menos 1 item na tabela de produtos
    $("#cadastroForm").submit(function(event) {
        const quantidadeItens = $("#tabelaProdutos tbody tr").length;
        if (quantidadeItens < 1) {
            alert("Pelo menos 1 item na tabela de produtos é obrigatório.");
            event.preventDefault(); // Impede o envio do formulário
        }

        // Validação dos campos na tabela de produtos
        let camposInvalidos = false;

        $("#tabelaProdutos tbody tr").each(function() {
            const descricao = $(this).find("input[name='descricaoProduto[]']").val();
            const unidadeMedida = $(this).find("input[name='unidadeMedida[]']").val();
            const quantidadeEstoque = $(this).find("input[name='quantidadeEstoque[]']").val();
            const valorUnitario = $(this).find("input[name='valorUnitario[]']").val();

            if (!descricao || !unidadeMedida || !quantidadeEstoque || !valorUnitario) {
                camposInvalidos = true;
                return false; // Saia do loop ao encontrar um campo inválido
            }
        });

        if (camposInvalidos) {
            alert("Todos os campos na tabela de produtos são obrigatórios.");
            event.preventDefault(); // Impede o envio do formulário
        }
    });
});
// Cálculo e preenchimento do campo "Valor Total" para cada linha da tabela
$("#tabelaProdutos tbody tr").each(function() {
    const quantidadeEstoque = parseFloat($(this).find("input[name='quantidadeEstoque[]']").val());
    const valorUnitario = parseFloat($(this).find("input[name='valorUnitario[]']").val());
    const valorTotal = (quantidadeEstoque * valorUnitario).toFixed(2);
    $(this).find("input[name='valorTotal[]']").val(valorTotal);
});

$("#cadastroForm").submit(function(event) {
    const quantidadeDocumentos = $("#tabelaAnexos tbody tr").length;
    if (quantidadeDocumentos < 1) {
        alert("Pelo menos 1 documento na tabela de anexos é obrigatório.");
        event.preventDefault(); // Impede o envio do formulário
    }
});
// Quando um documento é adicionado
$("#adicionarLinhaAnexo").click(() => {
    // ... Código para adicionar a linha na tabela

    // Obtenha o arquivo anexado, por exemplo, a partir de um campo de entrada de arquivo
    const fileInput = $(this).find("input[name='arquivoAnexo[]']")[0];
    const arquivo = fileInput.files[0];

    // Crie um Blob a partir do arquivo
    const blob = new Blob([arquivo], { type: arquivo.type });

    // Armazene o Blob no sessionStorage
    sessionStorage.setItem('documento_' + quantidadeDocumentos, blob);
});
$(document).on("click", ".excluirAnexo", function() {
    // Obtenha o índice da linha para excluir
    const rowIndex = $(this).closest("tr").index();

    // Remova o documento do sessionStorage
    sessionStorage.removeItem('documento_' + rowIndex);

    // Remova a linha da tabela
    $(this).closest("tr").remove();
});
$(document).on("click", ".visualizarAnexo", function() {
    // Obtenha o índice da linha para visualizar
    const rowIndex = $(this).closest("tr").index();

    // Obtenha o Blob do sessionStorage
    const blob = sessionStorage.getItem('documento_' + rowIndex);

    if (blob) {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'documento_' + rowIndex;
        link.click();
        window.URL.revokeObjectURL(url);
    }
});

function limpa_formulário_cep() {
    //Limpa valores do formulário de cep.
    document.getElementById('rua').value=("");
    document.getElementById('bairro').value=("");
    document.getElementById('cidade').value=("");
    document.getElementById('uf').value=("");
}

function meu_callback(conteudo) {
if (!("erro" in conteudo)) {
    //Atualiza os campos com os valores.
    document.getElementById('rua').value=(conteudo.logradouro);
    document.getElementById('bairro').value=(conteudo.bairro);
    document.getElementById('cidade').value=(conteudo.localidade);
    document.getElementById('uf').value=(conteudo.uf);
} //end if.
else {
    //CEP não Encontrado.
    limpa_formulário_cep();
    alert("CEP não encontrado.");
}
}

function pesquisacep(valor) {

//Nova variável "cep" somente com dígitos.
var cep = valor.replace(/\D/g, '');

//Verifica se campo cep possui valor informado.
if (cep != "") {

    //Expressão regular para validar o CEP.
    var validacep = /^[0-9]{8}$/;

    //Valida o formato do CEP.
    if(validacep.test(cep)) {

        //Preenche os campos com "..." enquanto consulta webservice.
        document.getElementById('rua').value="...";
        document.getElementById('bairro').value="...";
        document.getElementById('cidade').value="...";
        document.getElementById('uf').value="...";

        //Cria um elemento javascript.
        var script = document.createElement('script');

        //Sincroniza com o callback.
        script.src = 'https://viacep.com.br/ws/'+ cep + '/json/?callback=meu_callback';

        //Insere script no documento e carrega o conteúdo.
        document.body.appendChild(script);

    } //end if.
    else {
        //cep é inválido.
        limpa_formulário_cep();
        alert("Formato de CEP inválido.");
    }
} //end if.
else {
    //cep sem valor, limpa formulário.
    limpa_formulário_cep();
}
};

