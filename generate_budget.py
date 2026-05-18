#!/usr/bin/env python3
"""
Budget Personnel Complet — Générateur Excel/Numbers
9 feuilles · formules dynamiques · graphiques circulaires automatiques
"""

from openpyxl import Workbook
from openpyxl.styles import PatternFill, Font, Alignment, Border, Side
from openpyxl.chart import PieChart, BarChart, LineChart, Reference
from openpyxl.chart.series import DataPoint
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.datavalidation import DataValidation
import datetime

# ═══════════════════════════════════════════════════════════════════════════════
# CONSTANTES
# ═══════════════════════════════════════════════════════════════════════════════

YEAR = datetime.date.today().year

MONTHS = ["Janvier","Février","Mars","Avril","Mai","Juin",
          "Juillet","Août","Septembre","Octobre","Novembre","Décembre"]

C = {
    "navy":    "1A2E4A", "dark":    "2C3E50",
    "teal":    "16A085", "teal_l":  "A9DFBF",
    "green":   "27AE60", "green_l": "D5F5E3",
    "blue":    "2980B9", "blue_l":  "D6EAF8",
    "orange":  "E67E22", "orange_l":"FDEBD0",
    "red":     "C0392B", "red_l":   "FADBD8",
    "purple":  "7D3C98", "purple_l":"E8DAEF",
    "gray_d":  "717D7E", "gray":    "BDC3C7",
    "gray_l":  "F2F3F4", "gray_xl": "FAFAFA",
    "white":   "FFFFFF", "yellow_l":"FEF9E7",
    "gold":    "F39C12",
}

CATS_REV = ["Salaire","Entreprise","Freelance","Remboursement",
            "Aides sociales","Investissements","Location","Autres revenus"]

CATS_FIX = ["Loyer","Électricité","Eau","Gaz","Internet","Téléphone",
            "Assurance habitation","Assurance voiture","Assurance santé",
            "Crédit immobilier","Crédit voiture","Crédit conso",
            "Netflix","Spotify","Amazon Prime","Autres abonnements",
            "Impôts","Transport (abonnement)","Banque","Autres fixes"]

CATS_VAR = ["Alimentation","Restaurants","Cafés / Snacks","Sorties",
            "Vêtements","Chaussures","Essence","Transport",
            "Santé / Médecin","Pharmacie","Loisirs","Sport",
            "Culture","Animaux","Cadeaux","Voyages",
            "Beauté / Soins","Électronique","Maison / Déco",
            "Achats divers","Imprévus"]

CATS_EP   = ["Épargne sécurité","Livret A","Assurance vie épargne",
             "PEA / Bourse","Immobilier","Projet","Autres épargne"]

PAYMENT   = ["Virement","Prélèvement auto","CB","Espèces",
             "Chèque","PayPal","Apple Pay","Autres"]

STATUS_L  = ["Payé","À payer","Reçu","En attente","Annulé"]
TYPES_L   = ["Revenu","Dépense fixe","Dépense variable","Épargne"]
NP_L      = ["Nécessaire","Plaisir","Mixte"]
PRIO_L    = ["Haute","Moyenne","Basse"]

# ═══════════════════════════════════════════════════════════════════════════════
# HELPERS STYLE
# ═══════════════════════════════════════════════════════════════════════════════

def fill(h):  return PatternFill("solid", fgColor=h)
def fnt(bold=False, sz=11, col="000000", ita=False):
    return Font(name="Calibri", bold=bold, size=sz, color=col, italic=ita)
def aln(h="left", v="center", wrap=False):
    return Alignment(horizontal=h, vertical=v, wrap_text=wrap)
def bdr(thick=False):
    s = Side(style="medium" if thick else "thin",
             color="999999" if thick else "CCCCCC")
    return Border(left=s, right=s, top=s, bottom=s)

EUR  = '#,##0.00 "€"'
PCT  = '0.0%'
DATE = 'DD/MM/YYYY'

def sc(cell, bg=None, col="000000", bold=False, sz=11,
       h="left", v="center", wrap=False, b=True, ita=False,
       nf=None, thick=False):
    if bg:   cell.fill = fill(bg)
    cell.font      = fnt(bold, sz, col, ita)
    cell.alignment = aln(h, v, wrap)
    if b:    cell.border = bdr(thick)
    if nf:   cell.number_format = nf

def title_row(ws, row, text, span, bg=C["navy"], col=C["white"],
              sz=16, h=35):
    ws.merge_cells(f"A{row}:{get_column_letter(span)}{row}")
    c = ws.cell(row=row, column=1, value=text)
    sc(c, bg=bg, col=col, bold=True, sz=sz, h="center", v="center", thick=True)
    ws.row_dimensions[row].height = h

def section_header(ws, row, cols, texts, bg, col=C["white"], sz=10, h=22):
    ws.row_dimensions[row].height = h
    for i, txt in enumerate(texts):
        c = ws.cell(row=row, column=cols[i] if isinstance(cols, list) else cols+i,
                    value=txt)
        sc(c, bg=bg, col=col, bold=True, sz=sz, h="center", v="center")

def dv_list(items):
    joined = ",".join(items)
    return f'"{joined}"'

def add_dv(ws, formula, sqref):
    dv = DataValidation(type="list", formula1=formula, allow_blank=True,
                        showErrorMessage=False)
    ws.add_data_validation(dv)
    dv.sqref = sqref

def col_w(ws, widths):
    for col, w in widths.items():
        ws.column_dimensions[col].width = w

def no_grid(ws):
    ws.sheet_view.showGridLines = False

# ═══════════════════════════════════════════════════════════════════════════════
# WORKBOOK
# ═══════════════════════════════════════════════════════════════════════════════

wb = Workbook()
wb.remove(wb.active)

ws_dash = wb.create_sheet("Dashboard Annuel")
ws_bud  = wb.create_sheet("Budget Mensuel")
ws_rev  = wb.create_sheet("Revenus")
ws_fix  = wb.create_sheet("Depenses Fixes")
ws_var  = wb.create_sheet("Depenses Variables")
ws_cat  = wb.create_sheet("Categories")
ws_ep   = wb.create_sheet("Epargne Objectifs")
ws_hist = wb.create_sheet("Historique Annuel")
ws_syn  = wb.create_sheet("Synthese Categories")

TAB_COLORS = {
    ws_dash:"1A2E4A", ws_bud:"2980B9", ws_rev:"27AE60",
    ws_fix:"E67E22",  ws_var:"C0392B", ws_cat:"7D3C98",
    ws_ep:"16A085",   ws_hist:"717D7E", ws_syn:"2C3E50",
}
for ws, tc in TAB_COLORS.items():
    ws.sheet_properties.tabColor = tc

# ═══════════════════════════════════════════════════════════════════════════════
# FEUILLE 6 — CATEGORIES (créée en premier car référencée)
# ═══════════════════════════════════════════════════════════════════════════════

def build_categories():
    ws = ws_cat
    no_grid(ws)
    col_w(ws, {"A":28,"B":28,"C":28,"D":28,"E":22})

    title_row(ws, 1, "RÉFÉRENTIEL DES CATÉGORIES", 5, sz=14)
    ws.row_dimensions[2].height = 8

    sections = [
        (1, "REVENUS",             C["green"],  CATS_REV),
        (2, "DÉPENSES FIXES",      C["orange"], CATS_FIX),
        (3, "DÉPENSES VARIABLES",  C["red"],    CATS_VAR),
        (4, "ÉPARGNE",             C["teal"],   CATS_EP),
    ]

    DATA_START = 3
    for ci, title, bg, cats in sections:
        r = DATA_START
        hc = ws.cell(row=r, column=ci, value=title)
        sc(hc, bg=bg, col=C["white"], bold=True, sz=10, h="center")
        ws.row_dimensions[r].height = 22
        for i, cat in enumerate(cats):
            cell = ws.cell(row=r+1+i, column=ci, value=cat)
            sc(cell, bg=C["gray_xl"] if i%2==0 else C["white"], sz=10)

    # Colonne E : moyens de paiement
    r = DATA_START
    hc = ws.cell(row=r, column=5, value="MOYENS DE PAIEMENT")
    sc(hc, bg=C["purple"], col=C["white"], bold=True, sz=10, h="center")
    for i, pm in enumerate(PAYMENT):
        cell = ws.cell(row=r+1+i, column=5, value=pm)
        sc(cell, bg=C["gray_xl"] if i%2==0 else C["white"], sz=10)

    max_len = max(len(CATS_REV),len(CATS_FIX),len(CATS_VAR),len(CATS_EP))
    bot = DATA_START + max_len + 3

    # Statuts et types
    for ci2, title2, items in [(1,"STATUTS",STATUS_L),(2,"TYPES",TYPES_L),
                                (3,"NÉCESSAIRE/PLAISIR",NP_L),(4,"PRIORITÉ",PRIO_L)]:
        hc2 = ws.cell(row=bot, column=ci2, value=title2)
        sc(hc2, bg=C["dark"], col=C["white"], bold=True, sz=10, h="center")
        for i, s in enumerate(items):
            cell = ws.cell(row=bot+1+i, column=ci2, value=s)
            sc(cell, bg=C["gray_xl"] if i%2==0 else C["white"], sz=10)

