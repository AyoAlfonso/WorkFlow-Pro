ActiveAdmin.register DefaultAdminTemplate do
  permit_params :title, :template_type, :body

  index do
    selectable_column
    id_column
    column :title
    column :template_type do |mt|
      mt.template_type.upcase
    end
    actions
  end

  filter :title
  filter :template_type

  controller do
    def create
      @default_admin_template_params = params[:default_admin_template]
      @default_admin_template = DefaultAdminTemplate.create!({
        title: @default_admin_template_params[:title],
        template_type: @default_admin_template_params[:template_type],
        body: @default_admin_template_params[:body],
      })
      redirect_to admin_default_admin_template_path(@default_admin_template), notice: "Default Admin Template Created"
    end
  end

  show do
    h1 default_admin_template.title
    attributes_table do
      row :title
      row "Template Type" do
        default_admin_template.template_type.upcase
      end
      row :body
    end
  end

  form do |f|
    h1 object.title
    f.input :title
    f.input :template_type, as: :select, collection: DescriptionTemplate.template_types.map { |dt| [dt[0].humanize.upcase, dt[0]] }
    f.input :body,  as: :action_text
    f.actions
  end
end
