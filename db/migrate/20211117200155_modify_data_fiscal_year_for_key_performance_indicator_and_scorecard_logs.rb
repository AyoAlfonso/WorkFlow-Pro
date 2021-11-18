class ModifyDataFiscalYearForKeyPerformanceIndicatorAndScorecardLogs < ActiveRecord::Migration[6.1]
  def data
    KeyPerformanceIndicator.all.each do |kpi|
        kpi.scorecard_logs.update_all({
           fiscal_year: Company.find(kpi.company_id).year_for_creating_annual_initiatives
       }) if kpi.scorecard_logs.any? &&  kpi.company_id.present?
    end
  end
end