build_categories()

# ═══════════════════════════════════════════════════════════════════════════════
# FEUILLE 3 — REVENUS
# ═══════════════════════════════════════════════════════════════════════════════

def build_revenus():
    ws = ws_rev
    no_grid(ws)
    col_w(ws, {"A":13,"B":22,"C":20,"D":16,"E":16,"F":13,"G":15,"H":35})

    title_row(ws, 1, f"REVENUS {YEAR}", 8, bg=C["green"], sz=14)

    # Info box
    ws.merge_cells("A2:H2")
    ic = ws["A2"]
    ic.value = ("Saisissez ici toutes vos rentrées d'argent. "
                "Les totaux s'actualisent automatiquement.")
    sc(ic, bg=C["green_l"], col=C["dark"], sz=10, h="center", ita=True, b=False)
    ws.row_dimensions[2].height = 20

    # En-têtes colonnes
    HEADS = ["Date","Source du revenu","Catégorie",
             "Montant prévu","Montant reçu","Écart","Statut","Notes"]
    section_header(ws, 3, 1, HEADS, C["green"], sz=10)

    # Formules + formatage lignes données
    for row in range(4, 205):
        bg = C["gray_xl"] if row%2==0 else C["white"]
        for col in range(1, 9):
            cell = ws.cell(row=row, column=col)
            sc(cell, bg=bg, sz=10, b=True, nf=DATE if col==1 else
               EUR if col in [4,5,6] else None)
        # Formule Écart = Prévu - Reçu
        ws.cell(row=row, column=6).value = f"=IF(D{row}<>\"\",D{row}-E{row},\"\")"
        ws.cell(row=row, column=6).number_format = EUR

    # Lignes d'exemple
    ex_rows = [
        (4, datetime.date(YEAR,1,1), "Entreprise X", "Salaire", 2500, 2500, "Reçu", ""),
        (5, datetime.date(YEAR,1,15),"Plateforme",   "Freelance",500, 500,  "Reçu", "Mission web"),
    ]
    for r, dt, src, cat, prev, recu, stat, note in ex_rows:
        ws.cell(row=r, column=1).value = dt
        ws.cell(row=r, column=1).number_format = DATE
        ws.cell(row=r, column=2).value = src
        ws.cell(row=r, column=3).value = cat
        ws.cell(row=r, column=4).value = prev
        ws.cell(row=r, column=4).number_format = EUR
        ws.cell(row=r, column=5).value = recu
        ws.cell(row=r, column=5).number_format = EUR
        ws.cell(row=r, column=7).value = stat
        ws.cell(row=r, column=8).value = note
        for col in range(1, 9):
            ws.cell(row=r, column=col).font = fnt(ita=True, sz=10, col=C["gray_d"])

    # Zone totaux
    TR = 206
    ws.merge_cells(f"A{TR}:C{TR}")
    tc = ws.cell(row=TR, column=1, value="TOTAUX")
    sc(tc, bg=C["green"], col=C["white"], bold=True, h="center")

    labels = [("Montant prévu total", 4),("Montant reçu total",5),("Écart total",6)]
    for i,(lbl,ci) in enumerate(labels):
        lc = ws.cell(row=TR+1+i, column=3, value=lbl)
        sc(lc, bg=C["green_l"], bold=True, sz=10)
        vc = ws.cell(row=TR+1+i, column=4)
        vc.value = f"=SUM({get_column_letter(ci)}4:{get_column_letter(ci)}{TR-1})"
        sc(vc, bg=C["yellow_l"], bold=True, nf=EUR)

    # Validations
    cat_dv = dv_list(CATS_REV)
    add_dv(ws, cat_dv, f"C4:C{TR-1}")
    add_dv(ws, dv_list(STATUS_L), f"G4:G{TR-1}")

build_revenus()

# ═══════════════════════════════════════════════════════════════════════════════
# FEUILLE 4 — DÉPENSES FIXES
# ═══════════════════════════════════════════════════════════════════════════════

def build_depenses_fixes():
    ws = ws_fix
    no_grid(ws)
    col_w(ws, {"A":28,"B":22,"C":15,"D":16,"E":18,"F":13,"G":15,"H":35})

    title_row(ws, 1, f"DÉPENSES FIXES {YEAR}", 8, bg=C["orange"], sz=14)

    ws.merge_cells("A2:H2")
    ic = ws["A2"]
    ic.value = ("Charges mensuelles récurrentes. "
                "Prélèvements automatiques, loyer, abonnements, crédits…")
    sc(ic, bg=C["orange_l"], col=C["dark"], sz=10, h="center", ita=True, b=False)
    ws.row_dimensions[2].height = 20

    HEADS = ["Nom de la dépense","Catégorie","Montant",
             "Date prélèvement","Moyen de paiement","Récurrent","Statut","Notes"]
    section_header(ws, 3, 1, HEADS, C["orange"], sz=10)

    for row in range(4, 105):
        bg = C["gray_xl"] if row%2==0 else C["white"]
        for col in range(1, 9):
            cell = ws.cell(row=row, column=col)
            sc(cell, bg=bg, sz=10, b=True,
               nf=EUR if col==3 else DATE if col==4 else None)

    # Exemples
    ex = [
        (4,"Loyer","Loyer",850,1,"Prélèvement auto","Oui","Payé",""),
        (5,"EDF","Électricité",75,5,"Prélèvement auto","Oui","Payé",""),
        (6,"Orange","Téléphone",25,10,"Prélèvement auto","Oui","Payé",""),
        (7,"Netflix","Netflix",18,15,"CB","Oui","Payé",""),
        (8,"Crédit auto","Crédit voiture",320,1,"Prélèvement auto","Oui","Payé",""),
    ]
    for r,nom,cat,mnt,day,pay,rec,stat,note in ex:
        ws.cell(row=r,column=1).value = nom
        ws.cell(row=r,column=2).value = cat
        ws.cell(row=r,column=3).value = mnt
        ws.cell(row=r,column=3).number_format = EUR
        ws.cell(row=r,column=4).value = day
        ws.cell(row=r,column=5).value = pay
        ws.cell(row=r,column=6).value = rec
        ws.cell(row=r,column=7).value = stat
        ws.cell(row=r,column=8).value = note
        for col in range(1,9):
            ws.cell(row=r,column=col).font = fnt(ita=True, sz=10, col=C["gray_d"])

    # Totaux
    TR = 106
    ws.merge_cells(f"A{TR}:B{TR}")
    tc = ws.cell(row=TR, column=1, value="TOTAL DÉPENSES FIXES")
    sc(tc, bg=C["orange"], col=C["white"], bold=True, h="center")
    vc = ws.cell(row=TR, column=3)
    vc.value = f"=SUM(C4:C{TR-1})"
    sc(vc, bg=C["yellow_l"], bold=True, nf=EUR)

    add_dv(ws, dv_list(CATS_FIX), f"B4:B{TR-1}")
    add_dv(ws, dv_list(PAYMENT), f"E4:E{TR-1}")
    add_dv(ws, dv_list(["Oui","Non"]), f"F4:F{TR-1}")
    add_dv(ws, dv_list(STATUS_L), f"G4:G{TR-1}")

