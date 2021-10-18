class DefaultAdminTemplate < ApplicationRecord
  include ActionView::Helpers::SanitizeHelper

  #more types across entities will be added here
  enum template_type: {
    kpi: 0,
    objectives: 1,
    initiatives: 2,
  }
end
