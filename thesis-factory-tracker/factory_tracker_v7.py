#!/usr/bin/env python3
"""
factory_tracker.py  –  Learning Factory 4.0  –  v7
====================================================
NASCITA id pezzo:
  - Ordine     : Order.s_state == "ORDERED"  → pezzo aggiunto a pending queue
  - Stoccaggio : DSI.x_active True           → pezzo nato alla DSI

MORTE id pezzo:
  - Ordine     : DSO.i_code 0→1
  - Stoccaggio : Stock.[r,c].s_state → RAW / PROCESSED

"""

import asyncio
import logging
import os
import random
import re
import string

import asyncpg
from collections import deque
from dataclasses import dataclass, field as dc_field
from datetime import datetime
from typing import Optional

logging.basicConfig(level=logging.WARNING)

OPC_UA_URL = os.getenv("OPCUA_URL",    "opc.tcp://192.168.0.1:4840")
DB_URL     = os.getenv("DATABASE_URL", "postgresql://postgres:youss@localhost:5432/factory")
BASE       = '"gtyp_Interface_Dashboard"."Subscribe".'

I_CODE = {
    0: ("🔴", "FAULT – errore / vuoto"),
    1: ("⚪", "IDLE – pronto / in attesa"),
    2: ("🟡", "BUSY – in lavorazione"),
    3: ("🟢", "DONE – completato"),
    4: ("🔵", "FETCH – recupero pezzo"),
    5: ("🟠", "STORE – stoccaggio"),
}

STATION_NAME = {
    "dsi": "DSI (Ingresso)", "dso": "DSO (Uscita)",
    "hbw": "HBW (Magazzino)", "mpo": "MPO (Lavorazione)",
    "sld": "SLD (Smistamento)", "vgr": "VGR (Robot Ventosa)",
    "": "—",
}
# Stazioni fisiche (il tag [#ID] mostra solo il pezzo qui)
PHYSICAL_STATIONS = {"dsi", "dso", "hbw", "mpo", "sld", "vgr"}
# Stazioni da cui VGR puo' prelevare
SOURCE_STATIONS = ("dsi", "hbw", "sld", "mpo")

def station_name(s: str) -> str:
    return STATION_NAME.get(str(s).lower().strip(), str(s).upper())

def icode_str(code) -> str:
    if code is None: return "?"
    try:
        emoji, desc = I_CODE.get(int(code), ("❓", f"codice {code}"))
        return f"{emoji} {desc}"
    except Exception:
        return str(code)

def nid(path: str) -> str:
    return f'ns=3;s={BASE}{path}'


