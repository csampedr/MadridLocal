from flask import Flask, render_template, request
import pandas as pd
from negocios import negocios_scored

app = Flask(__name__)

df = pd.read_csv("data/negocios_scored.csv")

@app.route("/", methods=["GET", "POST"])
def index():
    locales = None
    barrios = None

    if request.method == "POST":
        tipo_negocio = request.form["tipo_negocio"]
        publico_objetivo = request.form["publico_objetivo"]
        terraza = int(request.form["terraza"])
        horario_nocturno = int(request.form["horario_nocturno"])
        presupuesto = int(request.form["presupuesto"])
        metros = int(request.form["metros"])

        resultado = negocios_scored(
            df,
            tipo_negocio,
            publico_objetivo,
            terraza,
            horario_nocturno,
            presupuesto,
            metros
        )

        # ←← FIX IMPORTANTE
        locales_raw = resultado["locales"]
        if hasattr(locales_raw, "to_dict"):
            locales = locales_raw.to_dict(orient="records")
        else:
            locales = []

        barrios = resultado["barrios"]

    return render_template("index.html", locales=locales, barrios=barrios)
