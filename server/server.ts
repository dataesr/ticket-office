import app from ".";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🦊 Elysia fonctionne sur http://localhost:${PORT}`);
  console.log(`Voir la documentation sur http://localhost:${PORT}/swagger`);
});
