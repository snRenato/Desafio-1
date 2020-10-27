const express = require("express");
const cors = require("cors");
const { v4: uuid} = require('uuid');
const app = express();
app.use(express.json());
app.use(cors());
const repositories = []
let count = 0

const validateId = (req, resp, next) => {
  const { id } = req.params
  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  if (repositoryIndex < 0){
    return resp.status(400).json({error: "Repository not found"})
  }
  next()
}

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body

  const repository = {id: uuid(), likes: 0, title, url: url, techs}
  repositories.push(repository)
  return response.json(repository)
});

app.put("/repositories/:id", validateId, (request, response) => {
  const { id } = request.params
  const {title, url, techs  } = request.body
  const repository = { id, title, url, techs, likes: 0 }

  repositories[id] = repository
  return response.json(repository)
});

app.delete("/repositories/:id", validateId, (request, response) => {
  const { id } = request.params
  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  repositories.splice(repositoryIndex, 1)
  return response.status(204).send()
});

app.post("/repositories/:id/like", validateId, (request, response) => { count += 1;
  const liked = { likes: count }; return response.json(liked)});

module.exports = app;
