"""
genera_grafici_cap4.py  —  Grafici Capitolo 4 per tesi LaTeX
============================================================
Produce 4 file PDF vettoriali nella cartella grafici_tesi/:
  1. throughput_giornaliero.pdf
  2. tempo_medio_stazione.pdf
  3. confronto_scenari.pdf
  4. gantt_percorso.pdf

Requisiti: pip install pandas matplotlib
Uso:       python genera_grafici_cap4.py
I CSV devono trovarsi nella stessa cartella dello script.
"""

import os
import pandas as pd
import numpy as np
import matplotlib
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches

# ── Output in PDF vettoriale (ideale per LaTeX \includegraphics) ──────
matplotlib.use("Agg")


BASE = r"C:\Users\Youss\Downloads"
OUTDIR = os.path.join(BASE, "grafici_tesi")
os.makedirs(OUTDIR, exist_ok=True)

# ── Stile tesi: bianco/grigio, font serif, dimensioni A4-friendly ─────
plt.rcParams.update({
    "figure.dpi":        150,
    "font.family":       "serif",
    "font.size":         11,
    "axes.titlesize":    12,
    "axes.titleweight":  "bold",
    "axes.labelsize":    11,
    "xtick.labelsize":   10,
    "ytick.labelsize":   10,
    "legend.fontsize":   10,
    "axes.spines.top":   False,
    "axes.spines.right": False,
    "axes.grid":         True,
    "grid.alpha":        0.35,
    "grid.linestyle":    "--",
})

# Palette neutra adatta alla stampa in bianco/nero e a colori
COL = {
    "STORED":      "#2166ac",   # blu
    "SHIPPED":     "#4dac26",   # verde
    "INTERRUPTED": "#d7191c",   # rosso
    "ordine":      "#2166ac",
    "stoccaggio":  "#e08214",
    "bar":         "#2166ac",
}

# ── Carica i dati ─────────────────────────────────────────────────────
daily = pd.read_csv(
    os.path.join(BASE, "daily_throughput.csv"),
    header=None, names=["day", "outcome", "pieces", "avg_s"]
)
avgd = pd.read_csv(
    os.path.join(BASE, "avg_duration_per_station.csv"),
    header=None, names=["station", "n", "avg_s", "min_s", "max_s"]
)
steps = pd.read_csv(
    os.path.join(BASE, "steps.csv"),
    header=None,
    names=["id", "piece_id", "station", "arrival_ts", "departure_ts", "duration_s"]
)
pieces = pd.read_csv(
    os.path.join(BASE, "pieces.csv"),
    header=None,
    names=["piece_id", "piece_type", "origin", "start_ts", "end_ts",
           "duration_s", "outcome"]
)

daily["day"] = pd.to_datetime(daily["day"])

STATION_LABEL = {
    "dsi": "DSI\n(Ingresso)",
    "vgr": "VGR\n(Robot)",
    "hbw": "HBW\n(Magazzino)",
    "mpo": "MPO\n(Lavorazione)",
    "sld": "SLD\n(Smistamento)",
    "dso": "DSO\n(Uscita)",
}

# ═══════════════════════════════════════════════════════════════════════
# GRAFICO 1 — Throughput giornaliero per esito (barre raggruppate)
# Correzione: ordine cronologico delle date (06/03 prima di 01/04)
# ═══════════════════════════════════════════════════════════════════════
daily_plot = daily.copy()
daily_plot["day_label"] = daily_plot["day"].dt.strftime("%d/%m/%Y")

pivot = (
    daily_plot
    .pivot(index="day_label", columns="outcome", values="pieces")
    .fillna(0)
    .astype(int)
)
# Ordine cronologico: 06/03 in cima al pivot → prima sull'asse X
pivot = pivot.reindex(["06/03/2026", "01/04/2026"])
# Ordine colonne
col_order = [c for c in ["STORED", "SHIPPED", "INTERRUPTED"] if c in pivot.columns]
pivot = pivot[col_order]

fig, ax = plt.subplots(figsize=(7, 4.2))
x     = np.arange(len(pivot))
width = 0.25
for i, col in enumerate(col_order):
    offset = (i - len(col_order) / 2 + 0.5) * width
    bars = ax.bar(x + offset, pivot[col], width,
                  label=col, color=COL[col], edgecolor="white", linewidth=0.6)
    for bar in bars:
        h = bar.get_height()
        if h > 0:
            ax.text(bar.get_x() + bar.get_width() / 2, h + 0.08,
                    str(int(h)), ha="center", va="bottom", fontsize=9)

ax.set_xticks(x)
ax.set_xticklabels(pivot.index)
ax.set_xlabel("Data sessione")
ax.set_ylabel("Numero di pezzi")
ax.set_title("Throughput giornaliero per esito finale")
ax.set_yticks(range(0, int(pivot.values.max()) + 2))
ax.legend(title="Esito", framealpha=0.8)
fig.tight_layout()
fig.savefig(os.path.join(OUTDIR, "throughput_giornaliero.pdf"), bbox_inches="tight")
plt.close(fig)
print("✓  throughput_giornaliero.pdf")

