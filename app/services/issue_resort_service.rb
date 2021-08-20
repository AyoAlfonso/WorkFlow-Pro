class IssueResortService < ApplicationService
  attr_accessor :issues

  def initialize(issues)
    @issues = issues
  end

  def call
    sorted_issues = @issues.sort_by_priority.sort_by_created_date
    reset_positions(sorted_issues)
  end

  def reset_positions(issues)
    updated_issues = issues.incomplete.each_with_index.map do |issue, index|
      issue.position = index + 1
      issue.as_json
    end
    Issue.upsert_all(reject_label_list(updated_issues))
    # issues.complete.each_with_index do |issue, index|
    #   issue.position = index + 1
    #   issue.save!
    # end
    issues
  end

  def reject_label_list(key_activities)
    key_activities.each { |ka| ka.delete("label_list") }
  end
end
