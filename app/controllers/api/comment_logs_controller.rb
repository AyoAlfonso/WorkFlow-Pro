class Api::CommentLogsController < Api::ApplicationController
  include StatsHelper
  respond_to :json
  before_action :set_comment_log, only: [:show, :destroy]

  def index
     comment_log = policy_scope(CommentLog).where(parent_id: params[:id], parent_type: params[:type]).page(params[:page]).per(params[:per]).sort_by_created_date
     render json: { comment_log: comment_log, meta: { first_page: comment_log.first_page?, prev_page: comment_log.prev_page, next_page: comment_log.next_page, current_page: comment_log.current_page, total_pages: comment_log.total_pages, total_count: comment_log.total_count, size: comment_log.size }, status: :ok }
  end 

  def create
    @comment_log = CommentLog.create!(comment_log_params)
    authorize @comment_log
    @comment_log.save!
    render json: { comment_log: @comment_log, status: :ok }
  end
  
  def destroy
    @comment_log.destroy!
    render json: { comment_log: @comment_log,  status: :ok }
  end

  private
  def set_comment_log
   @comment_log = policy_scope(CommentLog).find(params[:id])
   authorize @comment_log
  end

  def comment_log_params
    params.permit(:owned_by_id, :note, :parent_id, :parent_type, :created_at)
  end

end
