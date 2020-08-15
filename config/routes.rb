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
    sessions: 'sessions'
  }, skip: [:confirmations]

  devise_scope :user do
    get '/confirmation/new', to: 'confirmations#new', format: :html, as: :new_user_confirmation
    get '/confirmation', to: 'confirmations#show', format: :html, as: :user_confirmation
    post '/confirmation', to: 'confirmations#create', format: :html, as: nil
  end


  devise_for :admin_users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html


  scope module: :api, path: :api do
    resources :users, only: [:index, :create, :show, :update] do
      member do
        patch '/resend_invitation', to: "users#resend_invitation"
      end
    end
    get '/profile', to: 'users#profile'
    patch '/avatar', to: 'users#update_avatar'
    delete '/avatar', to: 'users#delete_avatar'

    resources :companies, only: [:show, :update] do
      member do
        delete 'logo', to: 'companies#delete_logo'
        patch 'logo', to: 'companies#update_logo'
      end
    end

    # issues
    resources :issues, only: [:index, :create, :update, :destroy]

    #key activities
    resources :key_activities, only: [:index, :create, :update, :destroy]

    #goals
    get '/goals', to: 'goals#index'

    #annual_initiatives
    resources :annual_initiatives, only: [:create, :show, :update, :destroy]
    post '/annual_initiatives/create_key_element/:id', to: 'annual_initiatives#create_key_element'

    #quarterly_goals
    resources :quarterly_goals, only: [:index, :create, :show, :update, :destroy]
    post '/quarterly_goals/create_key_element/:id', to: 'quarterly_goals#create_key_element'
    post '/quarterly_goals/create_milestones/:id', to: 'quarterly_goals#create_milestones'

    #habits
    resources :habits, only: [:index, :create, :update, :destroy] do
      resources :habit_logs, only: [:update], param: :log_date
    end

    #questionnaires
    resources :questionnaires, only: [:index]

    #questionnaire_attempts
    resources :questionnaire_attempts, only: [:create]
    
    #teams
    resources :teams, only: [:index]

    #meetings
    resources :meetings, only: [:create]

  end


  root 'react_app#index'
  get "/*path", to: "react_app#index", format: false, constraints: -> (req) { !req.path.include?("/rails") }
end
