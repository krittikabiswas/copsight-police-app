import os
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime

plt.switch_backend("Agg")

def generate_graphs(dataset_name, df, preds):
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    base_dir = r"C:\Users\SAPTARSHI MONDAL\Copsight\copsight-police-app\sapcop\generated_graphs"
    save_dir = os.path.join(base_dir, f"{dataset_name}_{timestamp}")
    os.makedirs(save_dir, exist_ok=True)

    df_plot = df.copy()
    df_plot["predicted_efficiency"] = preds

    # 1️⃣ Bar Chart
    plt.figure(figsize=(8, 4))
    sns.barplot(x="district", y="predicted_efficiency", data=df_plot, palette="Blues_d")
    plt.title(f"{dataset_name} — Predicted Efficiency by District")
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.savefig(os.path.join(save_dir, "bar_chart.png"))
    plt.close()

    # 2️⃣ Line Chart
    if "month" in df_plot.columns:
        plt.figure(figsize=(8, 4))
        for d in df_plot["district"].unique():
            subset = df_plot[df_plot["district"] == d]
            plt.plot(subset["month"], subset["predicted_efficiency"], marker="o", label=d)
        plt.title(f"{dataset_name} — Efficiency Trend Over Time")
        plt.legend()
        plt.xticks(rotation=45)
        plt.tight_layout()
        plt.savefig(os.path.join(save_dir, "line_trend.png"))
        plt.close()

    # 3️⃣ Scatter Plot
    if "target_efficiency" in df_plot.columns:
        plt.figure(figsize=(6, 4))
        plt.scatter(df_plot["target_efficiency"], df_plot["predicted_efficiency"], alpha=0.6, color="purple")
        plt.xlabel("Actual Efficiency")
        plt.ylabel("Predicted Efficiency")
        plt.title(f"{dataset_name} — Actual vs Predicted")
        plt.tight_layout()
        plt.savefig(os.path.join(save_dir, "scatter_actual_vs_pred.png"))
        plt.close()

    # 4️⃣ Histogram
    plt.figure(figsize=(6, 4))
    sns.histplot(df_plot["predicted_efficiency"], bins=10, kde=True, color="green")
    plt.title(f"{dataset_name} — Efficiency Distribution")
    plt.tight_layout()
    plt.savefig(os.path.join(save_dir, "histogram_efficiency.png"))
    plt.close()

    # 5️⃣ Correlation Heatmap
    numeric_cols = df_plot.select_dtypes(include='number')
    if len(numeric_cols.columns) > 1:
        plt.figure(figsize=(8, 6))
        sns.heatmap(numeric_cols.corr(), cmap="coolwarm", annot=True)
        plt.title(f"{dataset_name} — Feature Correlation Heatmap")
        plt.tight_layout()
        plt.savefig(os.path.join(save_dir, "heatmap_correlation.png"))
        plt.close()

    print(f"✅ Graphs saved in: {save_dir}")

    # ✅ Return structured info
    folder_name = os.path.basename(save_dir)
    files = [f for f in os.listdir(save_dir) if f.endswith(".png")]
    return {"folder": folder_name, "files": files}