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
                :timezone,
                :display_format,
                core_four_attributes: [:id, :core_1, :core_2, :core_3, :core_4]

  index do
    selectable_column
    id_column
    column :name
    column :address
    column :contact_email
    column :phone_number
    column :display_format
    column "#{t("rallying_cry")}", :rallying_cry
    actions
  end

  filter :name
  filter :address
  filter :contact_email
  filter :phone_number

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
    end
    br
    panel "#{I18n.t('core_four')}" do
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
    panel 'Users' do
      table_for company.users do
        column('Full Name') { |user| link_to user.full_name, admin_user_path(user) }
        column :email
        column :phone_number
        column :current_sign_in_at
        column :sign_in_count
        column :created_at
      end
    end
    panel "#{I18n.t('accountability_chart')}" do
      attributes_table_for company do
        row :accountability_chart do |c|
          if c.accountability_chart_embed.present?
            raw(c.accountability_chart_embed)
          end
        end
      end
    end
    panel 'Strategic Plan' do
      attributes_table_for company do
        row :strategic_plan do |c|
          if c.strategic_plan_embed.present?
            raw(c.strategic_plan_embed)
          end
        end
      end
    end
  end

  form do |f|
    h1 f.object.name
    f.inputs 'Company Details' do
      f.input :name
      f.input :logo, as: :file, hint: (f.object.try(:logo_url).present? ? image_tag(f.object.logo_url) : "Please set logo")
      f.input :address
      f.input :contact_email
      f.input :phone_number
      f.input :rallying_cry, input_html: { rows: 5 }, label: "#{t("rallying_cry")}"
      f.input :fiscal_year_start, order: [:month, :day, :year], end_year: Date.current.year + 1
      f.input :timezone, as: :select, collection: timezones
      f.input :display_format, as: :select, collection: Company.display_formats.keys
    end
    h2 'Foundational Four '
    f.inputs do
      # Some hackery because trix editor was only displaying one field otherwise in the has_many
      [:core_1, :core_2, :core_3, :core_4].each_with_index do |cf_field|
        f.label cf_field
        f.has_many :core_four, heading: false, allow_destroy: false, new_record: false do |cf|
          cf.rich_text_area cf_field, { label: "Core #{index + 1}" }
        end
      end
    end
    f.label "#{t(:accountability_chart)}"
    f.input :accountability_chart_embed, input_html: { rows: 5 }
    f.label :strategic_plan
    f.input :strategic_plan_embed, input_html: { rows: 5 }
    f.actions
  end
end