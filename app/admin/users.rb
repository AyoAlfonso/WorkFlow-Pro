ActiveAdmin.register User do
  permit_params :first_name, :last_name, :email, :password, :password_confirmation, :timezone, :company_id, :user_role_id

  config.sort_order = 'last_name_asc'

  member_action :resend_confirmation, method: :post do
    resource.send_confirmation_instructions
    redirect_to resource_path, notice: 'Confirmation e-mail resent!'
  end

  member_action :resend_invitation, method: :post do
    resource.invite!
    redirect_to resource_path, notice: 'Invitation e-mail resent!'
  end

  controller do
    def create
      if User.find_by_email(permitted_params.dig(:user, :email)).present?
        @user = User.create(permitted_params[:user])
        render 'new', errors: @user.errors.full_messages
        return
      end

      @user = User.invite!(permitted_params[:user])
      if @user.valid?
        redirect_to resource_path(@user), notice: "User created!"
      else
        render 'new', errors: @user.errors.full_messages
      end
    end

    def update
      @user = User.find(params[:id])
      if @user.update!(params.require(:user).permit(:first_name, :last_name, :email, :user_role, :timezone, company_ids: []))
        render 'show', errors: @user.errors.full_messages
      end
    end

  end

  index do
    selectable_column
    id_column
    column :first_name
    column :last_name
    column :email
    column :phone_number
    column :company_name do |user|
      user.companies.first
    end
    column :current_sign_in_at
    column :sign_in_count
    column :created_at
    column :confirmed_at
    column :invitation_sent_at
    actions defaults: true do |user|
      if (!user.confirmed? && user.invited_to_sign_up?)
        link_to("Re-send invitation", resend_invitation_admin_user_path(user), method: :post, format: :json, class: 'member_link' )
      elsif (!user.confirmed? && !user.invited_to_sign_up?)
        link_to("Re-send confirmation", resend_confirmation_admin_user_path(user), method: :post, format: :json, class: 'member_link' )
      end
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
      row :timezone
      row :avatar do |user|
        user.try(:avatar_url) ? image_tag(user.avatar_url) : "No Avatar Set"
      end
      row :personal_vision
      row :current_sign_in_at
      row :last_sign_in_at
      row :sign_in_count
      row :created_at
      row :confirmed_at
      row :invitation_sent_at
    end

    panel 'Companies' do
      table_for user.companies do
        column("Name") { |company| link_to company.name, admin_company_path(company) }
        column :contact_email
        column :phone_number
        column :display_format
      end
    end

  end

  form do |f|
    f.inputs do
      f.input :first_name
      f.input :last_name
      f.input :email
      # f.input :password
      # f.input :password_confirmation
      f.input :user_role, as: :select, collection: UserRole.all
      f.input :timezone, as: :select, collection: timezones
      f.input :companies, as: :select, collection: Company.all.map { |cp| [cp.name, cp.id] }, input_html: { class: "select2" }
    end
    f.actions
  end

end
