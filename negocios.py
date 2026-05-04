import pandas as pd
import numpy as np

def negocios_scored(
    df,
    tipo_negocio,
    publico_objetivo,
    terraza,
    horario_nocturno,
    presupuesto,
    metros_requeridos
):

    df_filtrado = df[df["desc_epigrafe"] == tipo_negocio].copy()
    if df_filtrado.empty:
        return {"locales": [], "barrios": []}

    mapa_publico = {
        "joven":      "score_joven_real",
        "millennial": "score_millennial_real",
        "familiar":   "score_familiar_real",
        "senior":     "score_senior_real"
    }

    col_score = mapa_publico.get(publico_objetivo)
    media = df_filtrado[col_score].mean()
    std = df_filtrado[col_score].std()
    umbral = media - std
    df_filtrado = df_filtrado[df_filtrado[col_score] >= umbral]

    df_filtrado = df_filtrado[df_filtrado["terraza_acondicionada"] == terraza]
    df_filtrado = df_filtrado[df_filtrado["es_nocturno"] == horario_nocturno]

    df_filtrado["coste_estimado"] = metros_requeridos * df_filtrado["precio_m2_real"]
    df_filtrado = df_filtrado[
        (df_filtrado["coste_estimado"] >= presupuesto - 1000) &
        (df_filtrado["coste_estimado"] <= presupuesto + 1000)
    ]

    if df_filtrado.empty:
        return {"locales": [], "barrios": []}

    df_ranked = df_filtrado.sort_values("score_total", ascending=False)
    top_locales = df_ranked.head(20)

    top_barrios = (
        top_locales["desc_barrio_local"]
        .value_counts()
        .head(5)
        .index
        .tolist()
    )

    return {"locales": top_locales, "barrios": top_barrios}
