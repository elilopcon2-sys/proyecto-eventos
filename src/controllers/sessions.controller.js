import { registerUser } from "../services/sessions.service.js";

export const getSessionStatus = (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Módulo de sesiones preparado"
  });
};

export const register = async (req, res) => {
  try {
    const user = await registerUser(req.body);

    return res.status(201).json({
      status: "success",
      payload: user
    });
  } catch (error) {
    if (error.code === 11000 || error.statusCode === 409) {
      return res.status(409).json({
        status: "error",
        message: "El email ya está registrado"
      });
    }

    if (error.statusCode === 400) {
      return res.status(400).json({
        status: "error",
        message: error.message
      });
    }

    console.error("Error al registrar usuario:", error);

    return res.status(500).json({
      status: "error",
      message: "Error interno del servidor"
    });
  }
};