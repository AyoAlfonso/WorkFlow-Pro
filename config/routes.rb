Rails.application.routes.draw do
  get 's3/direct_post'
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
    resources :users, only: [:index, :show]
    get '/profile', to: 'users#profile'
    put '/avatar', to: 'users#update_avatar'
    resources :companies, only: [:show]

    # issues
    resources :issues, only: [:index, :create, :update, :destroy]

    #key activities
    resources :key_activities, only: [:index, :create, :update, :destroy]

    #goals
    get '/goals', to: 'goals#index'

    #annual_initiatives
    resources :annual_initiatives, only: [:create, :show, :update, :destroy]

    #quarterly_goals
    resources :quarterly_goals, only: [:index, :create, :show, :update, :destroy]
  end


  root 'react_app#index'
  get "/*path", to: "react_app#index", format: false, constraints: -> (req) { !req.path.include?("/rails") }
end
