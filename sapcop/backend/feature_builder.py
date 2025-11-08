import pandas as pd
import numpy as np
import re


# 1️⃣ Convictions
def create_conviction_features(df):
    """
    Features for Convictions dataset to predict conviction trends.
    """
    df = df.copy()
    df["month"] = pd.to_datetime(df["month"], format="%Y-%m")

    # Conviction rates
    df["ipc_conviction_rate"] = np.where(df["ipc_trials"] > 0,
                                         df["ipc_convictions"] / df["ipc_trials"], 0)
    df["sll_conviction_rate"] = np.where(df["sll_trials"] > 0,
                                         df["sll_convictions"] / df["sll_trials"], 0)

    df["overall_conviction_rate"] = (
        (df["ipc_convictions"] + df["sll_convictions"]) /
        (df["ipc_trials"] + df["sll_trials"] + 1e-6)
    )

    features = [
        "ipc_trials", "ipc_convictions", "ipc_acquitted",
        "sll_trials", "sll_convictions", "sll_acquitted",
        "ipc_conviction_rate", "sll_conviction_rate", "overall_conviction_rate"
    ]
    X = df[features]
    return X, features, df


# 2️⃣ Crime Pendency
def create_pendency_features(df):
    """
    Feature builder for pendency trend classification.
    """
    df = df.copy()
    df["month"] = pd.to_datetime(df["month"], format="%Y-%m")

    df["pendency_change"] = df.groupby("district")["pendency_percent"].diff()
    df["trend_label"] = pd.cut(df["pendency_change"],
                               bins=[-np.inf, -1, 1, np.inf],
                               labels=["Improving", "Stable", "Worsening"])

    features = ["cases_reported_year", "total_pendency_30days",
                "target_close", "closed_during_drive", "pendency_percent"]
    X = df[features].fillna(0)
    return X, features, df


# 3️⃣ Excise Act
def create_excise_features(df):
    """
    Efficiency features for Excise Act enforcement.
    """
    df = df.copy()
    df["month"] = pd.to_datetime(df["month"], format="%Y-%m")

    # Arrests per case (core efficiency metric)
    df["arrest_per_case"] = np.where(
        df["cases_registered"] > 0,
        df["persons_arrested"] / df["cases_registered"],
        0
    )

    # Shift for next-month prediction
    df["target_efficiency"] = df.groupby("district")["arrest_per_case"].shift(-1)

    df_final = df.dropna(subset=["target_efficiency"])
    features = ["cases_registered", "persons_arrested", "arrest_per_case"]

    X = df_final[features]
    return X, features, df_final


# 4️⃣ Firearms Drive
def create_firearms_features(df):
    """
    Firearms seizure efficiency features.
    """
    df = df.copy()
    df["total_firearms"] = df[["gun_rifle", "pistol", "revolver",
                               "mouzer", "ak47", "slr", "others"]].sum(axis=1)
    df["total_ammo"] = df["ammunition"] + df["cartridge"]
    df["arrest_per_case"] = np.where(df["cases_registered"] > 0,
                                     df["persons_arrested"] / df["cases_registered"], 0)
    features = ["cases_registered", "total_firearms", "total_ammo", "arrest_per_case"]
    X = df[features].fillna(0)
    return X, features, df


# 5️⃣ Missing Persons Drive
def create_missing_features(df):
    """
    Recovery efficiency from Missing Persons Drive.
    """
    df = df.copy()
    df["month"] = pd.to_datetime(df["month"], format="%Y-%m")

    # --- 1️⃣ Aggregate totals ---
    df["missing_total"] = (
        df["missing_boys_start"] + df["missing_boys_during"] +
        df["missing_girls_start"] + df["missing_girls_during"] +
        df["missing_men_start"] + df["missing_men_during"] +
        df["missing_women_start"] + df["missing_women_during"]
    )

    df["traced_total"] = (
        df["traced_boys"] + df["traced_girls"] +
        df["traced_men"] + df["traced_women"]
    )

    # --- 2️⃣ Compute tracing efficiency ---
    df["tracing_efficiency"] = np.where(
        df["missing_total"] > 0,
        df["traced_total"] / df["missing_total"],
        0
    )

    # --- 3️⃣ Predict next-month tracing efficiency ---
    df["target_efficiency"] = df.groupby("district")["tracing_efficiency"].shift(-1)
    df_final = df.dropna(subset=["target_efficiency"])

    # --- 4️⃣ Select input features ---
    features = [
        "missing_boys_start", "missing_boys_during", "missing_girls_start", "missing_girls_during",
        "missing_men_start", "missing_men_during", "missing_women_start", "missing_women_during",
        "traced_boys", "traced_girls", "traced_men", "traced_women", "missing_total", "traced_total", "tracing_efficiency"
    ]

    X = df_final[features]
    return X, features, df_final


