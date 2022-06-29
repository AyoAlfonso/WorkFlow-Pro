class Api::CompaniesController < Api::ApplicationController
  include TeamUserEnablementAttributeParser
  include UserActivityLogHelper
  respond_to :json
  after_action :record_activities, only: [:create, :update_logo, :delete_logo, :update, :destroy, :create_or_update_onboarding_goals, :create_or_update_onboarding_key_activities, :create_or_update_onboarding_team]
  before_action :set_company, only: [:show, :update, :update_logo, :delete_logo]
  before_action :set_onboarding_company, only: [:create_or_update_onboarding_goals, :get_onboarding_goals, :create_or_update_onboarding_key_activities, :get_onboarding_key_activities, :create_or_update_onboarding_team]
  skip_after_action :verify_authorized, only: [:get_onboarding_company, :create_or_update_onboarding_goals, :get_onboarding_goals, :create_or_update_onboarding_key_activities, :get_onboarding_key_activities, :create_or_update_onboarding_team]

  def create
    @company = Company.new({
      display_format: params[:display_format],
      fiscal_year_start: params[:fiscal_year_start],
      name: params[:name],
      timezone: params[:timezone],
      forum_type: params[:forum_type],
      # TODO:
    })
    authorize @company
    @company.save!
    if params[:logo].present?
      decoded_image = Base64.decode64(params[:logo][0][:data].split(",")[1])
      image_io = StringIO.new(decoded_image)
      @company.logo.attach(io: image_io, filename: params[:logo][0][:file][:path], content_type: "image/jpeg")
    elsif params[:logo].blank? && @company.logo_url.present?
      @company.logo.purge
    end
    SignUpPurpose.create(company_id: @company[:id], purpose: params[:sign_up_purpose_attributes][:purpose]) if params[:sign_up_purpose_attributes].present?
    @user_role = UserRole.find_by(name: "CEO")
    UserCompanyEnablement.create(user_id: current_user.id, company_id: @company.id, user_role_id: @user_role.id)
    render json: @company.as_json(only: ["id", "name", "phone_number", "rallying_cry", "fiscal_year_start", "timezone", "preferences", "forum_type", "organisational_forum_type", "display_format"],
                             methods: ["accountability_chart_content", "strategic_plan_content",  "sso_emails_content", "logo_url", "current_fiscal_quarter", "quarter_for_creating_quarterly_goals", "current_fiscal_year", "year_for_creating_annual_initiatives", "fiscal_year_range", "current_quarter_start_date", "next_quarter_start_date", "forum_meetings_year_range", "forum_intro_video"],
                             include: {
                               core_four: { methods: ["core_1_content", "core_2_content", "core_3_content", "core_4_content"] },
                               sign_up_purpose: { only: ["purpose"] },
                             })
  end

  def show
    render json: @company.as_json(only: ["id", "name", "phone_number", "rallying_cry", "fiscal_year_start", "timezone", "preferences", "display_format", "forum_type", "organisational_forum_type", "objectives_key_type"],
                                  methods: ["accountability_chart_content", "strategic_plan_content", "sso_emails_content", "logo_url", "current_fiscal_week", "current_fiscal_quarter", "quarter_for_creating_quarterly_goals", "current_fiscal_year", "year_for_creating_annual_initiatives", "fiscal_year_range", "current_quarter_start_date", "next_quarter_start_date", "forum_meetings_year_range", "forum_intro_video", "forum_types", "objectives_key_types"],
                                  include: {
                                    core_four: { methods: ["core_1_content", "core_2_content", "core_3_content", "core_4_content"] },
                                    sign_up_purpose: { only: ["purpose"] },
                                  })
  end

  def update
    @company.update!(company_params)
    if params[:company][:logo].present?
      decoded_image = Base64.decode64(params[:company][:logo][0][:data].split(",")[1])
      image_io = StringIO.new(decoded_image)
      @company.logo.attach(io: image_io, filename: params[:company][:logo][0][:file][:path], content_type: "image/jpeg") if params[:company][:logo][0][:file][:path].present?
    end
  render json: @company.as_json(only: ["id", "name", "phone_number", "rallying_cry", "fiscal_year_start", "timezone", "preferences", "display_format", "forum_type", "organisational_forum_type", "objectives_key_type"],
                                  methods: ["accountability_chart_content", "strategic_plan_content", "sso_emails_content", "logo_url", "current_fiscal_week", "current_fiscal_quarter", "quarter_for_creating_quarterly_goals", "current_fiscal_year", "year_for_creating_annual_initiatives", "fiscal_year_range", "current_quarter_start_date", "next_quarter_start_date", "forum_meetings_year_range", "forum_intro_video", "forum_types", "objectives_key_types"],
                                  include: {
                                    core_four: { methods: ["core_1_content", "core_2_content", "core_3_content", "core_4_content"] },
                                    sign_up_purpose: { only: ["purpose"] },
                                  })
  end

  def get_onboarding_company
    user_company_enablements = UserCompanyEnablement.where(user_id: current_user.id)
    @onboarding_company = Company.where(id: user_company_enablements.pluck(:company_id), onboarding_status: :incomplete).last
    render json: @onboarding_company.as_json(only: ["id", "name", "phone_number", "rallying_cry", "fiscal_year_start", "timezone", "preferences", "display_format", "forum_type", "organisational_forum_type", "objectives_key_type"],
                                        methods: ["accountability_chart_content", "strategic_plan_content", "sso_emails_content", "current_fiscal_quarter", "logo_url", "quarter_for_creating_quarterly_goals", "current_fiscal_year", "year_for_creating_annual_initiatives", "fiscal_year_range", "current_quarter_start_date", "next_quarter_start_date", "forum_meetings_year_range", "forum_intro_video", "forum_types"],
                                        include: {
                                          core_four: { methods: ["core_1_content", "core_2_content", "core_3_content", "core_4_content"] },
                                          sign_up_purpose: { only: ["purpose"] },
                                        })
  end

  def create_or_update_onboarding_goals
    begin
      # Lynchpyn Goal aka Rallying Cry
      @onboarding_company.update!(rallying_cry: params[:rallying_cry])

      # Annual Objective aka Annual Initiative
      annual_initiative = AnnualInitiative.where(company_id: @onboarding_company.id,
                                                 created_by: current_user,
                                                 owned_by: current_user,
                                                 fiscal_year: @onboarding_company.set_four_week_end_of_year_offset(@onboarding_company.year_for_creating_annual_initiatives),
                                                 context_description: "",
                                                 importance: ["", "", ""]).first_or_initialize
      annual_initiative.update!(description: params[:annual_initiative][:description])

      # Quarterly Initiative aka Quarterly Goal
      @quarterly_goal = QuarterlyGoal.where(
        created_by: current_user,
        owned_by: current_user,
        annual_initiative_id: annual_initiative.id,
        context_description: "",
        importance: ["", "", ""],
        quarter: @onboarding_company.quarter_for_creating_quarterly_goals,
      ).first_or_initialize
      @quarterly_goal.update!(description: params[:annual_initiative][:quarterly_goals][0][:description])

      # Weekly Milestones aka Milestones
      if @quarterly_goal.milestones.blank?
        @quarterly_goal.create_milestones_for_quarterly_goal(current_user, @onboarding_company)
        @quarterly_goal.reload
      end

      @milestone = @quarterly_goal.milestones.first
      onboarding_milestone = params[:annual_initiative][:quarterly_goals][0][:milestones][0]
      onboarding_key_element = params[:annual_initiative][:quarterly_goals][0][:key_elements][0]
      @milestone.update!(description: onboarding_milestone[:description])
      KeyElement.create!(elementable: @quarterly_goal,
                  value: onboarding_key_element[:value], completion_type: onboarding_key_element[:completion_type],
                  greater_than: onboarding_key_element[:greater_than],
                  owned_by_id: onboarding_key_element[:owned_by],
                  completion_target_value: onboarding_key_element[:completion_target_value])
                  
      @annual_initiative = annual_initiative.as_json(only: [:id, :created_by, :owned_by, :importance, :description, :key_elements, :company_id, :context_description, :fiscal_year],
                                                     include: {
                                                       quarterly_goals: {
                                                         only: [:id, :annual_initiative_id, :importance, :description, :key_elements, :company_id, :context_description, :quarter],
                                                         methods: [:owned_by, :created_by],
                                                         include: {
                                                           milestones: {
                                                             only: [:id, :milestoneable_id, :milestoneable_type, :description, :week, :status, :week_of],
                                                             methods: [:created_by],
                                                           },
                                                         },
                                                       },
                                                     })

      render json: { rallying_cry: @onboarding_company.rallying_cry, annual_initiative: @annual_initiative }
    rescue StandardError => e
      render json: { message: "Please complete all the questions before proceeding to next or choose to skip this altogether." }, status: :bad_request
    end
  end

  def get_onboarding_goals
    @rallying_cry = @onboarding_company.rallying_cry
    annual_initiative = AnnualInitiative.find_by(company_id: @onboarding_company.id)
    @quarterly_goal = QuarterlyGoal.where(annual_initiative: annual_initiative).first
    @milestone = Milestone.where(quarterly_goal: @quarterly_goal).first
    @annual_initiative = annual_initiative.as_json(only: [:id, :created_by, :owned_by, :importance, :description, :key_elements, :company_id, :context_description, :fiscal_year],
                                                   include: {
                                                     quarterly_goals: {
                                                       only: [:id, :annual_initiative_id, :importance, :description, :key_elements, :company_id, :context_description, :quarter],
                                                       methods: [:owned_by, :created_by],
                                                       include: {
                                                         milestones: {
                                                           only: [:id, :milestoneable_id, :milestoneable_type, :description, :week, :status, :week_of],
                                                           methods: [:created_by],
                                                         },
                                                       },
                                                     },
                                                   })
    render json: { annual_initiative: @annual_initiative, rallying_cry: @rallying_cry }
  end

  def create_or_update_onboarding_key_activities
    params[:key_activities].each do |ka|
      if ka[:id].present?
        KeyActivity.find(ka[:id]).update!(description: ka[:description])
      else
        KeyActivity.create(user_id: current_user.id, company_id: @onboarding_company.id, description: ka[:description])
      end
    end
    @key_activities = KeyActivity.where(company_id: @onboarding_company.id, user_id: current_user.id)
    render json: @key_activities.as_json(only: [:id, :description])
  end

  def get_onboarding_key_activities
    @key_activities = KeyActivity.where(company_id: @onboarding_company.id, user_id: current_user.id)
    render json: @key_activities.as_json(only: [:id, :description])
  end

  def create_or_update_onboarding_team
    @team = Team.where(company_id: @onboarding_company.id).first

    if Team.where(company_id: @onboarding_company.id).first.blank? 
     @team = Team.create!(company_id: @onboarding_company.id, name: params[:team_name], settings: {})
    end
    @team.set_default_executive_team if Team.where(company_id: @team.company.id, executive: 1).blank?
    @team.set_default_avatar_color
    authorize @team

    TeamUserEnablement.create!(team_id: @team.id, user_id: current_user.id, role: 1)
    if params[:emails].present?
      @email_addresses = params[:emails].split(",")
      @email_addresses.each do |email|
        sanitized_email = email.strip
        if User.find_by_email(sanitized_email).blank?
          @user = User.create!({
            email: sanitized_email,
            company_id: @onboarding_company.id,
            default_selected_company_id: @onboarding_company.id,
            title: "",
            password: ENV["DEFAULT_PASSWORD"] || "password",
          })
          @user.invite!
          @user.assign_attributes({
            user_company_enablements_attributes: [{
              user_id: @user.id,
              company_id: @onboarding_company.id,
              user_title: @user.title,
              user_role_id: UserRole.find_by_name("Employee").id,
            }],
            team_user_enablements_attributes: team_user_enablement_attribute_parser([@team], @user),
          })
          @user.save(validate: false)
        end
      end
    end
   @onboarding_company.update!(onboarding_status: "complete")
    render json: @team
  end

  def update_logo
    @company.logo.attach(params[:logo])
    render json: { logo_url: @company.logo_url }
  end

  def delete_logo
    @company.logo.purge_later
    render json: { logo_url: nil }
  end

  private

  def company_params
    #user should not be allowed to update the display_format once created
    params.require(:company).permit(:name, :timezone, :fiscal_year_start, :forum_type, :objectives_key_type, :rallying_cry, preferences: [:foundational_four, :company_objectives, :personal_objectives] , sign_up_purpose_attributes: [:purpose], core_four_attributes: [:core_1, :core_2, :core_3, :core_4], company_static_datas_attributes: [:id, :value], description_templates_attributes: [:id, :title, :body])
  end

  def set_company
    @company = params[:id] == "default" ? current_company : Company.find(params[:id])
    authorize @company
  end

  def set_onboarding_company
    @onboarding_company = Company.find(params[:company_id])
    authorize @onboarding_company
  end

  def decode_logo
  end
  def record_activities
      record_activity(params[:note], nil, params[:id])
  end 
end
