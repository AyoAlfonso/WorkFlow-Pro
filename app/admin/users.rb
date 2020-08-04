ActiveAdmin.register User do
  permit_params :first_name, :last_name, :email, :password, :password_confirmation, :timezone, :company_id, :user_role_id

  config.sort_order = 'last_name_asc'

  member_action :resend_confirmation do
    resource.send_confirmation_instructions
    redirect_to resource_path, notice: 'Confirmation e-mail resent!'
  end
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
    column :confirmed_at
    actions defaults: true do |user|
      link_to("Re-send confirmation", resend_confirmation_admin_user_path(user), class: 'member_link' ) if !user.confirmed? && !user.invited_to_sign_up?
    end
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
      row :timezone do |u|
        u.get_timezone
      end
      row :avatar do |user|
        user.try(:avatar_url) ? image_tag(user.avatar_url) : "No Avatar Set"
      end
      row :personal_vision
      row :current_sign_in_at
      row :last_sign_in_at
      row :sign_in_count
      row :created_at
      row :confirmed_at
    end
  end
  form do |f|
    f.inputs do
      f.input :first_name
      f.input :last_name
      f.input :email
      f.input :password
      f.input :password_confirmation
      f.input :company, as: :select, collection: Company.all
      f.input :user_role, as: :select, collection: UserRole.all
      f.input :timezone, as: :select, collection: timezones
    end
    f.actions
  end

end