build_depenses_fixes()

# ═══════════════════════════════════════════════════════════════════════════════
# FEUILLE 5 — DÉPENSES VARIABLES
# ═══════════════════════════════════════════════════════════════════════════════

def build_depenses_variables():
    ws = ws_var
    no_grid(ws)
    col_w(ws, {"A":13,"B":22,"C":20,"D":30,"E":15,"F":18,"G":16,"H":35})

    title_row(ws, 1, f"DÉPENSES VARIABLES {YEAR}", 8, bg=C["red"], sz=14)

    ws.merge_cells("A2:H2")
    ic = ws["A2"]
    ic.value = ("⬇ Saisissez chaque dépense ici → les graphiques et totaux se mettent "
                "à jour automatiquement.")
    sc(ic, bg=C["red_l"], col=C["dark"], sz=10, h="center", ita=True, b=False)
    ws.row_dimensions[2].height = 20

    HEADS = ["Date","Catégorie","Sous-catégorie","Description",
             "Montant","Moyen de paiement","Nécessaire / Plaisir","Notes"]
    section_header(ws, 3, 1, HEADS, C["red"], sz=10, col=C["white"])

    for row in range(4, 505):
        bg = C["gray_xl"] if row%2==0 else C["white"]
        for col in range(1, 9):
            cell = ws.cell(row=row, column=col)
            sc(cell, bg=bg, sz=10, b=True,
               nf=DATE if col==1 else EUR if col==5 else None)

    # Exemples
    ex = [
        (4, datetime.date(YEAR,1,3),"Alimentation","Supermarché","Courses semaine 1",
         112.50,"CB","Nécessaire","Lidl + Leclerc"),
        (5, datetime.date(YEAR,1,7),"Restaurants","Resto","Dîner en famille",
         67.00,"CB","Plaisir","Anniversaire"),
        (6, datetime.date(YEAR,1,10),"Essence","Carburant","Plein voiture",
         75.00,"CB","Nécessaire",""),
        (7, datetime.date(YEAR,1,12),"Santé / Médecin","Généraliste","Consultation",
         27.00,"Espèces","Nécessaire","Remboursé sécu"),
        (8, datetime.date(YEAR,1,18),"Loisirs","Cinéma","Sortie cinéma",
         22.00,"CB","Plaisir",""),
    ]
    for r,dt,cat,scat,desc,mnt,pay,np,note in ex:
        ws.cell(row=r,column=1).value = dt
        ws.cell(row=r,column=1).number_format = DATE
        ws.cell(row=r,column=2).value = cat
        ws.cell(row=r,column=3).value = scat
        ws.cell(row=r,column=4).value = desc
        ws.cell(row=r,column=5).value = mnt
        ws.cell(row=r,column=5).number_format = EUR
        ws.cell(row=r,column=6).value = pay
        ws.cell(row=r,column=7).value = np
        ws.cell(row=r,column=8).value = note
        for col in range(1,9):
            ws.cell(row=r,column=col).font = fnt(ita=True, sz=10, col=C["gray_d"])

    # Totaux rapides par catégorie (bloc résumé)
    TR = 506
    ws.merge_cells(f"A{TR}:D{TR}")
    tc = ws.cell(row=TR, column=1, value="TOTAL PAR CATÉGORIE (résumé rapide)")
    sc(tc, bg=C["red"], col=C["white"], bold=True, h="center")
    ws.row_dimensions[TR].height = 22

    ws.cell(row=TR, column=5, value="Total dépenses variables")
    sc(ws.cell(row=TR, column=5), bg=C["orange_l"], bold=True, sz=10, h="center")
    ws.cell(row=TR, column=6).value = f"=SUM(E4:E{TR-1})"
    sc(ws.cell(row=TR, column=6), bg=C["yellow_l"], bold=True, nf=EUR)

    for i, cat in enumerate(CATS_VAR):
        r = TR+1+i
        nc = ws.cell(row=r, column=5, value=cat)
        sc(nc, bg=C["gray_xl"] if i%2==0 else C["white"], sz=10)
        vc = ws.cell(row=r, column=6)
        vc.value = f'=SUMIF(B4:B{TR-1},"{cat}",E4:E{TR-1})'
        sc(vc, bg=C["yellow_l"] if i%2==0 else C["orange_l"], sz=10, nf=EUR)

    add_dv(ws, dv_list(CATS_VAR), f"B4:B{TR-1}")
    add_dv(ws, dv_list(PAYMENT), f"F4:F{TR-1}")
    add_dv(ws, dv_list(NP_L), f"G4:G{TR-1}")

build_depenses_variables()

# ═══════════════════════════════════════════════════════════════════════════════
# FEUILLE 2 — BUDGET MENSUEL
# ═══════════════════════════════════════════════════════════════════════════════

def build_budget_mensuel():
    ws = ws_bud
    no_grid(ws)
    col_w(ws, {"A":13,"B":18,"C":22,"D":22,"E":28,"F":15,
               "G":18,"H":13,"I":15,"J":30})

    title_row(ws, 1, f"BUDGET MENSUEL {YEAR}", 10, bg=C["blue"], sz=14)

    # Sélecteur de mois
    ws.merge_cells("A2:C2")
    mc = ws["A2"]
    mc.value = "Mois sélectionné :"
    sc(mc, bg=C["blue_l"], col=C["dark"], bold=True, sz=11, h="right", b=False)
    ms = ws["D2"]
    ms.value = "Janvier"
    sc(ms, bg=C["yellow_l"], col=C["dark"], bold=True, sz=12, h="center")
    add_dv(ws, dv_list(MONTHS), "D2")
    ws.row_dimensions[2].height = 25

    # Note
    ws.merge_cells("A3:J3")
    nc = ws["A3"]
    nc.value = ("Journal unique de toutes vos transactions. "
                "Chaque nouvelle ligne met à jour les totaux ci-dessous automatiquement.")
    sc(nc, bg=C["blue_l"], col=C["gray_d"], sz=9, h="center", ita=True, b=False)
    ws.row_dimensions[3].height = 18

    HEADS = ["Date","Type","Catégorie","Sous-catégorie","Description",
             "Montant","Moyen paiement","Récurrent","Statut","Notes"]
    section_header(ws, 4, 1, HEADS, C["blue"], sz=10)
    ws.row_dimensions[4].height = 25

    for row in range(5, 305):
        bg = C["gray_xl"] if row%2==0 else C["white"]
        for col in range(1,11):
            cell = ws.cell(row=row, column=col)
            sc(cell, bg=bg, sz=10,
               nf=DATE if col==1 else EUR if col==6 else None)

    # Exemples
    ex = [
        (5, datetime.date(YEAR,1,1),"Revenu","Salaire","","Salaire mensuel net",
         2500,"Virement","Non","Reçu",""),
        (6, datetime.date(YEAR,1,1),"Dépense fixe","Loyer","","Loyer janvier",
         850,"Virement","Oui","Payé",""),
        (7, datetime.date(YEAR,1,3),"Dépense variable","Alimentation","Supermarché",
         "Courses hebdo",112.50,"CB","Non","Payé",""),
        (8, datetime.date(YEAR,1,5),"Épargne","Livret A","","Virement épargne",
         300,"Virement","Oui","Payé",""),
    ]
    for r,dt,tp,cat,scat,desc,mnt,pay,rec,stat,note in ex:
        ws.cell(row=r,column=1).value = dt
        ws.cell(row=r,column=1).number_format = DATE
        ws.cell(row=r,column=2).value = tp
        ws.cell(row=r,column=3).value = cat
        ws.cell(row=r,column=4).value = scat
        ws.cell(row=r,column=5).value = desc
        ws.cell(row=r,column=6).value = mnt
        ws.cell(row=r,column=6).number_format = EUR
        ws.cell(row=r,column=7).value = pay
        ws.cell(row=r,column=8).value = rec
        ws.cell(row=r,column=9).value = stat
        ws.cell(row=r,column=10).value = note
        for col in range(1,11):
            ws.cell(row=r,column=col).font = fnt(ita=True, sz=10, col=C["gray_d"])

    # Bloc résumé
    TR = 306
    ws.merge_cells(f"A{TR}:E{TR}")
    tc = ws.cell(row=TR, column=1, value="RÉSUMÉ DU MOIS")
    sc(tc, bg=C["navy"], col=C["white"], bold=True, sz=12, h="center", thick=True)
    ws.row_dimensions[TR].height = 28

    resume = [
        ("Total Revenus",
         f'=SUMIF(B5:B{TR-1},"Revenu",F5:F{TR-1})'),
        ("Total Dépenses Fixes",
         f'=SUMIF(B5:B{TR-1},"Dépense fixe",F5:F{TR-1})'),
        ("Total Dépenses Variables",
         f'=SUMIF(B5:B{TR-1},"Dépense variable",F5:F{TR-1})'),
        ("Total Épargne",
         f'=SUMIF(B5:B{TR-1},"Épargne",F5:F{TR-1})'),
        ("SOLDE FINAL",
         f'=SUMIF(B5:B{TR-1},"Revenu",F5:F{TR-1})'
         f'-SUMIF(B5:B{TR-1},"Dépense fixe",F5:F{TR-1})'
         f'-SUMIF(B5:B{TR-1},"Dépense variable",F5:F{TR-1})'
         f'-SUMIF(B5:B{TR-1},"Épargne",F5:F{TR-1})'),
        ("Taux d'épargne",
         f'=IF(SUMIF(B5:B{TR-1},"Revenu",F5:F{TR-1})>0,'
         f'SUMIF(B5:B{TR-1},"Épargne",F5:F{TR-1})'
         f'/SUMIF(B5:B{TR-1},"Revenu",F5:F{TR-1}),0)'),
    ]
    for i,(lbl,formula) in enumerate(resume):
        is_bold = i >= 4
        lc = ws.cell(row=TR+1+i, column=5, value=lbl)
        sc(lc, bg=C["blue_l"] if not is_bold else C["navy"],
           col=C["dark"] if not is_bold else C["white"],
           bold=is_bold, sz=10 if not is_bold else 11, h="right")
        vc = ws.cell(row=TR+1+i, column=6)
        vc.value = formula
        sc(vc, bg=C["yellow_l"] if not is_bold else C["gold"],
           col=C["dark"] if not is_bold else C["white"],
           bold=is_bold, sz=10 if not is_bold else 11,
           nf=PCT if i==5 else EUR)
        ws.row_dimensions[TR+1+i].height = 22

    add_dv(ws, dv_list(TYPES_L), f"B5:B{TR-1}")
    add_dv(ws, dv_list(PAYMENT), f"G5:G{TR-1}")
    add_dv(ws, dv_list(["Oui","Non"]), f"H5:H{TR-1}")
    add_dv(ws, dv_list(STATUS_L), f"I5:I{TR-1}")

