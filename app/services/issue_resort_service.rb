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
    issues.incomplete.each_with_index do |issue, index|
      issue.position = index + 1
      issue.save!
    end
    issues.complete.each_with_index do |issue, index|
      issue.position = index + 1
      issue.save!
    end
    issues
  end
end
