select
  key_performance_indicators.id as kpi,
  avg(scorecard_logs.score) as score
  scorecard_logs.owned_by_id as owned_by
from key_performance_indicators
inner join scorecard_logs 
on key_performance_indicators.id = scorecard_logs.associated_kpi  group by owned_by, kpi
