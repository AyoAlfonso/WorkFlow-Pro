class ModifyDataForMilestoneFiscalYear < ActiveRecord::Migration[6.0]
	def data
		Milestone.find_each(batch_size: 100) do |m|
			if m.week_of.year > Time.zone.now.year 
				if (m.milestoneable_type == 'SubInitiative')
					m.week_of = m.week_of - 1.year
					m.save!
				elsif (m.milestoneable_type == 'QuarterlyGoal')
					m.week_of = m.week_of - 1.year
					m.save!
				end
			end
		end
	end
end
