ActiveAdmin.register MeetingTemplate do
  permit_params :name, :meeting_type, :duration, steps_attributes: [:id, :name, :step_type, :order_index, :instructions, :duration, :component_to_render, :meeting_template_id, :image]

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
        duration: @meeting_template_params[:duration]
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
            image: step[:image]
          })
        end
      end
      redirect_to admin_meeting_template_path(@meeting_template), notice: "Meeting Template Created"
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
        meeting_template.duration
      end 
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
      end
    end
  end

  form do |f|
    h1 object.name
    f.input :name
    f.input :meeting_type, as: :select, collection: MeetingTemplate.meeting_types.map { |mt| [mt[0].humanize.titleize, mt[0]] }
    f.input :duration, label: "Duration (in minutes)"
    f.has_many :steps, allow_destroy: true do |step|
      step.input :name
      step.input :step_type, as: :select, collection: Step.step_types.map { |st| [st[0].humanize.titleize, st[0]]}
      step.input :order_index
      step.input :duration, label: "Duration (in minutes)"
      step.input :instructions, input_html: { rows: 3 }
      step.input :component_to_render # @TODO this eventually needs to be changed to a select of the possible components that can be rendered
      step.input :image, as: :file, hint: (step.object.try(:image_url) ? image_tag(step.object.image_url, style: "max-height: 150px;") : "No Image Selected")
    end
    f.actions
  end
end