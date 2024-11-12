import jwt from 'jsonwebtoken';

const authUsuario = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; 

  if (!token) {
    return res.status(401).json({ success: false, message: "Login não autorizado" });
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
    req.body.usuarioId = tokenDecode.id; 
    next(); 
  } catch (error) {
    console.log(error);
    return res.status(403).json({ success: false, message: "Token inválido" });
  }
};

export default authUsuario;
