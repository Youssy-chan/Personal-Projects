# 🏭 Learning Factory 4.0 – Codice Sorgente

**Progetto di Tesi** | Youssef El jihad | A.A. 2024/2025  
**Piattaforma**: Fischertechnik Learning Factory 4.0 – 24V  
**Tecnologie**: Python · OPC-UA · MQTT · PostgreSQL

---

## Descrizione

Questo repository contiene il codice sviluppato durante il tirocinio per la **tracciabilità in tempo reale** dei pezzi nella microfabbrica Fischertechnik Learning Factory 4.0.

Il sistema si connette al PLC Siemens S7-1500 tramite protocollo OPC-UA, monitora lo stato di tutte le stazioni della fabbrica (magazzino, robot, lavorazione, smistamento) e ricostruisce il percorso di ogni pezzo attraverso la linea produttiva, registrando tempi e transizioni su database PostgreSQL.

---

## Struttura del repository

```
fischertechnik-codice/
│
├── factory_tracker_v7.py       # Script principale – tracciabilità in tempo reale
├── node_discovery.py           # Esplorazione ricorsiva dell'Address Space OPC-UA
├── genera_grafici_cap4.py      # Generazione grafici PDF per la tesi (da CSV)
├── schema.sql                  # Schema database PostgreSQL (tabelle + view)
├── node_discovery.txt          # Output della discovery dei nodi OPC-UA
└── README.md                   # Questo file
```

---

## File principali

### `factory_tracker_v7.py` — Tracker principale
Cuore del progetto. Si connette al server OPC-UA del PLC, sottoscrive 68 nodi in tempo reale e traccia il ciclo di vita di ogni pezzo (ingresso, ordine, magazzino, lavorazione, smistamento, uscita).

**Funzionalità:**
- Connessione a `opc.tcp://192.168.0.1:4840`
- Monitoraggio in tempo reale di tutte le stazioni: DSI, DSO, HBW, VGR, MPO, SLD
- Ricostruzione automatica del percorso pezzo con timestamp per ogni tappa
- Salvataggio eventi su `factory_events.csv`, `piece_log.csv` e sul database 
- Visualizzazione live dello stato del magazzino HBW

### `node_discovery.py` — Discovery OPC-UA
Esplora ricorsivamente l'intero Address Space del server OPC-UA, raccogliendo tutti i nodi disponibili (oggetti, variabili, metodi). Utile per mappare le variabili del PLC.

**Output:** file `node_discovery.txt` con la lista completa dei nodi.

### `genera_grafici_cap4.py` — Grafici tesi
Genera 4 grafici PDF vettoriali da file CSV esportati dal database, pronti per l'inclusione in LaTeX:
- `throughput_giornaliero.pdf` — pezzi prodotti per sessione e per esito
- `tempo_medio_stazione.pdf` — tempo medio di permanenza per stazione
- `confronto_scenari.pdf` — confronto tra ciclo di produzione e stoccaggio manuale
- `gantt_percorso.pdf` — diagramma di Gantt del percorso reale dei pezzi

### `schema.sql` — Database PostgreSQL
Schema relazionale completo per la persistenza dei dati della fabbrica. Include:
- Tabella `pieces` — anagrafica di ogni pezzo tracciato
- Tabella `steps` — ogni tappa del percorso per stazione
- Tabella `events` — log degli eventi OPC-UA interpretati
- Tabella `stock_history` — storico cambi di stato degli slot HBW
- View `avg_duration_per_station`, `daily_throughput`, `current_stock`

---

## Requisiti

**Python 3.9+** con le seguenti librerie:

```bash
pip install asyncua pandas matplotlib numpy
```

**Database** (opzionale, per persistenza):
```bash
# PostgreSQL 14+
psql -U postgres -d factory -f schema.sql
```

---

## Come eseguire

### 1. Avviare il tracker principale

```bash
# Assicurarsi di essere connessi alla rete della fabbrica (Wi-Fi: FischerTechnik Network)
python factory_tracker_v7.py
```

Il tracker si connette automaticamente al PLC su `192.168.0.1:4840` e inizia il monitoraggio. I log vengono salvati in `factory_events.csv` e `piece_log.csv`. Premere `Ctrl+C` per terminare.

### 2. Discovery dei nodi OPC-UA

```bash
python node_discovery.py --url opc.tcp://192.168.0.1:4840 --output node_discovery.txt
```

### 3. Generare i grafici per la tesi

Assicurarsi che i file CSV (`daily_throughput.csv`, `avg_duration_per_station.csv`, `steps.csv`, `pieces.csv`) siano presenti nella cartella configurata in `BASE`, poi:

```bash
python genera_grafici_cap4.py
```

I PDF vengono salvati nella cartella `grafici_tesi/`.

---

## Architettura di rete

| Componente | IP | Protocollo |
|---|---|---|
| PLC Siemens S7-1500 | `192.168.0.1` | OPC-UA (porta 4840) |
| Raspberry Pi / Node-RED | `192.168.0.5` | HTTP (porta 1880) |
| TXT 4.0 Controller | `192.168.0.10` | MQTT (porta 1883) |

---

## Documentazione correlata

La documentazione tecnica completa (architettura, protocolli, flussi operativi) si trova nel repository separato **`fischertechnik-documentazione`**.