class Api::ScorecardLogsController < Api::ApplicationController
  include StatsHelper
  respond_to :json
  before_action :set_scorecard_log, only: [:destroy]

  def create
   manual_input_date = Date.strptime(params[:manual_input_date], '%Y-%m-%d').to_date unless params[:manual_input_date].empty? 
    if manual_input_date.present? &&  manual_input_date.monday? && manual_input_date > current_company.current_fiscal_start_date
       4.times do |quarter_index| 
         break if @weekly_index.present? && @quarter_index.present?
     fiscal_quarter_start_date = current_company.current_fiscal_start_date + (13.weeks * (quarter_index))
     fiscal_quarter_start_date_closest_sunday = fiscal_quarter_start_date.sunday? ? fiscal_quarter_start_date : fiscal_quarter_start_date.next_occurring(:sunday)
        
        13.times do |weekly_index|
            if  manual_input_date > fiscal_quarter_start_date_closest_sunday  && manual_input_date <= fiscal_quarter_start_date_closest_sunday + (1.week * (weekly_index + 1))
                @quarter_index = quarter_index + 1
                @weekly_index = weekly_index * quarter_index
                params[:scorecard_log][:fiscal_quarter] = @quarter_index 
                params[:scorecard_log][:week] = ((quarter_index)* 13) + (weekly_index+1)
                params[:scorecard_log][:fiscal_year] = fiscal_quarter_start_date.year 
                break
            elsif manual_input_date <= fiscal_quarter_start_date_closest_sunday + (1.week * weekly_index) && manual_input_date >= fiscal_quarter_start_date.prev_occurring(:sunday) + (1.week * weekly_index) && manual_input_date < fiscal_quarter_start_date
       
                 params[:scorecard_log][:fiscal_quarter] = 4
                 params[:scorecard_log][:week] = 52
                 params[:scorecard_log][:fiscal_year] = fiscal_quarter_start_date.year
                 break
            end
        end
      end
    end

   if manual_input_date.present? && manual_input_date < current_company.current_fiscal_start_date
       4.times do |quarter_index| 
         break if @weekly_index.present? && @quarter_index.present?
        fiscal_quarter_start_date = current_company.current_fiscal_start_date - 1.year + (13.weeks * (quarter_index))
        fiscal_quarter_start_date_new_year = current_company.current_fiscal_start_date  + (13.weeks * (quarter_index))
        fiscal_quarter_start_date_closest_sunday = fiscal_quarter_start_date.sunday? ? fiscal_quarter_start_date : fiscal_quarter_start_date.next_occurring(:sunday)
        13.times do |weekly_index|
            if  manual_input_date > fiscal_quarter_start_date_closest_sunday && manual_input_date <= fiscal_quarter_start_date_closest_sunday + (1.week * (weekly_index + 1))
                @quarter_index = quarter_index + 1
                @weekly_index = weekly_index
                params[:scorecard_log][:fiscal_quarter] = @quarter_index 
                params[:scorecard_log][:week] = ((quarter_index)* 13) + (weekly_index+1)
                params[:scorecard_log][:fiscal_year] = fiscal_quarter_start_date.year
                break
           elsif manual_input_date <= fiscal_quarter_start_date_closest_sunday + (1.week * weekly_index) && manual_input_date > fiscal_quarter_start_date_new_year.prev_occurring(:sunday) + (1.week * weekly_index)
                   params[:scorecard_log][:fiscal_quarter] = 4 
                   params[:scorecard_log][:week] = 52
                   params[:scorecard_log][:fiscal_year] = fiscal_quarter_start_date_new_year.year
                  break
            end
        end
      end
    end

 if manual_input_date.present? && !manual_input_date.monday? && (manual_input_date == current_company.current_fiscal_start_date || manual_input_date <= current_company.current_fiscal_start_date.next_occurring(:sunday)  || manual_input_date >= current_company.current_fiscal_start_date.prev_occurring(:sunday))
       4.times do |quarter_index| 
         break if @weekly_index.present? && @quarter_index.present?
        fiscal_quarter_start_date = current_company.current_fiscal_start_date + (13.weeks * (quarter_index))
        fiscal_quarter_start_date_closest_sunday = fiscal_quarter_start_date.sunday? ? fiscal_quarter_start_date : fiscal_quarter_start_date.next_occurring(:sunday)
        fiscal_quarter_start_date_new_year = current_company.current_fiscal_start_date - 1.year + (13.weeks * (quarter_index))
        13.times do |weekly_index|
            if  manual_input_date > fiscal_quarter_start_date_closest_sunday  && manual_input_date <= fiscal_quarter_start_date_closest_sunday + (1.week * (weekly_index + 1))
                @quarter_index = quarter_index + 1
                @weekly_index = weekly_index * quarter_index
                params[:scorecard_log][:fiscal_quarter] = @quarter_index 
                params[:scorecard_log][:week] = ((quarter_index)* 13) + (weekly_index+1)
                params[:scorecard_log][:fiscal_year] = fiscal_quarter_start_date.year 
                break
            elsif manual_input_date <= fiscal_quarter_start_date_closest_sunday + (1.week * weekly_index) && manual_input_date >= fiscal_quarter_start_date.prev_occurring(:sunday) + (1.week * weekly_index)
                 params[:scorecard_log][:fiscal_quarter] = 4 
                 params[:scorecard_log][:week] = 52
                 params[:scorecard_log][:fiscal_year] =  manual_input_date <=  current_company.current_fiscal_start_date.next_occurring(:sunday) ? fiscal_quarter_start_date_new_year.year :   fiscal_quarter_start_date.year 
                 break
            end
        end
      end
    end

   

    @scorecard_log = ScorecardLog.create!(scorecard_log_params)
    @kpi = KeyPerformanceIndicator.find(@scorecard_log.key_performance_indicator_id)
    authorize @scorecard_log
    @scorecard_log.save!
   
    render json: { scorecard_log: @scorecard_log,
      kpi: @kpi.as_json(), 
      status: :ok }
  end

  def show
    @key_performance_indicators = policy_scope(KeyPerformanceIndicator).vieweable_by_entity(params[:owner_type], params[:owner_id])
    if(params[:show_all].to_s.downcase == 'true')
      @key_performance_indicators = policy_scope(KeyPerformanceIndicator).vieweable_by_entity_and_owner_id(params[:owner_type], params[:owner_id]).exclude_advanced_kpis
    end
    authorize @key_performance_indicators
    @kpis = @key_performance_indicators.map do |kpi|
      kpi.as_json()
    end
    render json: @kpis
  end

  def destroy
    kpi = KeyPerformanceIndicator.find(@scorecard_log.key_performance_indicator_id)
    authorize @scorecard_log
    @scorecard_log.destroy!
    render json: { scorecard_log: @scorecard_log,  kpi: kpi.as_json(),  status: :ok }
  end

  private
  def set_scorecard_log
   @scorecard_log = policy_scope(ScorecardLog).find(params[:id])
   authorize @scorecard_log
  end

  def scorecard_log_params
    params.require(:scorecard_log).permit(:user_id, :score, :note, :key_performance_indicator_id, :fiscal_quarter, :fiscal_year, :week)
  end
end
