ActiveAdmin.register CheckInTemplate do
  permit_params :name, :check_in_type, :owner_type, :description, check_in_templates_steps_attributes: [:id, :name, :step_type, :order_index, :instructions, :duration, :component_to_render, :question,:check_in_template_id, :image, :link_embed, :override_key, :_destroy]

  index do
    selectable_column
    id_column
    column :name
    column :tag
    column :check_in_type do |mt|
      mt.check_in_type.humanize.titleize
    end
    actions
  end

  filter :name
  filter :check_in_type

  controller do
    def create
      @check_in_template_params = params[:check_in_template]
      @check_in_template = CheckInTemplate.create!({
        name: @check_in_template_params[:name],
        check_in_type: @check_in_template_params[:check_in_type],
        description: @check_in_template_params[:description],
        tag: ["global"],
        owner_type:  @check_in_template_params[:owner_type]                        
      })
      @step_atrributes = params[:check_in_template][:check_in_templates_steps_attributes]
      if @step_atrributes.present?
        @check_in_templates_steps = @step_atrributes.values
        @check_in_templates_steps.each do |step|
          CheckInTemplatesStep.create!({
            step_type: step[:step_type],
            order_index: step[:order_index],
            name: step[:name]|| "step name",
            instructions: step[:instructions]|| "step instructions...",
            duration: step[:duration],
            component_to_render: step[:component_to_render],
            check_in_template_id: @check_in_template.id,
            image: step[:image],
            override_key: step[:override_key]
          })
        end
      end
      redirect_to admin_check_in_template_path(@check_in_template), notice: "Check In Template Created"
    end

  # def update
  #   binding.pry
  # end

  end

  show do
    h1 check_in_template.name
    attributes_table do
      row :name
      row "Check In Type" do
        check_in_template.check_in_type.humanize.titleize
      end
      row :description
    end
    panel "Steps" do
      table_for check_in_template.check_in_templates_steps do
        column :name
        column :step_type do |step|
          step.step_type.humanize.titleize
        end
        column :order_index
        column "Duration (in minutes)", :duration
        column :instructions
        column :component_to_render do |step|
          step.component_to_render.blank? ? "No Component to Render" : step.component_to_render
        end
        column :image do |step|
          step.try(:image_url) ? image_tag(step.image_url, style: "max-height: 80px;") : "No Image Selected"
        end
      end
    end
  end

  form do |f|
    h1 object.name
    f.input :name
    f.input :owner_type, as: :select, collection: CheckInTemplate.owner_types.map { |ci| [ci[0].humanize.titleize, ci[0]] }
    f.input :check_in_type, as: :select, collection: CheckInTemplate.check_in_types.map { |ci| [ci[0].humanize.titleize, ci[0]] }
    f.input :description, input_html: { rows: 5 }

    f.has_many :check_in_templates_steps, heading: "Steps", allow_destroy: true do |step|
      step.input :name
      step.input :step_type, as: :select, collection: CheckInTemplatesStep.step_types.map { |st| [st[0].humanize.titleize, st[0]] } 
      
      if step.object.persisted? && step.object.try(:step_type) == 'questions'
         step.input :question
      end
      step.input :order_index
      step.input :duration, label: "Duration (in minutes)"
      step.input :instructions, input_html: { rows: 3 }
      
      if step.object.persisted? && step.object.try(:step_type) == "questions"
       step.input :component_to_render, as: :select, collection: CheckInTemplatesStep::QUESTION_STEP_COMPONENTS
      else
       step.input :component_to_render, as: :select, collection: CheckInTemplatesStep::STEP_COMPONENTS
      end
      step.input :image, as: :file, hint: (step.object.try(:image_url) ? image_tag(step.object.image_url, style: "max-height: 150px;") : "No Image Selected")
    end
    f.actions
  end
end
