import mongoose from 'mongoose'

const produtoSchema = new mongoose.Schema({
    itemId: {type: String},
    nome: {type: String},
    preco: {type: Number},
    categoria: {type: String},
    descricao: {type: String},
    imagem: {type: Array},
    data: {type: Date}
})

const produtoModel = mongoose.models.produto || mongoose.model("produto", produtoSchema)

export default produtoModel