const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

// const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

function validateProjectId(req, res, next) {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json({ error: "ID is not valid" });
  }

  return next();
}

let repositories = [];

app.get("/repositories", (request, response) => {
  response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repositori = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };
  repositories.push(repositori);
  return response.status(200).json(repositori);
});

app.put("/repositories/:id", validateProjectId, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositorieIndex = repositories.findIndex(
    (repositorie) => repositorie.id === id
  );

  if (repositorieIndex < 0) {
    return response.status(400).json({ error: "Repositori not found" });
  }

  repositories[repositorieIndex] = {
    ...repositories[repositorieIndex],
    title,
    url,
    techs,
  };

  console.log("DAdos", repositories[repositorieIndex]);

  return response.status("200").json(repositories[repositorieIndex]);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositorieIndex = repositories.findIndex(
    (repositorie) => repositorie.id === id
  );

  if (repositorieIndex < 0) {
    return response.status(400).json({ error: "Repositori not found" });
  }

  //respositories = repositories.slice(repositorieIndex, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", validateProjectId, (request, response) => {
  const { id } = request.params;

  const repositorieIndex = repositories.findIndex(
    (repositorie) => repositorie.id === id
  );

  if (repositorieIndex < 0) {
    return res.status(400).json({ error: "Repositori not found" });
  }

  const likesNow = repositories[repositorieIndex].likes + 1;

  repositories[repositorieIndex] = {
    ...repositories[repositorieIndex],
    likes: likesNow,
  };

  //console.log("DAdos", repositories[repositorieIndex]);

  return response.status("200").json(repositories[repositorieIndex]);
});

module.exports = app;