# ─────────────────────────────────────────────────────────────────────────────
# NodeId  (NFC rimosso completamente)
# ─────────────────────────────────────────────────────────────────────────────
ALL_NODES = {
    "DSI.x_active":      nid('"State_DSI"."x_active"'),
    "DSI.i_code":        nid('"State_DSI"."i_code"'),
    "DSI.s_station":     nid('"State_DSI"."s_station"'),
    "DSI.s_target":      nid('"State_DSI"."s_target"'),
    "DSI.s_description": nid('"State_DSI"."s_description"'),
    "DSI.ldt_ts":        nid('"State_DSI"."ldt_ts"'),
    "DSO.x_active":      nid('"State_DSO"."x_active"'),
    "DSO.i_code":        nid('"State_DSO"."i_code"'),
    "DSO.s_station":     nid('"State_DSO"."s_station"'),
    "DSO.s_target":      nid('"State_DSO"."s_target"'),
    "DSO.s_description": nid('"State_DSO"."s_description"'),
    "DSO.ldt_ts":        nid('"State_DSO"."ldt_ts"'),
    "HBW.x_active":      nid('"State_HBW"."x_active"'),
    "HBW.i_code":        nid('"State_HBW"."i_code"'),
    "HBW.s_station":     nid('"State_HBW"."s_station"'),
    "HBW.s_target":      nid('"State_HBW"."s_target"'),
    "HBW.s_description": nid('"State_HBW"."s_description"'),
    "HBW.ldt_ts":        nid('"State_HBW"."ldt_ts"'),
    "MPO.x_active":      nid('"State_MPO"."x_active"'),
    "MPO.i_code":        nid('"State_MPO"."i_code"'),
    "MPO.s_station":     nid('"State_MPO"."s_station"'),
    "MPO.s_target":      nid('"State_MPO"."s_target"'),
    "MPO.s_description": nid('"State_MPO"."s_description"'),
    "MPO.ldt_ts":        nid('"State_MPO"."ldt_ts"'),
    "SLD.x_active":      nid('"State_SLD"."x_active"'),
    "SLD.i_code":        nid('"State_SLD"."i_code"'),
    "SLD.s_station":     nid('"State_SLD"."s_station"'),
    "SLD.s_target":      nid('"State_SLD"."s_target"'),
    "SLD.s_description": nid('"State_SLD"."s_description"'),
    "SLD.ldt_ts":        nid('"State_SLD"."ldt_ts"'),
    "VGR.x_active":      nid('"State_VGR"."x_active"'),
    "VGR.i_code":        nid('"State_VGR"."i_code"'),
    "VGR.s_station":     nid('"State_VGR"."s_station"'),
    "VGR.s_target":      nid('"State_VGR"."s_target"'),
    "VGR.s_description": nid('"State_VGR"."s_description"'),
    "VGR.ldt_ts":        nid('"State_VGR"."ldt_ts"'),
    "Order.s_state":     nid('"State_Order"."s_state"'),
    "Order.s_type":      nid('"State_Order"."s_type"'),
    "Order.ldt_ts":      nid('"State_Order"."ldt_ts"'),
    **{f"Stock.[{r},{c}].s_id":    nid(f'"Stock_HBW"."StockItem"[{r},{c}]."s_id"')
       for r in range(3) for c in range(3)},
    **{f"Stock.[{r},{c}].s_type":  nid(f'"Stock_HBW"."StockItem"[{r},{c}]."s_type"')
       for r in range(3) for c in range(3)},
    **{f"Stock.[{r},{c}].s_state": nid(f'"Stock_HBW"."StockItem"[{r},{c}]."s_state"')
       for r in range(3) for c in range(3)},
    "Stock.s_location":  nid('"Stock_HBW"."s_location"'),
    "Stock.ldt_ts":      nid('"Stock_HBW"."ldt_ts"'),
}
HEARTBEAT_KEYS = {k for k in ALL_NODES if k.endswith(".ldt_ts")}


# ─────────────────────────────────────────────────────────────────────────────
# Step + PieceRecord
# ─────────────────────────────────────────────────────────────────────────────
def _gen_id() -> str:
    return "#" + "".join(random.choices(string.ascii_uppercase + string.digits, k=4))


@dataclass
class Step:
    station: str
    arrived: datetime
    left:    Optional[datetime] = None

    @property
    def duration_s(self) -> Optional[float]:
        return (self.left - self.arrived).total_seconds() if self.left else None

    @property
    def duration_str(self) -> str:
        s = self.duration_s
        if s is None: return "in corso"
        m, sec = divmod(int(s), 60)
        return (str(m) + "m " + f"{sec:02d}s") if m else (str(sec) + "s")


