const hide = document.querySelector(".hide");
const pesquisar = document.getElementById("pesquisar");
const salvarBtn = document.querySelector("#salvar");

let volumeInfo = {};
let saleInfo = {};
let year = '';
let id = '';

async function pesquisa() {
    const query = pesquisar.value;
    const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=AIzaSyCGAQVhKymIfZFqE4I7zdotsZ2bD9y3s40`;

    try {
        let response = await fetch(url);
        let data = await response.json();
        handleResponse(data);
        console.log(data);
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
    }
}

function handleResponse(response) {
    if (response.items && response.items.length > 0) {
        const item = response.items[0];
        volumeInfo = item.volumeInfo || {};
        saleInfo = item.saleInfo || {};
        id = item.id || '';

        // Atualiza a interface com as informações do livro
        document.getElementById("titulo").innerHTML = volumeInfo.title || 'Título não disponível';
        document.getElementById("autor").innerHTML = volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Autor não disponível';
        document.getElementById("pages").innerHTML = volumeInfo.pageCount ? `${volumeInfo.pageCount} Páginas` : 'Número de páginas não disponível';
        document.getElementById("livro").src = volumeInfo.imageLinks ? volumeInfo.imageLinks.thumbnail : '';
        document.getElementById("description").innerHTML = volumeInfo.description || 'Descrição não disponível';

        const publishedDate = volumeInfo.publishedDate || '';
        year = publishedDate.slice(0, 4);
        document.getElementById("ano").innerHTML = year;

        document.getElementById("valor").innerHTML = saleInfo.listPrice ? `R$ ${saleInfo.listPrice.amount}` : '?';
        document.getElementById("buy").href = saleInfo.buyLink || '#';

        hide.classList.remove("hide");

        // Adiciona o evento de clique ao botão de salvar se ele existir
        if (salvarBtn) {
            salvarBtn.addEventListener('click', salvar);
        } else {
            console.error("Botão 'salvar' não encontrado.");
        }
    } else {
        // Limpa a interface se nenhum livro for encontrado
        document.getElementById("titulo").innerHTML = 'Nenhum livro encontrado';
        document.getElementById("autor").innerHTML = '';
        document.getElementById("livro").src = '';
        document.getElementById("description").innerHTML = '';
        document.getElementById("pages").innerHTML = '';
        document.getElementById("ano").innerHTML = '';
        document.getElementById("valor").innerHTML = '';
        document.getElementById("buy").href = '#';
    }
}

function salvar() {
    // Obtém a lista de livros existente, ou cria uma nova lista se não existir
    let livros = JSON.parse(localStorage.getItem('bookInfo')) || [];

    // Adiciona o novo livro à lista
    livros.push({
        titulo: volumeInfo.title,
        autor: volumeInfo.authors,
        paginas: volumeInfo.pageCount,
        imagem: volumeInfo.imageLinks ? volumeInfo.imageLinks.thumbnail : '',
        descricao: volumeInfo.description,
        ano: year,
        valor: saleInfo.listPrice ? saleInfo.listPrice.amount : '',
        link_compra: saleInfo.buyLink,
        id: id,
    });
    // Salva a lista atualizada no localStorage
    localStorage.setItem('bookInfo', JSON.stringify(livros));


    const mensagem = document.getElementById('alerta');
    mensagem.classList.remove('ocultar');
    mensagem.classList.add('mostrar');

    setTimeout(() => {
        mensagem.classList.remove('alerta');
        mensagem.classList.add('ocultar');
    }, 2000);


   document.getElementById("alerta").textContent = "Livro Salvo";

}

// Adiciona o evento de tecla para pesquisa
pesquisar.addEventListener("keyup", (e) => {
    if (e.code === 'Enter') {
        pesquisa();
    }
});