# 6️⃣ NBW Drive
def create_nbw_features(df):
    """
    NBW (Non-Bailable Warrants) execution efficiency.
    """
    df = df.copy()
    df["month"] = pd.to_datetime(df["month"], format="%Y-%m")

    # --- 1️⃣ Compute key ratios ---
    df["nbw_execution_rate"] = np.where(
        df["nbw_received"] > 0,
        df["nbw_executed_drive"] / df["nbw_received"],
        0
    )

    df["nbw_disposal_rate"] = np.where(
        df["nbw_total_disposed"] > 0,
        df["nbw_executed_drive"] / df["nbw_total_disposed"],
        0
    )

    # Pending reduction ratio: how much pending reduced vs start
    df["nbw_pending_change_rate"] = np.where(
        df["nbw_pending_start"] > 0,
        (df["nbw_pending_start"] - df["nbw_pending_end"]) / df["nbw_pending_start"],
        0
    )

    # --- 2️⃣ Create target variable (next month's execution rate) ---
    df["target_efficiency"] = df.groupby("district")["nbw_execution_rate"].shift(-1)
    df_final = df.dropna(subset=["target_efficiency"])

    # --- 3️⃣ Select features ---
    features = [
        "nbw_pending_start", "nbw_received", "nbw_executed_drive",
        "nbw_disposed_other", "nbw_total_disposed", "nbw_pending_end",
        "nbw_execution_rate", "nbw_disposal_rate", "nbw_pending_change_rate"
    ]

    X = df_final[features].fillna(0)
    return X, features, df_final


# 7️⃣ Narcotics Drive
def create_narcotics_features(df):
    """
    Narcotics disposal and seizure efficiency.
    """
    df = df.copy()
    df["month"] = pd.to_datetime(df["month"], format="%Y-%m")

    # --- 1️⃣ Compute operational efficiency ---
    df["arrest_efficiency"] = np.where(
        df["cases_registered"] > 0,
        df["persons_arrested"] / df["cases_registered"],
        0
    )

    df["seizure_intensity"] = (
        df["ganja_kg"] +
        df["brownsugar_g"] / 1000 +  # convert grams to kg equivalent
        df["opium"] +
        df["bhanga"] +
        (df["cough_syrup_bottles"] / 1000)  # scale down bottle counts
    )

    # --- 2️⃣ Combined efficiency metric ---
    df["operation_efficiency"] = (df["arrest_efficiency"] + np.log1p(df["seizure_intensity"])) / 2

    # --- 3️⃣ Target variable — next month efficiency ---
    df["target_efficiency"] = df.groupby("district")["operation_efficiency"].shift(-1)
    df_final = df.dropna(subset=["target_efficiency"])

    # --- 4️⃣ Select meaningful features ---
    features = [
        "cases_registered", "persons_arrested", "ganja_kg", "brownsugar_g",
        "vehicles", "ganja_plants_destroyed", "bhanga", "opium",
        "cough_syrup_bottles", "cash_recovered", "arrest_efficiency", "seizure_intensity"
    ]

    X = df_final[features].fillna(0)
    return X, features, df_final

# 8️⃣ OPG Act
def extract_cash_value(text):
    """Extract numeric cash value from text like 'Rs. 4983 mobile phones and cash'."""
    if pd.isna(text):
        return 0.0
    match = re.search(r'Rs\.?\s?([\d,]+)', str(text))
    return float(match.group(1).replace(",", "")) if match else 0.0


def extract_cash_value(text):
    """
    Extracts numerical cash value from text like 'Rs. 4983 mobile phones and cash'
    Returns float in rupees.
    """
    if pd.isna(text):
        return 0.0
    match = re.search(r'Rs\.?\s?([\d,]+)', str(text))
    if match:
        return float(match.group(1).replace(",", ""))
    return 0.0


