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