ActiveAdmin.register MeetingTemplate do
  permit_params :name, :meeting_type, :duration, :description, steps_attributes: [:id, :name, :step_type, :order_index, :instructions, :duration, :component_to_render, :meeting_template_id, :image, :link_embed, :override_key, :description_text, :_destroy]

  index do
    selectable_column
    id_column
    column :name
    column :meeting_type do |mt|
      mt.meeting_type.humanize.titleize
    end
    column :duration
    actions
  end

  filter :name
  filter :meeting_type
  filter :duration

  controller do
    def create
      @meeting_template_params = params[:meeting_template]
      @meeting_template = MeetingTemplate.create!({
        name: @meeting_template_params[:name],
        meeting_type: @meeting_template_params[:meeting_type],
        duration: @meeting_template_params[:duration],
        description: @meeting_template_params[:description],
      })
      @step_atrributes = params[:meeting_template][:steps_attributes]
      if @step_atrributes.present?
        @steps = @step_atrributes.values
        @steps.each do |step|
          Step.create!({
            step_type: step[:step_type],
            order_index: step[:order_index],
            name: step[:name],
            instructions: step[:instructions],
            duration: step[:duration],
            component_to_render: step[:component_to_render],
            meeting_template_id: @meeting_template.id,
            image: step[:image],
            override_key: step[:override_key],
            description_text: step[:description_text],
          })
        end
      end
      redirect_to admin_meeting_template_path(@meeting_template), notice: "Meeting Template Created"
    end

    def update 
      @meeting_template = MeetingTemplate.find(params[:id])
      @step_atrributes = params[:meeting_template][:steps_attributes]
        if @step_atrributes.present?
             @steps = @step_atrributes.values
          @steps.each_with_index do |step, index|
           params[:meeting_template][:steps_attributes][index.to_s]["description_text"] = step[:description_text_content]
          end
        end
      if @meeting_template.update!(permitted_params)
        flash[:alert] = @meeting_template.errors.full_messages
         redirect_to admin_meeting_template_path(@meeting_template), notice: "Template updated"
      end
    end

    def permitted_params
      params.require(:meeting_template).permit(:name, :meeting_type, :duration, :description, steps_attributes: [:id, :name, :step_type, :order_index, :instructions, :duration, :component_to_render, :meeting_template_id, :image, :link_embed, :override_key, :description_text, :_destroy])
    end
 
  end

  show do
    h1 meeting_template.name
    attributes_table do
      row :name
      row "Meeting Type" do
        meeting_template.meeting_type.humanize.titleize
      end
      row "Duration (in minutes)" do
        meeting_template.total_duration
      end
      row :description
    end
    panel "Steps" do
      table_for meeting_template.steps do
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
        column :description_text do |step|
          step.description_text_content
        end
      end
    end
  end

  form do |f|
    h1 object.name
    f.input :name
    f.input :meeting_type, as: :select, collection: MeetingTemplate.meeting_types.map { |mt| [mt[0].humanize.titleize, mt[0]] }
    f.input :duration, label: "Duration (in minutes)"
    f.input :description, input_html: { rows: 5 }

    f.has_many :steps, heading: "Steps", allow_destroy: true do |step|
      step.input :name
      step.input :step_type, as: :select, collection: Step.step_types.map { |st| [st[0].humanize.titleize, st[0]] }
      step.input :order_index
      step.input :duration, label: "Duration (in minutes)"
      step.input :instructions, input_html: { rows: 3 }
      step.input :component_to_render, as: :select, collection: Step::STEP_COMPONENTS
      step.input :link_embed, input_html: { rows: 2 }
      step.input :override_key, input_html: { rows: 1 }
      step.input :description_text_content, as: :quill_editor,  input_html: { data: { options: { modules: { toolbar: [['bold', 'italic', 'underline'], ['link']] }, placeholder: 'Type something...', theme: 'snow' } } }
    
      step.input :image, as: :file, hint: (step.object.try(:image_url) ? image_tag(step.object.image_url, style: "max-height: 150px;") : "No Image Selected")
    end
    f.actions
  end
end
