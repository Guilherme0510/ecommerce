import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import usuarioModelo from "../models/usuarioModel.js";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

export const Login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    const usuario = await usuarioModelo.findOne({ email });

    if (!usuario) {
      return res.json({ success: false, message: "Usuario não existe" });
    }

    const isMatch = await bcrypt.compare(senha, usuario.senha);

    if (isMatch) {
      const token = createToken(usuario._id);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Credenciais Invalidas" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const registrar = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    const existe = await usuarioModelo.findOne({ email });

    if (existe) {
      return res.json({ success: false, message: "Usuário já existe!" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Insira um email válido" });
    }
    if (senha.length < 8) {
      return res.json({
        success: false,
        message: "Insira uma senha forte ( 8 digitos )",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedSenha = await bcrypt.hash(senha, salt);

    const novoUsuario = new usuarioModelo({
      nome,
      email,
      senha: hashedSenha,
    });

    const usuario = await novoUsuario.save();

    const token = createToken(usuario._id);

    res.json({ success: true, message: "Cadastro bem sucedido", token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const admin = async (req, res) => {
  try {
    const { email, senha } = req.body;
    if (email === process.env.ADMIN_EMAIL && senha === process.env.ADMIN_SENHA) {
      const token = jwt.sign(email + senha, process.env.JWT_SECRET);
      res.json({ success: true, token });
    }
    else{
      res.json({success:false, message: "Credenciais Inválidas"})
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
