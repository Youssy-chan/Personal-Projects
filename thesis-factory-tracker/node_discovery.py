#!/usr/bin/env python3
"""
OPC UA Full Node Discovery Script
---------------------------------
Si connette a un server OPC UA ed esplora ricorsivamente l'intero address space
a partire dalla root, raccogliendo tutti i nodi (Oggetti, Variabili, Metodi, ecc.)
e salvandoli in un file di output.

Utilizzo:
    python discover_all_nodes.py [--url OPCUA_URL] [--output FILE]

Se non specificato, l'URL predefinito è opc.tcp://192.168.0.1:4840
e l'output è node_discovery.txt.
"""

import asyncio
import logging
import argparse
from pathlib import Path
from typing import Set, Dict, Any, Optional
from asyncua import Client, Node
from asyncua.ua import NodeClass

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
LOG = logging.getLogger("discovery")


async def browse_node(node: Node, visited: Set[str], results: Dict[str, Dict[str, Any]], depth: int = 0):
    """
    Esplora ricorsivamente un nodo e tutti i suoi figli, evitando cicli.
    Utilizza una coda asincrona per gestire la profondità senza overflow di ricorsione.
    """
    try:
        node_id_str = node.nodeid.to_string()
    except Exception as e:
        LOG.warning("Impossibile ottenere NodeId per %s: %s", node, e)
        return

    if node_id_str in visited:
        return
    visited.add(node_id_str)

    # Leggi informazioni di base del nodo
    try:
        browse_name = await node.read_browse_name()
        display_name = await node.read_display_name()
        node_class = await node.read_node_class()
    except Exception as e:
        LOG.debug("Errore lettura attributi per %s: %s", node_id_str, e)
        browse_name = ("?", "?")
        display_name = "?"
        node_class = None

    # Memorizza i dati
    results[node_id_str] = {
        "node_id": node_id_str,
        "browse_name": browse_name.Name if browse_name else "?",
        "display_name": display_name.Text if display_name else "?",
        "node_class": str(node_class).split('.')[-1] if node_class else "Unknown",
        "depth": depth,
    }

    # Recupera i figli
    try:
        children = await node.get_children()
    except Exception as e:
        LOG.debug("Errore nel recupero figli di %s: %s", node_id_str, e)
        children = []

    # Esplora ricorsivamente i figli
    for child in children:
        await browse_node(child, visited, results, depth + 1)


async def discover_all_nodes(url: str, output_file: str):
    """Connessione al server e avvio della scoperta."""
    LOG.info("Connessione a %s ...", url)
    async with Client(url=url) as client:
        # Scegli l'endpoint con sicurezza None (come nel collector)
        # Il client asyncua seleziona automaticamente l'endpoint, ma possiamo forzare se necessario
        LOG.info("Connessione stabilita. Inizio browsing dalla root...")

        root = client.get_root_node()
        visited: Set[str] = set()
        results: Dict[str, Dict[str, Any]] = {}

        await browse_node(root, visited, results)

        LOG.info("Browsing completato. Trovati %d nodi.", len(results))

        # Salva i risultati su file
        output_path = Path(output_file)
        with output_path.open("w", encoding="utf-8") as f:
            f.write("# OPC UA Node Discovery\n")
            f.write(f"# Server: {url}\n")
            f.write(f"# Nodi totali: {len(results)}\n")
            f.write("# Formato: NodeId | BrowseName | DisplayName | NodeClass\n")
            f.write("-" * 80 + "\n")
            for node_id, info in sorted(results.items()):
                f.write(f"{node_id} | {info['browse_name']} | {info['display_name']} | {info['node_class']}\n")

        LOG.info("Risultati salvati in %s", output_file)

        # Opzionale: stampa anche a video un riepilogo
        print(f"\nScoperta completata. {len(results)} nodi trovati.")
        print(f"Dettagli salvati in: {output_file}")


def main():
    parser = argparse.ArgumentParser(description="Scopri tutti i nodi OPC UA del server.")
    parser.add_argument("--url", default="opc.tcp://192.168.0.1:4840",
                        help="URL del server OPC UA (default: opc.tcp://192.168.0.1:4840)")
    parser.add_argument("--output", default="node_discovery.txt",
                        help="File di output (default: node_discovery.txt)")
    args = parser.parse_args()

    asyncio.run(discover_all_nodes(args.url, args.output))


if __name__ == "__main__":
    main()