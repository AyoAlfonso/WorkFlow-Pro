class ModifyExecutiveColumnOnTeams < ActiveRecord::Migration[6.1]
  def data
    Company.all.each do |company|
    if Team.where(company_id: company.id, executive: 1).blank?
      existing_executive_team = Team.where(company_id: company.id, executive: 0).first
      existing_executive_team&.update!(executive: 1)
    end
      #  all_teams = Team.where(company_id: company.id)
      # if all_teams.size == 1 
      #   # binding.pry
      #   all_teams.first&.update!(executive: 1)
      # end
    end
  end
end
