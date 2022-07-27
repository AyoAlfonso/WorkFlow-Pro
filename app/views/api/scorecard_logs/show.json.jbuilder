json.extract! @scorecard_log, :id, :score, :note, :fiscal_quarter, :fiscal_year, :week, :user_id, :created_at, :updated_at
json.kpi @scorecard_log.kpi_data