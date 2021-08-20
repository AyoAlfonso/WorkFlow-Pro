class UserPulsePolicy < ApplicationPolicy
  def user_pulse_by_date?
    @record.blank? || @record.user == @user
  end

  def create_or_update?
    @record.user == @user && !user_can_observe_current_company?
  end

  class Scope
    attr_reader :context, :scope

    def initialize(context, scope)
      @user = context.user
      @company = context.company
      @scope = scope
    end
  end
end
