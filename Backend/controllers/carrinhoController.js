import usuarioModelo from "../models/usuarioModel.js";

export const addParaCarrinho = async (req, res) => {
  try {
    const { usuarioId, itemId } = req.body;

    const usuarioDados = await usuarioModelo.findById(usuarioId);
    
    if (!usuarioDados) {
      return res.json({ success: false, message: "Usuário não encontrado" });
    }

    let dadosCarrinho = usuarioDados.dadosCarrinho || {};

    if (dadosCarrinho[itemId]) {
      dadosCarrinho[itemId] += 1; 
    } else {
      dadosCarrinho[itemId] = 1; 
    }

    // Atualizar o usuário com os novos dados do carrinho
    await usuarioModelo.findByIdAndUpdate(usuarioId, { dadosCarrinho });

    res.json({ success: true, message: "Adicionou ao carrinho" });
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