@dataclass
class PieceRecord:
    id:         str
    created_at: datetime
    journey:    list  = dc_field(default_factory=list)
    piece_type: str   = ""   # tipo dal PLC (Order.s_type)
    origin:     str   = "unknown"  # 'dsi' | 'order'
    location:   str   = "?"

    def arrive_at(self, station: str, ts: datetime):
        if self.journey and self.journey[-1].left is None:
            if self.journey[-1].station == station:
                return
            self.journey[-1].left = ts
        self.journey.append(Step(station=station, arrived=ts))
        self.location = station

    def complete(self, ts: datetime):
        if self.journey and self.journey[-1].left is None:
            self.journey[-1].left = ts

    def total_duration(self) -> str:
        if not self.journey: return "n/d"
        end = self.journey[-1].left or datetime.now()
        s   = (end - self.created_at).total_seconds()
        m, sec = divmod(int(s), 60)
        return (str(m) + "m " + f"{sec:02d}s") if m else (str(sec) + "s")

    def print_summary(self):
        W = [18, 10, 10, 10]
        top = "┬".join("─" * w for w in W)
        div = "┼".join("─" * w for w in W)
        bot = "┴".join("─" * w for w in W)
        hdr = "│".join(h.center(w) for h, w in zip(
              ["Stazione", "Arrivo", "Partenza", "Durata"], W))
        ts_s = self.created_at.strftime("%H:%M:%S")
        ts_e = (self.journey[-1].left or datetime.now()).strftime("%H:%M:%S") \
               if self.journey else "?"
        print("\n" + "=" * 56)
        print("  PEZZO " + self.id +
              "  |  Tipo: " + (self.piece_type or "N/D"))
        print("  Durata totale: " + self.total_duration() +
              "  (" + ts_s + " -> " + ts_e + ")")
        print("=" * 56)
        print("  ┌" + top + "┐")
        print("  │" + hdr + "│")
        print("  ├" + div + "┤")
        for step in self.journey:
            arr = step.arrived.strftime("%H:%M:%S")
            lft = step.left.strftime("%H:%M:%S") if step.left else "—"
            row = "│".join(v.center(w) for v, w in zip(
                  [station_name(step.station)[:W[0]-1], arr, lft,
                   step.duration_str], W))
            print("  │" + row + "│")
        print("  └" + bot + "┘")
        print("=" * 56 + "\n")


