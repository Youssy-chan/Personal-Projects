-- =============================================================================
-- schema.sql  –  Learning Factory 4.0  –  PostgreSQL
-- =============================================================================
-- Eseguire una sola volta:
--   psql -U postgres -d factory -f schema.sql
-- =============================================================================

-- Pulisce le tabelle se esistono già (utile per reset completo)
DROP TABLE IF EXISTS stock_history CASCADE;
DROP TABLE IF EXISTS steps        CASCADE;
DROP TABLE IF EXISTS events       CASCADE;
DROP TABLE IF EXISTS pieces       CASCADE;

-- ─────────────────────────────────────────────────────────────────────────────
-- PIECES  –  anagrafica pezzo (1 riga per pezzo, dalla nascita alla morte)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE pieces (
    id                VARCHAR(5)   PRIMARY KEY,          -- es. #0YGS
    piece_type        VARCHAR(20),                       -- RED | BLUE | WHITE
    origin            VARCHAR(10)  NOT NULL,             -- 'dsi' (stoccaggio) | 'order'
    created_at        TIMESTAMPTZ  NOT NULL,
    completed_at      TIMESTAMPTZ,                       -- NULL se interrotto
    total_duration_s  FLOAT,
    outcome           VARCHAR(20)                        -- STORED | SHIPPED | INTERRUPTED
);

COMMENT ON TABLE  pieces IS 'Anagrafica di ogni pezzo tracciato dalla fabbrica';
COMMENT ON COLUMN pieces.origin  IS 'dsi = inserimento manuale, order = ordine da HBW';
COMMENT ON COLUMN pieces.outcome IS 'STORED = stoccato in HBW, SHIPPED = uscito da DSO, INTERRUPTED = tracker fermato';

-- ─────────────────────────────────────────────────────────────────────────────
-- STEPS  –  ogni tappa del viaggio di un pezzo
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE steps (
    id          BIGSERIAL    PRIMARY KEY,
    piece_id    VARCHAR(5)   NOT NULL REFERENCES pieces(id) ON DELETE CASCADE,
    station     VARCHAR(10)  NOT NULL,   -- dsi | vgr | hbw | mpo | sld | dso
    arrived_at  TIMESTAMPTZ  NOT NULL,
    left_at     TIMESTAMPTZ,             -- NULL se ancora in stazione
    duration_s  FLOAT                   -- NULL se ancora in stazione
);

CREATE INDEX idx_steps_piece_id  ON steps(piece_id);
CREATE INDEX idx_steps_station   ON steps(station);

COMMENT ON TABLE steps IS 'Ogni fermata di un pezzo in una stazione (una riga per stazione per pezzo)';

-- ─────────────────────────────────────────────────────────────────────────────
-- EVENTS  –  log eventi interpretati (solo quelli significativi)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE events (
    id          BIGSERIAL    PRIMARY KEY,
    ts          TIMESTAMPTZ  NOT NULL,
    module      VARCHAR(10)  NOT NULL,   -- VGR | SLD | HBW | MPO | DSI | DSO | Order | Stock
    piece_id    VARCHAR(5),              -- NO FK: il pezzo potrebbe non essere ancora in pieces
    key         VARCHAR(60)  NOT NULL,   -- es. VGR.x_active
    old_value   TEXT,
    new_value   TEXT,
    event_msg   TEXT         NOT NULL    -- messaggio interpretato (mai NULL qui)
);

CREATE INDEX idx_events_ts       ON events(ts);
CREATE INDEX idx_events_piece_id ON events(piece_id);
CREATE INDEX idx_events_module   ON events(module);

COMMENT ON TABLE events IS 'Solo eventi OPC-UA con messaggio interpretato (esclusi heartbeat e cambi non significativi)';

-- ─────────────────────────────────────────────────────────────────────────────
-- STOCK_HISTORY  –  storico cambi di stato degli slot del magazzino HBW
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE stock_history (
    id          BIGSERIAL    PRIMARY KEY,
    ts          TIMESTAMPTZ  NOT NULL,
    slot        VARCHAR(10)  NOT NULL,   -- es. [2,1]
    s_type      VARCHAR(20),             -- BLUE | RED | WHITE | NULL
    s_state     VARCHAR(20),             -- RAW | PROCESSED | EMPTY | NULL
    piece_id    VARCHAR(5)               -- pezzo coinvolto (se noto al momento)
);

CREATE INDEX idx_stock_ts   ON stock_history(ts);
CREATE INDEX idx_stock_slot ON stock_history(slot);

COMMENT ON TABLE stock_history IS 'Ogni cambio di s_state di uno slot HBW (prelievo o stoccaggio)';

-- ─────────────────────────────────────────────────────────────────────────────
-- VIEW UTILI
-- ─────────────────────────────────────────────────────────────────────────────

-- Tempo medio per stazione (su pezzi completati)
CREATE VIEW avg_duration_per_station AS
SELECT
    station,
    COUNT(*)                              AS n_passaggi,
    ROUND(AVG(duration_s)::NUMERIC, 1)   AS avg_s,
    ROUND(MIN(duration_s)::NUMERIC, 1)   AS min_s,
    ROUND(MAX(duration_s)::NUMERIC, 1)   AS max_s
FROM steps
WHERE duration_s IS NOT NULL
GROUP BY station
ORDER BY avg_s DESC;

-- Throughput giornaliero
CREATE VIEW daily_throughput AS
SELECT
    DATE(completed_at AT TIME ZONE 'Europe/Rome') AS giorno,
    outcome,
    COUNT(*)                                       AS pezzi,
    ROUND(AVG(total_duration_s)::NUMERIC, 1)      AS avg_ciclo_s
FROM pieces
WHERE completed_at IS NOT NULL
GROUP BY 1, 2
ORDER BY 1 DESC, 2;

-- Occupazione slot magazzino (stato attuale)
CREATE VIEW current_stock AS
SELECT DISTINCT ON (slot)
    slot, s_type, s_state, piece_id, ts
FROM stock_history
ORDER BY slot, ts DESC;
