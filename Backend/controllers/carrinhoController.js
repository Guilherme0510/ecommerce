import usuarioModelo from "../models/usuarioModel.js";
import produtoModel from "../models/produtoModel.js";

export const addParaCarrinho = async (req, res) => {
  try {
    const { usuarioId, itemId } = req.body;

    // Busca o usuário
    const usuarioDados = await usuarioModelo.findById(usuarioId);
    if (!usuarioDados) {
      return res.json({ success: false, message: "Usuário não encontrado" });
    }

    // Busca o produto
    const produto = await produtoModel.findById(itemId);
    if (!produto) {
      return res.json({ success: false, message: "Produto não encontrado" });
    }

    let dadosCarrinho = usuarioDados.dadosCarrinho || {};

    // Corrige estrutura antiga de dadosCarrinho se necessário
    if (typeof dadosCarrinho[itemId] === "number") {
      dadosCarrinho[itemId] = { quantidade: dadosCarrinho[itemId] };
    }

    // Verifica se o item já existe no carrinho
    if (dadosCarrinho[itemId]) {
      dadosCarrinho[itemId].quantidade += 1; // Incrementa a quantidade
    } else {
      // Adiciona o novo item com detalhes
      dadosCarrinho[itemId] = {
        quantidade: 1,
        nome: produto.nome,
        preco: produto.preco,
        imagem: produto.imagem[0],
        categoria: produto.categoria,
        descricao: produto.descricao,
      };
    }

    // Atualiza o carrinho no banco de dados
    await usuarioModelo.findByIdAndUpdate(usuarioId, { dadosCarrinho });

    res.json({
      success: true,
      message: "Adicionado ao carrinho",
      carrinho: dadosCarrinho,
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

export const atualizarCarrinho = async (req, res) => {
  try {
    const { usuarioId, itemId, quantidade } = req.body;

    let usuarioDados = await usuarioModelo.findById(usuarioId);
    let dadosCarrinho = await usuarioDados.dadosCarrinho;

    dadosCarrinho[itemId] = quantidade;
    await usuarioModelo.findByIdAndUpdate(usuarioId, { dadosCarrinho });
    res.json({ success: true, message: "Carrinho atualizado" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const carrinhoUsuario = async (req, res) => {
  try {
    const { usuarioId } = req.body;
    let dadosCarrinho = await usuarioModelo.findById(usuarioId, 'dadosCarrinho');
    if (!dadosCarrinho) {
      return res.json({ success: false, message: "Carrinho não encontrado." });
    }
    res.json({ success: true, dadosCarrinho });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};
