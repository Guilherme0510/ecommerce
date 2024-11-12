import usuarioModelo from "../models/usuarioModel.js";

export const addParaCarrinho = async (req, res) => {
  try {
    // Desestruturando os dados do body da requisição
    const { usuarioId, itemId } = req.body;

    // Verificando se os dados necessários foram enviados
    if (!usuarioId || !itemId) {
      return res
        .status(400)
        .json({ success: false, message: "Usuário e Item são obrigatórios" });
    }

    // Buscando os dados do usuário no banco de dados
    const usuarioDados = await usuarioModelo.findById(usuarioId);

    // Verificando se o usuário existe
    if (!usuarioDados) {
      return res
        .status(404)
        .json({ success: false, message: "Usuário não encontrado" });
    }

    // Inicializando os dados do carrinho caso não existam
    let dadosCarrinho = usuarioDados.dadosCarrinho || {};

    // Se o item já existe no carrinho, incrementa a quantidade
    if (dadosCarrinho[itemId]) {
      dadosCarrinho[itemId] += 1;
    } else {
      // Caso o item não exista, adiciona com quantidade 1
      dadosCarrinho[itemId] = 1;
    }

    // Atualizando os dados do carrinho no banco de dados
    await usuarioModelo.findByIdAndUpdate(usuarioId, { dadosCarrinho });

    // Retornando a resposta com sucesso e os dados atualizados
    res.json({
      success: true,
      message: "Adicionado ao carrinho",
      dadosCarrinho,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
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

export const carrinhoUsuario = async (req,res) => {
  try {
    const { usuarioId } = req.body
    let dadosCarrinho = await usuarioModelo.findById(usuarioId)
    res.json({success: true, dadosCarrinho})
  } catch (error) {
    console.log(error);
    res.json({success: false, message: error.message})
  }
}
