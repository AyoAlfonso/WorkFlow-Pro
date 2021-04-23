class AddPolymorphicReferenceForMilestones < ActiveRecord::Migration[6.0]
  def change
    add_reference :milestones, :milestoneable, polymorphic: true
  end

  def data
    Milestone.all.each do |milestone|
      milestone.milestoneable_type = 'QuarterlyGoal'
      milestone.milestoneable_id = milestone.quarterly_goal_id
      milestone.save
    end
  end
end