build_budget_mensuel()

# ═══════════════════════════════════════════════════════════════════════════════
# FEUILLE 7 — ÉPARGNE & OBJECTIFS
# ═══════════════════════════════════════════════════════════════════════════════

def build_epargne():
    ws = ws_ep
    no_grid(ws)
    col_w(ws, {"A":28,"B":15,"C":15,"D":15,"E":14,"F":14,"G":12,"H":30})

    title_row(ws, 1, "ÉPARGNE & OBJECTIFS FINANCIERS", 8, bg=C["teal"], sz=14)

    ws.merge_cells("A2:H2")
    ic = ws["A2"]
    ic.value = ("Suivez vos objectifs financiers. "
                "Mettez à jour la colonne 'Épargné' chaque mois.")
    sc(ic, bg=C["teal_l"], col=C["dark"], sz=10, h="center", ita=True, b=False)
    ws.row_dimensions[2].height = 20

    HEADS = ["Objectif","Montant cible","Épargné","Montant restant",
             "Date cible","Progression %","Priorité","Notes"]
    section_header(ws, 3, 1, HEADS, C["teal"], sz=10)

    GOALS = [
        ("Épargne de sécurité (3 mois)",  10000, 3500, "2025-12-31","Haute",
         "Objectif : 3 mois de charges"),
        ("Voyage / Vacances",              3000,  800,  "2025-07-01","Moyenne",
         "Voyage été"),
        ("Achat voiture",                  15000, 2000, "2026-06-01","Moyenne",""),
        ("Formation / Compétences",        2000,  200,  "2025-09-01","Haute",""),
        ("Projet entreprise",              5000,  0,    "2026-01-01","Basse",""),
        ("Investissement (PEA/Bourse)",    20000, 1500, "2027-12-31","Moyenne",
         "DCA mensuel"),
        ("Appartement / Résidence",        50000, 5000, "2030-01-01","Basse",""),
        ("Épargne objectif libre",         1000,  0,    "",          "Basse",""),
    ]

    for i,(goal,target,saved,date_str,prio,note) in enumerate(GOALS):
        row = 4 + i
        bg = C["gray_xl"] if i%2==0 else C["white"]
        ws.row_dimensions[row].height = 24

        ws.cell(row=row,column=1).value = goal
        sc(ws.cell(row=row,column=1), bg=bg, bold=True, sz=10)

        ws.cell(row=row,column=2).value = target
        sc(ws.cell(row=row,column=2), bg=bg, sz=10, nf=EUR, h="right")

        ws.cell(row=row,column=3).value = saved
        sc(ws.cell(row=row,column=3), bg=bg, sz=10, nf=EUR, h="right")

        # Formule restant
        ws.cell(row=row,column=4).value = f"=B{row}-C{row}"
        sc(ws.cell(row=row,column=4), bg=bg, sz=10, nf=EUR, h="right")

        ws.cell(row=row,column=5).value = date_str
        sc(ws.cell(row=row,column=5), bg=bg, sz=10, h="center")

        # Formule progression %
        ws.cell(row=row,column=6).value = f"=IF(B{row}>0,C{row}/B{row},0)"
        sc(ws.cell(row=row,column=6), bg=bg, sz=10, nf=PCT, h="center")

        ws.cell(row=row,column=7).value = prio
        prio_bg = {"Haute":C["red_l"],"Moyenne":C["orange_l"],"Basse":C["green_l"]}.get(prio,bg)
        sc(ws.cell(row=row,column=7), bg=prio_bg, sz=10, h="center")

        ws.cell(row=row,column=8).value = note
        sc(ws.cell(row=row,column=8), bg=bg, sz=10, ita=True)

    # Lignes vides additionnelles
    for i in range(len(GOALS), len(GOALS)+15):
        row = 4+i
        bg = C["gray_xl"] if i%2==0 else C["white"]
        for col in range(1,9):
            sc(ws.cell(row=row,column=col), bg=bg, sz=10,
               nf=EUR if col in [2,3,4] else PCT if col==6 else None,
               h="right" if col in [2,3,4,6] else "center" if col in [5,6,7] else "left")
        ws.cell(row=row,column=4).value = f"=B{row}-C{row}"
        ws.cell(row=row,column=6).value = f"=IF(B{row}>0,C{row}/B{row},0)"

    # Total épargne
    TR = 4 + len(GOALS) + 15 + 1
    ws.merge_cells(f"A{TR}:B{TR}")
    tc = ws.cell(row=TR, column=1, value="TOTAL ÉPARGNÉ")
    sc(tc, bg=C["teal"], col=C["white"], bold=True, h="center", thick=True)
    vc = ws.cell(row=TR, column=3)
    vc.value = f"=SUM(C4:C{TR-1})"
    sc(vc, bg=C["yellow_l"], bold=True, nf=EUR, thick=True)

    # TOTAL CIBLE sur la même ligne mais dans une cellule non fusionnée
    TRCIBLE = TR + 1
    ws.cell(row=TRCIBLE, column=1, value="TOTAL CIBLE")
    sc(ws.cell(row=TRCIBLE, column=1), bg=C["teal"], col=C["white"], bold=True, h="center", thick=True)
    ws.cell(row=TRCIBLE, column=2).value = f"=SUM(B4:B{TR-1})"
    sc(ws.cell(row=TRCIBLE, column=2), bg=C["yellow_l"], bold=True, nf=EUR, thick=True)

    add_dv(ws, dv_list(PRIO_L), f"G4:G{TR-1}")

