#!/usr/bin/env python3
"""Convierte la hoja Comparativa de vehiculos2026.xlsx a vehiculos2026.csv.
No requiere paquetes externos: funciona con Python 3.
"""

from __future__ import annotations

import csv
import posixpath
import re
import sys
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET

INPUT = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("vehiculos2026.xlsx")
OUTPUT = Path(sys.argv[2]) if len(sys.argv) > 2 else Path("vehiculos2026.csv")
SHEET_NAME = "Comparativa"


def local_name(tag: str) -> str:
    return tag.rsplit("}", 1)[-1]


def column_index(cell_ref: str) -> int:
    letters = re.match(r"[A-Za-z]+", cell_ref or "A")
    value = 0
    for char in (letters.group(0).upper() if letters else "A"):
        value = value * 26 + ord(char) - 64
    return value - 1


def read_xml(book: zipfile.ZipFile, name: str) -> ET.Element:
    try:
        return ET.fromstring(book.read(name))
    except KeyError as exc:
        raise RuntimeError(f"No se encontró {name} dentro del XLSX") from exc


def main() -> None:
    if not INPUT.exists():
        raise SystemExit(f"No se encontró {INPUT}")

    with zipfile.ZipFile(INPUT) as book:
        workbook = read_xml(book, "xl/workbook.xml")
        relationships = read_xml(book, "xl/_rels/workbook.xml.rels")

        sheet_node = next(
            (node for node in workbook.iter() if local_name(node.tag) == "sheet" and node.attrib.get("name") == SHEET_NAME),
            None,
        )
        if sheet_node is None:
            sheet_node = next((node for node in workbook.iter() if local_name(node.tag) == "sheet"), None)
        if sheet_node is None:
            raise RuntimeError("El libro no contiene hojas")

        relationship_id = next((value for key, value in sheet_node.attrib.items() if local_name(key) == "id"), None)
        relationship = next(
            (node for node in relationships.iter() if local_name(node.tag) == "Relationship" and node.attrib.get("Id") == relationship_id),
            None,
        )
        if relationship is None:
            raise RuntimeError("No se pudo localizar la hoja Comparativa")

        target = relationship.attrib["Target"].lstrip("/")
        sheet_path = posixpath.normpath(posixpath.join("xl", target))

        shared_strings: list[str] = []
        if "xl/sharedStrings.xml" in book.namelist():
            shared_root = read_xml(book, "xl/sharedStrings.xml")
            for item in (node for node in shared_root.iter() if local_name(node.tag) == "si"):
                shared_strings.append("".join((node.text or "") for node in item.iter() if local_name(node.tag) == "t"))

        sheet = read_xml(book, sheet_path)
        rows: list[list[object]] = []

        for cell in (node for node in sheet.iter() if local_name(node.tag) == "c"):
            ref = cell.attrib.get("r", "A1")
            row_match = re.search(r"\d+", ref)
            row_index = max(0, int(row_match.group(0)) - 1 if row_match else 0)
            col_index = column_index(ref)
            cell_type = cell.attrib.get("t")
            value: object = ""

            if cell_type == "inlineStr":
                value = "".join((node.text or "") for node in cell.iter() if local_name(node.tag) == "t")
            else:
                value_node = next((node for node in cell if local_name(node.tag) == "v"), None)
                raw = value_node.text if value_node is not None and value_node.text is not None else ""
                if cell_type == "s" and raw:
                    value = shared_strings[int(raw)]
                elif cell_type == "b":
                    value = "Sí" if raw == "1" else "No"
                else:
                    value = raw

            while len(rows) <= row_index:
                rows.append([])
            while len(rows[row_index]) <= col_index:
                rows[row_index].append("")
            rows[row_index][col_index] = value

    width = max((len(row) for row in rows), default=0)
    with OUTPUT.open("w", encoding="utf-8-sig", newline="") as file:
        writer = csv.writer(file)
        for row in rows:
            writer.writerow(row + [""] * (width - len(row)))

    print(f"CSV actualizado: {OUTPUT} ({len(rows)} filas, {width} columnas)")


if __name__ == "__main__":
    main()
