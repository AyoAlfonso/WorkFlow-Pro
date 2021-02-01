class ForumTeamPolicy < TeamPolicy

  def create_meetings_for_year?
    update?
  end

  def search_meetings_by_date_range?
    true
  end
end