build_epargne()

# ═══════════════════════════════════════════════════════════════════════════════
# FEUILLE 9 — SYNTHÈSE PAR CATÉGORIE (source des graphiques)
# ═══════════════════════════════════════════════════════════════════════════════

def build_synthese():
    ws = ws_syn
    no_grid(ws)
    col_w(ws, {"A":2,"B":28,"C":16,"D":16,"E":16,"F":10,"G":22})

    title_row(ws, 1, "SYNTHÈSE PAR CATÉGORIE — SOURCE DES GRAPHIQUES", 7,
              bg=C["dark"], sz=13)

    ws.merge_cells("B2:G2")
    nc = ws["B2"]
    nc.value = ("Les formules SUMIF lisent automatiquement vos feuilles de données. "
                "Ne pas modifier la structure de cette feuille.")
    sc(nc, bg=C["gray_l"], col=C["gray_d"], sz=9, h="center", ita=True, b=False)
    ws.row_dimensions[2].height = 18

    # ── SECTION A : Dépenses Variables par catégorie ──────────────────────────
    ROW_VAR = 4
    ws.merge_cells(f"B{ROW_VAR}:G{ROW_VAR}")
    sc(ws.cell(row=ROW_VAR, column=2, value="DÉPENSES VARIABLES PAR CATÉGORIE"),
       bg=C["red"], col=C["white"], bold=True, sz=11, h="center")
    ws.row_dimensions[ROW_VAR].height = 24

    heads_v = ["Catégorie","Total","% du total","Tendance"]
    for i,h in enumerate(heads_v):
        c = ws.cell(row=ROW_VAR+1, column=2+i, value=h)
        sc(c, bg=C["dark"], col=C["white"], bold=True, sz=10, h="center")

    var_cat_start = ROW_VAR + 2
    for i, cat in enumerate(CATS_VAR):
        row = var_cat_start + i
        bg = C["gray_xl"] if i%2==0 else C["white"]
        ws.row_dimensions[row].height = 20

        nc = ws.cell(row=row, column=2, value=cat)
        sc(nc, bg=bg, sz=10)

        # SUMIF depuis Depenses Variables + Budget Mensuel
        vc = ws.cell(row=row, column=3)
        vc.value = (f"=SUMIF('Depenses Variables'!$B:$B,B{row},'Depenses Variables'!$E:$E)"
                    f"+SUMIF('Budget Mensuel'!$C:$C,B{row},'Budget Mensuel'!$F:$F)")
        sc(vc, bg=bg, sz=10, nf=EUR, h="right")

        # % du total (calculé après - référence à la ligne de total)
        pc = ws.cell(row=row, column=4)
        pc.value = f"=IF(C{var_cat_start+len(CATS_VAR)}>0,C{row}/C{var_cat_start+len(CATS_VAR)},0)"
        sc(pc, bg=bg, sz=10, nf=PCT, h="center")

    # Ligne TOTAL dépenses variables
    TOTAL_VAR_ROW = var_cat_start + len(CATS_VAR)
    ws.cell(row=TOTAL_VAR_ROW, column=2, value="TOTAL DÉPENSES VARIABLES")
    sc(ws.cell(row=TOTAL_VAR_ROW, column=2), bg=C["red"], col=C["white"],
       bold=True, sz=10, h="center")
    ws.cell(row=TOTAL_VAR_ROW, column=3).value = (
        f"=SUM(C{var_cat_start}:C{TOTAL_VAR_ROW-1})")
    sc(ws.cell(row=TOTAL_VAR_ROW, column=3), bg=C["yellow_l"],
       bold=True, sz=11, nf=EUR, h="right")
    ws.row_dimensions[TOTAL_VAR_ROW].height = 24

    # ── SECTION B : Dépenses Fixes par catégorie ──────────────────────────────
    ROW_FIX = TOTAL_VAR_ROW + 3
    ws.merge_cells(f"B{ROW_FIX}:G{ROW_FIX}")
    sc(ws.cell(row=ROW_FIX, column=2, value="DÉPENSES FIXES PAR CATÉGORIE"),
       bg=C["orange"], col=C["white"], bold=True, sz=11, h="center")

    for i,h in enumerate(heads_v):
        c = ws.cell(row=ROW_FIX+1, column=2+i, value=h)
        sc(c, bg=C["dark"], col=C["white"], bold=True, sz=10, h="center")

    fix_cat_start = ROW_FIX + 2
    for i, cat in enumerate(CATS_FIX):
        row = fix_cat_start + i
        bg = C["gray_xl"] if i%2==0 else C["white"]
        ws.row_dimensions[row].height = 20

        nc = ws.cell(row=row, column=2, value=cat)
        sc(nc, bg=bg, sz=10)

        vc = ws.cell(row=row, column=3)
        vc.value = (f"=SUMIF('Depenses Fixes'!$B:$B,B{row},'Depenses Fixes'!$C:$C)"
                    f"+SUMIF('Budget Mensuel'!$C:$C,B{row},'Budget Mensuel'!$F:$F)")
        sc(vc, bg=bg, sz=10, nf=EUR, h="right")

        pc = ws.cell(row=row, column=4)
        pc.value = f"=IF(C{fix_cat_start+len(CATS_FIX)}>0,C{row}/C{fix_cat_start+len(CATS_FIX)},0)"
        sc(pc, bg=bg, sz=10, nf=PCT, h="center")

    TOTAL_FIX_ROW = fix_cat_start + len(CATS_FIX)
    ws.cell(row=TOTAL_FIX_ROW, column=2, value="TOTAL DÉPENSES FIXES")
    sc(ws.cell(row=TOTAL_FIX_ROW, column=2), bg=C["orange"], col=C["white"],
       bold=True, sz=10, h="center")
    ws.cell(row=TOTAL_FIX_ROW, column=3).value = (
        f"=SUM(C{fix_cat_start}:C{TOTAL_FIX_ROW-1})")
    sc(ws.cell(row=TOTAL_FIX_ROW, column=3), bg=C["yellow_l"],
       bold=True, sz=11, nf=EUR, h="right")
    ws.row_dimensions[TOTAL_FIX_ROW].height = 24

    # ── SECTION C : Revenus par source ────────────────────────────────────────
    ROW_REV = TOTAL_FIX_ROW + 3
    ws.merge_cells(f"B{ROW_REV}:G{ROW_REV}")
    sc(ws.cell(row=ROW_REV, column=2, value="REVENUS PAR SOURCE"),
       bg=C["green"], col=C["white"], bold=True, sz=11, h="center")

    for i,h in enumerate(heads_v):
        c = ws.cell(row=ROW_REV+1, column=2+i, value=h)
        sc(c, bg=C["dark"], col=C["white"], bold=True, sz=10, h="center")

    rev_cat_start = ROW_REV + 2
    for i, cat in enumerate(CATS_REV):
        row = rev_cat_start + i
        bg = C["gray_xl"] if i%2==0 else C["white"]
        ws.row_dimensions[row].height = 20

        nc = ws.cell(row=row, column=2, value=cat)
        sc(nc, bg=bg, sz=10)

        vc = ws.cell(row=row, column=3)
        vc.value = (f"=SUMIF('Revenus'!$C:$C,B{row},'Revenus'!$E:$E)"
                    f"+SUMIF('Budget Mensuel'!$C:$C,B{row},'Budget Mensuel'!$F:$F)")
        sc(vc, bg=bg, sz=10, nf=EUR, h="right")

        pc = ws.cell(row=row, column=4)
        pc.value = f"=IF(C{rev_cat_start+len(CATS_REV)}>0,C{row}/C{rev_cat_start+len(CATS_REV)},0)"
        sc(pc, bg=bg, sz=10, nf=PCT, h="center")

    TOTAL_REV_ROW = rev_cat_start + len(CATS_REV)
    ws.cell(row=TOTAL_REV_ROW, column=2, value="TOTAL REVENUS")
    sc(ws.cell(row=TOTAL_REV_ROW, column=2), bg=C["green"], col=C["white"],
       bold=True, sz=10, h="center")
    ws.cell(row=TOTAL_REV_ROW, column=3).value = (
        f"=SUM(C{rev_cat_start}:C{TOTAL_REV_ROW-1})")
    sc(ws.cell(row=TOTAL_REV_ROW, column=3), bg=C["yellow_l"],
       bold=True, sz=11, nf=EUR, h="right")
    ws.row_dimensions[TOTAL_REV_ROW].height = 24

    # ── SECTION D : Épargne par objectif (pour graphique) ────────────────────
    ROW_EP = TOTAL_REV_ROW + 3
    ws.merge_cells(f"B{ROW_EP}:G{ROW_EP}")
    sc(ws.cell(row=ROW_EP, column=2, value="ÉPARGNE PAR OBJECTIF"),
       bg=C["teal"], col=C["white"], bold=True, sz=11, h="center")

    for i,h in enumerate(["Objectif","Épargné","% de l'épargne totale",""]):
        c = ws.cell(row=ROW_EP+1, column=2+i, value=h)
        sc(c, bg=C["dark"], col=C["white"], bold=True, sz=10, h="center")

    ep_cat_start = ROW_EP + 2
    for i, cat in enumerate(CATS_EP):
        row = ep_cat_start + i
        bg = C["gray_xl"] if i%2==0 else C["white"]
        ws.row_dimensions[row].height = 20
        ws.cell(row=row, column=2, value=cat)
        sc(ws.cell(row=row, column=2), bg=bg, sz=10)
        # Référence directe à la feuille Épargne (colonne C = montant épargné)
        # On utilise un SUMIF sur la colonne A de la feuille Épargne
        vc = ws.cell(row=row, column=3)
        vc.value = f'=SUMIF(\'Epargne Objectifs\'!$A:$A,"*"&B{row}&"*",\'Epargne Objectifs\'!$C:$C)'
        sc(vc, bg=bg, sz=10, nf=EUR, h="right")

        pc = ws.cell(row=row, column=4)
        pc.value = f"=IF(C{ep_cat_start+len(CATS_EP)}>0,C{row}/C{ep_cat_start+len(CATS_EP)},0)"
        sc(pc, bg=bg, sz=10, nf=PCT, h="center")

    TOTAL_EP_ROW = ep_cat_start + len(CATS_EP)
    ws.cell(row=TOTAL_EP_ROW, column=2, value="TOTAL ÉPARGNE")
    sc(ws.cell(row=TOTAL_EP_ROW, column=2), bg=C["teal"], col=C["white"],
       bold=True, sz=10, h="center")
    ws.cell(row=TOTAL_EP_ROW, column=3).value = (
        f"=SUM(C{ep_cat_start}:C{TOTAL_EP_ROW-1})")
    sc(ws.cell(row=TOTAL_EP_ROW, column=3), bg=C["yellow_l"],
       bold=True, sz=11, nf=EUR, h="right")

    # ── SECTION E : Répartition globale (Fixes / Variables / Épargne) ─────────
    ROW_GLOB = TOTAL_EP_ROW + 3
    ws.merge_cells(f"B{ROW_GLOB}:G{ROW_GLOB}")
    sc(ws.cell(row=ROW_GLOB, column=2, value="RÉPARTITION GLOBALE DU BUDGET"),
       bg=C["navy"], col=C["white"], bold=True, sz=11, h="center")

    glob_data = [
        ("Dépenses fixes",    f"=C{TOTAL_FIX_ROW}"),
        ("Dépenses variables", f"=C{TOTAL_VAR_ROW}"),
        ("Épargne",           f"=C{TOTAL_EP_ROW}"),
        ("Revenus totaux",    f"=C{TOTAL_REV_ROW}"),
    ]
    GLOB_START = ROW_GLOB + 1
    for i,(lbl,formula) in enumerate(glob_data):
        row = GLOB_START + i
        bg = [C["orange_l"],C["red_l"],C["teal_l"],C["green_l"]][i]
        ws.cell(row=row, column=2, value=lbl)
        sc(ws.cell(row=row, column=2), bg=bg, bold=True, sz=10)
        vc = ws.cell(row=row, column=3)
        vc.value = formula
        sc(vc, bg=bg, bold=True, sz=10, nf=EUR, h="right")
        ws.row_dimensions[row].height = 22

    # ═══════════════════════════════════════════════════════════════════════════
    # GRAPHIQUES DYNAMIQUES
    # ═══════════════════════════════════════════════════════════════════════════

    # PIE 1 — Dépenses variables par catégorie
    pie1 = PieChart()
    pie1.title = "Répartition Dépenses Variables"
    pie1.style = 10
    pie1.width = 16
    pie1.height = 12
    pie1.dataLabels = None

    data1   = Reference(ws, min_col=3, min_row=var_cat_start,
                         max_row=TOTAL_VAR_ROW-1)
    labels1 = Reference(ws, min_col=2, min_row=var_cat_start,
                         max_row=TOTAL_VAR_ROW-1)
    pie1.add_data(data1)
    pie1.set_categories(labels1)
    pie1.series[0].graphicalProperties.line.solidFill = "FFFFFF"
    pie1.series[0].dLbls = None

    ws.add_chart(pie1, "I4")

    # PIE 2 — Revenus par source
    pie2 = PieChart()
    pie2.title = "Répartition des Revenus"
    pie2.style = 10
    pie2.width = 16
    pie2.height = 12

    data2   = Reference(ws, min_col=3, min_row=rev_cat_start,
                         max_row=TOTAL_REV_ROW-1)
    labels2 = Reference(ws, min_col=2, min_row=rev_cat_start,
                         max_row=TOTAL_REV_ROW-1)
    pie2.add_data(data2)
    pie2.set_categories(labels2)
    ws.add_chart(pie2, "I28")

    # PIE 3 — Répartition globale Fixes/Variables/Épargne
    pie3 = PieChart()
    pie3.title = "Fixes vs Variables vs Épargne"
    pie3.style = 10
    pie3.width = 14
    pie3.height = 11

    data3   = Reference(ws, min_col=3, min_row=GLOB_START,
                         max_row=GLOB_START+2)  # seulement Fixes/Var/Épargne
    labels3 = Reference(ws, min_col=2, min_row=GLOB_START,
                         max_row=GLOB_START+2)
    pie3.add_data(data3)
    pie3.set_categories(labels3)
    ws.add_chart(pie3, "I52")

    # PIE 4 — Épargne par objectif
    pie4 = PieChart()
    pie4.title = "Répartition de l'Épargne par Objectif"
    pie4.style = 10
    pie4.width = 16
    pie4.height = 12

    data4   = Reference(ws, min_col=3, min_row=ep_cat_start,
                         max_row=TOTAL_EP_ROW-1)
    labels4 = Reference(ws, min_col=2, min_row=ep_cat_start,
                         max_row=TOTAL_EP_ROW-1)
    pie4.add_data(data4)
    pie4.set_categories(labels4)
    ws.add_chart(pie4, "I70")

    # Retourner les références de totaux pour le Dashboard
    return {
        "total_var": TOTAL_VAR_ROW,
        "total_fix": TOTAL_FIX_ROW,
        "total_rev": TOTAL_REV_ROW,
        "total_ep":  TOTAL_EP_ROW,
        "glob_start": GLOB_START,
        "var_cat_start": var_cat_start,
        "fix_cat_start": fix_cat_start,
        "rev_cat_start": rev_cat_start,
    }

