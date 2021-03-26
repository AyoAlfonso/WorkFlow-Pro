class UserPulsePolicy < ApplicationPolicy
  def user_pulse_by_date?
    true
  end

  def create_or_update?
    true
  end
end