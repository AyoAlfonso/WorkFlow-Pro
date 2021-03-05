Rails.application.routes.draw do
  # devise_for :users, defaults: {format: :json}
  devise_for :users,
  defaults: {format: :json},
  path: '',
  path_names: {
    sign_in: 'api/users/sign_in',
    sign_out: 'api/users/sign_out'
  },
  controllers: {
    sessions: 'sessions',
    registrations: 'registrations'
  }, skip: [:confirmations, :passwords]

  devise_scope :user do
    get '/confirmation/new', to: 'confirmations#new', format: :html, as: :new_user_confirmation
    get '/confirmation', to: 'confirmations#show', format: :html, as: :user_confirmation
    post '/confirmation', to: 'confirmations#create', format: :html, as: nil


    get '/passwords/edit', to: 'devise/passwords#edit', format: :html, as: :edit_user_password
    patch '/password', to: 'devise/passwords#update', format: :html, as: :user_password
    put '/password', to: 'devise/passwords#update', format: :html, as: nil
    post '/password', to: 'devise/passwords#create', format: :html, as: nil
  end


  devise_for :admin_users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  require 'sidekiq/web'
  require 'sidekiq-scheduler/web'
  Sidekiq::Web.use Rack::Auth::Basic do |username, password|
    ActiveSupport::SecurityUtils.secure_compare(
      ::Digest::SHA256.hexdigest(username), ::Digest::SHA256.hexdigest(ENV['SIDEKIQ_USERNAME'])
    ) &
    ActiveSupport::SecurityUtils.secure_compare(
      ::Digest::SHA256.hexdigest(password), ::Digest::SHA256.hexdigest(ENV['SIDEKIQ_PASSWORD'])
    )
  end if Rails.env.production?
  mount Sidekiq::Web => '/sidekiq'

  scope module: :api, path: :api do
    resources :users, only: [:index, :create, :show, :update, :destroy] do
      collection do
        patch '/reset_password', to: "users#reset_password"
      end
      member do
        patch '/resend_invitation', to: "users#resend_invitation"
      end
    end
    patch '/update_user_team_role', to: 'users#update_team_role'
    get '/profile', to: 'users#profile'
    patch '/avatar', to: 'users#update_avatar'
    delete '/avatar', to: 'users#delete_avatar'
    patch '/update_company_first_time_access', to: 'users#update_company_first_time_access'
    post 'invite_users_to_company', to: 'users#invite_users_to_company'

    resources :companies, only: [:show, :update] do
      member do
        delete 'logo', to: 'companies#delete_logo'
        patch 'logo', to: 'companies#update_logo'
      end
    end

    # issues
    resources :issues, only: [:index, :create, :update, :destroy]
    get '/issues/issues_for_meeting', to: "issues#issues_for_meeting"
    get '/issues/issues_for_team', to: "issues#issues_for_team"
    patch '/issues', to: "issues#resort_index"

    # team_issues
    resources :team_issues, only: [:index, :update]

    # team_issue_meeting_enablements
    resources :team_issue_meeting_enablements, only: [:index]

    #key activities
    resources :key_activities, only: [:index, :create, :update, :destroy]
    get '/key_activities/created_in_meeting', to: "key_activities#created_in_meeting"
    patch '/key_activities', to: "key_activities#resort_index"

    #labels
    resources :labels, only: [:index, :create]

    #goals
    get '/goals', to: 'goals#index'

    #annual_initiatives
    resources :annual_initiatives, only: [:create, :show, :update, :destroy]
    post '/annual_initiatives/create_key_element/:id', to: 'annual_initiatives#create_key_element'
    get '/annual_initiatives/team/:team_id', to: "annual_initiatives#team"

    #quarterly_goals
    resources :quarterly_goals, only: [:index, :create, :show, :update, :destroy]
    post '/quarterly_goals/create_key_element/:id', to: 'quarterly_goals#create_key_element'
    post '/quarterly_goals/create_milestones/:id', to: 'quarterly_goals#create_milestones'

    #habits
    resources :habits, only: [:index, :create, :update, :destroy] do
      resources :habit_logs, only: [:update], param: :log_date
    end
    get '/habits/show_habit/:id', to: 'habits#show_habit'
    get '/habits/habits_for_personal_planning', to: 'habits#habits_for_personal_planning'
   
    #questionnaires
    resources :questionnaires, only: [:index]

    #questionnaire_attempts
    resources :questionnaire_attempts, only: [:create]
    get 'questionnaire_attempts/questionnaire_summary', to: 'questionnaire_attempts#questionnaire_summary'

    #teams
    resources :teams, only: [:index, :show, :update]
    post '/create_team_and_invite_users', to: 'teams#create_team_and_invite_users'
    
    #meetings
    resources :meetings, only: [:create, :index, :update, :destroy, :show] do
      get :search, on: :collection
      get :search_section_1_meetings, on: :collection
      patch :start_next_for, on: :collection
    end
    get '/meetings/team_meetings/:id', to: 'meetings#team_meetings'
  
    #forum-specific functions
    post '/forum/create_meetings_for_year', to: 'forums#create_meetings_for_year'
    get '/forum/search_meetings_by_date_range', to: 'forums#search_meetings_by_date_range'
    
    #meeting recap for team
    get '/teams/:team_id/meetings/:id/meeting_recap', to: 'meetings#meeting_recap'

    #meeting_templates
    resources :meeting_templates, only: [:index]
    
    #notifications
    resources :notifications, only: [:index, :update]

    #milestones
    resources :milestones, only: [:update]
    get '/milestones/milestones_for_meeting', to: "milestones#milestones_for_meeting"

    #summaries
    get '/journals', to: 'summaries#questionnaire_attempts_by_date'
    get '/notes', to: 'summaries#meetings_by_date'

  end


  root 'react_app#index'
  get "/*path", to: "react_app#index", format: false, constraints: -> (req) { !req.path.include?("/rails") }
end
