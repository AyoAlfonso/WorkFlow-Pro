class CheckInArtifact < ApplicationRecord
  acts_as_paranoid column: :deleted_at
  include HasOwner

  scope :optimized, -> { includes([:check_in_templates_steps ]) }
  scope :incomplete, -> { where(end_time: nil) }
  scope :for_day_of_date, ->(end_time) { where("(end_time >= ? AND end_time <= ?) OR end_time IS NULL", end_time.beginning_of_day, end_time.end_of_day) }
  scope :for_week_of_date, ->(end_time) { where("(end_time >= ? AND end_time <= ?) OR end_time IS NULL", end_time.beginning_of_week, end_time.end_of_week) }
  scope :for_month_of_date, ->(end_time) { where("(end_time >= ? AND end_time <= ?) OR end_time IS NULL", end_time.beginning_of_month, end_time.end_of_month) }
  scope :for_week_of_date_started_only, ->(end_time) { where("(end_time >= ? AND end_time <= ?)", end_time.beginning_of_week, end_time.end_of_week) }
  scope :owned_by_user, ->(user) { where(owned_by_id: user) }
  scope :not_skipped, ->  { where(skip: false) }
  scope :with_parents, ->() { joins(:check_in_template).where.not(check_in_templates: { parent: nil }) }

  belongs_to :check_in_template
  has_many :check_in_artifact_logs, dependent: :destroy

  def as_json(options = [])
    super({
       include: [
        check_in_template: {
          except: [:created_at, :updated_at],
          include: {
          check_in_templates_steps: {
             except: [:created_at, :updated_at]
            },
          }
        }, 
        check_in_artifact_logs: {
         except: [:updated_at],
        }
      ],
     })
    #  .merge({ :streaks => self.streaks })
  end

  scope :with_name, ->(name) { where(name: name) }
end