# ═══════════════════════════════════════════════════════════════════════
# GRAFICO 2 — Tempo medio per stazione (solo cicli COMPLETATI)
# Correzione: esclude INTERRUPTED per non distorcere l'HBW
# ═══════════════════════════════════════════════════════════════════════
# Ricalcola la media escludendo pezzi INTERRUPTED
completed_pids = pieces.loc[
    pieces["outcome"].isin(["STORED", "SHIPPED"]), "piece_id"
]
steps_ok = steps[steps["piece_id"].isin(completed_pids)]

avg_ok = (
    steps_ok.groupby("station")["duration_s"]
    .agg(n="count", avg_s="mean", min_s="min", max_s="max")
    .reset_index()
    .sort_values("avg_s", ascending=False)
)
avg_ok["label"] = avg_ok["station"].map(STATION_LABEL)

fig, ax = plt.subplots(figsize=(7, 4.2))
yerr = np.vstack([
    avg_ok["avg_s"] - avg_ok["min_s"],
    avg_ok["max_s"] - avg_ok["avg_s"]
])
bars = ax.bar(
    avg_ok["label"], avg_ok["avg_s"],
    yerr=yerr, capsize=5,
    color=COL["bar"], edgecolor="white", linewidth=0.6,
    error_kw={"elinewidth": 1.2, "ecolor": "#555555"}
)
for bar, n in zip(bars, avg_ok["n"]):
    ax.text(bar.get_x() + bar.get_width() / 2,
            bar.get_height() + (avg_ok["max_s"].max() * 0.03),
            f"n={int(n)}", ha="center", va="bottom", fontsize=8.5)

ax.set_xlabel("Stazione")
ax.set_ylabel("Tempo medio di permanenza (s)")
ax.set_title("Tempo medio per stazione\n(cicli completati: STORED + SHIPPED)")
ax.set_ylim(bottom=0)
fig.tight_layout()
fig.savefig(os.path.join(OUTDIR, "tempo_medio_stazione.pdf"), bbox_inches="tight")
plt.close(fig)
print("✓  tempo_medio_stazione.pdf")

# ═══════════════════════════════════════════════════════════════════════
# GRAFICO 3 — Confronto stoccaggio manuale vs produzione su ordine
# (solo stazioni in comune o presenti in almeno uno scenario)
# ═══════════════════════════════════════════════════════════════════════
m = steps_ok.merge(
    pieces[["piece_id", "origin"]], on="piece_id", how="left"
)
m["scenario"] = np.where(
    m["origin"] == "dsi",
    "Stoccaggio manuale",
    "Produzione su ordine"
)

pivot_scen = (
    m.groupby(["station", "scenario"])["duration_s"]
    .mean()
    .unstack()
    .reindex(["dsi", "vgr", "hbw", "mpo", "sld", "dso"])
)
pivot_scen.index = [STATION_LABEL[s] for s in pivot_scen.index]

fig, ax = plt.subplots(figsize=(8, 4.5))
x      = np.arange(len(pivot_scen))
width  = 0.35
scens  = [c for c in ["Produzione su ordine", "Stoccaggio manuale"]
          if c in pivot_scen.columns]
colors = [COL["ordine"], COL["stoccaggio"]]

for i, (scen, col) in enumerate(zip(scens, colors)):
    vals   = pivot_scen[scen].fillna(0).values
    offset = (i - len(scens) / 2 + 0.5) * width
    bars   = ax.bar(x + offset, vals, width,
                    label=scen, color=col,
                    edgecolor="white", linewidth=0.6)
    for bar, v in zip(bars, vals):
        if v > 1:
            ax.text(bar.get_x() + bar.get_width() / 2, v + 0.8,
                    f"{v:.0f}s", ha="center", va="bottom", fontsize=8)

ax.set_xticks(x)
ax.set_xticklabels(pivot_scen.index, fontsize=9)
ax.set_xlabel("Stazione")
ax.set_ylabel("Tempo medio di permanenza (s)")
ax.set_title("Confronto scenari: stoccaggio manuale vs produzione su ordine\n"
             "(cicli completati)")
ax.legend(title="Scenario", framealpha=0.8)
ax.set_ylim(bottom=0)

# Nota esplicativa per stazioni assenti in uno scenario
ax.annotate(
    "DSI, MPO, SLD, DSO non compaiono\nnel ciclo di stoccaggio manuale",
    xy=(0, 0), xycoords="axes fraction",
    xytext=(0.01, 0.97), textcoords="axes fraction",
    va="top", fontsize=8, color="#555555",
    bbox=dict(boxstyle="round,pad=0.3", fc="white", ec="#cccccc", alpha=0.8)
)

fig.tight_layout()
fig.savefig(os.path.join(OUTDIR, "confronto_scenari.pdf"), bbox_inches="tight")
plt.close(fig)
print("✓  confronto_scenari.pdf")

# ═══════════════════════════════════════════════════════════════════════
# GRAFICO 4 — Gantt del percorso dei pezzi (dati reali da steps.csv)
# Mostra per ogni stazione la durata effettiva di permanenza,
# separando ciclo di produzione su ordine e ciclo di stoccaggio manuale.
# ═══════════════════════════════════════════════════════════════════════

