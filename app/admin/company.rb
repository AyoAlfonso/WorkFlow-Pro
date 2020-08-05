ActiveAdmin.register Company do
  permit_params :accountability_chart,
                :address,
                :contact_email,
                :fiscal_year_start,
                :name,
                :logo,
                :phone_number,
                :rallying_cry,
                :strategic_plan,
                :timezone,
                core_four_attributes: [:id, :core_1, :core_2, :core_3, :core_4]

  index do
    selectable_column
    id_column
    column :name
    column :address
    column :contact_email
    column :phone_number
    column :rallying_cry
    actions
  end

  filter :name
  filter :address
  filter :contact_email
  filter :phone_number
  filter :rallying_cry

  show do
    h1 company.name
    attributes_table do
      row :logo do |company|
        company.try(:logo_url) ? image_tag(company.logo_url, style: "max-height: 100px;") : "No Company Logo Set"
      end
      row :address
      row :contact_email
      row :phone_number
      row :rallying_cry
      row :fiscal_year_start do |c|
        c.format_fiscal_year_start
      end
      row :timezone
    end
    br
    panel 'Core Four' do
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
    panel 'Accountability Chart' do
      attributes_table_for company do
        row :accountability_chart do |c|
          c.accountability_chart.body
        end
      end
    end
    panel 'Strategic Plan' do
      attributes_table_for company do
        row :strategic_plan do |c|
          c.strategic_plan.body
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
      f.input :rallying_cry, input_html: { rows: 5 }
      f.input :fiscal_year_start, order: [:month, :day]
      f.input :timezone, as: :select, collection: timezones
    end
    h2 'Core Four '
    f.inputs do
      # Some hackery because trix editor was only displaying one field otherwise in the has_many
      [:core_1, :core_2, :core_3, :core_4].each_with_index do |cf_field|
        f.label cf_field
        f.has_many :core_four, heading: false, allow_destroy: false, new_record: false do |cf|
          cf.rich_text_area cf_field, { label: "Core #{index + 1}" }
        end
      end
    end
    f.label :accountability_chart
    f.rich_text_area :accountability_chart, label: "Accountability Chart Rich Text"
    f.input :accountability_chart_embed, label: "Accountability Chart Embed Link", input_html: { rows: 5 }
    f.label :strategic_plan
    f.rich_text_area :strategic_plan, label: "Strategic Plan Rich Text"
    f.input :strategic_plan_embed, label: "Strategic Plan Embed Link", input_html: { rows: 5 }
    f.actions
  end
end