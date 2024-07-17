from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
from sqlalchemy import func, and_
import calendar
from models import db, Expense,Store  

def calculate_weekly_sums(user_id):
    today = datetime.now().date()
    start_of_week = today - timedelta(days=today.weekday())
    return [calculate_sum_for_period(start_of_week - timedelta(weeks=i), timedelta(days=7), user_id) for i in range(24)]

def calculate_monthly_sums(user_id):
    today = datetime.now().date()
    monthly_sums = []
    for i in range(12):
        start_date = today.replace(day=1) - relativedelta(months=i)
        end_date = start_date + relativedelta(months=1) - timedelta(days=1)
        total_sum = db.session.query(func.sum(Expense.amount))\
            .join(Store, Expense.store_id == Store.id)\
            .filter(and_(
            Expense.date.between(start_date, end_date),
            Store.user_id==user_id
        )).scalar() or 0
        monthly_sums.append({
            "month": calendar.month_name[start_date.month],
            "year": start_date.year,
            "sum": total_sum
        })
    return monthly_sums

def calculate_yearly_sums(user_id):
    today = datetime.now().date()
    yearly_sums = []
    for i in range(5):  # Last 5 years
        start_date = today.replace(month=1, day=1) - relativedelta(years=i)
        end_date = start_date + relativedelta(years=1) - timedelta(days=1)
        total_sum = db.session.query(func.sum(Expense.amount))\
            .join(Store, Expense.store_id == Store.id)\
            .filter(and_(
            Expense.date.between(start_date, end_date),
            Store.user_id==user_id
        )).scalar() or 0
        yearly_sums.append({
            "year": start_date.year,
            "sum": total_sum
        })
    return yearly_sums

def calculate_sum_for_period(start_date, duration,user_id):
    end_date = start_date + duration - timedelta(days=1)
    total_sum = db.session.query(func.sum(Expense.amount))\
        .join(Store, Expense.store_id == Store.id)\
        .filter(and_(
        Expense.date.between(start_date, end_date),
        Store.user_id == user_id
    )).scalar() or 0
    return {
        "start_date": start_date.strftime("%Y-%m-%d"),
        "end_date": end_date.strftime("%Y-%m-%d"),
        "sum": total_sum
    }
    
def calculate_weekly_sum_by_store(user_id):
    today = datetime.now().date()
    start_date = today - timedelta(weeks=24)
    num_week = 24
    return calculate_sum_by_store_for_period(start_date, today, num_week, user_id)

def calculate_monthly_sum_by_store(user_id):
    today = datetime.now().date()
    start_date = today.replace(day=1) - relativedelta(months=12)
    num_month = 12
    return calculate_sum_by_store_for_period(start_date, today,num_month, user_id)

def calculate_yearly_sum_by_store(user_id):
    today = datetime.now().date()
    start_date = today.replace(month=1, day=1) - relativedelta(years=5)
    num_year = 5
    return calculate_sum_by_store_for_period(start_date, today,num_year, user_id)

def calculate_sum_by_store_for_period(start_date, end_date, ave_num, user_id):
    sums = db.session.query(
        Store.storename,
        func.sum(Expense.amount).label('total')
    ).join(Expense).filter(and_(
        Expense.date.between(start_date, end_date),
        Store.user_id == user_id
    )).group_by(Store.id).all()
    
    return {store: total/ave_num for store, total in sums}

time_frame_functions = {
    "Weekly": calculate_weekly_sums,
    "Monthly": calculate_monthly_sums,
    "Yearly": calculate_yearly_sums
}

pie_chart_functions = {
    "Weekly": calculate_weekly_sum_by_store,
    "Monthly": calculate_monthly_sum_by_store,
    "Yearly": calculate_yearly_sum_by_store
}
