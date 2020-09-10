ActiveAdmin.register Questionnaire do
  permit_params :name,
                :steps,
                :title
  
  index do
    selectable_column
    id_column
    column :title
    actions
  end

  filter :title

  controller do
    def update 
      @questionnaire = Questionnaire.find(params[:id])
      @questionnaire.title = params[:questionnaire][:title]
      @questionnaire.steps = JSON.parse(params[:questionnaire][:steps_raw])
      @questionnaire.save!
      redirect_to admin_questionnaire_path, notice: "Questionnaire Updated"
    end
  end

  show do
    attributes_table do
      row :title
      row :created_at
      row :updated_at
      row :steps do |q|
        JSON.generate(q.steps)
      end
    end
  end

  form do |f|
    h1 f.object.title
    f.inputs "Steps" do
      f.input :title
      f.input :steps_raw, as: :text
      f.actions
    end
  end
end