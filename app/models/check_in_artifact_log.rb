class CheckInArtifactLog < ApplicationRecord
  acts_as_paranoid column: :deleted_at

  belongs_to :created_by, class_name: "User"
  belongs_to :objective_log
  belongs_to :scorecard_log
  belongs_to :check_in_artifact

  validates :check_in_artifact_id, :responses, :created_by_id, presence: true

  scope :created_by_user, ->(user) { where(user: user) }
  scope :created_between, ->(date_start, date_end) { where("created_at >= ? AND created_at < ?", date_start, date_end) }

  def as_json(options = [])
    super({
       include: [
        scorecard_log: {
          except: [:updated_at],
        },
        objective_log: {
          except: [:updated_at],
        }
      ]
     })
  end
end
