module TeamUserEnablementAttributeParser
  def team_user_enablement_attribute_parser(teams, user)
    tue_list = []
    teams.each do |team|
      tue_list.push({
        team_id: team[:id],
        user_id: user.id,
        role: 0,
      })
    end

    @user.team_user_enablements.each do |tue|
      tue_list.push({
        id: tue.id,
        _destroy: true,
      }) if !tue_list.any? { |enablement| enablement[:team_id] == tue.team_id && enablement[:user_id] == tue.user_id }
    end

    tue_list
  end
end
