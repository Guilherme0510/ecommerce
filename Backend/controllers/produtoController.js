import { v2 as cloudinary } from "cloudinary";
import produtoModel from "../models/produtoModel.js";

// Função para adicionar um produto
export const addProduto = async (req, res) => {
  try {
    const { nome, preco, categoria, descricao, data = Date.now() } = req.body;

    const image1 = req.files?.image1?.[0];
    const image2 = req.files?.image2?.[0];
    const image3 = req.files?.image3?.[0];
    const image4 = req.files?.image4?.[0];

    console.log("Imagens extraídas:", { image1, image2, image3, image4 });

    const imagens = [image1, image2, image3, image4].filter(
      (item) => item !== undefined
    );

    if (imagens.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Nenhuma imagem foi enviada." });
    }

    const produtoDados = {
      nome,
      preco: Number(preco),
      categoria,
      descricao,
      imagem: imagens,
      data,
    };

    console.log("Dados do Produto:", produtoDados);

    const produto = new produtoModel(produtoDados);
    await produto.save();

    res.json({ success: true, message: "Produto adicionado com sucesso!" });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: `Erro ao adicionar o produto: ${error.message}`,
    });
  }
};

export const listaProduto = async (req, res) => {
  try {
    const lista = await produtoModel.find({});
    res.json({ success: true, message: "Itens mostrados", lista });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const removerProduto = async (req,res) => {
  try {
    const remover = await produtoModel.findByIdAndDelete(req.body.id)
    res.json({success: true, message: "Item removido", remover})
  } catch (error) {
    console.log(error);
    res.json({success: false, message: error.message})
  }
}

export const produtoUnico = async (req,res) => {
  try {
    const { produtoId } = req.body
    const produto = await produtoModel.findById(produtoId)
    res.json({success: true, produto})
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}