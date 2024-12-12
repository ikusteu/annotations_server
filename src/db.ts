import fs from "fs";
import path from "path";
import SQLite, { Database } from "better-sqlite3";

function getSchema(): string {
  const name = "init.sql"
  const fpath = path.resolve(process.cwd(), "src", "schemas", name)
  return fs.readFileSync(fpath, "utf8")
}

export function deleteAnnotation(db: Database, id: number) {
  const operatorStmt = db.prepare("DELETE FROM annotation_operator WHERE annotation_id = ?");
  operatorStmt.run(id);

  const modelStmt = db.prepare("DELETE FROM model_annotation WHERE annotation_id = ?");
  modelStmt.run(id);

  const stmt = db.prepare("DELETE FROM annotation WHERE id = ?");
  return stmt.run(id);
}

const dbCache = new Map<string, Database>()

/** Creates a bare minimum SQLite instance and adds CR-SQLite extension */
export function newDB(fpath: string) {
  return new SQLite(fpath, { verbose: console.log });
}

export function initializeDB(db: Database) {
  const schema = getSchema()
  db.exec(schema);
}

export const getInitializedDB = async (fpath: string) => {
  // Check if db already cached
  if (dbCache.has(fpath)) return dbCache.get(fpath)!

  // Ensure the directory exists
  const dir = path.dirname(fpath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const db = newDB(fpath);
  initializeDB(db);

  return db;
}

// #region operators
export function createOperator(db: Database, name: string, surname: string) {
  const stmt = db.prepare("INSERT INTO operator (name, surname) VALUES (?, ?)");
  const info = stmt.run(name, surname);
  return info.lastInsertRowid;
}

export function getOperatorById(db: Database, id: number) {
  const stmt = db.prepare("SELECT * FROM operator WHERE id = ?");
  return stmt.get(id);
}

export function getOperators(db: Database) {
  const stmt = db.prepare("SELECT * FROM operator");
  return stmt.all();
}

export function updateOperator(db: Database, id: number, name: string, surname: string) {
  const stmt = db.prepare("UPDATE operator SET name = ?, surname = ? WHERE id = ?");
  return stmt.run(name, surname, id);
}

export function deleteOperator(db: Database, id: number) {
  const stmt = db.prepare("DELETE FROM operator WHERE id = ?");
  return stmt.run(id);
}

// #region annotations
export function createAnnotation(db: Database, x: number, y: number, z: number, content: string, operatorId: number, modelId: number) {
  const stmt = db.prepare("INSERT INTO annotation (x, y, z, content) VALUES (?, ?, ?, ?)");
  const info = stmt.run(x, y, z, content);
  const annotationId = info.lastInsertRowid;

  const linkStmt = db.prepare("INSERT INTO annotation_operator (annotation_id, operator_id) VALUES (?, ?)");
  linkStmt.run(annotationId, operatorId);

  const modelStmt = db.prepare("INSERT INTO model_annotation (model_id, annotation_id) VALUES (?, ?)");
  modelStmt.run(modelId, annotationId);

  return annotationId;
}

export function getAnnotations(db: Database) {
  const stmt = db.prepare(`
    SELECT a.*, o.id AS operator_id, o.name AS operator_name, o.surname AS operator_surname, ma.model_id
    FROM annotation a
    JOIN model_annotation ma ON a.id = ma.annotation_id
    JOIN annotation_operator ao ON a.id = ao.annotation_id
    JOIN operator o ON ao.operator_id = o.id
  `);
  return stmt.all();
}

export function getAnnotationsByModel(db: Database, modelId: number) {
  const stmt = db.prepare(`
    SELECT a.*, o.id AS operator_id, o.name AS operator_name, o.surname AS operator_surname, ma.model_id
    FROM annotation a
    JOIN model_annotation ma ON a.id = ma.annotation_id
    JOIN annotation_operator ao ON a.id = ao.annotation_id
    JOIN operator o ON ao.operator_id = o.id
    WHERE ma.model_id = ?
  `);
  return stmt.all(modelId);
}

export function updateAnnotation(db: Database, id: number, data: Partial<{ x: number; y: number; z: number; content: string; operator_id: number }>) {
  const fields = Object.keys(data).map(key => `${key} = ?`).join(", ");
  const values = Object.values(data);
  const stmt = db.prepare(`UPDATE annotation SET ${fields} WHERE id = ?`);
  const result = stmt.run(...values, id);

  if (data.operator_id !== undefined) {
    const operatorStmt = db.prepare("UPDATE annotation_operator SET operator_id = ? WHERE annotation_id = ?");
    operatorStmt.run(data.operator_id, id);
  }

  return result;
}

