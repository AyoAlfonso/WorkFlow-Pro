ActiveAdmin.register User do
  permit_params :first_name, :last_name, :email, :password, :password_confirmation, :timezone, :company_id, :user_role_id, user_company_enablements_attributes: [:id, :company_id, :user_role_id, :user_title], product_features_attributes: [:id, :pyns, :objective, :team, :meeting, :company]

  config.sort_order = "last_name_asc"

  member_action :resend_confirmation, method: :post do
    resource.send_confirmation_instructions
    redirect_to resource_path, notice: "Confirmation e-mail resent!"
  end

  member_action :resend_invitation, method: :post do
    resource.invite!
    redirect_to resource_path, notice: "Invitation e-mail resent!"
  end

  controller do
    def create
      if User.find_by_email(permitted_params.dig(:user, :email)).present?
        @user = User.create(permitted_params[:user])
        flash[:alert] = @user.errors.full_messages
        render "new"
        return
      end

      @user = User.invite!(permitted_params[:user].merge(default_selected_company_id: permitted_params.dig(:user, :user_company_enablements_attributes, "0", :company_id)))
      if @user.valid?
        redirect_to resource_path(@user), notice: "User created!"
      else
        flash[:alert] = @user.errors.full_messages
        render "new"
      end
    end

    def update
      @user = User.find(params[:id])
      # pp params
      if @user.update!(params.require(:user).permit(:first_name, :last_name, :email, :user_role, :timezone, user_company_enablements_attributes: [:id, :company_id, :user_role_id, :user_title, :_destroy], product_features_attributes: [:id, :pyns, :objective, :team, :meeting, :company]))
        flash[:alert] = @user.errors.full_messages
        render "show"
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
      user.companies.map { |c| c.name }.join(",")
    end
    column :current_sign_in_at
    column :sign_in_count
    column :created_at
    column :confirmed_at
    column :invitation_sent_at
    actions defaults: true do |user|
      if (!user.confirmed? && user.invited_to_sign_up?)
        link_to("Re-send invitation", resend_invitation_admin_user_path(user), method: :post, format: :json, class: "member_link")
      elsif (!user.confirmed? && !user.invited_to_sign_up?)
        link_to("Re-send confirmation", resend_confirmation_admin_user_path(user), method: :post, format: :json, class: "member_link")
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

    panel "Companies" do
      table_for user.user_company_enablements, label: "Companies" do
        column("Name") { |uce| link_to uce.company.name, admin_company_path(uce.company) }
        column("User Role") { |uce| uce.user_role&.name }
        column("User Title") { |uce| uce.user_title }
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
      f.input :timezone, as: :select, collection: timezones
      f.has_many :product_features, header: "Add Product Features", allow_destroy: false, new_record: user.product_features.empty? do |feature|
        if (user.product_features.exists?)
          user.product_features.each do |product_sub|
            feature.input :pyns, as: :boolean, :checked_value => true, :unchecked_value => false, input_html: { :checked => product_sub[:pyns] }
            feature.input :objective, as: :boolean, :checked_value => true, :unchecked_value => false, input_html: { :checked => product_sub[:objective] }
            feature.input :team, as: :boolean, :checked_value => true, :unchecked_value => false, input_html: { :checked => product_sub[:team] }
            feature.input :meeting, as: :boolean, :checked_value => true, :unchecked_value => false, input_html: { :checked => product_sub[:meeting] }
            feature.input :company, as: :boolean, :checked_value => true, :unchecked_value => false, input_html: { :checked => product_sub[:company] }
          end
        else
          feature.input :pyns, as: :boolean, :checked_value => true, :unchecked_value => false
          feature.input :objective, as: :boolean, :checked_value => true, :unchecked_value => false
          feature.input :team, as: :boolean, :checked_value => true, :unchecked_value => false
          feature.input :meeting, as: :boolean, :checked_value => true, :unchecked_value => false
          feature.input :company, as: :boolean, :checked_value => true, :unchecked_value => false
        end
      end

      f.has_many :user_company_enablements, allow_destroy: true do |uce|
        if uce.object&.persisted?
          uce.input :company, as: :select, collection: Company.all, input_html: { disabled: true }
        else
          uce.input :company, as: :select, collection: Company.all
        end
        uce.input :user_role, as: :select, collection: UserRole.all
        uce.input :user_title
      end

      br
    end
    f.actions
  end
end
