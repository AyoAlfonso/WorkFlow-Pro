Rails.application.routes.draw do
  # devise_for :users, defaults: {format: :json}
  devise_for :users,
             defaults: { format: :json },
             path: "",
             path_names: {
               sign_in: "api/users/sign_in",
               sign_out: "api/users/sign_out",
             },
             controllers: {
               sessions: "sessions",
               registrations: "registrations",
               invitations: "invitations",
             }, skip: [:confirmations, :passwords]

  devise_scope :user do
    get "/confirmation/new", to: "confirmations#new", format: :html, as: :new_user_confirmation
    get "/confirmation", to: "confirmations#show", format: :html, as: :user_confirmation
    post "/confirmation", to: "confirmations#create", format: :html, as: nil
    
    get "/passwords/edit", to: "devise/passwords#edit", format: :html, as: :edit_user_password
    patch "/password", to: "devise/passwords#update", format: :html, as: :user_password
    put "/password", to: "devise/passwords#update", format: :html, as: nil
    post "/password", to: "devise/passwords#create", format: :html, as: nil
  end

  devise_for :admin_users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  require "sidekiq/web"
  require "sidekiq-scheduler/web"
  Sidekiq::Web.use Rack::Auth::Basic do |username, password|
    ActiveSupport::SecurityUtils.secure_compare(
      ::Digest::SHA256.hexdigest(username), ::Digest::SHA256.hexdigest(ENV["SIDEKIQ_USERNAME"])
    ) &
    ActiveSupport::SecurityUtils.secure_compare(
      ::Digest::SHA256.hexdigest(password), ::Digest::SHA256.hexdigest(ENV["SIDEKIQ_PASSWORD"])
    )
  end if Rails.env.production?
  mount Sidekiq::Web => "/sidekiq"

  scope module: :api, path: :api do
    concern :paginatable do
      get '(page/:page)', action: :index, on: :collection, as: ''
    end
    resources :users, only: [:index, :create, :show, :update, :destroy] do
      collection do
        patch "/reset_password", to: "users#reset_password"
      end
      member do
        patch "/resend_invitation", to: "users#resend_invitation"
      end
    end
    patch "/update_user_team_manager", to: "users#update_user_team_manager"
    patch "/update_user_team_lead_role", to: "users#update_user_team_lead_role"
  
    get "/profile", to: "users#profile"
    patch "/avatar", to: "users#update_avatar"
    delete "/avatar", to: "users#delete_avatar"
    patch "/update_company_first_time_access", to: "users#update_company_first_time_access"
    post "invite_users_to_company", to: "users#invite_users_to_company"

    get "/static_data", to: "application#load_static_data"

    resources :companies, only: [:create, :show, :update] do
      member do
        delete "logo", to: "companies#delete_logo"
        patch "logo", to: "companies#update_logo"
      end
    end

    get "/onboarding", to: "companies#get_onboarding_company"
    get "onboarding/:company_id/goals", to: "companies#get_onboarding_goals"
    post "/onboarding/:company_id/goals", to: "companies#create_or_update_onboarding_goals"
    get "/onboarding/:company_id/key_activities/", to: "companies#get_onboarding_key_activities"
    post "/onboarding/:company_id/key_activities", to: "companies#create_or_update_onboarding_key_activities"
    post "/onboarding/:company_id/team", to: "companies#create_or_update_onboarding_team"
    
    # issues
    resources :issues, only: [:index, :create, :update, :destroy]
    get "/issues/issues_for_meeting", to: "issues#issues_for_meeting"
    get "/issues/issues_for_team", to: "issues#issues_for_team"
    patch "/issues", to: "issues#resort_index"
    post '/issues/duplicate/:id', to: 'issues#duplicate'
    patch 'issues/toggle_vote/:id', to: 'issues#toggle_vote'

    # team_issues
    resources :team_issues, only: [:index, :update]

    # team_issue_meeting_enablements
    resources :team_issue_meeting_enablements, only: [:index]
   
    #key activities
    resources :key_activities, only: [:index, :create, :update, :destroy] do
      collection do
        patch "/update_multiple", to: "key_activities#update_multiple"
      end
    end
    get "/key_activities/show/:id", to: "key_activities#show"
    get "/key_activities/created_in_meeting", to: "key_activities#created_in_meeting"
    patch "/key_activities", to: "key_activities#resort_index"
    post '/key_activities/duplicate/:id', to: 'key_activities#duplicate'
    #labels
    resources :labels, only: [:index, :create]

    #goals
    get "/goals", to: "goals#index"

    #annual_initiatives
    resources :annual_initiatives, only: [:create, :show, :update, :destroy]
    post '/annual_initiatives/create_key_element/:id', to: 'annual_initiatives#create_key_element'
    post 'annual_initiatives/:id/update_key_element/:key_element_id',  to: 'annual_initiatives#update_key_element'
    patch '/annual_initiatives/close_initiative/:id', to: 'annual_initiatives#close_initiative'
    post '/annual_initiatives/duplicate/:id', to: 'annual_initiatives#duplicate'
    delete '/annual_initiatives/delete_key_element/:key_element_id', to: 'annual_initiatives#delete_key_element'
    get '/annual_initiatives/team/:team_id', to: "annual_initiatives#team"

    #quarterly_goals
    resources :quarterly_goals, only: [:index, :create, :show, :update, :destroy]
    post '/quarterly_goals/create_key_element/:id', to: 'quarterly_goals#create_key_element'
    post 'quarterly_goals/:id/update_key_element/:key_element_id',  to: 'quarterly_goals#update_key_element'
    patch '/quarterly_goals/close_goal/:id', to: 'quarterly_goals#close_goal'
    post '/quarterly_goals/duplicate/:id', to: 'quarterly_goals#duplicate'
    delete '/quarterly_goals/delete_key_element/:key_element_id', to: 'quarterly_goals#delete_key_element'
    post '/quarterly_goals/create_milestones/:id', to: 'quarterly_goals#create_milestones'

    #sub_initiatives
    resources :sub_initiatives, only: [:create, :show, :update, :destroy]
    post '/sub_initiatives/create_key_element/:id', to: 'sub_initiatives#create_key_element'
    post 'sub_initiatives/:id/update_key_element/:key_element_id',  to: 'quarterly_goals#update_key_element'
    patch '/sub_initiatives/close_goal/:id', to: 'sub_initiatives#close_goal'
    delete '/sub_initiatives/delete_key_element/:key_element_id', to: 'sub_initiatives#delete_key_element'
    post '/sub_initiatives/create_milestones/:id', to: 'sub_initiatives#create_milestones'

    #habits
    resources :habits, only: [:index, :create, :update, :destroy] do
      resources :habit_logs, only: [:update], param: :log_date
    end
    get "/habits/show_habit/:id", to: "habits#show_habit"
    get "/habits/habits_for_personal_planning", to: "habits#habits_for_personal_planning"

    #key_performance_indicators
    resources :key_performance_indicator, only: [:index, :show, :create, :update, :destroy]
    patch '/key_performance_indicator/toggle_status/:id', to: 'key_performance_indicator#toggle_status'

    #scorecards
    get "/scorecard/:owner_type/:owner_id", to: "scorecard_logs#show"
    get "scorecard_logs/:id", to: "scorecard_logs#show_scorecard_from_log"
    resources :scorecard_logs, only: [:create, :destroy]

    #objective_logs
    resources :objective_logs, only: [:create, :destroy], concerns: :paginatable

    #comment_logs
    resources :comment_logs, only: [:create, :destroy], concerns: :paginatable
    
    #questionnaires
    resources :questionnaires, only: [:index]

    #questionnaire_attempts
    resources :questionnaire_attempts, only: [:create]
    get "questionnaire_attempts/questionnaire_summary", to: "questionnaire_attempts#questionnaire_summary"

    #teams
    resources :teams, only: [:index, :show, :update, :destroy]
    post "/create_team_and_invite_users", to: "teams#create_team_and_invite_users"

    #meetings
    resources :meetings, only: [:create, :index, :update, :destroy, :show] do
      get :search, on: :collection
      get :search_section_1_meetings, on: :collection
      patch :start_next_for, on: :collection
    end
    get "/meetings/team_meetings/:id", to: "meetings#team_meetings"

    #forum-specific functions
    post "/forum/create_meetings_for_year/:forum_type", to: "forums#create_meetings_for_year"
    get "/forum/search_meetings_by_date_range/:meeting_type", to: "forums#search_meetings_by_date_range"

    #meeting recap for team
    get "/teams/:team_id/meetings/:id/meeting_recap", to: "meetings#meeting_recap"

    #meeting_templates
    resources :meeting_templates, only: [:index]

    resources :check_in_templates, only: [:index, :create, :show, :update, :destroy]
    post "check_in_templates/run/:id", to: "check_in_templates#run_now"
    post "check_in_templates/publish/:id", to: "check_in_templates#publish_now"
    get "general_check_in",  to: "check_in_templates#general_check_in"
    get "check_in_templates_report/:id", to: "check_in_templates#report"
    patch "check_in_templates/artifact/:id",  to: "check_in_templates#artifact" #can be used to skip an artifact, and update the artifact 

    resources :check_in_artifact, only: [:show]
    #description_templates
    resources :description_templates, only: [:index, :destroy, :show]
    post "/description_templates/create_templates", to: "description_templates#update_or_create_templates"
    patch "/description_templates/update_templates", to: "description_templates#update_template_body"

    #notifications
    resources :notifications, only: [:index, :update]

    #milestones
    resources :milestones, only: [:update]
    get "/milestones/milestones_for_meeting", to: "milestones#milestones_for_meeting"
    get '/milestones/check_in/:due_date', to: "milestones#check_in_goals"

    #key_element
    resources :key_elements, only: [:show, :update]
    get '/key_elements/check_in', to: "key_elements#check_in_key_elements"

    #user_pulses
    get "user_pulse_by_date", to: "user_pulses#user_pulse_by_date"
    post "/update_user_pulse", to: "user_pulses#create_or_update"

    #daily_logs
    resources :daily_logs, only: [:index]

    resources :audit_logs, only: [:index], concerns: :paginatable

    resources :journal_entries, only: [:update, :destroy]
    #summaries
    get "/journals", to: "summaries#journals_by_date"
    get "/notes", to: "summaries#meetings_by_date"
  end

  scope path: :auth do
   post "microsoft_oauth2/callback", to: "authorization#microsoft_oauth2"
   post "go_oauth2/callback", to: "authorization#google_oauth2"
  end
  scope module: :integrations, path: :integrations do
    #pabbly_subscriptions
    post "/pabbly_subscriptions", to: "pabbly_subscriptions#create_company_and_user"

  end

  root "react_app#index"
  get "/*path", to: "react_app#index", format: false, constraints: ->(req) { !req.path.include?("/rails") }
end