SYN = build_synthese()

# ═══════════════════════════════════════════════════════════════════════════════
# FEUILLE 8 — HISTORIQUE ANNUEL
# ═══════════════════════════════════════════════════════════════════════════════

def build_historique():
    ws = ws_hist
    no_grid(ws)
    col_w(ws, {"A":16,"B":18,"C":18,"D":18,"E":14,"F":16,"G":14,"H":24})

    title_row(ws, 1, f"HISTORIQUE ANNUEL {YEAR}", 8, bg=C["dark"], sz=14)

    ws.merge_cells("A2:H2")
    nc = ws["A2"]
    nc.value = ("Récapitulatif mois par mois calculé automatiquement "
                "depuis vos feuilles de données.")
    sc(nc, bg=C["gray_l"], col=C["gray_d"], sz=10, h="center", ita=True, b=False)
    ws.row_dimensions[2].height = 20

    HEADS = ["Mois","Revenus totaux","Dépenses fixes",
             "Dépenses variables","Épargne","Solde final",
             "Taux épargne","Catégorie + coûteuse"]
    section_header(ws, 3, 1, HEADS, C["dark"], sz=10)
    ws.row_dimensions[3].height = 24

    for i, month in enumerate(MONTHS):
        row = 4 + i
        m   = i + 1  # numéro du mois 1-12
        bg  = C["gray_xl"] if i%2==0 else C["white"]
        ws.row_dimensions[row].height = 22

        ws.cell(row=row, column=1, value=month)
        sc(ws.cell(row=row, column=1), bg=bg, bold=True, sz=10)

        # Revenus du mois (SUMPRODUCT avec filtre MONTH)
        rev_f = (
            f"=SUMPRODUCT((MONTH('Revenus'!$A$4:$A$200)={m})"
            f"*('Revenus'!$E$4:$E$200))"
            f"+SUMPRODUCT((MONTH('Budget Mensuel'!$A$5:$A$300)={m})"
            f"*('Budget Mensuel'!$B$5:$B$300=\"Revenu\")"
            f"*('Budget Mensuel'!$F$5:$F$300))"
        )
        vc_rev = ws.cell(row=row, column=2)
        vc_rev.value = rev_f
        sc(vc_rev, bg=bg, sz=10, nf=EUR, h="right")

        # Dépenses fixes du mois
        fix_f = (
            f"=SUMPRODUCT((MONTH('Depenses Fixes'!$D$4:$D$100)={m})"
            f"*ISNUMBER('Depenses Fixes'!$D$4:$D$100)"
            f"*('Depenses Fixes'!$C$4:$C$100))"
            f"+SUMPRODUCT((MONTH('Budget Mensuel'!$A$5:$A$300)={m})"
            f"*('Budget Mensuel'!$B$5:$B$300=\"Dépense fixe\")"
            f"*('Budget Mensuel'!$F$5:$F$300))"
        )
        vc_fix = ws.cell(row=row, column=3)
        vc_fix.value = fix_f
        sc(vc_fix, bg=bg, sz=10, nf=EUR, h="right")

        # Dépenses variables du mois
        var_f = (
            f"=SUMPRODUCT((MONTH('Depenses Variables'!$A$4:$A$504)={m})"
            f"*ISNUMBER('Depenses Variables'!$A$4:$A$504)"
            f"*('Depenses Variables'!$E$4:$E$504))"
            f"+SUMPRODUCT((MONTH('Budget Mensuel'!$A$5:$A$300)={m})"
            f"*('Budget Mensuel'!$B$5:$B$300=\"Dépense variable\")"
            f"*('Budget Mensuel'!$F$5:$F$300))"
        )
        vc_var = ws.cell(row=row, column=4)
        vc_var.value = var_f
        sc(vc_var, bg=bg, sz=10, nf=EUR, h="right")

        # Épargne du mois
        ep_f = (
            f"=SUMPRODUCT((MONTH('Budget Mensuel'!$A$5:$A$300)={m})"
            f"*('Budget Mensuel'!$B$5:$B$300=\"Épargne\")"
            f"*('Budget Mensuel'!$F$5:$F$300))"
        )
        vc_ep = ws.cell(row=row, column=5)
        vc_ep.value = ep_f
        sc(vc_ep, bg=bg, sz=10, nf=EUR, h="right")

        # Solde final
        vc_sol = ws.cell(row=row, column=6)
        vc_sol.value = f"=B{row}-C{row}-D{row}-E{row}"
        sc(vc_sol, bg=bg, sz=10, nf=EUR, h="right", bold=True)

        # Taux d'épargne
        vc_tx = ws.cell(row=row, column=7)
        vc_tx.value = f"=IF(B{row}>0,E{row}/B{row},0)"
        sc(vc_tx, bg=bg, sz=10, nf=PCT, h="center")

        # Catégorie la plus coûteuse (placeholder)
        ws.cell(row=row, column=8, value="(calculé depuis Synthèse)")
        sc(ws.cell(row=row, column=8), bg=bg, sz=9, col=C["gray_d"], ita=True)

    # Ligne totaux annuels
    TOT_ROW = 4 + 12
    ws.row_dimensions[TOT_ROW].height = 26
    ws.cell(row=TOT_ROW, column=1, value=f"TOTAL {YEAR}")
    sc(ws.cell(row=TOT_ROW, column=1), bg=C["navy"], col=C["white"],
       bold=True, sz=11, h="center", thick=True)
    for col in range(2, 8):
        if col <= 6:
            vc = ws.cell(row=TOT_ROW, column=col)
            vc.value = f"=SUM({get_column_letter(col)}4:{get_column_letter(col)}{TOT_ROW-1})"
            sc(vc, bg=C["navy"] if col == 6 else C["yellow_l"],
               col=C["white"] if col == 6 else "000000",
               bold=True, sz=11,
               nf=PCT if col==7 else EUR, h="right", thick=True)
        else:
            sc(ws.cell(row=TOT_ROW, column=col), bg=C["navy"],
               col=C["white"], thick=True)

    # Taux épargne annuel
    vc_tx_an = ws.cell(row=TOT_ROW, column=7)
    vc_tx_an.value = f"=IF(B{TOT_ROW}>0,E{TOT_ROW}/B{TOT_ROW},0)"
    sc(vc_tx_an, bg=C["yellow_l"], bold=True, sz=11, nf=PCT, h="center", thick=True)

    # Graphique barre — Revenus vs Dépenses par mois
    bar = BarChart()
    bar.type   = "col"
    bar.title  = "Revenus vs Dépenses vs Épargne par mois"
    bar.style  = 10
    bar.width  = 24
    bar.height = 14
    bar.y_axis.title = "Montant (€)"
    bar.x_axis.title = "Mois"

    ref_months = Reference(ws, min_col=1, min_row=4, max_row=15)
    for ci, lbl, col_hex in [(2,"Revenus","27AE60"),
                              (3,"Dép. fixes","E67E22"),
                              (4,"Dép. variables","C0392B"),
                              (5,"Épargne","16A085")]:
        data = Reference(ws, min_col=ci, min_row=3, max_row=15)
        bar.add_data(data, titles_from_data=True)
    bar.set_categories(ref_months)
    ws.add_chart(bar, "A18")

    # Graphique ligne — Évolution du solde
    line = LineChart()
    line.title  = "Évolution du solde mensuel"
    line.style  = 10
    line.width  = 24
    line.height = 12
    line.y_axis.title = "Solde (€)"
    line.x_axis.title = "Mois"

    data_sol = Reference(ws, min_col=6, min_row=3, max_row=15)
    line.add_data(data_sol, titles_from_data=True)
    line.set_categories(ref_months)
    ws.add_chart(line, "A36")