# ─────────────────────────────────────────────────────────────────────────────
# PieceRegistry
# ─────────────────────────────────────────────────────────────────────────────
class PieceRegistry:
    def __init__(self):
        self.active:       dict  = {}   # pid → PieceRecord
        self.location_map: dict  = {}   # station → pid
        self.pending:      deque = deque()  # pid ordini in coda
        self._queue: Optional[asyncio.Queue] = None

    def set_queue(self, q: asyncio.Queue): self._queue = q

    # ── helpers ──────────────────────────────────────────────────────────────
    def _pid_at(self, station: str) -> Optional[str]:
        return self.location_map.get(station)

    def _piece_at(self, station: str) -> Optional[PieceRecord]:
        pid = self._pid_at(station)
        return self.active.get(pid) if pid else None

    def _move(self, from_st: str, to_st: str, ts: datetime) -> Optional[PieceRecord]:
        pid = self.location_map.pop(from_st, None)
        if not pid: return None
        piece = self.active.get(pid)
        if piece:
            piece.arrive_at(to_st, ts)
            self.location_map[to_st] = pid
        return piece

    def display_pid(self, station: str = "") -> str:
        """
        FIX [3]: per stazioni fisiche restituisce solo il pezzo fisicamente lì.
        Per eventi non-stazione (Order) cade su pending o primo attivo.
        """
        if station in PHYSICAL_STATIONS:
            return self.location_map.get(station, "")
        # Evento generico (Order, etc.)
        if self.pending:  return self.pending[0]
        if self.active:   return next(iter(self.active))
        return ""

    # ── NASCITA ───────────────────────────────────────────────────────────────
    def new_piece_ordered(self, ts: datetime, piece_type: str = "") -> str:
        pid    = _gen_id()
        record = PieceRecord(id=pid, created_at=ts, piece_type=piece_type, origin="order")
        self.active[pid] = record
        self.pending.append(pid)
        return pid

    def new_piece_at_dsi(self, ts: datetime) -> str:
        pid    = _gen_id()
        record = PieceRecord(id=pid, created_at=ts, origin="dsi")
        record.arrive_at("dsi", ts)
        self.active[pid] = record
        self.location_map["dsi"] = pid
        return pid

    # ── MOVIMENTI ─────────────────────────────────────────────────────────────
    def vgr_pickup(self, ts: datetime) -> Optional[PieceRecord]:
        """VGR preleva pezzo: cerca in SOURCE_STATIONS."""
        for st in SOURCE_STATIONS:
            if st in self.location_map:
                return self._move(st, "vgr", ts)
        return None

    def station_receives(self, station: str, ts: datetime) -> Optional[PieceRecord]:
        """MPO / DSO ricevono dal VGR."""
        if "vgr" in self.location_map:
            return self._move("vgr", station, ts)
        return None

    def sld_activates(self, ts: datetime) -> Optional[PieceRecord]:
        """
        FIX [2]: SLD e' locale alla MPO — il pezzo e' ancora a MPO quando SLD scatta,
        VGR arriva DOPO. Cerca quindi prima "mpo", poi "vgr" come fallback.
        """
        if "mpo" in self.location_map:
            return self._move("mpo", "sld", ts)
        if "vgr" in self.location_map:
            return self._move("vgr", "sld", ts)
        return None

    def hbw_activates(self, ts: datetime, vgr_target: str) -> tuple:
        """
        HBW si attiva: due scenari.
          STOCCAGGIO : VGR porta pezzo verso HBW
          ORDINE     : HBW recupera pezzo dallo scaffale (pending non vuoto)
        """
        if "vgr" in self.location_map and vgr_target.lower() == "hbw":
            piece = self._move("vgr", "hbw", ts)
            return piece, "storage"
        if self.pending:
            pid   = self.pending.popleft()
            piece = self.active.get(pid)
            if piece:
                piece.arrive_at("hbw", ts)
                self.location_map["hbw"] = pid
            return piece, "order"
        return None, "unknown"

    # ── MORTE ─────────────────────────────────────────────────────────────────
    def complete_at(self, station: str, ts: datetime) -> Optional[PieceRecord]:
        pid = self.location_map.pop(station, None)
        if not pid: return None
        piece = self.active.pop(pid, None)
        if not piece: return None
        piece.complete(ts)
        for k in [k for k, v in self.location_map.items() if v == pid]:
            del self.location_map[k]
        return piece

    def save_and_forget(self, piece: PieceRecord, outcome: str = "INTERRUPTED"):
        if self._queue:
            completed = piece.journey[-1].left if piece.journey else None
            total_s   = (completed - piece.created_at).total_seconds() if completed else None
            self._queue.put_nowait({"type": "piece",
                "id": piece.id, "piece_type": piece.piece_type or None,
                "origin": piece.origin, "created_at": piece.created_at,
                "completed_at": completed, "total_duration_s": total_s,
                "outcome": outcome})
            for step in piece.journey:
                self._queue.put_nowait({"type": "step",
                    "piece_id": piece.id, "station": step.station,
                    "arrived_at": step.arrived, "left_at": step.left,
                    "duration_s": step.duration_s})
        piece.print_summary()

    def flush_all(self, ts: datetime):
        for pid in list(self.active.keys()):
            piece = self.active.pop(pid)
            piece.complete(ts)
            print("\n  ⚠️  Pezzo " + piece.id + " interrotto prima del completamento")
            self.save_and_forget(piece)
        self.location_map.clear()
        self.pending.clear()


# ─────────────────────────────────────────────────────────────────────────────
# Stato globale
# ─────────────────────────────────────────────────────────────────────────────
class StockMap:
    def __init__(self):
        self.slots = {(r, c): {"s_id": "", "s_type": "", "s_state": ""}
                      for r in range(3) for c in range(3)}

    def update(self, r, c, field, val):
        self.slots[(r, c)][field] = str(val) if val else ""

    def print_map(self):
        print("")
        print("  ┌──────────────── MAGAZZINO HBW ──────────────────────┐")
        print("  │          C0              C1              C2          │")
        for r in range(3):
            parts = []
            for c in range(3):
                slot  = self.slots[(r, c)]
                stype = slot.get("s_type", "").upper() or "VUOTO"
                sst   = slot.get("s_state", "")[:5]
                icon  = "📦" if stype not in ("VUOTO", "") else "⬜"
                parts.append(icon + stype[:5] + "(" + sst + ")")
            print("  │  Riga " + str(r) + ":  " +
                  parts[0].ljust(14) + "  " + parts[1].ljust(14) +
                  "  " + parts[2].ljust(14) + "│")
        print("  └─────────────────────────────────────────────────────┘")
        print("")


