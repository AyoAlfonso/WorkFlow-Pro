class KeyPerformanceIndicator < ApplicationRecord
  include ActionView::Helpers::SanitizeHelper
  include HasCreator
  include HasOwner
  include HasViewer

  before_save :sanitize_description
  enum unit_type: { percentage: 0, numerical: 1, currency: 2 }
  enum parent_type: { existing: 0, rollup: 1, avr: 2}

  validates :title, :created_by, :viewers, :unit_type, :target_value, presence: true
  validates :greater_than, inclusion: [true, false]
  has_many :scorecard_logs
  


  def aggregrate_score
   return 0 unless self.parent_kpi&.length > 0 && self.parent_type.present?
    if self.parent_type ==  "rollup" &&  self.parent_type ==  "existing"
      return self.parent_kpi.inject(0){|sum,kpi| sum + get_scorecard_score(kpi) }
    elsif self.parent_type == "avr"
      return self.parent_kpi.inject(0){|sum,kpi| sum + get_latest_scorecard_score(kpi)}/self.parent_kpi&.length
    end
  end
  def get_latest_scorecard_score(kpi)
    score = KeyPerformanceIndicator.find(kpi).scorecard_logs.last&.score 
    score = 0 if score.nil?
    return score
  end

  private
  
  def sanitize_description
    self.description = strip_tags(description)
  end
end
