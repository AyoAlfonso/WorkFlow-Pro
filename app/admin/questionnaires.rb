ActiveAdmin.register Questionnaire do
  permit_params :name,
                :steps
  
  index do
    selectable_column
    id_column
    column :name
    actions
  end

  filter :name

  show do
    h1 questionnaire.name
    attributes_table do
      row :created_at
      row :updated_at
      row :steps
    end
  end

  form do |f|
    h1 f.object.name
    f.inputs "Steps" do
      f.input :steps
      f.actions
    end
  end
end