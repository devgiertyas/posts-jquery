const urlApi = 'https://localhost:4567';

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
    console.log(post)
    var linha = $(`<tr ${posts.id}>`);
    var coluna = "";

    coluna += `<td><button onclick="deletarPost(${post.id})">Deletar</button> <button onclick="atualizarPost(${post.id})">Atualizar</button></td>`;
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

  $("#cadastrar-post").css("display", "block")

  $("#btnAdicionarPost").css("display", "none")

}

function atualizarPost(idPost) {
  $("#cadastrar-post").css("display", "block")

  $("#btnAdicionarPost").css("display", "none")

  $("#idPost").val(idPost);

  $.ajax({
    type: "GET",
    url: urlApi + '/posts/' + idPost,
    dataType: "json",
    success: function (response) {
      $("#inputTitulo").val(response.title);
      $("#inputCategoria").val(response.categories);
      $("#inputConteudo").val(response.content);
      $("#inputVersao").val(response.version);
    },
    error: function (xhr, status) {
      console.log(xhr, status)
    },
  });


}

function voltarPost() {
  $("#cadastrar-post").css("display", "none")

  $("#btnAdicionarPost").css("display", "block")
}

function salvarPost() {

  const idPost = $("#idPost").val();
  const inputTitulo = $("#inputTitulo").val();
  const inputCategoria = $("#inputCategoria").val();
  const inputConteudo = $("#inputConteudo").val();

  if (inputTitulo === undefined || inputTitulo === "") {
    alert("Informe o Título");
    return;
  }

  if (inputCategoria === undefined || inputCategoria === "") {
    alert("Informe a Categoria");
    return;
  }


  if (inputConteudo === undefined || inputConteudo === "") {
    alert("Informe o Conteúdo");
    return
  }

  var post = {
    title: inputTitulo,
    categories: ["#feliz", "#folga"],
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

  $("#idPost").val(0);
  $("#inputTitulo").val('');
  $("#inputCategoria").val('');
  $("#inputConteudo").val('');
  $("#inputVersao").val(0);
}
