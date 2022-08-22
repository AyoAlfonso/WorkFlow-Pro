class Api::IssuesController < Api::ApplicationController
  include UserActivityLogHelper
  after_action :record_activities, only: [:create, :update, :destroy, :duplicate]
  
  before_action :set_issue, only: [:update, :destroy, :duplicate]

  respond_to :json

  def index
    @issues = policy_scope(Issue).where(user_id: current_user.id).sort_by_position_and_priority_and_created_at_and_completed_at
    render "api/issues/index"
  end

  def create
    @issue = Issue.new({ user_id: params[:user_id], description: params[:description], body: params[:body], due_date: params[:due_date], topic_type: params[:topic_type], priority: params[:priority], team_id: params[:team_id], position: params[:position], company_id: current_company.id, personal: params[:personal], label_list: params[:label] && params[:label][:name] })
    authorize @issue
    @issue.insert_at(1)
    @issue.save!

    @issue.upvote_by current_user

    if params[:team_id]
      # USE HOOK TO CREATE A TEAM ISSUE IF IT DOESNT EXIST FOR @ISSUE
      @team_issues = TeamIssue.optimized.for_team(params[:team_id]).sort_by_position.exclude_personal_for_team
      @issues_to_render = team_meeting_issues(params[:team_id]).exclude_personal_for_team

      #additional details to render if its a team
      if params[:meeting_id]
        if params[:meeting_enabled]
          TeamIssueMeetingEnablementsService.call(@issue, params)
        end
        @meeting_team_issues = Issue.for_meeting(params[:meeting_id]).exclude_personal_for_team
      end
    else
      @issues_to_render = policy_scope(Issue).sort_by_position_and_priority_and_created_at_and_completed_at
    end

    render "api/issues/create"
  end

  def update
    merged_issue_params = params[:label_list].present? ? issue_params.merge(label_list: ActsAsTaggableOn::Tag.find(params[:label_list]) || params[:label_list]) : issue_params
    @issue.update!(merged_issue_params.merge(completed_at: params[:completed] ? Time.now : nil))

    if params[:from_team_meeting]
      #returns issues only related to the team, not all issues
      @issues_to_render = team_meeting_issues(@issue.team_id).exclude_personal_for_team
    else
      @issues_to_render = policy_scope(Issue).sort_by_position_and_priority_and_created_at_and_completed_at
    end
    @team_issues = TeamIssue.optimized.for_team(@issue.team_id).sort_by_position.exclude_personal_for_team
    render "api/issues/update"
  end

  def destroy
    team_id = @issue.team_id
    @issue.destroy!
    if params[:from_team_meeting] == "true"
      #TODO: ensure enablements destroyed here as well
      @issues_to_render = team_meeting_issues(@issue.team_id)
    else
      @issues_to_render = policy_scope(Issue).sort_by_position_and_priority_and_created_at_and_completed_at
    end
    @team_issues = TeamIssue.for_team(team_id).sort_by_position.exclude_personal_for_team
    render "api/issues/destroy"
  end
  
  def duplicate
    current_issue = @issue.dup
    current_issue.cached_votes_total = 0
    current_issue.cached_votes_score =   0
    current_issue.cached_votes_up = 0
    current_issue.cached_votes_down =  0
    current_issue.cached_weighted_score = 0
    current_issue.cached_weighted_total =  0
    current_issue.cached_weighted_average = 0.0

    current_issue.save
    @issue = current_issue
    if(@issue.team_id)
      @team_issue = TeamIssue.where(issue_id: current_issue.id).first_or_create!(issue_id: current_issue.id, team_id: current_issue.team_id, position: current_issue.position)
      if params[:meeting_id]
        TeamIssueMeetingEnablement.where(meeting_id: params[:meeting_id], team_issue_id: @team_issue.id).first_or_create(meeting_id: params[:meeting_id], team_issue_id: @team_issue.id)
      end
      render "api/team_issues/show_team_issue"
    else
      render "api/issues/show"
    end
  end

  def issues_for_meeting
    team_id = Meeting.find(params[:meeting_id]).team_id
    @issues = team_meeting_issues(team_id).exclude_personal_for_team
    authorize @issues
    render "api/issues/issues_for_meeting"
  end

  def issues_for_team
    @issues = team_meeting_issues(params[:team_id]).exclude_personal_for_team
    authorize @issues
    render "api/issues/issues_for_team"
  end

  def toggle_vote
    @issue = Issue.find(params[:id])
    if current_user.voted_up_on? @issue
      @issue.unliked_by current_user
    else
      @issue.upvote_by current_user
    end

    authorize @issue
   render "api/issues/show"
  end
  def resort_index
    if params[:meeting_id].present?
      meeting = Meeting.find(params[:meeting_id])
      team_id = meeting.team_id
      @issues = team_meeting_issues(team_id).exclude_personal_for_team
      @team_issues = TeamIssueResortService.call(TeamIssue.for_team(team_id).exclude_personal_for_team, meeting)
      if params[:sort].nil?
       @team_issues = @team_issues.sort_by_position
      end
      @meeting_team_issues = Issue.for_meeting(params[:meeting_id]).exclude_personal_for_team
    elsif params[:team_id].present? && params[:meeting_id].blank?
      @issues = IssueResortService.call(policy_scope(Issue).where(team_id: params[:team_id])).exclude_personal_for_team
      @team_issues = TeamIssue.for_team(params[:team_id]).exclude_personal_for_team
      if params[:sort].nil?
       @team_issues = @team_issues.sort_by_position
      end
    else
      @issues = IssueResortService.call(policy_scope(Issue).where(user_id: current_user.id))
    end

    case params[:sort]
    when "by_priority"
      @issues = @issues&.sort_by_priority.sort_by_due_date
      @team_issues = @team_issues&.sort_by_issue_priority&.sort_by_issue_due_date
    when "by_upvotes"
      @issues = @issues&.sort_by_upvotes.sort_by_priority
      @team_issues = @team_issues&.sort_by_issue_upvotes&.sort_by_issue_due_date&.sort_by_issue_priority
    when "by_due_date"
      @issues = @issues&.sort_by_due_date.sort_by_priority
      @team_issues = @team_issues&.sort_by_issue_due_date&.sort_by_issue_priority
    end
    authorize @issues
    render "api/issues/resort"
  end

  private

  def issue_params
    params.permit(:user_id, :description, :body, :topic_type, :due_date, :completed_at, :priority, :team_id, :position, :personal)
  end

  def set_issue
    @issue = policy_scope(Issue).find(params[:id])
    authorize @issue
  end

  def team_meeting_issues(team_id)
    if params[:sort].present?
          policy_scope(Issue).where(team_id: team_id)
    else
       policy_scope(Issue).where(team_id: team_id).sort_by_position_and_priority_and_created_at_and_completed_at
    end
  end
  def record_activities
   controller = "Topics" if current_company.display_format == "Forum"
    record_activity(params[:note], controller, params[:id])
  end 
end
