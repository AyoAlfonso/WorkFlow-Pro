class AddNotesToMeeting < ActiveRecord::Migration[6.0]
  def change
    add_column :meetings, :notes, :text, default: ""
  end

  def data
    Meeting.all.each do |m|
      if m.notes.nil?
        m.notes = ""
      end
      m.save!
    end
  end
end
