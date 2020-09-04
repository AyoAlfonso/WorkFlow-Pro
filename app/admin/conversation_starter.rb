ActiveAdmin.register ConversationStarter do
  permit_params :body
  
  index do
    selectable_column
    id_column
    column :body
    actions
  end

  filter :body

end