ActiveAdmin.register User do
  permit_params :email, :password, :password_confirmation

  config.sort_order = 'last_name_asc'

  index do
    selectable_column
    id_column
    column :first_name
    column :last_name
    column :email
    column :phone_number
    column :company_name do |user|
      user.company_name
    end
    column :current_sign_in_at
    column :sign_in_count
    column :created_at
    actions
  end

  filter :email
  filter :current_sign_in_at
  filter :sign_in_count
  filter :created_at

  show do
    h1 user.full_name
    attributes_table do
      row("Company Name") { |user| link_to user.company_name, admin_company_path(user.company) }
      row :first_name
      row :last_name
      row :email
      row :phone_number
      row :personal_vision
      row :current_sign_in_at
      row :last_sign_in_at
      row :sign_in_count
      row :created_at
    end
  end
  form do |f|
    f.inputs do
      f.input :email
      f.input :password
      f.input :password_confirmation
    end
    f.actions
  end

end