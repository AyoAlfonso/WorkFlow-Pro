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

  controller do
    def update 
      @questionnaire = Questionnaire.find(params[:id])
      @questionnaire.steps = params[:questionnaire][:steps_raw].split(/[\r\n]+/).map { |row| row.squish }
      @questionnaire.save!
      redirect_to admin_questionnaire_path, notice: "Questionnaire Updated"
    end
  end

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
      f.input :steps_raw, as: :text
      f.actions
    end
  end
end