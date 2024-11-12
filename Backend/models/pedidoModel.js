import mongoose from 'mongoose'

export const pedidoSchema = new mongoose.Schema({
    usuarioId: {type: String, required: true},
    itens: [{type: String, required: true}],
    quantidade: {type: Number, required: true},
    endereco: {type: String, required: true},
    status: {type: String, required: true},
    metodoPagamento: {type: String, required: true},
    pagamento: {type: Boolean, required: true},
})

const pedidoModel = mongoose.models.pedido || mongoose .model('pedido', pedidoSchema)

export default pedidoModel