build_historique()

# ═══════════════════════════════════════════════════════════════════════════════
# FEUILLE 1 — DASHBOARD ANNUEL
# ═══════════════════════════════════════════════════════════════════════════════

def build_dashboard():
    ws = ws_dash
    no_grid(ws)
    col_w(ws, {"A":2,"B":20,"C":18,"D":18,"E":18,"F":18,"G":18,"H":2})

    title_row(ws, 1, f"TABLEAU DE BORD FINANCIER {YEAR}", 7,
              bg=C["navy"], sz=18, h=45)

    ws.merge_cells("B2:G2")
    dc = ws["B2"]
    dc.value = (f"Mis à jour automatiquement · "
                f"Données au {datetime.date.today().strftime('%d/%m/%Y')}")
    sc(dc, bg=C["blue_l"], col=C["gray_d"], sz=10, h="center", ita=True, b=False)
    ws.row_dimensions[2].height = 20

    # ── KPI CARDS (ligne 4–6) ─────────────────────────────────────────────────
    ws.row_dimensions[3].height = 12

    KPI = [
        ("REVENUS TOTAUX",
         f"='Synthese Categories'!C{SYN['total_rev']}",
         C["green"], C["green_l"]),
        ("DÉPENSES FIXES",
         f"='Synthese Categories'!C{SYN['total_fix']}",
         C["orange"], C["orange_l"]),
        ("DÉPENSES VARIABLES",
         f"='Synthese Categories'!C{SYN['total_var']}",
         C["red"], C["red_l"]),
        ("ÉPARGNE TOTALE",
         f"='Synthese Categories'!C{SYN['total_ep']}",
         C["teal"], C["teal_l"]),
        ("SOLDE RESTANT",
         (f"='Synthese Categories'!C{SYN['total_rev']}"
          f"-'Synthese Categories'!C{SYN['total_fix']}"
          f"-'Synthese Categories'!C{SYN['total_var']}"
          f"-'Synthese Categories'!C{SYN['total_ep']}"),
         C["navy"], C["blue_l"]),
        ("TAUX D'ÉPARGNE",
         (f"=IF('Synthese Categories'!C{SYN['total_rev']}>0,"
          f"'Synthese Categories'!C{SYN['total_ep']}"
          f"/'Synthese Categories'!C{SYN['total_rev']},0)"),
         C["purple"], C["purple_l"]),
    ]

    for idx, (label, formula, color, light) in enumerate(KPI):
        col = 2 + idx
        ws.row_dimensions[4].height = 20
        ws.row_dimensions[5].height = 30
        ws.row_dimensions[6].height = 10

        lc = ws.cell(row=4, column=col, value=label)
        sc(lc, bg=color, col=C["white"], bold=True, sz=9, h="center", v="center", thick=True)

        vc = ws.cell(row=5, column=col)
        vc.value = formula
        sc(vc, bg=light, col=C["dark"], bold=True, sz=14, h="center", v="center",
           nf=PCT if idx==5 else EUR, thick=True)

    # ── RÉSUMÉ ANNUEL ─────────────────────────────────────────────────────────
    ws.row_dimensions[7].height = 14

    ws.merge_cells("B8:G8")
    sc(ws.cell(row=8, column=2, value="RÉSUMÉ ANNUEL PAR MOIS"),
       bg=C["dark"], col=C["white"], bold=True, sz=12, h="center", thick=True)
    ws.row_dimensions[8].height = 26

    heads_h = ["Mois","Revenus","Dép. fixes","Dép. variables","Épargne","Solde"]
    for i, h in enumerate(heads_h):
        c = ws.cell(row=9, column=2+i, value=h)
        sc(c, bg=C["navy"], col=C["white"], bold=True, sz=10, h="center")

    for i, month in enumerate(MONTHS):
        row = 10 + i
        hist_row = 4 + i
        bg = C["gray_xl"] if i%2==0 else C["white"]
        ws.row_dimensions[row].height = 20

        ws.cell(row=row, column=2, value=month)
        sc(ws.cell(row=row, column=2), bg=bg, bold=True, sz=10)

        for ci, hcol in enumerate([2,3,4,5,6]):
            vc = ws.cell(row=row, column=3+ci)
            vc.value = f"='Historique Annuel'!{get_column_letter(hcol)}{hist_row}"
            sc(vc, bg=bg, sz=10, nf=EUR, h="right")

    # Ligne totaux
    TOT = 10 + 12
    ws.cell(row=TOT, column=2, value="TOTAUX ANNUELS")
    sc(ws.cell(row=TOT, column=2), bg=C["navy"], col=C["white"],
       bold=True, sz=11, h="center", thick=True)
    for ci, hcol in enumerate([2,3,4,5,6]):
        vc = ws.cell(row=TOT, column=3+ci)
        vc.value = f"='Historique Annuel'!{get_column_letter(hcol)}{4+12}"
        sc(vc, bg=C["yellow_l"], bold=True, sz=11, nf=EUR, h="right", thick=True)
    ws.row_dimensions[TOT].height = 26

    # ── TOP CATÉGORIES ────────────────────────────────────────────────────────
    TOPC = TOT + 2
    ws.row_dimensions[TOPC].height = 26
    ws.merge_cells(f"B{TOPC}:G{TOPC}")
    sc(ws.cell(row=TOPC, column=2,
               value="TOP DÉPENSES — VARIABLES (cumulées sur l'année)"),
       bg=C["red"], col=C["white"], bold=True, sz=12, h="center", thick=True)

    for i, h in enumerate(["Catégorie","Montant dépensé","% du total"]):
        c = ws.cell(row=TOPC+1, column=2+i, value=h)
        sc(c, bg=C["dark"], col=C["white"], bold=True, sz=10, h="center")

    # Afficher les 8 premières catégories depuis Synthèse
    for i in range(min(8, len(CATS_VAR))):
        syn_row = SYN["var_cat_start"] + i
        row = TOPC + 2 + i
        bg = C["gray_xl"] if i%2==0 else C["white"]
        ws.row_dimensions[row].height = 20

        nc = ws.cell(row=row, column=2)
        nc.value = f"='Synthese Categories'!B{syn_row}"
        sc(nc, bg=bg, sz=10)

        vc = ws.cell(row=row, column=3)
        vc.value = f"='Synthese Categories'!C{syn_row}"
        sc(vc, bg=bg, sz=10, nf=EUR, h="right")

        pc = ws.cell(row=row, column=4)
        pc.value = f"='Synthese Categories'!D{syn_row}"
        sc(pc, bg=bg, sz=10, nf=PCT, h="center")

    # ── GRAPHIQUES DASHBOARD ──────────────────────────────────────────────────
    # Copie graphique bar depuis Historique (inline)
    bar2 = BarChart()
    bar2.type   = "col"
    bar2.title  = "Revenus vs Dépenses par mois"
    bar2.style  = 10
    bar2.width  = 32
    bar2.height = 14
    bar2.y_axis.title = "Montant (€)"

    ref_m = Reference(ws_hist, min_col=1, min_row=4, max_row=15)
    for ci, lbl in [(2,"Revenus"),(3,"Fixes"),(4,"Variables"),(5,"Épargne")]:
        d = Reference(ws_hist, min_col=ci, min_row=3, max_row=15)
        bar2.add_data(d, titles_from_data=True)
    bar2.set_categories(ref_m)
    ws.add_chart(bar2, "B35")

    # Graphique ligne — Évolution solde
    line2 = LineChart()
    line2.title  = "Évolution du solde mensuel"
    line2.style  = 10
    line2.width  = 32
    line2.height = 12
    line2.y_axis.title = "Solde (€)"

    d_sol = Reference(ws_hist, min_col=6, min_row=3, max_row=15)
    m_ref = Reference(ws_hist, min_col=1, min_row=4, max_row=15)
    line2.add_data(d_sol, titles_from_data=True)
    line2.set_categories(m_ref)
    ws.add_chart(line2, "B55")

build_dashboard()

# ═══════════════════════════════════════════════════════════════════════════════
# MISE EN PAGE GLOBALE & FREEZE PANES
# ═══════════════════════════════════════════════════════════════════════════════

for ws in [ws_bud, ws_rev, ws_fix, ws_var]:
    ws.freeze_panes = ws.cell(row=4, column=1)

ws_hist.freeze_panes = ws_hist["A4"]
ws_syn.freeze_panes  = ws_syn["B5"]
ws_dash.freeze_panes = ws_dash["B4"]
ws_ep.freeze_panes   = ws_ep["A4"]

# Zoom confortable
for ws in wb.worksheets:
    ws.sheet_view.zoomScale = 90

# ═══════════════════════════════════════════════════════════════════════════════
# SAUVEGARDE
# ═══════════════════════════════════════════════════════════════════════════════

output = "Budget_Personnel.xlsx"
wb.save(output)
print(f"Fichier généré avec succès : {output}")
print(f"Feuilles : {[ws.title for ws in wb.worksheets]}")
