class TeamIssueMeetingEnablementPolicy < ApplicationPolicy

  #not used really as we currently acceses team issue enableme nts via issues controller and service
  def create?
    true
  end

  def index?
    true
  end
end