import usuarioModelo from "../models/usuarioModel.js";

export const addParaCarrinho = async (req, res) => {
  try {
    const { usuarioId, itemId } = req.body;

    if (!usuarioId || !itemId) {
      return res
        .status(400)
        .json({ success: false, message: "Usuário e Item são obrigatórios" });
    }

    const usuarioDados = await usuarioModelo.findById(usuarioId);

    if (!usuarioDados) {
      return res
        .status(404)
        .json({ success: false, message: "Usuário não encontrado" });
    }

    let dadosCarrinho = usuarioDados.dadosCarrinho || {};

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
    res.json({success: false, message: error.message })
  }
}
