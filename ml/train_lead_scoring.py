import os
import joblib
import pandas as pd
from sklearn.model_selection import train_test_split
from lightgbm import LGBMClassifier

def train():
    os.makedirs('models', exist_ok=True)
    os.makedirs('data', exist_ok=True)
    
    # Generate synthetic feature parquet if data file doesn't exist
    parquet_path = 'data/events_features.parquet'
    if not os.path.exists(parquet_path):
        dummy_data = {
            'page_views': [12, 2, 25, 1, 18, 4, 30, 3],
            'time_on_page_min': [15.5, 1.2, 35.0, 0.5, 22.1, 2.0, 40.0, 1.0],
            'cta_clicks': [3, 0, 5, 0, 4, 0, 6, 0],
            'sponsor_views': [2, 0, 4, 0, 3, 0, 5, 0],
            'consent_granted': [1, 1, 1, 1, 1, 1, 1, 1],
            'is_lead': [1, 0, 1, 0, 1, 0, 1, 0]
        }
        df_dummy = pd.DataFrame(dummy_data)
        df_dummy.to_parquet(parquet_path)
    
    df = pd.read_parquet(parquet_path)
    X = df.drop(columns=['is_lead'])
    y = df['is_lead']
    
    X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2, random_state=42)
    model = LGBMClassifier(n_estimators=100, learning_rate=0.05, random_state=42)
    model.fit(X_train, y_train)
    
    model_path = 'models/lead_scoring_v1.pkl'
    joblib.dump(model, model_path)
    print(f"[ML Pipeline] Successfully trained Lead Scoring Model and exported to {model_path}")

if __name__ == "__main__":
    train()
