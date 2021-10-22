import express from "express";
import { generateId } from "./utils/utils.js";
import { requestLogger, unknownEndpoint } from "./middleware.js";
import cardsDB from "./cards.js";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(requestLogger);
app.use(cors());
app.use(express.static("build"));

let cards = [...cardsDB];

app.get("/", (req, res) => {
  res.send("<h1>Hello World</h1>");
});

app.get("/api/cards", (req, res) => {
  res.json(cards);
});

app.get("/api/cards/:id", (req, res) => {
  const id = Number(req.params.id);
  const card = cards.find((card) => card.id === id);

  if (card) {
    res.json(card);
  } else {
    res.statusMessage = "The card with that ID was not found";
    res.status(404).end();
  }
});

app.post("/api/cards", (req, res) => {
  const card = req.body;
  if (!card.cardNumber) {
    return res.status(400).json({ error: "content missing" });
  }

  const newCard = {
    id: generateId(cards),
    validUntil: card.validUntil,
    important: card.important || false,
    type: card.type,
    cardNumber: card.cardNumber,
  };
  cards = cards.concat(newCard);
  res.json(card);
});

app.delete("/api/cards/:id", (req, res) => {
  const id = Number(req.params.id);
  cards = cards.filter((card) => card.id !== id);
  res.status(204).end();
});

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