class FactoryState:
    def __init__(self):
        self.values   = {}
        self.stock    = StockMap()
        self.registry = PieceRegistry()

    def update(self, key: str, val):
        old = self.values.get(key)
        self.values[key] = val
        return old


# ─────────────────────────────────────────────────────────────────────────────
# Interprete eventi
# ─────────────────────────────────────────────────────────────────────────────
def interpret_event(key: str, old, val, state: FactoryState) -> Optional[str]:
    module, *rest = key.split(".")
    field = ".".join(rest)
    now   = datetime.now()
    reg   = state.registry

    # ── VGR ──────────────────────────────────────────────────────────────────
    if module == "VGR":
        if field == "x_active":
            if val is True:
                s_to  = state.values.get("VGR.s_target", "?")
                piece = reg.vgr_pickup(now)
                tag   = (" [" + piece.id + "]") if piece else " [no pezzo]"
                return "🤖 VGR PRELEVA → " + station_name(str(s_to)) + tag
            elif val is False and old is True:
                s_to  = state.values.get("VGR.s_target", "?")
                piece = reg._piece_at("vgr")
                tag   = (" [" + piece.id + "]") if piece else ""
                return "🤖 VGR DEPOSITA → " + station_name(str(s_to)) + tag
        if field == "i_code":
            return "🤖 VGR stato → " + icode_str(val)
        if field == "s_target" and val:
            return "🤖 VGR destinazione: " + station_name(str(val))

    # ── DSI ──────────────────────────────────────────────────────────────────
    if module == "DSI":
        if field == "x_active":
            if val is True:
                # Guard #1: stesso pezzo ancora registrato a DSI (doppio scatto rapido)
                # Guard #2 RIMOSSO: se "dsi" è vuoto qualunque True è un nuovo pezzo fisico
                if "dsi" in reg.location_map:
                    return "📥 DSI: doppio scatto ignorato [" + reg.location_map["dsi"] + "]"
                new_id = reg.new_piece_at_dsi(now)
                return "📥 DSI: PEZZO RILEVATO – ID " + new_id + " assegnato"
            elif val is False and old is True:
                return "📤 DSI: stazione LIBERA"
        if field == "i_code":
            return "📥 DSI stato → " + icode_str(val)

    # ── DSO ──────────────────────────────────────────────────────────────────
    if module == "DSO":
        if field == "x_active":
            if val is True:
                piece = reg.station_receives("dso", now)
                tag   = (" [" + piece.id + "]") if piece else ""
                return "📦 DSO: PEZZO CONSEGNATO in uscita" + tag
        if field == "i_code":
            if val == 1 and old == 0:
                # MORTE ordine
                piece = reg.complete_at("dso", now)
                if piece:
                    reg.save_and_forget(piece, "SHIPPED")
                    return ("✅ DSO SVUOTATA – " + piece.id +
                            " [" + (piece.piece_type or "?") + "] " +
                            piece.total_duration() + " – ID dimenticato")
            return "📦 DSO stato → " + icode_str(val)

    # ── HBW ──────────────────────────────────────────────────────────────────
    if module == "HBW":
        if field == "x_active":
            if val is True:
                vgr_target = state.values.get("VGR.s_target", "")
                piece, scenario = reg.hbw_activates(now, vgr_target)
                tag = (" [" + piece.id + "]") if piece else ""
                label = {
                    "order":   "🏭 HBW RECUPERA da scaffale",
                    "storage": "🏭 HBW RICEVE da VGR (stoccaggio)",
                    "unknown": "🏭 HBW ATTIVO",
                }[scenario]
                return label + tag
            elif val is False and old is True:
                return "🏭 HBW: operazione COMPLETATA"
        if field == "i_code":
            return "🏭 HBW stato → " + icode_str(val)
        if field == "s_description" and val:
            return "🏭 HBW: " + str(val)

    # ── MPO ──────────────────────────────────────────────────────────────────
    if module == "MPO":
        if field == "x_active":
            if val is True:
                piece = reg.station_receives("mpo", now)
                tag   = (" [" + piece.id + "]") if piece else ""
                return "⚙️  MPO: LAVORAZIONE AVVIATA" + tag
            elif val is False and old is True:
                return "⚙️  MPO: LAVORAZIONE COMPLETATA"
        if field == "i_code":
            return "⚙️  MPO stato → " + icode_str(val)
        if field == "s_description" and val:
            return "⚙️  MPO: " + str(val)

    # ── SLD ──────────────────────────────────────────────────────────────────
    if module == "SLD":
        if field == "x_active":
            if val is True:
                # FIX [2]: SLD cerca pezzo a MPO prima (e' locale alla MPO)
                piece = reg.sld_activates(now)
                tag   = (" [" + piece.id + "]") if piece else ""
                return "🎨 SLD: SMISTAMENTO colore" + tag
            elif val is False and old is True:
                return "🎨 SLD: smistamento COMPLETATO"
        if field == "i_code":
            return "🎨 SLD stato → " + icode_str(val)
        if field == "s_target" and val:
            return "🎨 SLD → " + station_name(str(val))

    # ── Order ─────────────────────────────────────────────────────────────────
    if module == "Order":
        if field == "s_state":
            if str(val) == "ORDERED":
                ord_type = state.values.get("Order.s_type", "")
                new_id   = reg.new_piece_ordered(now, ord_type)
                return ("📋 ORDINE RICEVUTO – " + new_id +
                        " in coda  [tipo: " + str(ord_type) + "]")
            labels = {
                "IN_PROCESS":        "🔄 Ordine IN LAVORAZIONE",
                "SHIPPED":           "🚚 Ordine SPEDITO – pezzo sul DSO",
                "WAITING_FOR_ORDER": "⏳ Fabbrica in ATTESA di nuovo ordine",
                "COMPLETED":         "✅ Ordine COMPLETATO",
                "ERROR":             "🚨 ERRORE ordine",
            }
            return labels.get(str(val), "📋 Ordine: → '" + str(val) + "'")
        if field == "s_type" and val:
            # Aggiorna tipo sul pezzo pending (se esiste)
            if reg.pending:
                pid = reg.pending[0]
                if pid in reg.active:
                    reg.active[pid].piece_type = str(val)
            return "📋 Tipo ordinato → '" + str(val) + "'"

    # ── Stock ─────────────────────────────────────────────────────────────────
    if module == "Stock":
        if field == "s_location":
            return "📍 HBW posizione: " + str(val)
        m = re.match(r'\[(\d),(\d)\]\.(s_\w+)', field)
        if m:
            r_, c_, sf = int(m.group(1)), int(m.group(2)), m.group(3)
            state.stock.update(r_, c_, sf, val)
            if sf == "s_state":
                state.stock.print_map()
                # FIX [1]: usa parametro 'old' (NON state.values che e' gia' aggiornato)
                old_state    = str(old) if old is not None else ""
                slot_was_empty = not old_state or old_state in ("", "EMPTY")
                slot_now_full  = bool(val) and str(val) not in ("", "EMPTY")
                if slot_was_empty and slot_now_full:
                    piece = reg.complete_at("hbw", now)
                    if piece:
                        reg.save_and_forget(piece, "STORED")
                        return ("🏭 Slot [" + str(r_) + "," + str(c_) +
                                "] → " + str(val) + "  ✅ " + piece.id +
                                " [" + (piece.piece_type or "?") + "]" +
                                " stoccato in " + piece.total_duration() +
                                " – ID dimenticato")
                    return "🏭 Slot [" + str(r_) + "," + str(c_) + "] → " + str(val)
                elif not val or str(val) in ("", "EMPTY"):
                    return "🏭 Slot [" + str(r_) + "," + str(c_) + "] → VUOTO (prelievo)"
    return None


