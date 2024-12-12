import * as http from "http";
import express from "express";
import cors from "cors";

import { getInitializedDB } from "./db";

const PORT = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

app.get("/", (_, res) => {
  res.send("Ok");
});

import {
  createOperator,
  getOperators,
  updateOperator,
  deleteOperator,
  getOperatorById,
  createAnnotation,
  getAnnotations,
  getAnnotationsByModel,
  updateAnnotation,
  deleteAnnotation
} from "./db";

const dbName = "dev.sqlite3"
const dbPath = ["./.dbs", dbName].join("/")

const db = await getInitializedDB(dbPath);

// #region operators
app.post("/operators", (req, res) => {
  const { name, surname } = req.body;
  const id = createOperator(db, name, surname);
  res.status(201).json({ id });
});

app.get("/operators/:id", (req, res) => {
  const { id } = req.params;
  const operator = getOperatorById(db, Number(id));
  if (operator) {
    res.json(operator);
  } else {
    res.status(404).send("Operator not found");
  }
});

app.get("/operators", (_, res) => {
  const operators = getOperators(db);
  res.json(operators);
});

app.put("/operators/:id", (req, res) => {
  const { id } = req.params;
  const { name, surname } = req.body;
  const result = updateOperator(db, Number(id), name, surname);
  if (result.changes === 0) {
    res.status(404).send("Operator not found");
  } else {
    res.send("Operator updated");
  }
});

app.delete("/operators/:id", (req, res) => {
  const { id } = req.params;
  const result = deleteOperator(db, Number(id));
  if (result.changes === 0) {
    res.status(404).send("Operator not found");
  } else {
    res.send("Operator deleted");
  }
});

// #region annotations
app.post("/annotations", (req, res) => {
  const { x, y, z, content, operatorId, modelId } = req.body;
  const id = createAnnotation(db, x, y, z, content, operatorId, modelId);
  res.status(201).json({ id });
});

app.get("/annotations/all", (_, res) => {
  const annotations = getAnnotations(db);
  res.json(annotations);
});

app.get("/annotations/:model_id", (req, res) => {
  const { model_id } = req.params;
  const annotations = getAnnotationsByModel(db, Number(model_id));
  res.json(annotations);
});

app.put("/annotations/:id", (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const result = updateAnnotation(db, Number(id), data);
  if (result.changes === 0) {
    res.status(404).send("Annotation not found");
  } else {
    res.send("Annotation updated");
  }
});

app.delete("/annotations/:id", (req, res) => {
  const { id } = req.params;
  const result = deleteAnnotation(db, Number(id));
  if (result.changes === 0) {
    res.status(404).send("Annotation not found");
  } else {
    res.send("Annotation deleted");
  }
});

server.listen(PORT, () => {
  console.log("info", `listening on http://localhost:${PORT}!`);
});

// Gracefully shut down the server on process termination
process.on("SIGINT", () => {
  console.log("info", "Shutting down server...");
  server.close(() => {
    console.log("info", "Server closed");
    process.exit(0);
  });
});

