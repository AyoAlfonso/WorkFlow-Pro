ActiveAdmin.register Company do
  permit_params :name, :address, :contact_email, :phone_number, :rallying_cry

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
      row :address
      row :contact_email
      row :phone_number 
      row :rallying_cry
    end
    br
    panel 'Core Four' do
      attributes_table_for company.core_four do
        row :core_1
        row :core_2
        row :core_3
        row :core_4
      end
    end
    br
    panel 'Users' do
      table_for company.users do
        column :full_name
        column :email
        column :phone_number
        column :current_sign_in_at
        column :sign_in_count
        column :created_at
        column("View User") { |user| link_to "View", admin_user_path(user) }
      end
    end
  end

  form do |f|
    f.inputs do 
      f.input :name
      f.input :address
      f.input :contact_email
      f.input :phone_number 
      f.input :rallying_cry
    end
    f.actions
  end
end