# ─────────────────────────────────────────────────────────────────────────────
# Handler OPC UA
# ─────────────────────────────────────────────────────────────────────────────
class FactoryHandler:
    def __init__(self, state: FactoryState, id_to_key: dict, queue: asyncio.Queue):
        self.state     = state
        self.id_to_key = id_to_key
        self._queue    = queue

    def datachange_notification(self, node, val, data):
        try:   nid_str = node.nodeid.to_string()
        except Exception: nid_str = str(node)
        key = self.id_to_key.get(nid_str)
        if not key: return
        old = self.state.update(key, val)
        if old == val: return
        ts_full = datetime.now()
        ts_str  = ts_full.strftime("%H:%M:%S.%f")[:-3]
        if key in HEARTBEAT_KEYS: return
        msg    = interpret_event(key, old, val, self.state)
        module = key.split(".")[0]
        old_s  = str(old)[:14] if old is not None else "—"
        val_s  = str(val)[:20]
        # FIX [3]: display_pid usa la stazione del modulo
        pid    = self.state.registry.display_pid(module.lower())
        tag    = ("[" + pid + "]") if pid else ""
        print("[" + ts_str + "] " + module.ljust(6) + " " + tag.ljust(8) +
              " │ " + key.ljust(35) + " " + old_s.ljust(14) + " → " + val_s)
        if msg:
            print("           " + " " * 6 + " │  ↳ " + msg)
        # Solo eventi significativi → DB
        if msg and self._queue:
            self._queue.put_nowait({"type": "event",
                "ts": ts_full, "module": module,
                "piece_id": pid or None, "key": key,
                "old_value": str(old) if old is not None else None,
                "new_value": str(val), "event_msg": msg})
        # Stock history: ogni cambio s_state → DB
        if module == "Stock" and self._queue:
            m_sh = re.match(r'Stock\.\[(\d),(\d)\]\.s_state', key)
            if m_sh:
                r_, c_ = m_sh.group(1), m_sh.group(2)
                stype = str(self.state.values.get(f"Stock.[{r_},{c_}].s_type", "") or "") or None
                self._queue.put_nowait({"type": "stock",
                    "ts": ts_full, "slot": f"[{r_},{c_}]",
                    "s_type": stype, "s_state": str(val) if val else None,
                    "piece_id": pid or None})


