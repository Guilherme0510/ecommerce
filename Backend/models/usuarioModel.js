import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true  },
  senha: { type: String, required: true},
  dadosCarrinho: {type: Object, default: {}}
}, {minimize: false});

const usuarioModelo = mongoose.models.usuario || mongoose.model('usuario', userSchema)

export default usuarioModelo