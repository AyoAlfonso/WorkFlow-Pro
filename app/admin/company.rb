ActiveAdmin.register Company do
  permit_params :address,
                :contact_email,
                :fiscal_year_start,
                :name,
                :logo,
                :phone_number,
                :rallying_cry,
                # :accountability_chart,
                :accountability_chart_embed,
                # :strategic_plan,
                :strategic_plan_embed,
                :sso_emails_embed,
                :timezone,
                :display_format,
                :forum_type,
                :organisational_forum_type,
                :onboarding_status,
                core_four_attributes: [:id, :core_1, :core_2, :core_3, :core_4, :_destroy],
                company_static_datas_attributes: [:id, :value,  :_destroy],
                description_templates_attributes: [:id, :title, :body, :_destroy] 

  index do
    selectable_column
    id_column
    column :name
    column :address
    column :contact_email
    column :phone_number
    column :display_format
    column :onboarding_status
    column "#{t("rallying_cry")}", :rallying_cry
    actions
  end

  filter :name
  filter :address
  filter :contact_email
  filter :phone_number

  controller do
   def update 
      @company = Company.find(params[:id])
      @core_four_attributes = params[:company][:core_four_attributes]
      if @core_four_attributes.present?
        # upgrade how you derive array here, it should be tied to the comp model 
        [*1..4].each do |core| 
         params[:company][:core_four_attributes]["core_#{core}" ] = @core_four_attributes["core_#{core}_content"]
        end
      end

      @description_templates = params[:company][:description_templates_attributes]
      if @description_templates.present?
          @company.description_templates.each_with_index do |description_template, index|
            puts index
             params[:company][:description_templates_attributes][index.to_s]["body"] = @description_templates[index.to_s][:body_content]
          end
      end

      @team = Team.where(company_id:@company.id).first
          if Team.where(company_id: @company.id).first.blank? 
            @team = Team.create!(company_id: @company.id, name: "#{company.name} Team", settings: {})
            @team.set_default_executive_team if Team.where(company_id: @team.company.id, executive: 1).blank?
            @team.set_default_avatar_color
          end

      if params[:company][:sso_emails_embed].present?
        @new_sso_emails = params[:company][:sso_emails_embed].split(",").compact.map(&:strip).reverse.uniq
        @new_sso_emails.each do |email|
          sanitized_email = email.strip
          if !sanitized_email.empty? && User.find_by_email(sanitized_email).blank?
            @user = User.create!({
              email: sanitized_email,
              company_id: @company.id,
              default_selected_company_id: @company.id,
              title: "",
              confirmed_at: Time.now,
              password: Devise.friendly_token[0,20],
              provider: "no_auth"
            })
            @user.assign_attributes({
              user_company_enablements_attributes: [{
                user_id: @user.id,
                company_id: @company.id,
                user_title: @user.title,
                user_role_id: UserRole.find_by_name("Employee").id,
              }],
            })
            @user.save(validate: false)
          end
      
        end
      end

       params[:company][:sso_emails_embed] = @new_sso_emails&.join(",")
       if @company.update!(params.require(:company).permit(:address,:contact_email,:fiscal_year_start,:name,
                :logo,
                :phone_number,
                :rallying_cry,
                :accountability_chart_embed,
                :strategic_plan_embed,
                :timezone,
                :sso_emails_embed,
                :display_format,
                :forum_type,
                :organisational_forum_type,
                :onboarding_status,
                core_four_attributes: [:id, :core_1, :core_2, :core_3, :core_4],
                company_static_datas_attributes: [:id, :value],
                description_templates_attributes: [:id, :title, :body]))
        flash[:alert] = @company.errors.full_messages
         redirect_to admin_company_path(@company), notice: "Company updated"
      end
   end
  end
  

  show do
    h1 company.name
    attributes_table do
      row :logo do |company|
        company.try(:logo_url) ? image_tag(company.logo_url, style: "max-height: 100px;") : "No Company Logo Set"
      end
      row :address
      row :contact_email
      row :phone_number
      row "#{t("rallying_cry")}", :rallying_cry
      row :fiscal_year_start do |c|
        c.format_fiscal_year_start
      end
      row :timezone
      row :display_format
      row :forum_type
      row :organisational_forum_type
    end
    br
    panel "#{I18n.t("core_four")}" do
      attributes_table_for company.core_four do
        row :core_1 do |cf|
          cf.core_1.body
        end
        row :core_2 do |cf|
          cf.core_2.body
        end
        row :core_3 do |cf|
          cf.core_3.body
        end
        row :core_4 do |cf|
          cf.core_4.body
        end
      end
    end
    br
    panel "Users" do
      table_for company.users do
        column("Full Name") { |user| link_to user.full_name, admin_user_path(user) }
        column :email
        column :phone_number
        column :current_sign_in_at
        column :sign_in_count
        column :created_at
      end
    end
    panel "#{I18n.t("accountability_chart")}" do
      attributes_table_for company do
        row :accountability_chart do |c|
          if c.accountability_chart_embed.present?
            raw(c.accountability_chart_embed)
          end
        end
      end
    end
    panel "Strategic Plan" do
      attributes_table_for company do
        row :strategic_plan do |c|
          if c.strategic_plan_embed.present?
            raw(c.strategic_plan_embed)
          end
        end
      end
    end
    panel "#{I18n.t("sso_emails")}" do
      attributes_table_for company do
        row :sso_emails do |c|
          if c.sso_emails_embed.present?
            raw(c.sso_emails_embed)
          end
        end
      end
    end
  end

  form do |f|
    h1 f.object.name
    f.inputs "Company Details" do
      f.input :name
      f.input :logo, as: :file, hint: (f.object.try(:logo_url).present? ? image_tag(f.object.logo_url) : "Please set logo")
      f.input :address
      f.input :contact_email
      f.input :phone_number
      f.input :rallying_cry, input_html: { rows: 5 }, label: "#{t("rallying_cry")}"
      f.input :fiscal_year_start, order: [:month, :day, :year], end_year: Date.current.year + 1
      f.input :timezone, as: :select, collection: timezones
      f.input :onboarding_status
      f.input :display_format, as: :select, collection: Company.display_formats.keys
      f.input :forum_type, as: :select, collection: Company.forum_types.keys
      f.input :organisational_forum_type,  as: :select, collection: Company.organisational_forum_types.keys

    end
    h2 "Foundational Four "
    f.inputs do
      # Some hackery because trix editor was only displaying one field otherwise in the has_many
      [:core_1, :core_2, :core_3, :core_4].each_with_index do |cf_field, index|
        f.label cf_field
        f.has_many :core_four, heading: false, allow_destroy: false, new_record: false do |cf|
          cf_value = index == 0 ?  :core_1_content : index == 1 ? :core_2_content :  index == 2 ? :core_3_content  :  index == 3 ? :core_4_content  : null
          cf.input cf_value, label: cf_field , as: :quill_editor,  input_html: {data: {options: { modules: { toolbar: [['bold', 'italic', 'underline'], ['link']] }, placeholder: 'Type something...', theme: 'snow' } } }
        end
      end
    end
    f.label "#{t(:accountability_chart)}"
    f.input :accountability_chart_embed, input_html: { rows: 5 }
    f.label :strategic_plan
    f.input :strategic_plan_embed, input_html: { rows: 5 }


   f.label "#{I18n.t("sso_emails")}"
   f.input :sso_emails_embed, input_html: { rows: 5 }

    f.inputs do
      f.has_many :company_static_datas, allow_destroy: false, new_record: false do |tu|
        tu.input :field, input_html: { disabled: true }
        tu.input :value
      end
    end

    f.inputs do
      f.has_many :description_templates, allow_destroy: false, new_record: false do |tu|
        tu.input :title, input_html: { disabled: true }
        tu.input :body_content, as: :quill_editor,  input_html: {data: {options: { modules: { toolbar: [['bold', 'italic', 'underline'], ['link']] }, placeholder: 'Type something...', theme: 'snow' } } }
      end
    end
    f.actions
  end
end
