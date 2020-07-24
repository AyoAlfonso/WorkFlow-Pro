class UserPolicy < ApplicationPolicy

  def index?
    true
  end

  def show?
    user.company == record.company
  end

  def create?
    user = record.company_admin? #current_admin_user.present?
  end

  def update?
    @record == @user || current_admin_user.present? # || user = record.company_admin?
  end

  # TODO: Needs logic here
  def update_avatar?
    true
  end

  def destroy?
    false #admin does destruction
  end

  class Scope
    attr_reader :user, :scope

    def initialize(user, scope)
      @user = user
      @scope = scope
    end

    def resolve
      scope.where(company: user.company)
    end
  end
end