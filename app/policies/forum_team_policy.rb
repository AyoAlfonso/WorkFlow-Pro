class ForumTeamPolicy < TeamPolicy

  def create_meetings_for_year?
    update?
  end
end