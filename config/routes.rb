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
  }

  devise_for :admin_users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html


  scope module: :api, path: :api do
    resources :users, only: [:index, :show]
    get '/profile', to: 'users#profile'
    resources :companies, only: [:show]

    # issues
    resources :issues, only: [:index, :create, :update, :destroy]

    #key activities
    resources :key_activities, only: [:index, :create, :update, :destroy]

    #goals
    get '/goals', to: 'goals#index'
  end
  

  root 'react_app#index'
  get "/*path", to: "react_app#index", format: false
end