# ─────────────────────────────────────────────────────────────────────────────
# Snapshot iniziale
# ─────────────────────────────────────────────────────────────────────────────
async def print_snapshot(client, state: FactoryState):
    print("\n" + "=" * 70)
    print("  SNAPSHOT  –  " + datetime.now().strftime("%d/%m/%Y %H:%M:%S"))
    print("=" * 70)
    sections = [
        ("📥 DSI", "DSI"), ("📦 DSO", "DSO"), ("🏭 HBW", "HBW"),
        ("⚙️  MPO", "MPO"), ("🎨 SLD", "SLD"), ("🤖 VGR", "VGR"),
        ("📋 Order", "Order"),
    ]
    for title, mod in sections:
        keys = {k: v for k, v in ALL_NODES.items()
                if k.startswith(mod) and not k.endswith("ldt_ts")}
        print("\n  " + title)
        for k, nid_str in keys.items():
            try:
                v = await client.get_node(nid_str).read_value()
                state.values[k] = v
                flag = ""
                if "x_active" in k and v: flag = "  ◀◀ ATTIVO"
                if "i_code"   in k:       flag = "  (" + icode_str(v) + ")"
                print("    " + k.ljust(38) + " = " + str(v) + flag)
            except Exception:
                print("    " + k.ljust(38) + " = [n/d]")
    for r in range(3):
        for c in range(3):
            for sf in ("s_id", "s_type", "s_state"):
                sk = f"Stock.[{r},{c}].{sf}"
                try:
                    v = await client.get_node(ALL_NODES[sk]).read_value()
                    state.values[sk] = v
                    state.stock.update(r, c, sf, v)
                except Exception:
                    pass
    print("")
    state.stock.print_map()


# ─────────────────────────────────────────────────────────────────────────────
# Main
# ─────────────────────────────────────────────────────────────────────────────

