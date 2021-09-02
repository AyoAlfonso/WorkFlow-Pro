ActiveAdmin.register StaticData do
  permit_params :value

  actions :all, :except => [:new]

  form do |f|
    f.inputs do
      f.input :field, input_html: { disabled: true }
      f.input :value
    end
    f.actions
  end
end
