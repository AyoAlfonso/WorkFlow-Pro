class AddMovedToTodayOnToKeyActivity < ActiveRecord::Migration[6.0]
  def change
    add_column :key_activities, :moved_to_today_on, :date
  end

  def data
    #ensure all items in 'today' set there moved_to_today on as the current date
    todays_date = Time.current.in_time_zone("Eastern Time (US & Canada)").to_date
    KeyActivity.where(scheduled_group_id: ScheduledGroup.find_by_name("Today").id).update_all(moved_to_today_on: todays_date)
  end
end