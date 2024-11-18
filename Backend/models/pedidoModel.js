import mongoose from 'mongoose';

const pedidoSchema = new mongoose.Schema({
  usuarioId: { type: String, required: true },
  itens: [{
    produtoId: { type: String, required: true },
    quantidade: { type: Number, required: true },
    nome: { type: String, required: true }
  }],
  endereco: {
    primeiroNome: { type: String, required: true },
    sobrenome: { type: String, required: true },
    email: { type: String, required: true },
    endereco: { type: String, required: true },
    numeroCasa: { type: String, required: true },
    cidade: { type: String, required: true },
    estado: { type: String, required: true },
    cep: { type: String, required: true },
    pais: { type: String, required: true },
    telefone: { type: String, required: true }
  },
  status: { type: String, required: false },
  metodoPagamento: { type: String, required: true },
  pagamento: { type: Boolean, required: true },
  data: { type: Date, default: Date.now },
});

const pedidoModel = mongoose.models.pedido || mongoose.model('pedido', pedidoSchema);

export default pedidoModel;
