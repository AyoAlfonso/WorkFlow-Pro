select
  key_performance_indicators.id as kpi,
  avg(scorecard_logs.score) as score,
  scorecard_logs.user_id as owned_by,
  fiscal_quarter,
  fiscal_year,
  week
from key_performance_indicators
inner join scorecard_logs 
on key_performance_indicators.id = scorecard_logs.key_performance_indicator_id  group by owned_by, kpi, fiscal_year, fiscal_quarter, week 
