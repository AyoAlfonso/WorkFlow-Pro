Rails.application.routes.draw do
  devise_for :users
  devise_for :admin_users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  root 'react_app#index'

  scope module: :api, path: :api do
    get '/users', to: 'users#index'

    # issues
    resources :issues, only: [:index, :create, :update, :destroy]

  end
end