# Prendi un ciclo SHIPPED e un ciclo STORED come esempi rappresentativi
shipped_pid = pieces.loc[pieces["outcome"] == "SHIPPED", "piece_id"].iloc[0]
stored_pid  = pieces.loc[pieces["outcome"] == "STORED",  "piece_id"].iloc[0]

steps_ship  = steps[steps["piece_id"] == shipped_pid].copy()
steps_store = steps[steps["piece_id"] == stored_pid].copy()

# Calcola l'offset temporale dall'avvio del ciclo (t=0 = prima tappa)
def normalise(df):
    df = df.copy()
    t0 = pd.to_datetime(df["arrival_ts"], utc=True).min()
    df["t_start"] = (pd.to_datetime(df["arrival_ts"],   utc=True) - t0).dt.total_seconds()
    df["t_end"]   = (pd.to_datetime(df["departure_ts"], utc=True) - t0).dt.total_seconds()
    df["dur"]     = df["t_end"] - df["t_start"]
    return df

steps_ship  = normalise(steps_ship)
steps_store = normalise(steps_store)

# Ordine canonico stazioni sull'asse Y (dal basso verso l'alto)
STAZ_ORDER = ["dso", "sld", "mpo", "vgr", "hbw", "dsi"]
STAZ_LABEL = {
    "dsi": "DSI (Ingresso)",
    "hbw": "HBW (Magazzino)",
    "vgr": "VGR (Robot)",
    "mpo": "MPO (Lavorazione)",
    "sld": "SLD (Smistamento)",
    "dso": "DSO (Uscita)",
}
y_pos = {s: i for i, s in enumerate(STAZ_ORDER)}

COL_SHIP  = "#2166ac"
COL_STORE = "#e08214"
BAR_H     = 0.28

fig, ax = plt.subplots(figsize=(8, 4.6))

for _, row in steps_ship.iterrows():
    y = y_pos.get(row["station"])
    if y is None:
        continue
    ax.barh(y + BAR_H / 2, row["dur"], left=row["t_start"],
            height=BAR_H, color=COL_SHIP, edgecolor="white",
            linewidth=0.5, label="_nolegend_")
    if row["dur"] > 5:
        ax.text(row["t_start"] + row["dur"] / 2,
                y + BAR_H / 2,
                f"{int(round(row['dur']))}s",
                ha="center", va="center",
                fontsize=7.5, color="white", fontweight="bold")

for _, row in steps_store.iterrows():
    y = y_pos.get(row["station"])
    if y is None:
        continue
    ax.barh(y - BAR_H / 2, row["dur"], left=row["t_start"],
            height=BAR_H, color=COL_STORE, edgecolor="white",
            linewidth=0.5, label="_nolegend_")
    if row["dur"] > 5:
        ax.text(row["t_start"] + row["dur"] / 2,
                y - BAR_H / 2,
                f"{int(round(row['dur']))}s",
                ha="center", va="center",
                fontsize=7.5, color="white", fontweight="bold")

# Griglia orizzontale leggera tra le stazioni
for i in range(len(STAZ_ORDER) - 1):
    ax.axhline(i + 0.5, color="#cccccc", linewidth=0.5, zorder=0)

ax.set_yticks(range(len(STAZ_ORDER)))
ax.set_yticklabels([STAZ_LABEL[s] for s in STAZ_ORDER], fontsize=9)
ax.set_xlabel("Tempo dall'avvio del ciclo (s)", fontsize=10)
ax.set_title("Ricostruzione del percorso dei pezzi\n"
             "(dati reali — un ciclo per scenario)", fontsize=11, fontweight="bold")
ax.set_xlim(left=0)
ax.set_ylim(-0.6, len(STAZ_ORDER) - 0.4)
ax.spines["top"].set_visible(False)
ax.spines["right"].set_visible(False)
ax.grid(axis="x", linestyle="--", alpha=0.35)

legend_patches = [
    mpatches.Patch(color=COL_SHIP,  label="Produzione su ordine"),
    mpatches.Patch(color=COL_STORE, label="Stoccaggio manuale"),
]
ax.legend(handles=legend_patches, fontsize=9, framealpha=0.8,
          loc="upper right")

fig.tight_layout()
fig.savefig(os.path.join(OUTDIR, "gantt_percorso.pdf"), bbox_inches="tight")
plt.close(fig)
print("✓  gantt_percorso.pdf")

print(f"\nGrafici salvati in: {OUTDIR}")
print("Includili in LaTeX con:")
print("  \\includegraphics[width=\\textwidth]{grafici_tesi/throughput_giornaliero.pdf}")
print("  \\includegraphics[width=\\textwidth]{grafici_tesi/tempo_medio_stazione.pdf}")
print("  \\includegraphics[width=\\textwidth]{grafici_tesi/confronto_scenari.pdf}")
print("  \\includegraphics[width=\\textwidth]{grafici_tesi/gantt_percorso.pdf}")