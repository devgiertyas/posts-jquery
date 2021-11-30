const urlApi = 'https://localhost:4567';

let contadorCategoria = 1

function listarPosts() {

  $.ajax({
    url: urlApi + '/posts',
    type: "GET",
    success: function (response) {
      construirTabela(response);
    },
    error: function (xhr, status) {
      alert("error");
    }
  });

}

function construirTabela(posts) {
  $("#myTable tbody").remove();

  posts.forEach(post => {
    var linha = $(`<tr ${posts.id}>`);
    var coluna = "";

    coluna += `<td><button type="button" class="btn btn-danger"onclick="deletarPost(${post.id})">⨉</button> <button type="button" class="btn btn-primary"onclick="atualizarPost(${post.id})">↺</button></td>`;
    coluna += `<td> ${post.id} </td>`;
    coluna += `<td> ${post.title} </td>`;
    coluna += `<td> ${post.categories}</td>`;
    coluna += `<td> ${post.content}</td>`;
    coluna += `<td> ${post.version}</td>`;

    linha.append(coluna);
    $("#myTable").append(linha);
  }
  )

}

function cadastrarPost() {

  $("#modal-post").css("display", "block")

  $("#btnAdicionarPost").css("display", "none")

  resetarCampos();

  $('#modal-title').html("Novo Post");
}

function atualizarPost(idPost) {
  $("#modal-post").css("display", "block")

  $("#btnAdicionarPost").css("display", "none")

  $("#idPost").val(idPost);

  $('#modal-title').html("Atualizar Post");

  $.ajax({
    type: "GET",
    url: urlApi + '/posts/' + idPost,
    dataType: "json",
    success: function (response) {
      $("#inputTitulo").val(response.title);
      $("#inputConteudo").val(response.content);
      $("#inputVersao").val(response.version);
      renderizarCaregorias(response.categories)
    },
    error: function (xhr, status) {
      console.log(xhr, status)
    },
  });


}

function voltarPost() {
  $("#modal-post").css("display", "none")

  $("#btnAdicionarPost").css("display", "block")

  resetarCampos();
}

function salvarPost() {

  const idPost = $("#idPost").val();
  const inputTitulo = $("#inputTitulo").val();
  const inputConteudo = $("#inputConteudo").val();
  let categorias = [];

  $('#listaCategorias').children().each((index, element) => {

    categorias.push(element.textContent)// children's element
  });

  console.log(categorias)

  if (inputTitulo === undefined || inputTitulo === "") {
    alert("Informe o Título");
    return;
  }

  if (categorias.length <= 0) {
    alert("Informe a Categoria");
    return;
  }


  if (inputConteudo === undefined || inputConteudo === "") {
    alert("Informe o Conteúdo");
    return
  }

  var post = {
    title: inputTitulo,
    categories: categorias,
    content: inputConteudo,
  }


  if (idPost > 0) {

    // Update
    post = {
      ...post,
      "id": 5
    }

    $.ajax({
      type: "PUT",
      url: urlApi + '/posts/' + idPost,
      dataType: "json",
      data: JSON.stringify(post),
      success: function (response) {
        listarPosts();
        alert('os dados foram atualizados com sucesso!')
      },
      error: function (xhr, status) {
        console.log(xhr, status)
      },
    });

  }
  else {

    $.ajax({
      type: "POST",
      url: urlApi + '/posts',
      dataType: "json",
      data: JSON.stringify(post),
      success: function (response) {
        listarPosts();
        alert('os dados foram salvos com sucesso!')
      },
      error: function (xhr, status) {
        console.log(xhr, status)
      },
    });
  }

  voltarPost();

  resetarCampos();

}

function deletarPost(idPost) {
  if (!idPost)
    return
  $.ajax({
    type: "DELETE",
    url: urlApi + '/posts/' + idPost,
    dataType: "json",
    success: function (response, status) {
      listarPosts();
      alert('Deletado com sucesso')
    },
    error: function (xhr, status) {
      console.log(xhr, status)
    },
  });
}

$(document).ready(function () {
  listarPosts();
});

function resetarCampos() {
  $("#listaCategorias").children().remove();
  $("#idPost").val(0);
  $("#inputTitulo").val('');
  $("#inputCategoria").val('');
  $("#inputConteudo").val('');
  $("#inputVersao").val(0);
  contadorCategoria = 0;
}

function AdicionarCategoria() {

  const inputCategoria = $("#inputCategoria").val();

  if (inputCategoria === undefined || inputCategoria === "") {
    alert("Informe a Categoria");
    return;
  }

  var linha = $(`<li onclick={removerCategoria(categoria${contadorCategoria})} id="categoria${contadorCategoria}">${inputCategoria}</li>`);

  $("#listaCategorias").append(linha);

  contadorCategoria++;

  $("#inputCategoria").val('');

}

function renderizarCaregorias(categorias) {

  for (let i = 0; i < categorias.length; i++) {

    var linha = $(`<li onclick={removerCategoria(categoria${i})} id="categoria${i}">${categorias[i]}</li>`);
    $("#listaCategorias").append(linha);
    contadorCategoria++;
  }

}

function removerCategoria(categoria) {
  categoria.remove();
}