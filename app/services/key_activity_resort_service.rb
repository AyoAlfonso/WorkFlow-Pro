class KeyActivityResortService < ApplicationService
  attr_reader :sort_type
  attr_accessor :key_activities

  def initialize(key_activities, sort_type)
    @key_activities = key_activities
    @sort_type = sort_type
  end

  def call
    case @sort_type
    when "by_priority"
      sorted_key_activities = @key_activities.sort_by_priority.sort_by_created_date
    when "by_due_date"
      sorted_key_activities = @key_activities.sort_by_due_date.sort_by_created_date
    when "by_due_date_and_priority"
      sorted_key_activities = @key_activities.sort_by_due_date.sort_by_priority.sort_by_created_date
    end
    reset_positions(sorted_key_activities)
  end

  def reset_positions(key_activities)
    ka_1 = key_activities.todays_priority.each_with_index.map do |ka, idx|
      ka.position = idx + 1
      ka.as_json
    end

    ka_2 = key_activities.weekly_list.each_with_index.map do |ka, idx|
      ka.position = idx + 1
      ka.as_json
    end

    ka_3 = key_activities.master_list.each_with_index.map do |ka, idx|
      ka.position = idx + 1
      ka.as_json
    end

    KeyActivity.upsert_all(ka_1 + ka_2 + ka_3)
    key_activities
  end
end
