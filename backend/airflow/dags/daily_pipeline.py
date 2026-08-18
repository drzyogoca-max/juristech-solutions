from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime, timedelta

default_args = {
    'owner': 'automation',
    'depends_on_past': False,
    'retries': 1,
    'retry_delay': timedelta(minutes=5),
}

with DAG(
    dag_id='bi_daily_model_update',
    default_args=default_args,
    schedule_interval='0 */12 * * *',  # Every 12 Hours Automation
    start_date=datetime(2026, 1, 1),
    catchup=False,
    max_active_runs=1
) as dag:

    def extract_events():
        print("[Airflow Step 1] Extracting opt-in events from consent store...")

    def compute_features():
        print("[Airflow Step 2] Computing lead interest features and engagement scores...")

    def train_or_update_models():
        print("[Airflow Step 3] Re-training LightGBM lead scoring models...")

    def generate_offers():
        print("[Airflow Step 4] Generating AI draft proposals and pushing to review queue...")

    def push_to_review_queue():
        print("[Airflow Step 5] Human Review Queue updated. Awaiting human approval & signature.")

    t1 = PythonOperator(task_id='extract_events', python_callable=extract_events)
    t2 = PythonOperator(task_id='compute_features', python_callable=compute_features)
    t3 = PythonOperator(task_id='train_models', python_callable=train_or_update_models)
    t4 = PythonOperator(task_id='generate_offers', python_callable=generate_offers)
    t5 = PythonOperator(task_id='push_to_review', python_callable=push_to_review_queue)

    t1 >> t2 >> t3 >> t4 >> t5
