export const getSessionStatus = (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Módulo de sesiones preparado"
  });
};