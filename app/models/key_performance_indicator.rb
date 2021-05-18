class KeyPerformanceIndicator < ApplicationRecord
    include ActionView::Helpers::SanitizeHelper
    
    before_save :sanitize_description
    belongs_to :user
    belongs_to :company, optional: true
    belongs_to :team, optional: true
    
    validates :description, :created_by, :owned_by, :unit_type, :quarter, presence: true
    enum unit_type : { percentage: 0, numerical: 1, currency: 2 }

    #save the data for kpi and create api route
    
    #protect route
    private
    def sanitize_description
    self.description = strip_tags(description)
  end
end
