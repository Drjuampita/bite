#!/usr/bin/env python3
"""Deja el .docx listo para Word: numera los marcadores sin repetir y quita las entradas de carpeta del ZIP."""
import re
import sys
import zipfile
from pathlib import Path


def corregir(ruta):
    ruta = Path(ruta)
    with zipfile.ZipFile(ruta) as z:
        partes = [(i, z.read(i.filename)) for i in z.infolist() if not i.filename.endswith("/")]
    salida = []
    for info, datos in partes:
        if info.filename == "word/document.xml":
            xml = datos.decode("utf-8")
            actual = [0]

            def paso(m):
                if m.group(0).startswith("<w:bookmarkStart"):
                    actual[0] += 1
                    return re.sub(r'w:id="\d+"', f'w:id="{actual[0]}"', m.group(0))
                return re.sub(r'w:id="\d+"', f'w:id="{actual[0]}"', m.group(0))

            xml = re.sub(r"<w:bookmark(?:Start|End)[^>]*/>", paso, xml)
            datos = xml.encode("utf-8")
        salida.append((info, datos))
    tmp = ruta.with_suffix(".tmp")
    with zipfile.ZipFile(tmp, "w", zipfile.ZIP_DEFLATED) as z:
        for info, datos in salida:
            z.writestr(info.filename, datos)
    tmp.replace(ruta)


if __name__ == "__main__":
    corregir(sys.argv[1])
