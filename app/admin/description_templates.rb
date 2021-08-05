ActiveAdmin.register DescriptionTemplate do
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
      @description_template_params = params[:description_template]
      @description_template = DescriptionTemplate.create!({
        title: @description_template_params[:title],
        template_type: @description_template_params[:template_type],
        body: @description_template_params[:body],
      })
      redirect_to admin_description_template_path(@description_template), notice: "Description Template Created"
    end
  end

  show do
    h1 description_template.title
    attributes_table do
      row :title
      row "Template Type" do
        description_template.template_type.upcase
      end
      row :body
    end
  end

  form do |f|
    h1 object.title
    f.input :title
    f.input :template_type, as: :select, collection: DescriptionTemplate.template_types.map { |dt| [dt[0].humanize.upcase, dt[0]] }
    f.input :body, input_html: { rows: 5 }
    f.actions
  end
end
