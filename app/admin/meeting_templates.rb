ActiveAdmin.register MeetingTemplate do
  permit_params :name, :meeting_type, :duration, steps_attributes: [:id, :name, :step_type, :order_index, :instructions, :duration, :component_to_render, :meeting_template_id, :image]

  index do
    selectable_column
    id_column
    column :name
    column :meeting_type
    column :duration
    actions
  end

  filter :name
  filter :meeting_type
  filter :duration

  controller do
    def create
      @meeting_template = MeetingTemplate.new({
        name: params[:meeting_template][:name],
        meeting_type: params[:meeting_template][:meeting_type],
        duration: params[:meeting_template][:duration]
      })
      @meeting_template.save!
      @steps = params[:meeting_template][:steps_attributes].values
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
      redirect_to admin_meeting_template_path(@meeting_template), notice: "Meeting Template Created"
    end
  end

  show do
    h1 meeting_template.name
    attributes_table do
      row :meeting_type
      row :duration
    end
    panel "Steps" do
      table_for meeting_template.steps do
        column :name
        column :step_type
        column :order_index
        column :duration
        column :instructions
        column :component_to_render do |step|
          step.component_to_render.blank? ? "No Component to Render" : step.component_to_render
        end
        column :image do |step|
          step.try(:image_url) ? image_tag(step.image_url, style: "max-height: 80px;") : "No Image Set"
        end
      end
    end
  end

  form do |f|
    h1 "New Meeting Template"
    f.input :name
    f.input :meeting_type, as: :select, collection: MeetingTemplate.meeting_types.keys
    f.input :duration, label: "Duration (in minutes)"
    f.has_many :steps, allow_destroy: true do |step|
      step.input :name
      step.input :step_type, as: :select, collection: Step.step_types.keys
      step.input :order_index
      step.input :duration, label: "Duration (in minutes)"
      step.input :instructions, input_html: { rows: 3 }
      step.input :component_to_render
      step.input :image, as: :file
    end
    f.actions
  end
end