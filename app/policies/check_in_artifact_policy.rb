class CheckInArtifactPolicy < ApplicationPolicy
 
  def general_check_in?
     (user_is_part_of_current_company? || user_can_observe_current_company?)
  end

  def artifact?
      @record.owned_by == @user || user_is_company_admin_of_current_company?
  end

  class Scope
    attr_reader :user, :scope, :company

    def initialize(context, scope)
      @user = context.user
      @company = context.company
      @scope = scope
    end

    def resolve #system defaults
     scope.sort_by_company(@company)
    end
  end
end
