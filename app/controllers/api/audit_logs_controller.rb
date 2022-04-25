class Api::AuditLogsController < Api::ApplicationController
  respond_to :json

  def index
    if params[:from].blank? || params[:to].blank?
      #return error, will not return all daily logs
      user_activity_logs =  policy_scope(UserActivityLog).page(params[:page]).per(params[:per]).sort_by_created_date
      if params[:entity_type] == "user"
        user_activity_logs.owned_by_user(params[:entity_id])
      end
     return render json: { user_activity_logs: user_activity_logs, meta: { first_page: user_activity_logs.first_page?, prev_page: user_activity_logs.prev_page, next_page: user_activity_logs.next_page, current_page: user_activity_logs.current_page, total_pages: user_activity_logs.total_pages, total_count: user_activity_logs.total_count, size: user_activity_logs.size }, status: :ok }

    else
      from = params[:from].to_date
      to = params[:to].to_date
      @user_activity_logs = policy_scope(UserActivityLog).created_between(from, to)
     return render json: { user_activity_logs: @user_activity_logs }
    end
  end
end
