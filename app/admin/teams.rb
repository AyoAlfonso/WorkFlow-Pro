ActiveAdmin.register Team do
  permit_params :company_id, :name, team_user_enablements_attributes: [:id, :user_id, :role, :_destroy]
  #
  # or
  #
  # permit_params do
  #   permitted = [:company_id, :name]
  #   permitted << :other if params[:action] == 'create' && current_user.admin?
  #   permitted
  # end

  filter :company
  filter :users
  filter :name

  show do
    h1 team.name
    attributes_table do
      row :company
      row :name
      row :created_at
      row :updated_at
    end
    br
    panel "Users" do
      table_for team.users do
        column("Full Name") { |user| link_to user.full_name, admin_user_path(user) }
        column :email
      end
    end
  end

  form do |f|
    f.inputs do
      f.input :company, :collection => Company.where("name <> 'N/A'").order(:name)
      f.input :name
      if f.object.persisted?
        f.has_many :team_user_enablements, allow_destroy: true do |tu|
          if tu.object.persisted?
            tu.input :user, as: :select, collection: [tu.object.user], input_html: { disabled: false }
          else
            tu.input :user, as: :select, collection: Company.find(f.object.company.id).users.where.not(first_name: nil).order(:first_name), input_html: { disabled: tu.object.persisted? }
          end
          tu.input :role
        end
      end
    end
    f.actions
  end
end