def create_opg_features(df):
    """
    Creates efficiency features for OPG Act operations.
    """
    df = df.copy()
    df["month"] = pd.to_datetime(df["month"], format="%Y-%m")

    # --- 1️⃣ Extract numeric cash seized ---
    df["cash_value"] = df["details_of_seizure"].apply(extract_cash_value)

    # --- 2️⃣ Create efficiency indicators ---
    df["arrest_efficiency"] = np.where(
        df["cases_registered"] > 0,
        df["persons_arrested"] / df["cases_registered"],
        0
    )

    df["cash_per_case"] = np.where(
        df["cases_registered"] > 0,
        df["cash_value"] / df["cases_registered"],
        0
    )

    # --- 3️⃣ Combined performance score ---
    df["operation_efficiency"] = (df["arrest_efficiency"] + np.log1p(df["cash_per_case"])) / 2

    # --- 4️⃣ Target: Predict next month's efficiency ---
    df["target_efficiency"] = df.groupby("district")["operation_efficiency"].shift(-1)
    df_final = df.dropna(subset=["target_efficiency"])

    # --- 5️⃣ Features for model ---
    features = ["cases_registered", "persons_arrested", "cash_value", "arrest_efficiency", "cash_per_case"]
    X = df_final[features]

    return X, features, df_final

# 9️⃣ Preventive Measures
def create_preventive_features(df):
    """
    Preventive action efficiency.
    """
    df = df.copy()
    df["month"] = pd.to_datetime(df["month"], format="%Y-%m")

    # --- 1️⃣ Calculate key efficiency ratios ---
    df["bnss_129_efficiency"] = np.where(
        df["notice_129_bnss"] > 0,
        df["bound_129_bnss"] / df["notice_129_bnss"],
        0
    )

    df["bnss_126_efficiency"] = np.where(
        df["notice_126_bnss"] > 0,
        df["bound_126_bnss"] / df["notice_126_bnss"],
        0
    )

    df["nbw_execution_ratio"] = np.where(
        df["nbw_executed"] > 0,
        df["nbw_executed"] / (df["notice_129_bnss"] + df["notice_126_bnss"]),
        0
    )

    df["organized_action_rate"] = np.where(
        df["chanda_cases_registered"] > 0,
        df["organized_crime_action"] / df["chanda_cases_registered"],
        0
    )

    # --- 2️⃣ Combine them into one efficiency score ---
    df["preventive_efficiency"] = (
        df["bnss_129_efficiency"] * 0.3 +
        df["bnss_126_efficiency"] * 0.3 +
        df["nbw_execution_ratio"] * 0.2 +
        df["organized_action_rate"] * 0.2
    )

    # --- 3️⃣ Target variable: next month's efficiency ---
    df["target_efficiency"] = df.groupby("district")["preventive_efficiency"].shift(-1)
    df_final = df.dropna(subset=["target_efficiency"])

    # --- 4️⃣ Define features for model ---
    features = [
        "notice_129_bnss", "bound_129_bnss",
        "notice_126_bnss", "bound_126_bnss",
        "nbw_executed", "chanda_cases_registered",
        "chanda_persons_arrested", "blockings_border_sealed",
        "organized_crime_action", "bnss_129_efficiency",
        "bnss_126_efficiency", "nbw_execution_ratio", "organized_action_rate"
    ]

    X = df_final[features].fillna(0)
    return X, features, df_final


# 🔟 Sand Mining
def create_mining_features(df):
    """
    Sand mining efficiency indicators.
    """
    df = df.copy()
    df["month"] = pd.to_datetime(df["month"], format="%Y-%m")

    # --- 1️⃣ Compute core operational efficiency metrics ---
    df["arrest_efficiency"] = np.where(
        df["cases_registered"] > 0,
        df["persons_arrested"] / df["cases_registered"],
        0
    )

    df["vehicle_per_case"] = np.where(
        df["cases_registered"] > 0,
        df["vehicles_seized"] / df["cases_registered"],
        0
    )

    df["notices_per_case"] = np.where(
        df["cases_registered"] > 0,
        df["notices_served"] / df["cases_registered"],
        0
    )

    # --- 2️⃣ Combine into an overall enforcement efficiency score ---
    df["mining_efficiency"] = (
        df["arrest_efficiency"] * 0.4 +
        df["vehicle_per_case"] * 0.3 +
        df["notices_per_case"] * 0.3
    )

    # --- 3️⃣ Target: predict next month’s efficiency ---
    df["target_efficiency"] = df.groupby("district")["mining_efficiency"].shift(-1)
    df_final = df.dropna(subset=["target_efficiency"])

    # --- 4️⃣ Features used for regression ---
    features = [
        "cases_registered",
        "vehicles_seized",
        "persons_arrested",
        "notices_served",
        "arrest_efficiency",
        "vehicle_per_case",
        "notices_per_case"
    ]

    X = df_final[features].fillna(0)
    return X, features, df_final