# ─────────────────────────────────────────────────────────────────────────────
# DB Writer  –  consuma la queue e scrive su PostgreSQL
# ─────────────────────────────────────────────────────────────────────────────
async def db_writer(pool: asyncpg.Pool, queue: asyncio.Queue):
    while True:
        item = await queue.get()
        if item is None:           # segnale di stop
            queue.task_done()
            break
        try:
            async with pool.acquire() as conn:
                t = item["type"]
                if t == "piece":
                    await conn.execute("""
                        INSERT INTO pieces
                            (id, piece_type, origin, created_at, completed_at, total_duration_s, outcome)
                        VALUES ($1,$2,$3,$4,$5,$6,$7)
                        ON CONFLICT (id) DO UPDATE SET
                            piece_type=EXCLUDED.piece_type,
                            completed_at=EXCLUDED.completed_at,
                            total_duration_s=EXCLUDED.total_duration_s,
                            outcome=EXCLUDED.outcome
                    """, item["id"], item["piece_type"], item["origin"],
                        item["created_at"], item["completed_at"],
                        item["total_duration_s"], item["outcome"])
                elif t == "step":
                    await conn.execute("""
                        INSERT INTO steps (piece_id, station, arrived_at, left_at, duration_s)
                        VALUES ($1,$2,$3,$4,$5)
                    """, item["piece_id"], item["station"],
                        item["arrived_at"], item["left_at"], item["duration_s"])
                elif t == "event":
                    await conn.execute("""
                        INSERT INTO events (ts, module, piece_id, key, old_value, new_value, event_msg)
                        VALUES ($1,$2,$3,$4,$5,$6,$7)
                    """, item["ts"], item["module"], item["piece_id"],
                        item["key"], item["old_value"], item["new_value"], item["event_msg"])
                elif t == "stock":
                    await conn.execute("""
                        INSERT INTO stock_history (ts, slot, s_type, s_state, piece_id)
                        VALUES ($1,$2,$3,$4,$5)
                    """, item["ts"], item["slot"], item["s_type"],
                        item["s_state"], item["piece_id"])
        except Exception as e:
            logging.error(f"DB error ({item.get('type','?')}): {e}  →  {item}")
        finally:
            queue.task_done()

async def main():
    print("Connessione DB → " + DB_URL.split("@")[-1])
    pool  = await asyncpg.create_pool(DB_URL, min_size=1, max_size=5)
    queue = asyncio.Queue(maxsize=2000)

    state     = FactoryState()
    state.registry.set_queue(queue)
    id_to_key = {v: k for k, v in ALL_NODES.items()}

    writer_task = asyncio.create_task(db_writer(pool, queue))

    print("Connessione OPC-UA → " + OPC_UA_URL + " ...")
    async with __import__("asyncua").Client(url=OPC_UA_URL) as client:
        print("Connesso!")
        await print_snapshot(client, state)
        handler = FactoryHandler(state, id_to_key, queue)
        sub     = await client.create_subscription(200, handler)
        ok, err = [], []
        for key, nid_str in ALL_NODES.items():
            try:
                await sub.subscribe_data_change(client.get_node(nid_str))
                ok.append(key)
            except Exception as e:
                err.append((key, str(e)))
        print("Sottoscritti: " + str(len(ok)) + "/" + str(len(ALL_NODES)) + " nodi")
        if err:
            for n, _ in err[:10]: print("  ⚠️  " + n)
        print("\n" + "─" * 70)
        print("  MONITOR v7  │  PostgreSQL: " + DB_URL.split("@")[-1] + "  │  Ctrl+C")
        print("─" * 70 + "\n")
        try:
            while True:
                await asyncio.sleep(1)
        except asyncio.CancelledError:
            pass
        finally:
            await sub.delete()
            state.registry.flush_all(datetime.now())
            # Attendi che la queue venga svuotata, poi ferma il writer
            await queue.join()
            await queue.put(None)
            await writer_task
            await pool.close()
            print("DB chiuso – tutti i dati salvati.")


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nUscita.")
