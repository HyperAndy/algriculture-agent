import sqlite3
from pathlib import Path

DB_PATH = Path("prisma/dev.db")

SCHEMA_SQL = """
PRAGMA foreign_keys=ON;

CREATE TABLE IF NOT EXISTS Field (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  areaMu REAL NOT NULL,
  cropType TEXT NOT NULL,
  variety TEXT,
  growthStage TEXT NOT NULL,
  sowingDate DATETIME NOT NULL,
  targetYieldKgPerMu REAL,
  riskLevel TEXT NOT NULL DEFAULT 'low',
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS FieldObservation (
  id TEXT PRIMARY KEY NOT NULL,
  fieldId TEXT NOT NULL,
  temperatureC REAL NOT NULL,
  rainfallMm REAL NOT NULL,
  windLevel TEXT,
  weatherTrend TEXT NOT NULL,
  soilMoisturePercent REAL NOT NULL,
  soilTemperatureC REAL,
  soilPh REAL,
  nitrogenLevel TEXT NOT NULL,
  phosphorusLevel TEXT NOT NULL,
  potassiumLevel TEXT NOT NULL,
  plantHeightCm REAL,
  leafColor TEXT NOT NULL,
  growthStatus TEXT NOT NULL,
  pestDescription TEXT,
  diseaseDescription TEXT,
  weedDescription TEXT,
  lastIrrigationDate DATETIME,
  lastFertilizationDate DATETIME,
  lastPesticideDate DATETIME,
  notes TEXT,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT FieldObservation_fieldId_fkey FOREIGN KEY (fieldId) REFERENCES Field(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS AgentRun (
  id TEXT PRIMARY KEY NOT NULL,
  fieldId TEXT NOT NULL,
  observationId TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'completed',
  overallRiskLevel TEXT NOT NULL,
  summary TEXT NOT NULL,
  reasoning TEXT NOT NULL,
  recommendations TEXT NOT NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completedAt DATETIME,
  CONSTRAINT AgentRun_fieldId_fkey FOREIGN KEY (fieldId) REFERENCES Field(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT AgentRun_observationId_fkey FOREIGN KEY (observationId) REFERENCES FieldObservation(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS AgentStep (
  id TEXT PRIMARY KEY NOT NULL,
  agentRunId TEXT NOT NULL,
  agentName TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'completed',
  inputSummary TEXT NOT NULL,
  outputSummary TEXT NOT NULL,
  startedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completedAt DATETIME,
  CONSTRAINT AgentStep_agentRunId_fkey FOREIGN KEY (agentRunId) REFERENCES AgentRun(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS FarmingTask (
  id TEXT PRIMARY KEY NOT NULL,
  fieldId TEXT NOT NULL,
  agentRunId TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT NOT NULL,
  dueDate DATETIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completedAt DATETIME,
  CONSTRAINT FarmingTask_fieldId_fkey FOREIGN KEY (fieldId) REFERENCES Field(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT FarmingTask_agentRunId_fkey FOREIGN KEY (agentRunId) REFERENCES AgentRun(id) ON DELETE CASCADE ON UPDATE CASCADE
);
"""


def main():
  DB_PATH.parent.mkdir(parents=True, exist_ok=True)
  connection = sqlite3.connect(DB_PATH)
  try:
    connection.executescript(SCHEMA_SQL)
    connection.commit()
  finally:
    connection.close()
  print(f"SQLite schema initialized at {DB_PATH.resolve()}")


if __name__ == "__main__":
  main()
